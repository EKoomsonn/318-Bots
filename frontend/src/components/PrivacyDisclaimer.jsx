import React from 'react';
import { ShieldCheck, Lock, AlertCircle, FileText, CheckCircle2 } from 'lucide-react';

export default function PrivacyDisclaimer() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Title */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <div className="flex items-center space-x-3 mb-2">
          <div className="p-2.5 bg-red-100 rounded-xl text-red-600">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900">
              Privacy & Medical Screening Disclaimer
            </h1>
            <p className="text-xs text-slate-500">
              RedApp Protocol Compliance & Ghana Medical Standards
            </p>
          </div>
        </div>
      </div>

      {/* Main Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pillar 1: Contact Masking */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
          <div className="p-2.5 bg-emerald-100 text-emerald-700 w-fit rounded-xl">
            <Lock className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold text-slate-900">1. Donor Contact Information Masking</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            As stipulated in the project specification, donor personal phone numbers and private addresses remain masked across all public endpoints and hospital dispatch interfaces (e.g., <code>+233 24 *** *233</code>).
          </p>
          <ul className="text-xs text-slate-600 space-y-1.5 pt-2">
            <li className="flex items-center space-x-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Platform facilitates structured first contact only.</span>
            </li>
            <li className="flex items-center space-x-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Prevents unsolicited phone calls and data scraping.</span>
            </li>
            <li className="flex items-center space-x-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Donors voluntarily confirm availability before hospital contact.</span>
            </li>
          </ul>
        </div>

        {/* Pillar 2: Clinical Screening */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
          <div className="p-2.5 bg-red-100 text-red-700 w-fit rounded-xl">
            <AlertCircle className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold text-slate-900">2. In-Hospital Medical Protocol</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            RedApp functions strictly as an emergency coordination and rapid communication platform. It does not replace medical screening or testing.
          </p>
          <ul className="text-xs text-slate-600 space-y-1.5 pt-2">
            <li className="flex items-center space-x-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-red-600" />
              <span>Eligibility check (hemoglobin, BP, pulse) is conducted at hospital.</span>
            </li>
            <li className="flex items-center space-x-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-red-600" />
              <span>Transfusion-transmissible infection (TTI) laboratory tests.</span>
            </li>
            <li className="flex items-center space-x-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-red-600" />
              <span>Standard sterile blood draw under licensed Ghanaian phlebotomists.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Ghana Blood Donation Eligibility Guidelines */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center space-x-2">
          <FileText className="w-4 h-4 text-slate-500" />
          <span>General Donor Eligibility Criteria (Ghana Health Service / NBS)</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <span className="font-bold text-slate-900 block mb-1">Age</span>
            <span className="text-slate-600">Between 17 and 65 years old.</span>
          </div>
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <span className="font-bold text-slate-900 block mb-1">Body Weight</span>
            <span className="text-slate-600">At least 50 kg (110 lbs).</span>
          </div>
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <span className="font-bold text-slate-900 block mb-1">Donation Interval</span>
            <span className="text-slate-600">Minimum 3-4 months between whole blood draws.</span>
          </div>
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <span className="font-bold text-slate-900 block mb-1">General Health</span>
            <span className="text-slate-600">No active fever, flu, or recent surgical procedures.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
