const { isCompatible, getEligibleDonorTypes, getEligibleRecipientTypes } = require('../src/engine/compatibilityEngine');
const { calculateDistanceKm, rankDonorsByProximity } = require('../src/engine/geoProximity');
const dataStore = require('../src/models/dataStore');

function runTests() {
  console.log('🧪 [RedApp Tests] Running Compatibility & Proximity Verification...\n');
  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
      failed++;
    }
  }

  // --- 1. Universal Donor (O-) Tests ---
  console.log('--- Test Suite 1: O- Universal Donor ---');
  const allBloodTypes = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];
  allBloodTypes.forEach(recipient => {
    assert(isCompatible('O-', recipient), `O- can donate to ${recipient}`);
  });

  // --- 2. Universal Recipient (AB+) Tests ---
  console.log('\n--- Test Suite 2: AB+ Universal Recipient ---');
  allBloodTypes.forEach(donor => {
    assert(isCompatible(donor, 'AB+'), `AB+ can receive from ${donor}`);
  });

  // --- 3. Negative Incompatibilities ---
  console.log('\n--- Test Suite 3: Incompatibility Guardrails ---');
  assert(!isCompatible('A+', 'O-'), 'A+ cannot donate to O-');
  assert(!isCompatible('B+', 'A+'), 'B+ cannot donate to A+');
  assert(!isCompatible('AB+', 'O+'), 'AB+ cannot donate to O+');
  assert(!isCompatible('A+', 'B-'), 'A+ cannot donate to B-');

  // --- 4. Reverse Lookup: Donors for A+ Recipient ---
  console.log('\n--- Test Suite 4: Donors for A+ Recipient ---');
  const donorsForAPlus = getEligibleDonorTypes('A+');
  assert(donorsForAPlus.includes('O-') && donorsForAPlus.includes('O+') && donorsForAPlus.includes('A-') && donorsForAPlus.includes('A+'), 'A+ can receive from O-, O+, A-, A+');
  assert(!donorsForAPlus.includes('B+') && !donorsForAPlus.includes('AB+'), 'A+ cannot receive from B+ or AB+');

  // --- 5. Haversine Distance Tests (Accra Coordinates) ---
  console.log('\n--- Test Suite 5: Haversine Geolocation Engine ---');
  // Korle Bu (5.5367, -0.2289) to Ridge Hospital (5.5645, -0.1983) is approx 4.6km
  const dist = calculateDistanceKm(5.5367, -0.2289, 5.5645, -0.1983);
  assert(dist > 4 && dist < 6, `Distance Korle Bu -> Ridge is ${dist} km (expected ~4.6 km)`);

  // Same point distance should be 0
  assert(calculateDistanceKm(5.5367, -0.2289, 5.5367, -0.2289) === 0, 'Distance to same coordinate is 0 km');

  // --- 6. Proximity Ranking ---
  console.log('\n--- Test Suite 6: Proximity Ranking ---');
  const mockDonors = [
    { id: 1, name: 'Far', location: { latitude: 6.6971, longitude: -1.6308 } }, // Kumasi (~200km)
    { id: 2, name: 'Close', location: { latitude: 5.5562, longitude: -0.2104 } } // Adabraka (~3km)
  ];
  const ranked = rankDonorsByProximity(mockDonors, { latitude: 5.5367, longitude: -0.2289 });
  assert(ranked[0].name === 'Close', 'Closest donor is ranked first');
  assert(ranked[0].distanceKm < ranked[1].distanceKm, 'Ascending distance order preserved');

  // --- 7. DataStore Workflow ---
  console.log('\n--- Test Suite 7: DataStore & Scheduling ---');
  const hospitals = dataStore.getAllHospitals();
  assert(hospitals.length >= 3, `Loaded ${hospitals.length} hospitals in Ghana`);

  const initialRequests = dataStore.getAllRequests();
  assert(initialRequests.length >= 2, `Loaded ${initialRequests.length} active seed requests`);

  // Test creating new request
  const newReq = dataStore.createRequest({
    hospitalId: hospitals[0].id,
    bloodType: 'B-',
    unitsRequired: 2,
    urgency: 'CRITICAL',
    patientNotes: 'Urgent emergency surgery'
  });
  assert(newReq.id.startsWith('req-'), 'Created new blood request with ID');
  assert(newReq.status === 'OPEN', 'Initial status is OPEN');

  // Test donor scheduling
  const scheduleResult = dataStore.scheduleDonation(newReq.id, {
    donorId: 'donor-1',
    appointmentTime: 'Today 4:00 PM',
    notes: 'Volunteered via RedApp'
  });
  assert(scheduleResult !== null, 'Scheduled donor commitment successfully');
  assert(scheduleResult.request.unitsFulfilled === 1, 'Units fulfilled incremented to 1');
  assert(scheduleResult.request.status === 'IN_PROGRESS', 'Request status shifted to IN_PROGRESS');

  console.log(`\n========================================`);
  console.log(`🎉 TEST SUMMARY: ${passed} Passed, ${failed} Failed`);
  console.log(`========================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
