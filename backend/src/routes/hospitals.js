const express = require('express');
const router = express.Router();
const dataStore = require('../models/dataStore');
const { getCompatibilityMatrix, ALL_BLOOD_TYPES } = require('../engine/compatibilityEngine');

/**
 * GET /api/hospitals
 * List all participating hospitals and blood banks
 */
router.get('/', (req, res) => {
  const hospitals = dataStore.getAllHospitals();
  res.json({
    success: true,
    count: hospitals.length,
    data: hospitals
  });
});

/**
 * GET /api/hospitals/:id
 */
router.get('/:id', (req, res) => {
  const hospital = dataStore.getHospitalById(req.params.id);
  if (!hospital) {
    return res.status(404).json({ success: false, message: 'Hospital not found' });
  }

  // Get active requests for this hospital
  const hospitalRequests = dataStore.getAllRequests().filter(r => r.hospitalId === hospital.id);

  res.json({
    success: true,
    data: {
      ...hospital,
      activeRequests: hospitalRequests
    }
  });
});

/**
 * GET /api/stats
 * Overview numbers for the platform dashboard
 */
router.get('/meta/stats', (req, res) => {
  const hospitals = dataStore.getAllHospitals();
  const donors = dataStore.getAllDonors();
  const requests = dataStore.getAllRequests();

  const totalFulfilledUnits = requests.reduce((sum, r) => sum + (r.unitsFulfilled || 0), 0);
  const openRequestsCount = requests.filter(r => r.status === 'OPEN' || r.status === 'IN_PROGRESS').length;

  res.json({
    success: true,
    data: {
      hospitalsCount: hospitals.length,
      registeredDonorsCount: donors.length,
      activeRequestsCount: openRequestsCount,
      totalUnitsFulfilled: totalFulfilledUnits,
      bloodTypesSupported: ALL_BLOOD_TYPES.length
    }
  });
});

/**
 * GET /api/compatibility/matrix
 * ABO & Rh compatibility reference
 */
router.get('/meta/compatibility-matrix', (req, res) => {
  res.json({
    success: true,
    data: getCompatibilityMatrix()
  });
});

module.exports = router;
