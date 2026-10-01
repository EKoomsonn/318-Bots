import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import { playEmergencyAlertSound } from '../services/compatibility';

const SocketContext = createContext();

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export function SocketProvider({ children }) {
  const [isConnected, setIsConnected] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [latestAlert, setLatestAlert] = useState(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const socketRef = useRef(null);

  useEffect(() => {
    // Initialize socket connection
    const socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 10,
      reconnectionDelay: 2000,
      timeout: 10000,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('⚡ Connected to RedApp Real-Time Server:', socket.id);
      setIsConnected(true);
    });

    socket.on('disconnect', (reason) => {
      console.log('🔌 Disconnected from RedApp Server:', reason);
      setIsConnected(false);
    });

    // Listen for urgent broadcast alerts pushed by hospitals
    socket.on('blood_alert_broadcast', (alertData) => {
      console.log('🚨 Incoming Blood Alert Broadcast:', alertData);
      
      const newNotification = {
        id: `notif-${Date.now()}`,
        type: 'EMERGENCY_BROADCAST',
        title: `🚨 Emergency Need: ${alertData.bloodType} Blood`,
        message: `${alertData.hospitalName} requires ${alertData.unitsRequired} pint(s) of ${alertData.bloodType}.`,
        data: alertData,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        read: false
      };

      setNotifications(prev => [newNotification, ...prev]);
      setLatestAlert(newNotification);

      if (soundEnabled) {
        playEmergencyAlertSound();
      }
    });

    // Listen for donor pledge updates
    socket.on('request_updated', (updateData) => {
      console.log('🎉 Request Updated (Donor Pledged):', updateData);
      const newNotification = {
        id: `notif-${Date.now()}`,
        type: 'DONATION_PLEDGED',
        title: '🎉 Donor Responded!',
        message: updateData.alertMessage,
        data: updateData,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        read: false
      };
      setNotifications(prev => [newNotification, ...prev]);
    });

    return () => {
      socket.disconnect();
    };
  }, [soundEnabled]);

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearLatestAlert = () => {
    setLatestAlert(null);
  };

  return (
    <SocketContext.Provider
      value={{
        socket: socketRef.current,
        isConnected,
        notifications,
        latestAlert,
        clearLatestAlert,
        markAllAsRead,
        soundEnabled,
        setSoundEnabled
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}

export const useSocket = () => useContext(SocketContext);
