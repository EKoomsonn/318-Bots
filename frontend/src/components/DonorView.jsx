import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { isCompatible, calculateDistanceKm, COMPATIBLE_RECIPIENTS_FOR_DONOR } from '../services/compatibility';
import confetti from 'canvas-confetti';
import { 
  Heart, 
  MapPin, 
  Clock, 
  CheckCircle, 
  ShieldCheck, 
  Calendar, 
  AlertTriangle, 
  ChevronRight,
  Filter,
  CheckCircle2,
  X
} from 'lucide-react';

export default function DonorView({ requests, onScheduleDonation }) {
  const { currentDonor, setCurrentDonor, donorsList } = useAuth();

  const [onlyCompatible, setOnlyCompatible] = useState(true);
  const [maxDistanceKm, setMaxDistanceKm] = useState(50);
  const [selectedRequestForPledge, setSelectedRequestForPledge] = useState(null);
  const [appointmentSlot, setAppointmentSlot] = useState('Within 2 Hours (Urgent)');
  const [checklist, setChecklist] = useState({
    ageWeightOk: true,
    feelingWell: true,
    hydrated: true
  });
  const [pledgeNotes, setPledgeNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  // Compute distance and biological compatibility for each request
  const processedRequests = requests.map(req => {
    const compatible = isCompatible(currentDonor.bloodType, req.bloodType);
    const distanceKm = currentDonor.location && req.location
      ? calculateDistanceKm(
          currentDonor.location.latitude,
          currentDonor.location.longitude,
          req.location.latitude,
          req.location.longitude
        )
      : null;

    return {
      ...req,
      isCompatible: compatible,
      distanceKm
    };
  });

  // Apply filters
  const filteredRequests = processedRequests
    .filter(req => {
      if (onlyCompatible && !req.isCompatible) return false;
      if (req.status === 'FULFILLED') return false;
      if (maxDistanceKm && req.distanceKm !== null && req.distanceKm > maxDistanceKm) return false;
      return true;
    })
    .sort((a, b) => (a.distanceKm ?? Infinity) - (b.distanceKm ?? Infinity));

  const handlePledgeCommit = async (e) => {
    e.preventDefault();
    if (!selectedRequestForPledge) return;

    setIsSubmitting(true);
    try {
      await onScheduleDonation(selectedRequestForPledge.id, {
        donorId: currentDonor.id,
        donorName: currentDonor.name,
        donorBloodType: currentDonor.bloodType,
        maskedPhone: currentDonor.maskedPhone,
        appointmentTime: appointmentSlot,
        notes: pledgeNotes
      });

      // Trigger celebration confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // ignore
      }

      setSuccessMessage({
        hospitalName: selectedRequestForPledge.hospitalName,
        bloodType: selectedRequestForPledge.bloodType,
        time: appointmentSlot
      });

      setSelectedRequestForPledge(null);
      setPledgeNotes('');
    } catch (err) {
      console.error('Failed to pledge:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const recipientTypes = COMPATIBLE_RECIPIENTS_FOR_DONOR[currentDonor.bloodType] || [];

  return (
    <div className="space-y-8">
      {/* Donor Profile Header & Selector */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="relative flex items-center justify-center w-16 h-16 bg-red-600 rounded-2xl text-white font-black text-2xl shadow-lg shadow-red-200">
              {currentDonor.bloodType}
              <Heart className="w-4 h-4 fill-white absolute bottom-1 right-1" />
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-extrabold text-slate-900">{currentDonor.name}</h1>
                <span className="text-xs font-semibold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full border border-emerald-200">
                  Ready to Donate
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5 flex items-center space-x-2">
                <span>📍 {currentDonor.area}, {currentDonor.city}</span>
                <span>•</span>
                <span>Masked: {currentDonor.maskedPhone}</span>
                <span>•</span>
                <span>{currentDonor.totalDonations || 0} Lifesaving Donations</span>
              </p>
              <div className="mt-2 text-xs text-slate-600 flex items-center space-x-1">
                <span className="font-semibold text-slate-900">Your RBC can safely help: </span>
                <span className="text-red-700 font-bold">{recipientTypes.join(', ')}</span>
              </div>
            </div>
          </div>

          {/* Donor Account Switcher */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 min-w-[260px]">
            <label className="block text-xs font-bold text-slate-600 mb-1">
              Switch Active Donor Account:
            </label>
            <select
              value={currentDonor.id}
              onChange={(e) => {
                const found = donorsList.find(d => d.id === e.target.value);
                if (found) setCurrentDonor(found);
              }}
              className="w-full bg-white text-slate-900 text-xs font-bold rounded-lg px-3 py-2 border border-slate-300 focus:ring-2 focus:ring-red-500"
            >
              {donorsList.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.bloodType} - {d.area})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Success Banner if committed */}
      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-bold text-emerald-900">
                Donation Pledge Confirmed at {successMessage.hospitalName}!
              </h3>
              <p className="text-xs text-emerald-700 mt-0.5">
                Thank you, {currentDonor.name}. Your schedule for {successMessage.time} has been registered with the hospital blood bank. Please proceed with proper hydration.
              </p>
            </div>
          </div>
          <button
            onClick={() => setSuccessMessage(null)}
            className="text-emerald-700 hover:text-emerald-900 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Filter & Controls Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={onlyCompatible}
              onChange={(e) => setOnlyCompatible(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
            <span className="ml-3 text-xs font-bold text-slate-700">
              Only Biologically Compatible ({currentDonor.bloodType})
            </span>
          </label>
        </div>

        <div className="flex items-center space-x-2 text-xs font-medium text-slate-600">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span>Max Radius:</span>
          <select
            value={maxDistanceKm}
            onChange={(e) => setMaxDistanceKm(Number(e.target.value))}
            className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-800"
          >
            <option value="10">Within 10 km</option>
            <option value="25">Within 25 km</option>
            <option value="50">Within 50 km</option>
            <option value="200">All Ghana Regions</option>
          </select>
        </div>
      </div>

      {/* Requests Feed Sorted by Distance */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
            <span>Hospital Blood Emergencies Nearby</span>
            <span className="px-2 py-0.5 text-xs font-bold bg-slate-100 text-slate-700 rounded-full border border-slate-200">
              {filteredRequests.length} Matches
            </span>
          </h2>
          <span className="text-xs text-slate-500">Sorted by distance to your coordinates</span>
        </div>

        {filteredRequests.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
            <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">No Compatible Emergencies In Range</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              There are currently no open blood shortages matching your blood group ({currentDonor.bloodType}) within {maxDistanceKm} km. We will notify you instantly when a hospital broadcasts!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredRequests.map((req) => {
              const isUrgent = req.urgency === 'CRITICAL';
              const percent = Math.min(100, Math.round(((req.unitsFulfilled || 0) / req.unitsRequired) * 100));

              return (
                <div
                  key={req.id}
                  className={`bg-white rounded-2xl p-5 border transition-all flex flex-col justify-between ${
                    isUrgent
                      ? 'border-red-300 hover:border-red-400 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 shadow-sm'
                  }`}
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded-xl bg-red-50 border border-red-200 flex flex-col items-center justify-center text-red-700 font-black">
                          <span className="text-[10px] uppercase font-semibold">Needs</span>
                          <span className="text-lg leading-none">{req.bloodType}</span>
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-slate-900 leading-snug">{req.hospitalName}</h3>
                          <div className="flex items-center space-x-2 mt-0.5">
                            {req.distanceKm !== null && (
                              <span className="text-xs font-bold text-slate-700 flex items-center space-x-1">
                                <MapPin className="w-3.5 h-3.5 text-red-500" />
                                <span>{req.distanceKm} km away</span>
                              </span>
                            )}
                            <span
                              className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full uppercase ${
                                isUrgent ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                              }`}
                            >
                              {req.urgency}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Biological Match Badge */}
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                          req.isCompatible
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-slate-100 text-slate-500 border border-slate-200'
                        }`}
                      >
                        {req.isCompatible ? 'Biologically Match' : 'Incompatible'}
                      </span>
                    </div>

                    {/* Patient Context */}
                    {req.patientNotes && (
                      <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 mb-3">
                        {req.patientNotes}
                      </p>
                    )}

                    {/* Progress */}
                    <div className="space-y-1 mb-4">
                      <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
                        <span>Pledges</span>
                        <span className="text-red-700 font-bold">
                          {req.unitsFulfilled || 0} / {req.unitsRequired} pints
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-red-600 h-2 rounded-full"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Commit Action */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400 flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(req.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </span>

                    <button
                      onClick={() => setSelectedRequestForPledge(req)}
                      disabled={!req.isCompatible}
                      className="px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-md shadow-red-200 flex items-center space-x-1.5 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <Heart className="w-3.5 h-3.5 fill-white" />
                      <span>Commit & Schedule Visit</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Schedule & Commitment Modal */}
      {selectedRequestForPledge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 border border-slate-200 shadow-2xl relative">
            <button
              onClick={() => setSelectedRequestForPledge(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3 mb-4">
              <div className="p-3 bg-red-100 rounded-2xl text-red-600">
                <Heart className="w-6 h-6 fill-current" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Confirm Blood Donation Visit
                </h3>
                <p className="text-xs text-slate-500">
                  {selectedRequestForPledge.hospitalName} · Needs {selectedRequestForPledge.bloodType}
                </p>
              </div>
            </div>

            <form onSubmit={handlePledgeCommit} className="space-y-4">
              {/* Appointment Slot Picker */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Expected Arrival Time Slot <span className="text-red-500">*</span>
                </label>
                <select
                  value={appointmentSlot}
                  onChange={(e) => setAppointmentSlot(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-red-500"
                >
                  <option value="Immediately (Within 1 hour)">Immediately (Within 1 hour)</option>
                  <option value="Today at 3:00 PM">Today at 3:00 PM</option>
                  <option value="Today at 5:30 PM">Today at 5:30 PM</option>
                  <option value="Tomorrow Morning (9:00 AM)">Tomorrow Morning (9:00 AM)</option>
                </select>
              </div>

              {/* Pre-donation Readiness Checklist */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
                <h4 className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Pre-Donation Eligibility Checklist</span>
                </h4>
                <label className="flex items-center space-x-2 text-xs text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={checklist.ageWeightOk}
                    onChange={(e) => setChecklist({ ...checklist, ageWeightOk: e.target.checked })}
                    className="rounded text-red-600 focus:ring-red-500"
                  />
                  <span>I am between 17–65 years old and weigh at least 50 kg</span>
                </label>
                <label className="flex items-center space-x-2 text-xs text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={checklist.feelingWell}
                    onChange={(e) => setChecklist({ ...checklist, feelingWell: e.target.checked })}
                    className="rounded text-red-600 focus:ring-red-500"
                  />
                  <span>I am feeling well with no active fever, malaria, or medications</span>
                </label>
                <label className="flex items-center space-x-2 text-xs text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={checklist.hydrated}
                    onChange={(e) => setChecklist({ ...checklist, hydrated: e.target.checked })}
                    className="rounded text-red-600 focus:ring-red-500"
                  />
                  <span>I have had fluids/water and eaten within the last 4 hours</span>
                </label>
              </div>

              {/* Optional Notes */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Notes for Hospital Blood Bank (Optional)
                </label>
                <input
                  type="text"
                  value={pledgeNotes}
                  onChange={(e) => setPledgeNotes(e.target.value)}
                  placeholder="e.g. Coming with a friend, will arrive by taxi"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:ring-2 focus:ring-red-500"
                />
              </div>

              {/* Screening Disclaimer */}
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-800 leading-relaxed flex items-start space-x-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Standard Medical Protocol:</strong> RedApp facilitates immediate contact. Complete health screening, hemoglobin testing, and safe draw will be administered by medical officers at the hospital.
                </span>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedRequestForPledge(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !checklist.ageWeightOk || !checklist.feelingWell}
                  className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-lg shadow-red-200 transition-all disabled:opacity-40"
                >
                  {isSubmitting ? 'Confirming...' : 'Confirm Lifesaving Pledge'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
