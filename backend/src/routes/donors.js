const express = require('express');
const router = express.Router();
const dataStore = require('../models/dataStore');
const { isCompatible, getEligibleRecipientTypes } = require('../engine/compatibilityEngine');
const { rankDonorsByProximity } = require('../engine/geoProximity');

/**
 * GET /api/donors
 * Retrieve all registered donors (contact numbers masked for privacy compliance)
 */
router.get('/', (req, res) => {
  const { bloodType, city } = req.query;
  let donors = dataStore.getAllDonors();

  if (bloodType) {
    donors = donors.filter(d => d.bloodType.toUpperCase() === bloodType.toUpperCase());
  }
  if (city) {
    donors = donors.filter(d => d.city.toLowerCase() === city.toLowerCase());
  }

  res.json({
    success: true,
    count: donors.length,
    data: donors
  });
});

/**
 * GET /api/donors/:id
 * Single donor profile (masked)
 */
router.get('/:id', (req, res) => {
  const donor = dataStore.getDonorById(req.params.id);
  if (!donor) {
    return res.status(404).json({ success: false, message: 'Donor not found' });
  }

  res.json({
    success: true,
    data: donor,
    canDonateTo: getEligibleRecipientTypes(donor.bloodType)
  });
});

/**
 * POST /api/donors
 * Register a new blood donor
 */
router.post('/', (req, res) => {
  const { name, bloodType, phone, city, area, location } = req.body;

  if (!name || !bloodType) {
    return res.status(400).json({ success: false, message: 'Name and bloodType are required' });
  }

  const newDonor = dataStore.addDonor({
    name,
    bloodType,
    phone,
    city,
    area,
    location
  });

  res.status(201).json({
    success: true,
    message: 'Donor registered successfully',
    data: newDonor
  });
});

/**
 * GET /api/donors/:id/compatible-requests
 * Returns all active blood requests biologically compatible with this donor,
 * sorted by proximity to the donor's coordinates.
 */
router.get('/:id/compatible-requests', (req, res) => {
  const donor = dataStore.getDonorById(req.params.id);
  if (!donor) {
    return res.status(404).json({ success: false, message: 'Donor not found' });
  }

  const allRequests = dataStore.getAllRequests().filter(r => r.status !== 'FULFILLED' && r.status !== 'CANCELLED');
  
  // Filter by biological compatibility
  const compatible = allRequests.filter(req => isCompatible(donor.bloodType, req.bloodType));

  // Rank by proximity to donor location
  const ranked = compatible.map(req => {
    const dummyDonor = [{ location: req.location }];
    const rankedHosp = rankDonorsByProximity(dummyDonor, donor.location);
    return {
      ...req,
      distanceKm: rankedHosp[0]?.distanceKm ?? null
    };
  }).sort((a, b) => (a.distanceKm ?? Infinity) - (b.distanceKm ?? Infinity));

  res.json({
    success: true,
    donor: {
      id: donor.id,
      name: donor.name,
      bloodType: donor.bloodType,
      location: donor.location
    },
    count: ranked.length,
    data: ranked
  });
});

module.exports = router;
