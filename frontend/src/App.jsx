import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SocketProvider, useSocket } from './context/SocketContext';
import Navbar from './components/Navbar';
import HospitalView from './components/HospitalView';
import DonorView from './components/DonorView';
import LiveMap from './components/LiveMap';
import CompatibilityMatrix from './components/CompatibilityMatrix';
import PrivacyDisclaimer from './components/PrivacyDisclaimer';
import TeamRosterModal from './components/TeamRosterModal';
import { NotificationDrawer, NotificationToast } from './components/NotificationCenter';
import api from './services/api';
import { Droplet, Heart, Shield, Radio, Activity, MapPin } from 'lucide-react';

// Fallback seed requests if backend API is not yet running or during standalone Netlify preview
const FALLBACK_SEED_REQUESTS = [
  {
    id: 'req-101',
    hospitalId: 'hosp-1',
    hospitalName: 'Korle Bu Teaching Hospital',
    bloodType: 'O-',
    unitsRequired: 3,
    unitsFulfilled: 1,
    urgency: 'CRITICAL',
    status: 'IN_PROGRESS',
    patientNotes: 'Emergency pediatric surgery and blood loss trauma. Urgent O- donors needed.',
    location: { latitude: 5.5367, longitude: -0.2289, address: 'Guggisberg Ave, Korle Bu, Accra' },
    createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    schedules: [
      {
        id: 'sch-1',
        donorId: 'donor-1',
        donorName: 'Kwame Agyeman',
        donorBloodType: 'O-',
        maskedPhone: '+233 24 *** *233',
        appointmentTime: 'Today at 3:30 PM',
        status: 'CONFIRMED'
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
    location: { latitude: 5.5645, longitude: -0.1983, address: 'Castle Rd, Ridge, Accra' },
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
    location: { latitude: 5.5888, longitude: -0.1804, address: 'Liberation Rd, 37, Accra' },
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    schedules: []
  }
];

function MainContent() {
  const { role } = useAuth();
  const { socket } = useSocket();

  const [activeTab, setActiveTab] = useState('DASHBOARD'); // 'DASHBOARD' | 'MAP' | 'MATRIX' | 'DISCLAIMER'
  const [requests, setRequests] = useState(FALLBACK_SEED_REQUESTS);
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [isNotifDrawerOpen, setIsNotifDrawerOpen] = useState(false);
  const [stats, setStats] = useState({
    activeRequestsCount: 3,
    registeredDonorsCount: 8,
    hospitalsCount: 5,
    totalUnitsFulfilled: 1
  });

  // Fetch initial data from backend API
  const loadRequests = async () => {
    try {
      const res = await api.getRequests();
      if (res && res.data) {
        setRequests(res.data);
      }
    } catch (err) {
      console.warn('Backend API currently unreachable, running with seed store:', err.message);
    }
  };

  const loadStats = async () => {
    try {
      const res = await api.getStats();
      if (res && res.data) {
        setStats(res.data);
      }
    } catch (err) {
      // fallback
    }
  };

  useEffect(() => {
    loadRequests();
    loadStats();
  }, []);

  // Listen to live socket events for instantaneous real-time sync without page refresh
  useEffect(() => {
    if (!socket) return;

    socket.on('blood_alert_broadcast', (newReq) => {
      setRequests(prev => {
        const exists = prev.some(r => r.id === newReq.id);
        if (exists) return prev;
        return [newReq, ...prev];
      });
      loadStats();
    });

    socket.on('request_updated', (updatedData) => {
      setRequests(prev => prev.map(r => {
        if (r.id === updatedData.requestId) {
          return {
            ...r,
            status: updatedData.status,
            unitsFulfilled: updatedData.unitsFulfilled,
            schedules: updatedData.latestSchedule ? [...(r.schedules || []), updatedData.latestSchedule] : r.schedules
          };
        }
        return r;
      }));
      loadStats();
    });

    socket.on('request_status_changed', ({ requestId, status }) => {
      setRequests(prev => prev.map(r => r.id === requestId ? { ...r, status } : r));
      loadStats();
    });

    return () => {
      socket.off('blood_alert_broadcast');
      socket.off('request_updated');
      socket.off('request_status_changed');
    };
  }, [socket]);

  // Handlers
  const handleRequestCreated = async (payload) => {
    try {
      const res = await api.createRequest(payload);
      if (res && res.data) {
        setRequests(prev => [res.data, ...prev]);
      }
    } catch (err) {
      // Local fallback creation
      const localNew = {
        id: `req-${Date.now().toString().slice(-5)}`,
        ...payload,
        unitsFulfilled: 0,
        status: 'OPEN',
        createdAt: new Date().toISOString(),
        location: { latitude: 5.5367, longitude: -0.2289 },
        schedules: []
      };
      setRequests(prev => [localNew, ...prev]);
    }
  };

  const handleScheduleDonation = async (requestId, payload) => {
    try {
      const res = await api.scheduleDonation(requestId, payload);
      if (res && res.data) {
        setRequests(prev => prev.map(r => r.id === requestId ? res.data.request : r));
      }
    } catch (err) {
      // Local fallback
      setRequests(prev => prev.map(r => {
        if (r.id === requestId) {
          const newSchedule = {
            id: `sch-${Date.now()}`,
            ...payload,
            pledgedAt: new Date().toISOString()
          };
          const fulfilled = (r.unitsFulfilled || 0) + 1;
          return {
            ...r,
            unitsFulfilled: fulfilled,
            status: fulfilled >= r.unitsRequired ? 'FULFILLED' : 'IN_PROGRESS',
            schedules: [...(r.schedules || []), newSchedule]
          };
        }
        return r;
      }));
    }
  };

  const handleStatusChange = async (requestId, newStatus) => {
    try {
      await api.updateRequestStatus(requestId, newStatus);
      setRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: newStatus } : r));
    } catch (err) {
      setRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: newStatus } : r));
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenTeamModal={() => setIsTeamModalOpen(true)}
        onOpenNotifDrawer={() => setIsNotifDrawerOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-3">
            <div className="p-3 bg-red-100 text-red-600 rounded-xl">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <span className="text-xl font-black text-slate-900">{requests.filter(r => r.status !== 'FULFILLED').length}</span>
              <p className="text-xs text-slate-500 font-medium">Active Emergencies</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-3">
            <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl">
              <Heart className="w-5 h-5 fill-current" />
            </div>
            <div>
              <span className="text-xl font-black text-slate-900">{stats.registeredDonorsCount || 8}</span>
              <p className="text-xs text-slate-500 font-medium">Registered Donors</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-3">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-black text-slate-900">{stats.hospitalsCount || 5}</span>
              <p className="text-xs text-slate-500 font-medium">Connected Hospitals</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-3">
            <div className="p-3 bg-amber-100 text-amber-600 rounded-xl">
              <Droplet className="w-5 h-5 fill-current" />
            </div>
            <div>
              <span className="text-xl font-black text-slate-900">
                {requests.reduce((sum, r) => sum + (r.unitsFulfilled || 0), 0)}
              </span>
              <p className="text-xs text-slate-500 font-medium">Pints Pledged</p>
            </div>
          </div>
        </div>

        {/* Tab Content Views */}
        {activeTab === 'DASHBOARD' && (
          role === 'HOSPITAL' ? (
            <HospitalView
              requests={requests}
              onRequestCreated={handleRequestCreated}
              onStatusChange={handleStatusChange}
            />
          ) : (
            <DonorView
              requests={requests}
              onScheduleDonation={handleScheduleDonation}
            />
          )
        )}

        {activeTab === 'MAP' && <LiveMap />}

        {activeTab === 'MATRIX' && <CompatibilityMatrix />}

        {activeTab === 'DISCLAIMER' && <PrivacyDisclaimer />}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-semibold text-slate-700">
            RedApp · Real-Time Blood Donation Coordination Platform
          </p>
          <p>
            University of Ghana · DCIT 318 Programming II
          </p>
          <button
            onClick={() => setIsTeamModalOpen(true)}
            className="text-red-600 hover:text-red-700 font-bold underline"
          >
            View Project Team Roster (8 Members)
          </button>
        </div>
      </footer>

      {/* Notification Toast Popup */}
      <NotificationToast />

      {/* Notification Drawer Slideover */}
      <NotificationDrawer
        isOpen={isNotifDrawerOpen}
        onClose={() => setIsNotifDrawerOpen(false)}
      />

      {/* DCIT 318 Team Modal */}
      <TeamRosterModal
        isOpen={isTeamModalOpen}
        onClose={() => setIsTeamModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <MainContent />
      </SocketProvider>
    </AuthProvider>
  );
}
