/**
 * RedApp Real-Time Socket.IO Handler
 * 
 * Handles real-time bi-directional events, room joins by blood group,
 * and instant emergency broadcasting without requiring page refresh.
 */

function setupSocketIO(io) {
  io.on('connection', (socket) => {
    console.log(`[Socket.IO] Client connected: ${socket.id}`);

    // Join room based on blood type (e.g. 'blood_O-', 'blood_A+')
    socket.on('join_blood_group', (bloodType) => {
      if (bloodType) {
        const roomName = `blood_${bloodType.toUpperCase()}`;
        socket.join(roomName);
        console.log(`[Socket.IO] Socket ${socket.id} joined room ${roomName}`);
        socket.emit('joined_room', { room: roomName, message: `Subscribed to alerts for ${bloodType}` });
      }
    });

    // Hospital staff join hospital-specific notification room
    socket.on('join_hospital', (hospitalId) => {
      if (hospitalId) {
        const roomName = `hospital_${hospitalId}`;
        socket.join(roomName);
        console.log(`[Socket.IO] Socket ${socket.id} joined room ${roomName}`);
      }
    });

    // Ping check
    socket.on('ping_server', (data) => {
      socket.emit('pong_server', { ...data, serverTime: new Date().toISOString() });
    });

    socket.on('disconnect', (reason) => {
      console.log(`[Socket.IO] Client disconnected: ${socket.id} (${reason})`);
    });
  });
}

module.exports = { setupSocketIO };
