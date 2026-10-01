const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
require('dotenv').config();

const requestsRouter = require('./routes/requests');
const donorsRouter = require('./routes/donors');
const hospitalsRouter = require('./routes/hospitals');
const { setupSocketIO } = require('./socket/socketHandler');

const app = express();
const server = http.createServer(app);

// Dynamic CORS configuration allowing localhost and any Netlify frontend deployment
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:4173',
  'https://localhost:5173',
  process.env.FRONTEND_URL
].filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
    if (!origin) return callback(null, true);
    
    // Allow localhost and *.netlify.app domains automatically
    if (
      allowedOrigins.includes(origin) ||
      origin.endsWith('.netlify.app') ||
      origin.includes('localhost') ||
      origin.includes('127.0.0.1')
    ) {
      return callback(null, true);
    }
    // If strict origin matching is not required in dev/demo, allow:
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

// Setup Socket.IO
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Attach io instance to express app so routes can broadcast events
app.set('io', io);
setupSocketIO(io);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    platform: 'RedApp - Real-Time Blood Donation Coordination Platform',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    features: [
      'Urgent Request Broadcasting',
      'ABO & Rh Compatibility Engine',
      'Haversine Proximity Geolocation',
      'Real-Time WebSockets',
      'Masked Privacy Protection'
    ]
  });
});

// API Routes
app.use('/api/requests', requestsRouter);
app.use('/api/donors', donorsRouter);
app.use('/api/hospitals', hospitalsRouter);

// Root route
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>RedApp Backend API</title>
        <style>
          body { font-family: system-ui, -apple-system, sans-serif; max-width: 700px; margin: 40px auto; padding: 20px; line-height: 1.6; }
          .badge { background: #dc2626; color: white; padding: 4px 10px; border-radius: 9999px; font-weight: bold; }
          code { background: #f3f4f6; padding: 2px 6px; border-radius: 4px; }
          a { color: #dc2626; text-decoration: none; font-weight: 500; }
        </style>
      </head>
      <body>
        <h1>🩸 RedApp Backend API</h1>
        <p><span class="badge">LIVE</span> Real-Time Blood Donation Coordination Platform (DCIT 318)</p>
        <p>This backend API powers live emergency blood requests, biological matching, and proximity ranking.</p>
        <h3>Available Endpoints:</h3>
        <ul>
          <li><a href="/api/health"><code>/api/health</code></a> - System Health & Status</li>
          <li><a href="/api/requests"><code>/api/requests</code></a> - Active Blood Requests</li>
          <li><a href="/api/donors"><code>/api/donors</code></a> - Registered Donors (Privacy Masked)</li>
          <li><a href="/api/hospitals"><code>/api/hospitals</code></a> - Hospitals in Ghana</li>
          <li><a href="/api/hospitals/meta/stats"><code>/api/hospitals/meta/stats</code></a> - Platform Statistics</li>
          <li><a href="/api/hospitals/meta/compatibility-matrix"><code>/api/hospitals/meta/compatibility-matrix</code></a> - ABO/Rh Compatibility Matrix</li>
        </ul>
      </body>
    </html>
  `);
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🩸 RedApp API Server listening on port ${PORT}`);
  console.log(`🚀 Ready for local dev & cloud deployment (Render/Railway)`);
  console.log(`====================================================`);
});
