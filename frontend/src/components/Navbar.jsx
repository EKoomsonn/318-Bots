import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { 
  Heart, 
  Hospital, 
  UserCheck, 
  Bell, 
  Volume2, 
  VolumeX, 
  Wifi, 
  WifiOff, 
  Users, 
  MapPin, 
  Activity, 
  BookOpen, 
  ShieldCheck 
} from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, onOpenTeamModal, onOpenNotifDrawer }) {
  const { role, setRole, currentHospital, currentDonor } = useAuth();
  const { isConnected, notifications, soundEnabled, setSoundEnabled } = useSocket();

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & DCIT 318 Title */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('DASHBOARD')}>
            <div className="relative flex items-center justify-center w-10 h-10 bg-red-600 rounded-xl shadow-md shadow-red-200 text-white">
              <Heart className="w-6 h-6 fill-current animate-pulse" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-400 rounded-full animate-ping" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-black tracking-tight text-slate-900">
                  Red<span className="text-red-600">App</span>
                </span>
                <span className="hidden sm:inline-block text-[11px] font-semibold tracking-wide uppercase px-2 py-0.5 bg-red-50 text-red-700 border border-red-200 rounded-full">
                  Health
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden md:block">
                Real-Time Blood Donation Platform
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            <button
              onClick={() => setActiveTab('DASHBOARD')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'DASHBOARD'
                  ? 'bg-red-50 text-red-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('MAP')}
              className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'MAP'
                  ? 'bg-red-50 text-red-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span>Emergency Map</span>
            </button>
            <button
              onClick={() => setActiveTab('MATRIX')}
              className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'MATRIX'
                  ? 'bg-red-50 text-red-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>Compatibility Engine</span>
            </button>
            <button
              onClick={() => setActiveTab('DISCLAIMER')}
              className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'DISCLAIMER'
                  ? 'bg-red-50 text-red-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Privacy & Medical</span>
            </button>
          </nav>

          {/* Right Section: Role Switcher, Socket Status, Notifications */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Role Switcher Pill */}
            <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                onClick={() => setRole('HOSPITAL')}
                className={`flex items-center space-x-1 px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                  role === 'HOSPITAL'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Broadcast & manage blood needs"
              >
                <Hospital className="w-3.5 h-3.5 text-red-600" />
                <span className="hidden sm:inline">Hospital</span>
              </button>
              <button
                onClick={() => setRole('DONOR')}
                className={`flex items-center space-x-1 px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                  role === 'DONOR'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Find compatible emergencies & schedule donation"
              >
                <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span className="hidden sm:inline">Donor ({currentDonor.bloodType})</span>
              </button>
            </div>

            {/* Socket Status Indicator */}
            <div
              className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border ${
                isConnected
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-amber-50 text-amber-700 border-amber-200'
              }`}
              title={isConnected ? 'Real-Time SignalR/Socket Connected' : 'Connecting to Server...'}
            >
              {isConnected ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  <span className="hidden sm:inline text-[11px]">Live</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-3 h-3 text-amber-600" />
                  <span className="hidden sm:inline text-[11px]">Offline</span>
                </>
              )}
            </div>

            {/* Sound Chime Toggle */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
              title={soundEnabled ? 'Mute alert sounds' : 'Enable alert chime'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-red-600" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
            </button>

            {/* Notification Bell */}
            <button
              onClick={onOpenNotifDrawer}
              className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 flex items-center justify-center w-4 h-4 bg-red-600 text-white text-[10px] font-bold rounded-full">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* DCIT 318 Team Roster Modal Trigger */}
            <button
              onClick={onOpenTeamModal}
              className="flex items-center space-x-1 px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition-colors"
              title="DCIT 318 Team Roster"
            >
              <Users className="w-3.5 h-3.5 text-slate-600" />
              <span className="hidden md:inline">Team Roster</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
