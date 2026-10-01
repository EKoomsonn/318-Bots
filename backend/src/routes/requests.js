const express = require('express');
const router = express.Router();
const dataStore = require('../models/dataStore');
const { isCompatible, getEligibleDonorTypes } = require('../engine/compatibilityEngine');
const { rankDonorsByProximity } = require('../engine/geoProximity');

/**
 * GET /api/requests
 * List requests with optional filters:
 * - status: 'OPEN' | 'IN_PROGRESS' | 'FULFILLED'
 * - donorBloodType: will return only requests where this donor can donate!
 * - lat, lon, maxDistanceKm: proximity calculation
 */
router.get('/', (req, res) => {
  const { status, donorBloodType, lat, lon } = req.query;
  let requests = dataStore.getAllRequests();

  if (status) {
    requests = requests.filter(r => r.status.toUpperCase() === status.toUpperCase());
  }

  // If a donor blood type is supplied, only return requests where donor is biologically compatible!
  if (donorBloodType) {
    requests = requests.filter(r => isCompatible(donorBloodType, r.bloodType));
  }

  // If user coordinates provided, compute distance to each hospital
  if (lat && lon) {
    const userLoc = { latitude: parseFloat(lat), longitude: parseFloat(lon) };
    requests = requests.map(r => {
      const distanceDonors = rankDonorsByProximity([{ location: r.location }], userLoc);
      return {
        ...r,
        distanceKm: distanceDonors[0]?.distanceKm ?? null
      };
    });
  }

  res.json({
    success: true,
    count: requests.length,
    data: requests
  });
});

/**
 * GET /api/requests/:id
 * Single request details + matched donors ranked by proximity
 */
router.get('/:id', (req, res) => {
  const request = dataStore.getRequestById(req.params.id);
  if (!request) {
    return res.status(404).json({ success: false, message: 'Request not found' });
  }

  // Find all compatible donors
  const allDonors = dataStore.getAllDonors();
  const compatibleDonors = allDonors.filter(d => isCompatible(d.bloodType, request.bloodType));
  const rankedDonors = rankDonorsByProximity(compatibleDonors, request.location);

  res.json({
    success: true,
    data: {
      ...request,
      eligibleBloodTypes: getEligibleDonorTypes(request.bloodType),
      matchedDonorsCount: rankedDonors.length,
      matchedDonors: rankedDonors
    }
  });
});

/**
 * GET /api/requests/:id/matched-donors
 * Returns ranked compatible donors for a specific hospital request
 */
router.get('/:id/matched-donors', (req, res) => {
  const request = dataStore.getRequestById(req.params.id);
  if (!request) {
    return res.status(404).json({ success: false, message: 'Request not found' });
  }

  const { maxDistanceKm } = req.query;
  const allDonors = dataStore.getAllDonors();
  const compatibleDonors = allDonors.filter(d => isCompatible(d.bloodType, request.bloodType));
  const ranked = rankDonorsByProximity(
    compatibleDonors,
    request.location,
    maxDistanceKm ? parseFloat(maxDistanceKm) : null
  );

  res.json({
    success: true,
    requestId: request.id,
    requestedBloodType: request.bloodType,
    hospitalLocation: request.location,
    eligibleTypes: getEligibleDonorTypes(request.bloodType),
    matchedDonors: ranked
  });
});

/**
 * POST /api/requests
 * Hospital broadcasts an urgent blood request
 */
router.post('/', (req, res) => {
  const { hospitalId, bloodType, unitsRequired, urgency, patientNotes, location } = req.body;

  if (!bloodType) {
    return res.status(400).json({ success: false, message: 'bloodType is required' });
  }

  const newRequest = dataStore.createRequest({
    hospitalId,
    bloodType,
    unitsRequired,
    urgency,
    patientNotes,
    location
  });

  // Calculate matching donors for broadcast payload
  const allDonors = dataStore.getAllDonors();
  const compatibleDonors = allDonors.filter(d => isCompatible(d.bloodType, newRequest.bloodType));
  const rankedDonors = rankDonorsByProximity(compatibleDonors, newRequest.location);

  // Emit real-time broadcast via Socket.IO if attached to req.app
  const io = req.app.get('io');
  if (io) {
    const broadcastPayload = {
      ...newRequest,
      eligibleBloodTypes: getEligibleDonorTypes(newRequest.bloodType),
      matchedDonorsCount: rankedDonors.length,
      alertMessage: `🚨 URGENT: ${newRequest.hospitalName} needs ${newRequest.unitsRequired} pint(s) of ${newRequest.bloodType} blood!`
    };

    // Broadcast globally to all connected clients
    io.emit('blood_alert_broadcast', broadcastPayload);

    // Also broadcast targeted events to specific compatible blood type rooms
    getEligibleDonorTypes(newRequest.bloodType).forEach(donorType => {
      io.to(`blood_${donorType}`).emit('blood_alert_targeted', broadcastPayload);
    });
  }

  res.status(201).json({
    success: true,
    message: 'Urgent blood request broadcasted successfully',
    data: newRequest,
    matchedDonorsCount: rankedDonors.length
  });
});

/**
 * POST /api/requests/:id/schedule
 * Donor commits to donating and books an appointment slot
 */
router.post('/:id/schedule', (req, res) => {
  const { donorId, appointmentTime, notes } = req.body;
  const result = dataStore.scheduleDonation(req.params.id, { donorId, appointmentTime, notes });

  if (!result) {
    return res.status(404).json({ success: false, message: 'Request not found' });
  }

  const io = req.app.get('io');
  if (io) {
    io.emit('request_updated', {
      requestId: result.request.id,
      status: result.request.status,
      unitsFulfilled: result.request.unitsFulfilled,
      unitsRequired: result.request.unitsRequired,
      latestSchedule: result.schedule,
      alertMessage: `🎉 Donor ${result.schedule.donorName} (${result.schedule.donorBloodType}) scheduled donation for ${result.request.hospitalName}!`
    });
  }

  res.json({
    success: true,
    message: 'Donation visit scheduled successfully',
    data: result
  });
});

/**
 * PATCH /api/requests/:id/status
 * Update request status (e.g. FULFILLED, CANCELLED)
 */
router.patch('/:id/status', (req, res) => {
  const { status } = req.body;
  if (!status) {
    return res.status(400).json({ success: false, message: 'Status is required' });
  }

  const updated = dataStore.updateRequestStatus(req.params.id, status.toUpperCase());
  if (!updated) {
    return res.status(404).json({ success: false, message: 'Request not found' });
  }

  const io = req.app.get('io');
  if (io) {
    io.emit('request_status_changed', {
      requestId: updated.id,
      status: updated.status
    });
  }

  res.json({
    success: true,
    data: updated
  });
});

module.exports = router;
