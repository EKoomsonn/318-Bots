import React from 'react';
import { useSocket } from '../context/SocketContext';
import { 
  Bell, 
  X, 
  Radio, 
  Heart, 
  Check, 
  Volume2, 
  VolumeX, 
  Trash2, 
  Clock 
} from 'lucide-react';

export function NotificationDrawer({ isOpen, onClose }) {
  const { 
    notifications, 
    markAllAsRead, 
    soundEnabled, 
    setSoundEnabled 
  } = useSocket();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Drawer Header */}
          <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-red-100 rounded-xl text-red-600">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Live Alert Notifications</h3>
                <p className="text-xs text-slate-500">Real-time SignalR & Socket.IO feed</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Action Bar */}
          <div className="px-5 py-2.5 bg-slate-100/70 border-b border-slate-200 flex items-center justify-between text-xs">
            <button
              onClick={markAllAsRead}
              className="text-slate-600 hover:text-slate-900 font-semibold flex items-center space-x-1"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Mark all as read</span>
            </button>

            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="text-slate-600 hover:text-slate-900 font-semibold flex items-center space-x-1"
            >
              {soundEnabled ? (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-red-600" />
                  <span>Chime On</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-slate-400" />
                  <span>Chime Muted</span>
                </>
              )}
            </button>
          </div>

          {/* Notification List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {notifications.length === 0 ? (
              <div className="text-center py-16 text-slate-400">
                <Bell className="w-10 h-10 mx-auto mb-2 opacity-30" />
                <p className="text-sm font-semibold text-slate-500">No new notifications</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  Broadcasts from hospitals and donor pledges will appear here in real time.
                </p>
              </div>
            ) : (
              notifications.map((n) => {
                const isEmergency = n.type === 'EMERGENCY_BROADCAST';
                return (
                  <div
                    key={n.id}
                    className={`p-4 rounded-2xl border transition-all ${
                      isEmergency
                        ? 'bg-red-50/70 border-red-200'
                        : 'bg-emerald-50/70 border-emerald-200'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        {isEmergency ? (
                          <Radio className="w-4 h-4 text-red-600 animate-pulse" />
                        ) : (
                          <Heart className="w-4 h-4 text-emerald-600 fill-current" />
                        )}
                        <h4 className="text-xs font-bold text-slate-900">{n.title}</h4>
                      </div>
                      <span className="text-[10px] text-slate-400 flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{n.timestamp}</span>
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 mt-1 leading-snug">{n.message}</p>
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

export function NotificationToast() {
  const { latestAlert, clearLatestAlert } = useSocket();

  if (!latestAlert) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-white rounded-2xl shadow-2xl border border-red-300 p-4 urgent-pulse animate-slideUp">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-red-600 text-white rounded-xl shadow-md shadow-red-200">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h4 className="text-sm font-extrabold text-slate-900">{latestAlert.title}</h4>
            <p className="text-xs text-slate-600 mt-0.5 leading-snug">{latestAlert.message}</p>
          </div>
        </div>
        <button
          onClick={clearLatestAlert}
          className="text-slate-400 hover:text-slate-600 p-1"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
