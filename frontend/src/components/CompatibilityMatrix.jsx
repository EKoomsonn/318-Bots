import React, { useState } from 'react';
import { 
  ALL_BLOOD_TYPES, 
  COMPATIBLE_DONORS_FOR_RECIPIENT, 
  COMPATIBLE_RECIPIENTS_FOR_DONOR, 
  isCompatible 
} from '../services/compatibility';
import { Activity, Check, X, Info, Sparkles, Award } from 'lucide-react';

export default function CompatibilityMatrix() {
  const [selectedType, setSelectedType] = useState('O-');

  const canDonateTo = COMPATIBLE_RECIPIENTS_FOR_DONOR[selectedType] || [];
  const canReceiveFrom = COMPATIBLE_DONORS_FOR_RECIPIENT[selectedType] || [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <div className="flex items-center space-x-3 mb-2">
          <div className="p-2.5 bg-red-100 rounded-xl text-red-600">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900">
              RedApp Biological Compatibility Engine
            </h1>
            <p className="text-xs text-slate-500">
              ABO & Rh Factor Red Blood Cell (RBC) Transfusion Rules
            </p>
          </div>
        </div>
        <p className="text-xs text-slate-600 max-w-3xl leading-relaxed mt-2">
          When a hospital broadcasts a blood shortage on RedApp, our rule engine evaluates biological compatibility before triggering alerts. Only donors whose red blood cells lack antigens that would be attacked by the recipient's antibodies receive high-priority notifications.
        </p>
      </div>

      {/* Interactive Explorer Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-red-600" />
          <span>Select Blood Type to Inspect Compatibility:</span>
        </h2>

        {/* Buttons */}
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2.5 mb-6">
          {ALL_BLOOD_TYPES.map((type) => {
            const isOminus = type === 'O-';
            const isABplus = type === 'AB+';

            return (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`relative py-3 rounded-2xl font-black text-base border transition-all flex flex-col items-center justify-center ${
                  selectedType === type
                    ? 'bg-red-600 text-white border-red-600 shadow-lg shadow-red-200 scale-105'
                    : 'bg-slate-50 text-slate-800 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span>{type}</span>
                {isOminus && (
                  <span className={`text-[9px] uppercase font-bold px-1 rounded mt-0.5 ${selectedType === type ? 'bg-red-800 text-white' : 'bg-red-100 text-red-700'}`}>
                    Universal
                  </span>
                )}
                {isABplus && (
                  <span className={`text-[9px] uppercase font-bold px-1 rounded mt-0.5 ${selectedType === type ? 'bg-red-800 text-white' : 'bg-blue-100 text-blue-700'}`}>
                    Recipient
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Detailed Breakdown for Selected Type */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Can Donate To */}
          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900">
                Blood Group <span className="text-red-600 text-base">{selectedType}</span> Can Donate To:
              </h3>
              <span className="text-xs font-bold px-2 py-0.5 bg-red-100 text-red-700 rounded-full">
                {canDonateTo.length} of 8 Types
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {ALL_BLOOD_TYPES.map((t) => {
                const isMatch = canDonateTo.includes(t);
                return (
                  <div
                    key={t}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border ${
                      isMatch
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        : 'bg-slate-100 text-slate-400 border-slate-200 opacity-60'
                    }`}
                  >
                    {isMatch ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <X className="w-3.5 h-3.5 text-slate-400" />}
                    <span>{t}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Can Receive From */}
          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900">
                Patient With <span className="text-red-600 text-base">{selectedType}</span> Can Receive From:
              </h3>
              <span className="text-xs font-bold px-2 py-0.5 bg-red-100 text-red-700 rounded-full">
                {canReceiveFrom.length} of 8 Types
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {ALL_BLOOD_TYPES.map((t) => {
                const isMatch = canReceiveFrom.includes(t);
                return (
                  <div
                    key={t}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border ${
                      isMatch
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        : 'bg-slate-100 text-slate-400 border-slate-200 opacity-60'
                    }`}
                  >
                    {isMatch ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <X className="w-3.5 h-3.5 text-slate-400" />}
                    <span>{t}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Full 8x8 Compatibility Grid */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm overflow-x-auto">
        <h2 className="text-base font-bold text-slate-900 mb-2">
          Clinical 8×8 RBC Transfusion Matrix
        </h2>
        <p className="text-xs text-slate-500 mb-4">
          Rows represent the <strong>Donor</strong> blood group; columns represent the <strong>Recipient</strong>.
        </p>

        <table className="w-full text-center border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="p-2 text-left text-slate-500 font-bold uppercase tracking-wider">Donor \ Recipient</th>
              {ALL_BLOOD_TYPES.map((recip) => (
                <th key={recip} className="p-2.5 font-black text-slate-800 bg-slate-50">
                  {recip}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ALL_BLOOD_TYPES.map((donor) => (
              <tr key={donor} className="border-b border-slate-100 hover:bg-slate-50/60">
                <td className="p-2.5 font-black text-left text-slate-900 bg-slate-50">
                  {donor}
                  {donor === 'O-' && <span className="ml-1 text-[9px] text-red-600 font-bold">(Universal)</span>}
                </td>
                {ALL_BLOOD_TYPES.map((recipient) => {
                  const match = isCompatible(donor, recipient);
                  return (
                    <td key={recipient} className="p-2">
                      <div
                        className={`w-7 h-7 mx-auto rounded-lg flex items-center justify-center font-bold text-xs ${
                          match
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-slate-100 text-slate-300'
                        }`}
                      >
                        {match ? '✓' : '—'}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
