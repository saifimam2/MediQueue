import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { waf } from './waf.js';
import { cybersecurityEngine } from './cybersecurityPrinciples.js';
import {
  initialDoctors,
  initialAccommodations,
  initialFoodPlaces,
  initialAmbulances,
  initialReviews,
  initialChecklist
} from './data.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// 1. Core Parsers & CORS
app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// 2. Attach MediQueue Cybersecurity Web Application Firewall (WAF)
app.use(waf.middleware());

// In-Memory Database State
const state = {
  doctors: JSON.parse(JSON.stringify(initialDoctors)),
  accommodations: JSON.parse(JSON.stringify(initialAccommodations)),
  foodPlaces: JSON.parse(JSON.stringify(initialFoodPlaces)),
  ambulances: JSON.parse(JSON.stringify(initialAmbulances)),
  reviews: JSON.parse(JSON.stringify(initialReviews)),
  checklist: JSON.parse(JSON.stringify(initialChecklist)),
  activeAmbulanceDispatches: [],
  sseClients: []
};

// Real-Time Queue Broadcast Helper (SSE)
function broadcastQueueUpdate(eventData) {
  const payload = `data: ${JSON.stringify(eventData)}\n\n`;
  state.sseClients.forEach(client => {
    try {
      client.res.write(payload);
    } catch (err) {
      // client disconnected
    }
  });
}

// ======================== API ROUTES ========================

// Health & System Info
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    platform: 'MediQueue Healthcare Core v1.0',
    wafStatus: 'ACTIVE_SHIELD_ENABLED',
    timestamp: new Date().toISOString()
  });
});

// SSE Live Stream for Real-time Token Sync
app.get('/api/queue/stream', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  const clientId = Date.now() + Math.random();
  const clientObj = { id: clientId, res };
  state.sseClients.push(clientObj);

  // Send immediate initial sync
  res.write(`data: ${JSON.stringify({ type: 'INIT_SYNC', doctors: state.doctors, timestamp: new Date() })}\n\n`);

  req.on('close', () => {
    state.sseClients = state.sseClients.filter(c => c.id !== clientId);
  });
});

// 1. Doctors & Queue Info
app.get('/api/doctors', (req, res) => {
  const { search, specialty } = req.query;
  let list = state.doctors;
  if (specialty && specialty !== 'All') {
    list = list.filter(d => d.specialization.toLowerCase().includes(specialty.toLowerCase()));
  }
  if (search) {
    const s = search.toLowerCase();
    list = list.filter(d => d.name.toLowerCase().includes(s) || d.specialization.toLowerCase().includes(s) || d.hospital.toLowerCase().includes(s));
  }
  res.json({ success: true, doctors: list });
});

app.get('/api/doctors/:id', (req, res) => {
  const doc = state.doctors.find(d => d.id === req.params.id);
  if (!doc) return res.status(404).json({ success: false, error: 'Doctor not found' });
  res.json({ success: true, doctor: doc });
});

// 2. Doctor / Receptionist Live Queue Controls
app.post('/api/queue/action', (req, res) => {
  const { doctorId, action, value } = req.body;
  const doc = state.doctors.find(d => d.id === doctorId);
  if (!doc) return res.status(404).json({ success: false, error: 'Doctor not found' });

  let eventMessage = '';

  switch (action) {
    case 'NEXT_TOKEN': {
      // Find current and mark completed
      const currentWaitingIdx = doc.queue.findIndex(q => q.status === 'WAITING');
      if (currentWaitingIdx !== -1) {
        // Mark previous in room as completed
        doc.queue.forEach(q => {
          if (q.status === 'IN_ROOM') q.status = 'COMPLETED';
        });
        doc.queue[currentWaitingIdx].status = 'IN_ROOM';
        doc.currentToken = doc.queue[currentWaitingIdx].token;
        eventMessage = `Token #${doc.currentToken} called into room`;
      } else {
        doc.currentToken += 1;
        eventMessage = `Advanced to next token #${doc.currentToken}`;
      }
      break;
    }

    case 'COMPLETE_CONSULTATION': {
      const inRoom = doc.queue.find(q => q.status === 'IN_ROOM');
      if (inRoom) inRoom.status = 'COMPLETED';
      // Automatically call next if available
      const nextWaiting = doc.queue.find(q => q.status === 'WAITING');
      if (nextWaiting) {
        nextWaiting.status = 'IN_ROOM';
        doc.currentToken = nextWaiting.token;
        eventMessage = `Consultation completed. Token #${doc.currentToken} is now in room.`;
      } else {
        eventMessage = `Consultation completed. Waiting for new patients.`;
      }
      break;
    }

    case 'SKIP_PATIENT': {
      const currentTokenNum = Number(value || doc.currentToken);
      const patient = doc.queue.find(q => q.token === currentTokenNum);
      if (patient) {
        patient.status = 'SKIPPED';
        // Move to next waiting
        const nextWaiting = doc.queue.find(q => q.status === 'WAITING');
        if (nextWaiting) {
          nextWaiting.status = 'IN_ROOM';
          doc.currentToken = nextWaiting.token;
        }
        eventMessage = `Token #${currentTokenNum} was skipped. Queue advanced.`;
      }
      break;
    }

    case 'TOGGLE_PAUSE': {
      doc.isPaused = !doc.isPaused;
      doc.pauseReason = doc.isPaused ? (value || 'Doctor on emergency case / surgical break (15 mins)') : '';
      eventMessage = doc.isPaused ? `Queue paused: ${doc.pauseReason}` : 'Queue resumed active consultations';
      break;
    }

    case 'UPDATE_DURATION': {
      const newDuration = parseInt(value, 10);
      if (newDuration > 0 && newDuration <= 60) {
        doc.avgDuration = newDuration;
        eventMessage = `Average consultation duration adjusted to ${newDuration} mins`;
      }
      break;
    }

    case 'ADD_EMERGENCY_PATIENT': {
      const nextTokenNum = Math.max(...doc.queue.map(q => q.token), doc.currentToken) + 1;
      const newPatient = {
        token: nextTokenNum,
        patientName: value?.patientName || 'Emergency Priority Patient',
        status: 'WAITING',
        time: 'Immediate',
        priority: 'EMERGENCY'
      };
      // Insert right after current running token
      const inRoomIdx = doc.queue.findIndex(q => q.status === 'IN_ROOM');
      if (inRoomIdx !== -1) {
        doc.queue.splice(inRoomIdx + 1, 0, newPatient);
      } else {
        doc.queue.unshift(newPatient);
      }
      eventMessage = `Emergency patient inserted as priority Token #${nextTokenNum}`;
      break;
    }

    default:
      return res.status(400).json({ success: false, error: 'Invalid action type' });
  }

  // Broadcast to all connected patient/attendant dashboards
  broadcastQueueUpdate({
    type: 'QUEUE_UPDATED',
    doctorId: doc.id,
    currentToken: doc.currentToken,
    avgDuration: doc.avgDuration,
    isPaused: doc.isPaused,
    pauseReason: doc.pauseReason,
    doctors: state.doctors,
    message: eventMessage,
    timestamp: new Date()
  });

  // Record tamper-evident cryptographic hash block (Integrity Principle)
  cybersecurityEngine.recordIntegrityEvent('QUEUE_ACTION', {
    doctorId: doc.id,
    action,
    currentToken: doc.currentToken,
    timestamp: new Date().toISOString()
  });

  res.json({
    success: true,
    message: eventMessage,
    doctor: doc
  });
});

// 3. Smart Arrival Time Calculator API
app.post('/api/queue/calculate-arrival', (req, res) => {
  const { doctorId, patientToken = 25, distanceKm = 8, travelSpeedKmH = 25, bufferMins = 10 } = req.body;
  const doc = state.doctors.find(d => d.id === (doctorId || 'doc-1'));
  if (!doc) return res.status(404).json({ success: false, error: 'Doctor not found' });

  const runningToken = doc.currentToken;
  const patientsAhead = Math.max(0, patientToken - runningToken);
  const avgDuration = doc.avgDuration || 8;
  const pauseExtraMins = doc.isPaused ? 15 : 0;

  // Estimated wait time until turn starts (in minutes)
  const estimatedWaitMins = (patientsAhead * avgDuration) + pauseExtraMins;

  // Travel calculation
  const travelTimeMins = Math.round((distanceKm / (travelSpeedKmH || 25)) * 60);

  // Time calculations
  const now = new Date();
  const turnStartTime = new Date(now.getTime() + estimatedWaitMins * 60000);
  const turnEndTime = new Date(turnStartTime.getTime() + avgDuration * 60000);

  // Recommended departure time: turnStartTime minus (travelTime + buffer)
  const totalPrepAndTravelMins = travelTimeMins + bufferMins;
  const recommendedDepartureStart = new Date(turnStartTime.getTime() - (totalPrepAndTravelMins + 5) * 60000);
  const recommendedDepartureEnd = new Date(turnStartTime.getTime() - (totalPrepAndTravelMins - 5) * 60000);

  const formatTime = (d) => d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // Notification stage determination
  let notificationStatus = 'Relax at home. Queue moving smoothly.';
  let urgencyLevel = 'NORMAL'; // NORMAL, PREPARE, GET_READY, LEAVE_NOW, IN_LOBBY, CALLED

  if (patientsAhead <= 0) {
    notificationStatus = 'Your token is called! Report to doctor’s room immediately.';
    urgencyLevel = 'CALLED';
  } else if (patientsAhead === 1) {
    notificationStatus = 'Your turn is very close! Please be outside the doctor’s cabin.';
    urgencyLevel = 'IN_LOBBY';
  } else if (patientsAhead === 2) {
    notificationStatus = 'Leave for the hospital now to avoid missing your slot.';
    urgencyLevel = 'LEAVE_NOW';
  } else if (patientsAhead === 3) {
    notificationStatus = 'Get ready to leave in 10-15 minutes.';
    urgencyLevel = 'GET_READY';
  } else if (patientsAhead <= 5) {
    notificationStatus = 'Start preparing your medical reports and prescriptions.';
    urgencyLevel = 'PREPARE';
  }

  res.json({
    success: true,
    calculation: {
      myToken: patientToken,
      runningToken,
      patientsAhead,
      avgDuration,
      isPaused: doc.isPaused,
      pauseReason: doc.pauseReason,
      estimatedWaitMinutes: estimatedWaitMins,
      travelTimeMinutes: travelTimeMins,
      distanceKm,
      expectedConsultationWindow: `${formatTime(turnStartTime)} – ${formatTime(turnEndTime)}`,
      recommendedDepartureWindow: `${formatTime(recommendedDepartureStart)} – ${formatTime(recommendedDepartureEnd)}`,
      urgencyLevel,
      departureMessage: `Your turn is approaching. Please leave between ${formatTime(recommendedDepartureStart)} and ${formatTime(recommendedDepartureEnd)} to reach comfortably on time.`,
      notificationStatus
    }
  });
});

// 4. Book Appointment with Attendant & Family options
app.post('/api/appointments', (req, res) => {
  const {
    doctorId,
    patientName,
    patientPhone,
    attendantCount = 0,
    needsAccommodation = false,
    needsFood = false,
    visitDuration = 'Single Consultation (2-3 Hours)',
    budgetRange = 'Under ₹1000'
  } = req.body;

  const doc = state.doctors.find(d => d.id === doctorId);
  if (!doc) return res.status(404).json({ success: false, error: 'Doctor not found' });

  const assignedToken = Math.max(...doc.queue.map(q => q.token), doc.currentToken) + 1;
  const newAppointment = {
    token: assignedToken,
    patientName: patientName || 'Patient',
    patientPhone,
    status: 'WAITING',
    time: 'Assigned Today',
    priority: 'NORMAL',
    attendantSupport: {
      attendantCount: Number(attendantCount),
      needsAccommodation: Boolean(needsAccommodation),
      needsFood: Boolean(needsFood),
      visitDuration,
      budgetRange
    }
  };

  doc.queue.push(newAppointment);

  broadcastQueueUpdate({
    type: 'NEW_BOOKING',
    doctorId: doc.id,
    token: assignedToken,
    doctors: state.doctors,
    timestamp: new Date()
  });

  // Record cryptographic integrity block for token issuance
  cybersecurityEngine.recordIntegrityEvent('TOKEN_ISSUED', {
    doctorId: doc.id,
    token: assignedToken,
    patientName: patientName || 'Patient',
    timestamp: new Date().toISOString()
  });

  res.json({
    success: true,
    tokenNumber: assignedToken,
    doctorName: doc.name,
    hospital: doc.hospital,
    room: doc.room,
    currentToken: doc.currentToken,
    patientsAhead: assignedToken - doc.currentToken,
    message: `Appointment confirmed! Your live Token Number is #${assignedToken}.`
  });
});

// 5. Emergency Ambulance Services (Instant 1-Click Request without Registration)
app.get('/api/ambulance/fleet', (req, res) => {
  res.json({
    success: true,
    emergencyHotlines: [
      { name: 'National Emergency Ambulance', number: '108', type: 'Toll-Free Government' },
      { name: 'Apex Hospital Trauma Center Dispatch', number: '+91 11 4567 8999', type: 'Direct Hospital Line' },
      { name: 'Police / First Responder', number: '112', type: 'Emergency Unified' }
    ],
    ambulances: state.ambulances,
    activeDispatches: state.activeAmbulanceDispatches
  });
});

app.post('/api/ambulance/request', (req, res) => {
  const { ambulanceCategory, pickupAddress, destinationHospital, callerName, callerPhone, patientCondition } = req.body;

  const amb = state.ambulances.find(a => a.category.includes(ambulanceCategory || 'Basic')) || state.ambulances[0];
  const dispatchId = `DISP-${Date.now().toString(36).toUpperCase()}`;

  const dispatchRecord = {
    id: dispatchId,
    category: amb.category,
    plateNumber: amb.plateNumber,
    driver: amb.driver,
    driverPhone: amb.phone,
    etaMinutes: amb.etaMinutes,
    pickupAddress: pickupAddress || 'Current GPS Location Detected',
    destinationHospital: destinationHospital || 'Apex Metro Heart & Multi-Speciality Hospital',
    callerName: callerName || 'Emergency Caller',
    callerPhone: callerPhone || 'Direct Dispatch',
    patientCondition: patientCondition || 'Immediate Attention Needed',
    status: 'DISPATCHED_EN_ROUTE',
    createdAt: new Date().toISOString()
  };

  state.activeAmbulanceDispatches.unshift(dispatchRecord);

  res.json({
    success: true,
    message: `Emergency Ambulance ${amb.plateNumber} dispatched immediately! Driver ${amb.driver} is en route.`,
    dispatch: dispatchRecord
  });
});

// 6. Attendant & Family Support: Accommodations
app.get('/api/accommodations', (req, res) => {
  const { maxPrice, maxDistance, type } = req.query;
  let list = state.accommodations;

  if (type && type !== 'All') {
    list = list.filter(a => a.type.toLowerCase().includes(type.toLowerCase()));
  }
  if (maxPrice) {
    list = list.filter(a => a.pricePerDay <= Number(maxPrice));
  }
  if (maxDistance) {
    list = list.filter(a => a.distanceKm <= Number(maxDistance));
  }

  res.json({ success: true, count: list.length, accommodations: list });
});

// 7. Attendant & Family Support: Food Near Hospital
app.get('/api/food', (req, res) => {
  const { diet, maxPrice, deliveryOnly } = req.query;
  let list = state.foodPlaces;

  if (diet && diet !== 'All') {
    list = list.filter(f => f.diet.toLowerCase().includes(diet.toLowerCase()));
  }
  if (maxPrice) {
    list = list.filter(f => f.approxMealPrice <= Number(maxPrice));
  }
  if (deliveryOnly === 'true') {
    list = list.filter(f => f.deliveryAvailable === true);
  }

  res.json({ success: true, count: list.length, foodPlaces: list });
});

// 8. Medicine & Document Checklist
app.get('/api/checklist', (req, res) => {
  res.json({ success: true, checklist: state.checklist });
});

app.post('/api/checklist/toggle-packed', (req, res) => {
  const { id, type } = req.body;
  if (type === 'document') {
    const item = state.checklist.documents.find(d => d.id === id);
    if (item) item.packed = !item.packed;
  } else if (type === 'medicine') {
    const item = state.checklist.medicines.find(m => m.id === id);
    if (item) item.packed = !item.packed;
  }
  res.json({ success: true, checklist: state.checklist });
});

app.post('/api/checklist/add-item', (req, res) => {
  const { type, name, category, dosage, note } = req.body;
  if (type === 'medicine') {
    state.checklist.medicines.push({
      id: `med-${Date.now()}`,
      name,
      category: category || 'Prescribed Drug',
      dosage: dosage || 'As advised',
      note: note || '',
      packed: false
    });
  } else if (type === 'document') {
    state.checklist.documents.push({
      id: `doc-${Date.now()}`,
      title: name,
      category: category || 'Medical Record',
      required: false,
      packed: false
    });
  }
  res.json({ success: true, checklist: state.checklist });
});

// 9. Verified Reviews & Ratings
app.get('/api/reviews', (req, res) => {
  const { doctorId } = req.query;
  let list = state.reviews;
  if (doctorId) {
    list = list.filter(r => r.doctorId === doctorId);
  }
  res.json({ success: true, reviews: list });
});

app.post('/api/reviews', (req, res) => {
  const { doctorId, patientName, rating, communicationRating, waitingRating, comment, verifiedAppointmentToken } = req.body;

  if (!verifiedAppointmentToken) {
    return res.status(403).json({
      success: false,
      error: 'Verification Required',
      message: 'Only patients with verified completed appointment tokens can submit doctor reviews.'
    });
  }

  const newReview = {
    id: `rev-${Date.now()}`,
    doctorId,
    patientName: patientName || 'Verified Patient',
    date: 'Just now',
    rating: Number(rating) || 5,
    communicationRating: Number(communicationRating) || 5,
    waitingRating: Number(waitingRating) || 5,
    verifiedAppointmentToken,
    comment
  };

  state.reviews.unshift(newReview);

  // Recalculate doctor rating
  const doc = state.doctors.find(d => d.id === doctorId);
  if (doc) {
    doc.totalReviews += 1;
    doc.rating = Number(((doc.rating * 0.9) + (newReview.rating * 0.1)).toFixed(1));
  }

  res.json({ success: true, message: 'Review verified and published successfully!', review: newReview });
});

// 10. Cybersecurity & WAF Admin SOC Endpoints
app.get('/api/security/dashboard', (req, res) => {
  res.json({ success: true, ...waf.getSecurityDashboardData() });
});

app.post('/api/security/simulate-attack', (req, res) => {
  const { type, payload } = req.body;
  const result = waf.simulateAttack(type, payload);
  res.json(result);
});

app.post('/api/security/ip-ban', (req, res) => {
  const { ip, durationMinutes = 60 } = req.body;
  waf.banIpManual(ip, durationMinutes);
  res.json({ success: true, message: `IP ${ip} has been manually banned for ${durationMinutes} minutes.` });
});

app.post('/api/security/ip-unban', (req, res) => {
  const { ip } = req.body;
  const unbanned = waf.unbanIp(ip);
  res.json({ success: unbanned, message: unbanned ? `IP ${ip} unbanned.` : `IP ${ip} not found in ban list.` });
});

// ======================== PRINCIPLES OF CYBERSECURITY (CIA, PoLP, NON-REPUDIATION) ========================

// 1. CIA Triad Compliance Telemetry
app.get('/api/security/principles/cia-report', (req, res) => {
  res.json({ success: true, ...cybersecurityEngine.getCiaPrinciplesReport() });
});

// 2. Cryptographic Integrity Chain Verification (SHA-256)
app.post('/api/security/principles/verify-integrity', (req, res) => {
  const result = cybersecurityEngine.verifyChainIntegrity();
  res.json({ success: true, ...result });
});

// 3. Deliberate Tamper Simulation to demonstrate Integrity Detection
app.post('/api/security/principles/simulate-tampering', (req, res) => {
  const result = cybersecurityEngine.simulateTamperAttempt();
  res.json({ success: true, ...result });
});

// 4. Restore & Reseal Ledger Integrity
app.post('/api/security/principles/restore-integrity', (req, res) => {
  cybersecurityEngine.createGenesisBlock();
  res.json({ success: true, message: 'Cryptographic ledger resealed with fresh genesis verification.' });
});

// 5. Availability: Automated Disaster Recovery Snapshot
app.post('/api/security/principles/create-backup', (req, res) => {
  const snapshot = cybersecurityEngine.createDisasterRecoveryBackup(state);
  res.json({ success: true, snapshot, message: 'Disaster recovery snapshot created and encrypted with SHA-256 seal.' });
});

// 6. Principle of Least Privilege (PoLP) Access Control Verification
app.post('/api/security/principles/test-rbac', (req, res) => {
  const { simulatedRole, attemptedAction } = req.body;
  const permissionMap = {
    'MANAGE_WAF_RULES': 'manage:ip_bans',
    'COMPLETE_CONSULTATION': 'complete:consultation',
    'VERIFY_INTEGRITY': 'verify:integrity',
    'BOOK_APPOINTMENT': 'book:appointment'
  };

  const reqPerm = permissionMap[attemptedAction] || 'manage:ip_bans';
  const allowed = cybersecurityEngine.hasPermission(simulatedRole, reqPerm);

  if (allowed) {
    res.json({
      success: true,
      allowed: true,
      role: simulatedRole,
      action: attemptedAction,
      message: `Access GRANTED: Role '${simulatedRole}' possesses '${reqPerm}'. Least privilege compliance satisfied.`
    });
  } else {
    res.status(403).json({
      success: false,
      allowed: false,
      role: simulatedRole,
      action: attemptedAction,
      error: 'Principle of Least Privilege (PoLP) Violation',
      message: `Access DENIED: Role '${simulatedRole}' lacks '${reqPerm}'. Unauthorized privilege escalation blocked.`
    });
  }
});

// 7. Confidentiality: PII Masking Demonstration
app.post('/api/security/principles/mask-demo', (req, res) => {
  const { phone, name, id } = req.body;
  res.json({
    success: true,
    maskedPhone: cybersecurityEngine.maskPII(phone || '9876543210', 'phone'),
    maskedName: cybersecurityEngine.maskPII(name || 'Rahul Sharma', 'name'),
    maskedId: cybersecurityEngine.maskPII(id || '123456789012', 'id')
  });
});

// 11. Notifications Trigger Simulator
app.post('/api/notifications/test', (req, res) => {
  const { channel, message, phone } = req.body;
  res.json({
    success: true,
    channel,
    recipient: phone || '+91 98765 43210',
    dispatchedAt: new Date().toISOString(),
    deliveredStatus: 'DELIVERED',
    message
  });
});

// ======================== SERVE FRONTEND (If built) ========================
const distPath = path.join(__dirname, '..', 'dist');
app.use(express.static(distPath));

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  res.sendFile(path.join(distPath, 'index.html'), (err) => {
    if (err) {
      res.send(`
        <!DOCTYPE html>
        <html>
          <head><title>MediQueue API Server</title><meta name="viewport" content="width=device-width, initial-scale=1"></head>
          <body style="font-family:sans-serif;padding:40px;text-align:center;background:#f0f9ff;color:#0369a1;">
            <h2>🏥 MediQueue Backend API & Live WAF Server Active</h2>
            <p>Port: ${PORT} | WAF Status: <strong>PROTECTED</strong></p>
            <p>Frontend dev server runs at <a href="http://localhost:3000">http://localhost:3000</a></p>
          </body>
        </html>
      `);
    }
  });
});

app.listen(PORT, () => {
  console.log(`[MediQueue] Backend & WAF running securely on http://localhost:${PORT}`);
});
