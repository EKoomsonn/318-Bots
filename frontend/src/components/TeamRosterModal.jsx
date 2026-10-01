import React from 'react';
import { Users, X, Award, Code, Database, Layout, ShieldCheck, FileText } from 'lucide-react';

const TEAM_MEMBERS = [
  { name: 'Obeng Nana Yaw Asante', id: '22120929', role: 'Project Lead', responsibility: 'Scope, timeline & team coordination', icon: Award, color: 'text-amber-600 bg-amber-50' },
  { name: 'Nasir Kwaku Anyobode', id: '22060865', role: 'Backend Dev', responsibility: 'ASP.NET Core API, EF Core, SQL Server', icon: Database, color: 'text-blue-600 bg-blue-50' },
  { name: 'Elton Koomson', id: '22053775', role: 'Backend Dev', responsibility: 'ASP.NET Core API, WebSockets & SignalR', icon: Database, color: 'text-blue-600 bg-blue-50' },
  { name: 'Mark Ashong Katai Handsome', id: '22112890', role: 'Frontend Dev', responsibility: 'UI components, Responsive layout', icon: Layout, color: 'text-emerald-600 bg-emerald-50' },
  { name: 'Joseph Donkor', id: '22128961', role: 'Frontend Dev', responsibility: 'Client state & Netlify deployment', icon: Layout, color: 'text-emerald-600 bg-emerald-50' },
  { name: 'Michael Chandi Thomas', id: '22241883', role: 'Matching Engine Dev', responsibility: 'Blood-type rule engine & geo-filter', icon: Code, color: 'text-purple-600 bg-purple-50' },
  { name: 'Aseda Kwame Herman', id: '22060793', role: 'QA & Testing', responsibility: 'Unit & integration test suites', icon: ShieldCheck, color: 'text-rose-600 bg-rose-50' },
  { name: 'Brian Danso-Wontumi', id: '22242270', role: 'Documentation & QA', responsibility: 'Technical docs & final report write-up', icon: FileText, color: 'text-indigo-600 bg-indigo-50' },
];

export default function TeamRosterModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 border border-slate-200 shadow-2xl relative max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-red-100 rounded-2xl text-red-600">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900">
                RedApp Team Roster
              </h3>
              <p className="text-xs text-slate-500">
                DCIT 318 · Programming II · University of Ghana
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Member Cards List */}
        <div className="flex-1 overflow-y-auto py-4 space-y-2.5 pr-1">
          {TEAM_MEMBERS.map((member) => {
            const Icon = member.icon;
            return (
              <div
                key={member.id}
                className="p-3.5 bg-slate-50 hover:bg-slate-100/80 rounded-2xl border border-slate-200/80 flex items-center justify-between transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2.5 rounded-xl ${member.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{member.name}</h4>
                    <p className="text-xs text-slate-500">{member.responsibility}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-black text-slate-800 block">ID: {member.id}</span>
                  <span className="text-[11px] font-bold text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full inline-block mt-0.5">
                    {member.role}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>8 Team Members · Full Roster Compliant</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
