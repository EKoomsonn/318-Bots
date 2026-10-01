/**
 * RedApp In-Memory Data Store & Seed Data
 * 
 * Provides seed data for hospitals in Ghana, registered donors,
 * and active blood requests, along with helper operations.
 */

const { v4: uuidv4 } = require('uuid');

// Hospitals in Ghana with real geographic coordinates
const INITIAL_HOSPITALS = [
  {
    id: 'hosp-1',
    name: 'Korle Bu Teaching Hospital',
    city: 'Accra',
    region: 'Greater Accra',
    address: 'Guggisberg Ave, Korle Bu, Accra',
    contactNumber: '+233 30 266 5401',
    emergencyUnit: 'Accident & Emergency Centre',
    location: {
      latitude: 5.5367,
      longitude: -0.2289
    }
  },
  {
    id: 'hosp-2',
    name: 'Greater Accra Regional Hospital (Ridge)',
    city: 'Accra',
    region: 'Greater Accra',
    address: 'Castle Rd, Ridge, Accra',
    contactNumber: '+233 30 222 8315',
    emergencyUnit: 'Trauma & Emergency Care',
    location: {
      latitude: 5.5645,
      longitude: -0.1983
    }
  },
  {
    id: 'hosp-3',
    name: '37 Military Hospital',
    city: 'Accra',
    region: 'Greater Accra',
    address: 'Liberation Rd, 37, Accra',
    contactNumber: '+233 30 277 6111',
    emergencyUnit: 'Military Emergency Wing',
    location: {
      latitude: 5.5888,
      longitude: -0.1804
    }
  },
  {
    id: 'hosp-4',
    name: 'Komfo Anokye Teaching Hospital',
    city: 'Kumasi',
    region: 'Ashanti',
    address: 'Bantama, Kumasi',
    contactNumber: '+233 32 202 2301',
    emergencyUnit: 'Directorate of Surgery & Trauma',
    location: {
      latitude: 6.6971,
      longitude: -1.6308
    }
  },
  {
    id: 'hosp-5',
    name: 'Tema General Hospital',
    city: 'Tema',
    region: 'Greater Accra',
    address: 'Hospital Rd, Community 9, Tema',
    contactNumber: '+233 30 330 2695',
    emergencyUnit: 'Casualty Ward',
    location: {
      latitude: 5.6796,
      longitude: -0.0076
    }
  }
];

// Donors located around Accra / Ghana with real blood types
// Note: Phone numbers are masked for privacy compliance
const INITIAL_DONORS = [
  {
    id: 'donor-1',
    name: 'Kwame Agyeman',
    bloodType: 'O-', // Universal donor
    rawPhone: '+233 24 411 2233',
    maskedPhone: '+233 24 *** *233',
    city: 'Accra',
    area: 'Adabraka',
    isAvailable: true,
    lastDonatedDate: '2026-06-15',
    totalDonations: 6,
    location: {
      latitude: 5.5562,
      longitude: -0.2104
    }
  },
  {
    id: 'donor-2',
    name: 'Abena Mansa',
    bloodType: 'O+',
    rawPhone: '+233 50 123 4567',
    maskedPhone: '+233 50 *** *567',
    city: 'Accra',
    area: 'Osu',
    isAvailable: true,
    lastDonatedDate: '2026-05-10',
    totalDonations: 4,
    location: {
      latitude: 5.5560,
      longitude: -0.1820
    }
  },
  {
    id: 'donor-3',
    name: 'Kofi Boateng',
    bloodType: 'A+',
    rawPhone: '+233 20 876 5432',
    maskedPhone: '+233 20 *** *432',
    city: 'Accra',
    area: 'Airport Residential',
    isAvailable: true,
    lastDonatedDate: '2026-07-01',
    totalDonations: 9,
    location: {
      latitude: 5.6025,
      longitude: -0.1772
    }
  },
  {
    id: 'donor-4',
    name: 'Akua Serwaa',
    bloodType: 'B+',
    rawPhone: '+233 55 987 6543',
    maskedPhone: '+233 55 *** *543',
    city: 'Accra',
    area: 'East Legon',
    isAvailable: true,
    lastDonatedDate: '2026-04-20',
    totalDonations: 3,
    location: {
      latitude: 5.6428,
      longitude: -0.1580
    }
  },
  {
    id: 'donor-5',
    name: 'Yaw Mensah',
    bloodType: 'A-',
    rawPhone: '+233 27 345 6789',
    maskedPhone: '+233 27 *** *789',
    city: 'Accra',
    area: 'Dzorwulu',
    isAvailable: true,
    lastDonatedDate: '2026-08-01',
    totalDonations: 5,
    location: {
      latitude: 5.6111,
      longitude: -0.1983
    }
  },
  {
    id: 'donor-6',
    name: 'Esi Frimpong',
    bloodType: 'AB+', // Universal recipient
    rawPhone: '+233 24 555 7788',
    maskedPhone: '+233 24 *** *788',
    city: 'Accra',
    area: 'Kaneshie',
    isAvailable: true,
    lastDonatedDate: '2026-03-12',
    totalDonations: 2,
    location: {
      latitude: 5.5683,
      longitude: -0.2412
    }
  },
  {
    id: 'donor-7',
    name: 'Emmanuel Osei',
    bloodType: 'O-', // Universal donor
    rawPhone: '+233 54 222 3344',
    maskedPhone: '+233 54 *** *344',
    city: 'Accra',
    area: 'Dansoman',
    isAvailable: true,
    lastDonatedDate: '2026-07-22',
    totalDonations: 8,
    location: {
      latitude: 5.5450,
      longitude: -0.2650
    }
  },
  {
    id: 'donor-8',
    name: 'Nana Yaa Darko',
    bloodType: 'B-',
    rawPhone: '+233 26 888 9900',
    maskedPhone: '+233 26 *** *900',
    city: 'Accra',
    area: 'Cantonments',
    isAvailable: true,
    lastDonatedDate: '2026-06-30',
    totalDonations: 5,
    location: {
      latitude: 5.5794,
      longitude: -0.1706
    }
  }
];

// Seed active blood requests
const INITIAL_REQUESTS = [
  {
    id: 'req-101',
    hospitalId: 'hosp-1',
    hospitalName: 'Korle Bu Teaching Hospital',
    bloodType: 'O-',
    unitsRequired: 3,
    unitsFulfilled: 1,
    urgency: 'CRITICAL', // CRITICAL | URGENT | ROUTINE
    status: 'IN_PROGRESS', // OPEN | IN_PROGRESS | FULFILLED | CANCELLED
    patientNotes: 'Emergency pediatric surgery and blood loss trauma. Urgent O- donors needed.',
    location: {
      latitude: 5.5367,
      longitude: -0.2289,
      address: 'Guggisberg Ave, Korle Bu, Accra'
    },
    createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    schedules: [
      {
        id: 'sch-1',
        donorId: 'donor-1',
        donorName: 'Kwame Agyeman',
        donorBloodType: 'O-',
        maskedPhone: '+233 24 *** *233',
        appointmentTime: 'Today at 3:30 PM',
        status: 'CONFIRMED',
        pledgedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString()
      }
    ]
  },
  {
    id: 'req-102',
    hospitalId: 'hosp-2',
    hospitalName: 'Greater Accra Regional Hospital (Ridge)',
    bloodType: 'A+',
    unitsRequired: 2,
    unitsFulfilled: 0,
    urgency: 'URGENT',
    status: 'OPEN',
    patientNotes: 'Maternal health unit urgent requirement for scheduled caesarean section.',
    location: {
      latitude: 5.5645,
      longitude: -0.1983,
      address: 'Castle Rd, Ridge, Accra'
    },
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    schedules: []
  },
  {
    id: 'req-103',
    hospitalId: 'hosp-3',
    hospitalName: '37 Military Hospital',
    bloodType: 'B+',
    unitsRequired: 4,
    unitsFulfilled: 0,
    urgency: 'URGENT',
    status: 'OPEN',
    patientNotes: 'Road traffic collision casualty resuscitation blood reserve.',
    location: {
      latitude: 5.5888,
      longitude: -0.1804,
      address: 'Liberation Rd, 37, Accra'
    },
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    schedules: []
  }
];

class DataStore {
  constructor() {
    this.hospitals = [...INITIAL_HOSPITALS];
    this.donors = [...INITIAL_DONORS];
    this.requests = [...INITIAL_REQUESTS];
  }

  // --- Hospitals ---
  getAllHospitals() {
    return this.hospitals;
  }

  getHospitalById(id) {
    return this.hospitals.find(h => h.id === id);
  }

  // --- Donors ---
  getAllDonors() {
    // Return sanitized donor objects (safe for privacy compliance)
    return this.donors.map(d => ({
      id: d.id,
      name: d.name,
      bloodType: d.bloodType,
      maskedPhone: d.maskedPhone,
      city: d.city,
      area: d.area,
      isAvailable: d.isAvailable,
      lastDonatedDate: d.lastDonatedDate,
      totalDonations: d.totalDonations,
      location: d.location
    }));
  }

  getDonorById(id) {
    const donor = this.donors.find(d => d.id === id);
    if (!donor) return null;
    return {
      id: donor.id,
      name: donor.name,
      bloodType: donor.bloodType,
      maskedPhone: donor.maskedPhone,
      city: donor.city,
      area: donor.area,
      isAvailable: donor.isAvailable,
      lastDonatedDate: donor.lastDonatedDate,
      totalDonations: donor.totalDonations,
      location: donor.location
    };
  }

  addDonor(donorData) {
    const raw = donorData.phone || '';
    const masked = raw.length > 5
      ? `${raw.slice(0, 7)} *** *${raw.slice(-3)}`
      : '***-***-****';

    const newDonor = {
      id: `donor-${uuidv4().slice(0, 8)}`,
      name: donorData.name,
      bloodType: donorData.bloodType,
      rawPhone: raw,
      maskedPhone: masked,
      city: donorData.city || 'Accra',
      area: donorData.area || 'Central',
      isAvailable: donorData.isAvailable ?? true,
      lastDonatedDate: donorData.lastDonatedDate || null,
      totalDonations: donorData.totalDonations || 0,
      location: donorData.location || {
        latitude: 5.5600,
        longitude: -0.2000
      }
    };
    this.donors.push(newDonor);
    return this.getDonorById(newDonor.id);
  }

  // --- Requests ---
  getAllRequests() {
    return this.requests.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  getRequestById(id) {
    return this.requests.find(r => r.id === id);
  }

  createRequest(requestData) {
    const hospital = this.getHospitalById(requestData.hospitalId) || this.hospitals[0];

    const newRequest = {
      id: `req-${Date.now().toString().slice(-6)}`,
      hospitalId: hospital.id,
      hospitalName: hospital.name,
      bloodType: requestData.bloodType.toUpperCase(),
      unitsRequired: parseInt(requestData.unitsRequired, 10) || 1,
      unitsFulfilled: 0,
      urgency: requestData.urgency || 'URGENT',
      status: 'OPEN',
      patientNotes: requestData.patientNotes || '',
      location: requestData.location || hospital.location,
      createdAt: new Date().toISOString(),
      schedules: []
    };

    this.requests.unshift(newRequest);
    return newRequest;
  }

  scheduleDonation(requestId, { donorId, appointmentTime, notes }) {
    const request = this.getRequestById(requestId);
    if (!request) return null;

    const donor = this.getDonorById(donorId) || {
      id: donorId,
      name: 'Registered Donor',
      bloodType: 'Unknown',
      maskedPhone: '+233 24 *** *000'
    };

    const newSchedule = {
      id: `sch-${uuidv4().slice(0, 8)}`,
      donorId: donor.id,
      donorName: donor.name,
      donorBloodType: donor.bloodType,
      maskedPhone: donor.maskedPhone,
      appointmentTime: appointmentTime || 'Immediately / Within 2 hours',
      notes: notes || '',
      status: 'CONFIRMED',
      pledgedAt: new Date().toISOString()
    };

    request.schedules.push(newSchedule);
    request.unitsFulfilled = Math.min(request.unitsRequired, request.unitsFulfilled + 1);

    if (request.unitsFulfilled >= request.unitsRequired) {
      request.status = 'FULFILLED';
    } else {
      request.status = 'IN_PROGRESS';
    }

    return { request, schedule: newSchedule };
  }

  updateRequestStatus(requestId, status) {
    const request = this.getRequestById(requestId);
    if (!request) return null;
    request.status = status;
    return request;
  }
}

const instance = new DataStore();
module.exports = instance;
