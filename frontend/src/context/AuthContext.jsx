import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

const MOCK_HOSPITALS = [
  { id: 'hosp-1', name: 'Korle Bu Teaching Hospital', city: 'Accra', bloodBankPhone: '+233 30 266 5401' },
  { id: 'hosp-2', name: 'Greater Accra Regional Hospital (Ridge)', city: 'Accra', bloodBankPhone: '+233 30 222 8315' },
  { id: 'hosp-3', name: '37 Military Hospital', city: 'Accra', bloodBankPhone: '+233 30 277 6111' },
  { id: 'hosp-4', name: 'Komfo Anokye Teaching Hospital', city: 'Kumasi', bloodBankPhone: '+233 32 202 2301' },
  { id: 'hosp-5', name: 'Tema General Hospital', city: 'Tema', bloodBankPhone: '+233 30 330 2695' }
];

const MOCK_DONORS = [
  {
    id: 'donor-1',
    name: 'Kwame Agyeman',
    bloodType: 'O-', // Universal donor
    maskedPhone: '+233 24 *** *233',
    city: 'Accra',
    area: 'Adabraka',
    location: { latitude: 5.5562, longitude: -0.2104 },
    totalDonations: 6
  },
  {
    id: 'donor-2',
    name: 'Abena Mansa',
    bloodType: 'O+',
    maskedPhone: '+233 50 *** *567',
    city: 'Accra',
    area: 'Osu',
    location: { latitude: 5.5560, longitude: -0.1820 },
    totalDonations: 4
  },
  {
    id: 'donor-3',
    name: 'Kofi Boateng',
    bloodType: 'A+',
    maskedPhone: '+233 20 *** *432',
    city: 'Accra',
    area: 'Airport Residential',
    location: { latitude: 5.6025, longitude: -0.1772 },
    totalDonations: 9
  },
  {
    id: 'donor-4',
    name: 'Akua Serwaa',
    bloodType: 'B+',
    maskedPhone: '+233 55 *** *543',
    city: 'Accra',
    area: 'East Legon',
    location: { latitude: 5.6428, longitude: -0.1580 },
    totalDonations: 3
  },
  {
    id: 'donor-6',
    name: 'Esi Frimpong',
    bloodType: 'AB+', // Universal recipient
    maskedPhone: '+233 24 *** *788',
    city: 'Accra',
    area: 'Kaneshie',
    location: { latitude: 5.5683, longitude: -0.2412 },
    totalDonations: 2
  }
];

export function AuthProvider({ children }) {
  const [role, setRole] = useState('HOSPITAL'); // 'HOSPITAL' | 'DONOR'
  const [currentHospital, setCurrentHospital] = useState(MOCK_HOSPITALS[0]);
  const [currentDonor, setCurrentDonor] = useState(MOCK_DONORS[0]);

  return (
    <AuthContext.Provider
      value={{
        role,
        setRole,
        currentHospital,
        setCurrentHospital,
        currentDonor,
        setCurrentDonor,
        hospitalsList: MOCK_HOSPITALS,
        donorsList: MOCK_DONORS
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
