import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ALL_BLOOD_TYPES, COMPATIBLE_DONORS_FOR_RECIPIENT } from '../services/compatibility';
import { 
  Send, 
  AlertCircle, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  Users, 
  Droplet, 
  Radio, 
  ChevronRight,
  ShieldCheck,
  Calendar
} from 'lucide-react';

export default function HospitalView({ requests, onRequestCreated, onStatusChange }) {
  const { currentHospital, setCurrentHospital, hospitalsList } = useAuth();

  // Form State
  const [bloodType, setBloodType] = useState('O-');
  const [unitsRequired, setUnitsRequired] = useState(2);
  const [urgency, setUrgency] = useState('CRITICAL');
  const [patientNotes, setPatientNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedRequestDetails, setSelectedRequestDetails] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onRequestCreated({
        hospitalId: currentHospital.id,
        hospitalName: currentHospital.name,
        bloodType,
        unitsRequired: parseInt(unitsRequired, 10),
        urgency,
        patientNotes: patientNotes || `Emergency request for ${bloodType} blood at ${currentHospital.name}.`
      });
      // Reset form fields
      setPatientNotes('');
    } catch (err) {
      console.error('Failed to broadcast request:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const eligibleDonors = COMPATIBLE_DONORS_FOR_RECIPIENT[bloodType] || [];

  return (
    <div className="space-y-8">
      {/* Top Banner / Hospital Selector */}
      <div className="bg-gradient-to-r from-red-600 to-rose-700 rounded-2xl p-6 text-white shadow-lg shadow-red-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold mb-2">
              <Radio className="w-3.5 h-3.5 animate-pulse text-amber-300" />
              <span>Hospital Emergency Dispatch Center</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Broadcast Urgent Blood Need
            </h1>
            <p className="text-red-100 text-sm mt-1 max-w-xl">
              Post real-time requirements to instantly reach all biologically compatible donors within proximity without phone delays.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/20">
            <label className="block text-xs font-medium text-red-100 mb-1">
              Active Hospital Dispatcher:
            </label>
            <select
              value={currentHospital.id}
              onChange={(e) => {
                const found = hospitalsList.find(h => h.id === e.target.value);
                if (found) setCurrentHospital(found);
              }}
              className="w-full bg-white text-slate-900 text-sm font-semibold rounded-lg px-3 py-2 border-0 focus:ring-2 focus:ring-red-400"
            >
              {hospitalsList.map((h) => (
                <option key={h.id} value={h.id}>
                  {h.name} ({h.city})
                </option>
              ))}
            </select>
            <p className="text-[11px] text-red-200 mt-1 flex items-center space-x-1">
              <MapPin className="w-3 h-3" />
              <span>{currentHospital.bloodBankPhone} · Emergency Ward</span>
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: Broadcast Form & Active Requests */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Broadcast Form (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center space-x-2 mb-4 pb-3 border-b border-slate-100">
            <div className="p-2 bg-red-100 rounded-lg text-red-600">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">New Emergency Broadcast</h2>
              <p className="text-xs text-slate-500">Pushes live alert to compatible donors</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Blood Type Picker */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                Blood Group Needed <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-4 gap-2">
                {ALL_BLOOD_TYPES.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setBloodType(type)}
                    className={`py-2.5 text-sm font-black rounded-xl border transition-all ${
                      bloodType === type
                        ? 'bg-red-600 text-white border-red-600 shadow-md shadow-red-200 scale-[1.02]'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>

              {/* Dynamic Compatibility Hint */}
              <div className="mt-2.5 p-2.5 bg-red-50/60 rounded-xl border border-red-100 text-xs">
                <span className="font-semibold text-red-900">Compatible Donors: </span>
                <span className="text-red-700">
                  {eligibleDonors.join(', ')} ({eligibleDonors.length} eligible blood types)
                </span>
              </div>
            </div>

            {/* Units & Urgency */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Units / Pints Needed
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={unitsRequired}
                    onChange={(e) => setUnitsRequired(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-red-500 focus:bg-white"
                  />
                  <Droplet className="w-4 h-4 text-red-500 absolute right-3 top-2.5" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Urgency Level
                </label>
                <select
                  value={urgency}
                  onChange={(e) => setUrgency(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-red-500 focus:bg-white"
                >
                  <option value="CRITICAL">CRITICAL 🚨 (Immediate)</option>
                  <option value="URGENT">URGENT ⚡ (Under 4h)</option>
                  <option value="ROUTINE">ROUTINE 📋 (Today)</option>
                </select>
              </div>
            </div>

            {/* Emergency Notes */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Clinical Context / Patient Notes
              </label>
              <textarea
                rows="3"
                value={patientNotes}
                onChange={(e) => setPatientNotes(e.target.value)}
                placeholder="e.g., Surgery trauma case in emergency theater, urgent O- needed for blood transfusion."
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-red-500 focus:bg-white"
              />
            </div>

            {/* Medical Screening Disclaimer Note */}
            <div className="flex items-start space-x-2 text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
              <ShieldCheck className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <span>
                First contact only. Donor screening & draw occur under standard medical protocol at hospital blood bank.
              </span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center space-x-2 py-3.5 px-4 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold rounded-xl shadow-lg shadow-red-200 transition-all disabled:opacity-50"
            >
              <Radio className="w-4 h-4 animate-pulse" />
              <span>{isSubmitting ? 'Broadcasting Alert...' : 'Broadcast Urgent Alert Now'}</span>
            </button>
          </form>
        </div>

        {/* Right Column: Active Live Broadcasts (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
              <span>Active Blood Broadcasts</span>
              <span className="px-2 py-0.5 text-xs font-bold bg-slate-100 text-slate-700 rounded-full border border-slate-200">
                {requests.length} Live
              </span>
            </h2>
          </div>

          <div className="space-y-4">
            {requests.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-800">No Open Blood Shortages</h3>
                <p className="text-xs text-slate-500 mt-1">All current hospital requests have been fulfilled.</p>
              </div>
            ) : (
              requests.map((req) => {
                const percent = Math.min(100, Math.round(((req.unitsFulfilled || 0) / req.unitsRequired) * 100));
                const isCritical = req.urgency === 'CRITICAL';

                return (
                  <div
                    key={req.id}
                    className={`bg-white rounded-2xl p-5 border transition-all ${
                      isCritical && req.status === 'OPEN'
                        ? 'border-red-300 shadow-sm urgent-pulse'
                        : 'border-slate-200 hover:border-slate-300 shadow-sm'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded-xl bg-red-100 flex flex-col items-center justify-center text-red-700 font-black">
                          <span className="text-xs uppercase font-semibold">Type</span>
                          <span className="text-lg leading-none">{req.bloodType}</span>
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className="text-base font-bold text-slate-900">{req.hospitalName}</h3>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                                isCritical
                                  ? 'bg-red-100 text-red-700 border border-red-200'
                                  : 'bg-amber-100 text-amber-700 border border-amber-200'
                              }`}
                            >
                              {req.urgency}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5 flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>Posted {new Date(req.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </p>
                        </div>
                      </div>

                      {/* Status Badge */}
                      <span
                        className={`text-xs font-bold px-3 py-1 rounded-full ${
                          req.status === 'FULFILLED'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : req.status === 'IN_PROGRESS'
                            ? 'bg-blue-100 text-blue-800 border border-blue-200'
                            : 'bg-red-50 text-red-700 border border-red-200'
                        }`}
                      >
                        {req.status}
                      </span>
                    </div>

                    {/* Patient Notes */}
                    {req.patientNotes && (
                      <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 mt-3">
                        {req.patientNotes}
                      </p>
                    )}

                    {/* Progress Bar (Pledges vs Goal) */}
                    <div className="mt-4 pt-3 border-t border-slate-100">
                      <div className="flex items-center justify-between text-xs font-semibold mb-1">
                        <span className="text-slate-600">
                          {req.unitsFulfilled || 0} of {req.unitsRequired} pints pledged
                        </span>
                        <span className="text-red-600">{percent}% Fulfilled</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                        <div
                          className={`h-2.5 rounded-full transition-all duration-500 ${
                            percent >= 100 ? 'bg-emerald-500' : 'bg-red-600'
                          }`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>

                    {/* Pledged Donors List */}
                    {req.schedules && req.schedules.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-slate-100">
                        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center space-x-1">
                          <Users className="w-3.5 h-3.5 text-slate-500" />
                          <span>Committed Donors ({req.schedules.length}):</span>
                        </h4>
                        <div className="space-y-1.5">
                          {req.schedules.map((sch) => (
                            <div
                              key={sch.id}
                              className="flex items-center justify-between text-xs bg-emerald-50/70 border border-emerald-100 rounded-lg p-2"
                            >
                              <div className="flex items-center space-x-2">
                                <span className="font-bold text-emerald-900">{sch.donorName}</span>
                                <span className="px-1.5 py-0.2 bg-emerald-200 text-emerald-800 text-[10px] font-bold rounded">
                                  {sch.donorBloodType}
                                </span>
                                <span className="text-emerald-700 text-[11px]">{sch.maskedPhone}</span>
                              </div>
                              <span className="text-[11px] font-semibold text-emerald-800 flex items-center space-x-1">
                                <Calendar className="w-3 h-3" />
                                <span>{sch.appointmentTime}</span>
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="mt-4 flex items-center justify-end space-x-2">
                      {req.status !== 'FULFILLED' && (
                        <button
                          onClick={() => onStatusChange(req.id, 'FULFILLED')}
                          className="text-xs font-semibold px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors flex items-center space-x-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Mark Fulfilled</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
