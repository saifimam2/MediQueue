import React, { useState, useEffect } from 'react';
import {
  Clock, Navigation, Bell, MapPin, CheckCircle, AlertTriangle,
  Car, Bike, Train, Footprints, ShieldCheck, RefreshCw, Send,
  ArrowRight, PhoneCall, Sparkles, UserCheck
} from 'lucide-react';

export default function LiveTokenTracker({ doctors, activeDoctorId, onSelectDoctor, myTokenNumber = 25 }) {
  const currentDoctor = doctors.find(d => d.id === activeDoctorId) || doctors[0];

  // Smart Arrival Calculator inputs
  const [distanceKm, setDistanceKm] = useState(8.5);
  const [travelMode, setTravelMode] = useState('car'); // car, bike, metro, walk
  const [bufferMins, setBufferMins] = useState(10);
  const [trafficLevel, setTrafficLevel] = useState('moderate'); // low, moderate, heavy

  // Notification simulation
  const [pushEnabled, setPushEnabled] = useState(true);
  const [smsEnabled, setSmsEnabled] = useState(true);
  const [whatsappEnabled, setWhatsappEnabled] = useState(true);
  const [notificationLog, setNotificationLog] = useState([]);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [activeTab, setActiveTab] = useState('tracking'); // 'tracking' or 'calculator'

  // Speed matrix (km/h) based on mode and traffic
  const speeds = {
    car: { low: 35, moderate: 25, heavy: 16 },
    bike: { low: 40, moderate: 30, heavy: 22 },
    metro: { low: 28, moderate: 24, heavy: 24 },
    walk: { low: 5, moderate: 5, heavy: 4 }
  };

  const travelSpeed = speeds[travelMode][trafficLevel] || 25;
  const travelTimeMinutes = Math.round((distanceKm / travelSpeed) * 60);

  // Dynamic queue math
  const runningToken = currentDoctor ? currentDoctor.currentToken : 18;
  const patientsAhead = Math.max(0, myTokenNumber - runningToken);
  const avgDuration = currentDoctor ? currentDoctor.avgDuration : 8;
  const extraPauseTime = currentDoctor?.isPaused ? 15 : 0;
  const totalWaitMinutes = (patientsAhead * avgDuration) + extraPauseTime;

  // Expected consultation window
  const now = new Date();
  const startTime = new Date(now.getTime() + totalWaitMinutes * 60000);
  const endTime = new Date(startTime.getTime() + avgDuration * 60000);

  // Departure window
  const totalTravelAndPrep = travelTimeMinutes + bufferMins;
  const departStart = new Date(startTime.getTime() - (totalTravelAndPrep + 5) * 60000);
  const departEnd = new Date(startTime.getTime() - (totalTravelAndPrep - 5) * 60000);

  const formatTime = (d) => d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // Urgency & Notification Thresholds
  let urgency = {
    badge: 'Relax at Home',
    color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    indicator: 'bg-emerald-500',
    headline: 'You have plenty of time. Rest comfortably at home.',
    instruction: `Recommended departure between ${formatTime(departStart)} and ${formatTime(departEnd)}.`
  };

  if (patientsAhead <= 0) {
    urgency = {
      badge: 'Token Called!',
      color: 'bg-red-50 text-red-700 border-red-200 animate-pulse',
      indicator: 'bg-red-600',
      headline: 'YOUR TOKEN IS BEING CALLED NOW!',
      instruction: `Please enter ${currentDoctor?.room || 'the Doctor cabin'} immediately.`
    };
  } else if (patientsAhead === 1) {
    urgency = {
      badge: '1 Patient Remaining',
      color: 'bg-purple-50 text-purple-700 border-purple-200',
      indicator: 'bg-purple-600',
      headline: 'Your turn is very close! Please be stationed outside the cabin.',
      instruction: 'Doctor will call Token #' + myTokenNumber + ' in approx ' + avgDuration + ' minutes.'
    };
  } else if (patientsAhead === 2) {
    urgency = {
      badge: '2 Patients Remaining',
      color: 'bg-orange-50 text-orange-700 border-orange-200',
      indicator: 'bg-orange-500',
      headline: 'LEAVE FOR HOSPITAL IMMEDIATELY!',
      instruction: 'Start your commute right now to avoid queue forfeiture.'
    };
  } else if (patientsAhead === 3) {
    urgency = {
      badge: '3 Patients Remaining',
      color: 'bg-amber-50 text-amber-700 border-amber-200',
      indicator: 'bg-amber-500',
      headline: 'Get Ready to Leave Your Location.',
      instruction: 'Gather medical files, medicines, and head towards your transport.'
    };
  } else if (patientsAhead <= 5) {
    urgency = {
      badge: '5 Patients Remaining',
      color: 'bg-blue-50 text-blue-700 border-blue-200',
      indicator: 'bg-blue-500',
      headline: 'Start Preparing Your Visit.',
      instruction: 'Check your prescribed medicines, recent blood reports & token pass.'
    };
  }

  // Trigger simulated notification
  const sendTestNotification = (channel) => {
    const newAlert = {
      id: Date.now(),
      channel,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      message: `[MediQueue ${channel.toUpperCase()}] Token #${myTokenNumber} Update: Currently running Token #${runningToken}. Patients ahead: ${patientsAhead}. Expected consultation: ${formatTime(startTime)} – ${formatTime(endTime)}. Please depart between ${formatTime(departStart)} and ${formatTime(departEnd)}.`
    };
    setNotificationLog(prev => [newAlert, ...prev]);
    setShowNotificationModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Top Doctor Selector & Live Pulse */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={currentDoctor?.photo}
            alt={currentDoctor?.name}
            className="w-14 h-14 rounded-full object-cover border-2 border-brand-500 shadow-sm"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                LIVE OPD RUNNING
              </span>
              <span className="text-xs text-slate-500">• {currentDoctor?.hospital}</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mt-0.5">{currentDoctor?.name}</h2>
            <p className="text-sm text-slate-600">{currentDoctor?.specialization} | <span className="font-semibold text-brand-600">{currentDoctor?.room}</span></p>
          </div>
        </div>

        {/* Doctor Switcher Dropdown */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <label className="text-xs font-medium text-slate-500 whitespace-nowrap">Switch Doctor:</label>
          <select
            value={currentDoctor?.id}
            onChange={(e) => onSelectDoctor(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-xl px-3 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500 w-full md:w-auto"
          >
            {doctors.map(d => (
              <option key={d.id} value={d.id}>{d.name} ({d.specialization})</option>
            ))}
          </select>
        </div>
      </div>

      {/* Doctor Paused Alert (If paused) */}
      {currentDoctor?.isPaused && (
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0" />
            <div>
              <p className="font-semibold text-amber-900">Doctor Queue Temporarily Paused</p>
              <p className="text-sm text-amber-700">{currentDoctor?.pauseReason || 'Doctor attending urgent inpatient or surgical round.'} Estimated delay: +15 mins added automatically.</p>
            </div>
          </div>
          <span className="text-xs bg-amber-200 text-amber-900 font-bold px-2.5 py-1 rounded-lg">DELAY APPLIED</span>
        </div>
      )}

      {/* Main Hero Card: Live Running Token vs My Token */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Token Highlights Box */}
        <div className="lg:col-span-8 bg-gradient-to-br from-brand-900 via-brand-800 to-slate-900 text-white rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden">
          {/* Subtle background graphics */}
          <div className="absolute -top-16 -right-16 w-64 h-64 bg-brand-500/20 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-white/10">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span className="text-xs font-semibold text-brand-200 tracking-wide uppercase">Real-Time Sync Activated</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-white/70">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Auto-updating via SSE Socket
            </div>
          </div>

          {/* Tokens Comparative Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-8">
            {/* My Token */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 text-center">
              <span className="text-xs font-medium text-brand-200 block mb-1">Your Token Number</span>
              <span className="text-4xl md:text-5xl font-black text-amber-300 tracking-tight">#{myTokenNumber}</span>
              <span className="text-[11px] text-white/70 block mt-1 font-medium">Rahul Sharma</span>
            </div>

            {/* Currently Running */}
            <div className="bg-emerald-500/20 backdrop-blur-md rounded-2xl p-4 border border-emerald-400/30 text-center relative overflow-hidden">
              <div className="absolute top-1 right-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block"></span>
              </div>
              <span className="text-xs font-medium text-emerald-300 block mb-1">Currently Inside</span>
              <span className="text-4xl md:text-5xl font-black text-white tracking-tight">#{runningToken}</span>
              <span className="text-[11px] text-emerald-200 block mt-1 font-semibold">Consultation in Room</span>
            </div>

            {/* Patients Ahead */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 text-center">
              <span className="text-xs font-medium text-brand-200 block mb-1">Patients Ahead</span>
              <span className="text-4xl md:text-5xl font-black text-white tracking-tight">{patientsAhead}</span>
              <span className="text-[11px] text-white/70 block mt-1 font-medium">{patientsAhead === 0 ? 'Your Turn!' : 'In Waiting Line'}</span>
            </div>

            {/* Estimated Wait Time */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 text-center">
              <span className="text-xs font-medium text-brand-200 block mb-1">Est. Waiting Time</span>
              <span className="text-4xl md:text-5xl font-black text-emerald-400 tracking-tight">{totalWaitMinutes} <span className="text-lg font-semibold text-white/80">m</span></span>
              <span className="text-[11px] text-white/70 block mt-1 font-medium">~{avgDuration} min / patient</span>
            </div>
          </div>

          {/* Expected Turn Window Display */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 md:p-5 border border-white/20 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-brand-500/40 flex items-center justify-center text-white">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-brand-200 uppercase tracking-wider font-semibold">Expected Consultation Window</p>
                <p className="text-xl md:text-2xl font-bold text-white tracking-tight">
                  {formatTime(startTime)} – {formatTime(endTime)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-black/30 px-4 py-2 rounded-xl border border-white/10">
              <Navigation className="w-4 h-4 text-emerald-400" />
              <div className="text-right">
                <span className="text-[11px] text-white/70 block">Hospital Location</span>
                <span className="text-xs font-semibold text-white">OPD Block A, Room {currentDoctor?.room?.split(',')[0]}</span>
              </div>
            </div>
          </div>

          {/* Dynamic Smart Urgency Banner */}
          <div className={`mt-6 p-4 rounded-2xl border ${urgency.color} flex items-start gap-3`}>
            <div className={`w-3.5 h-3.5 rounded-full ${urgency.indicator} mt-1 flex-shrink-0`}></div>
            <div className="flex-1">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-black uppercase tracking-wider">{urgency.badge}</span>
                <span className="text-xs font-medium opacity-80">MediQueue Smart AI Assistant</span>
              </div>
              <h4 className="font-bold text-base mt-0.5">{urgency.headline}</h4>
              <p className="text-sm mt-0.5 font-medium opacity-90">{urgency.instruction}</p>
            </div>
          </div>
        </div>

        {/* Right Column: Smart Departure Calculator */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-brand-600">
                <Navigation className="w-5 h-5" />
                <h3 className="font-bold text-slate-900">Smart Arrival Calculator</h3>
              </div>
              <span className="text-xs bg-brand-50 text-brand-700 font-semibold px-2 py-0.5 rounded-full">GPS Ready</span>
            </div>

            <p className="text-xs text-slate-500 mt-2">
              MediQueue calculates your exact departure window factoring live OPD duration, traffic & hospital walking distance.
            </p>

            {/* Travel Mode Selector */}
            <div className="mt-4">
              <label className="text-xs font-semibold text-slate-700 mb-1.5 block">Mode of Commute:</label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'car', icon: Car, label: 'Car' },
                  { id: 'bike', icon: Bike, label: 'Bike' },
                  { id: 'metro', icon: Train, label: 'Metro' },
                  { id: 'walk', icon: Footprints, label: 'Walk' },
                ].map(item => {
                  const Icon = item.icon;
                  const isActive = travelMode === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setTravelMode(item.id)}
                      className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-medium transition-all ${
                        isActive
                          ? 'border-brand-600 bg-brand-50 text-brand-700 font-bold shadow-sm ring-1 ring-brand-600'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <Icon className="w-4 h-4 mb-1" />
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Distance Slider */}
            <div className="mt-4">
              <div className="flex justify-between items-center text-xs font-semibold text-slate-700 mb-1">
                <span>Distance from Hospital:</span>
                <span className="text-brand-600 font-bold text-sm">{distanceKm} km</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="30"
                step="0.5"
                value={distanceKm}
                onChange={(e) => setDistanceKm(parseFloat(e.target.value))}
                className="w-full accent-brand-600 h-2 bg-slate-100 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                <span>Nearby (0.5 km)</span>
                <span>City Center (15 km)</span>
                <span>Suburbs (30 km)</span>
              </div>
            </div>

            {/* Traffic Level Selector */}
            <div className="mt-4">
              <label className="text-xs font-semibold text-slate-700 mb-1.5 block">Current Traffic Condition:</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'low', label: 'Light', color: 'text-emerald-600' },
                  { id: 'moderate', label: 'Moderate', color: 'text-amber-600' },
                  { id: 'heavy', label: 'Heavy Rush', color: 'text-red-600' },
                ].map(t => (
                  <button
                    key={t.id}
                    onClick={() => setTrafficLevel(t.id)}
                    className={`py-1.5 px-2 rounded-xl text-xs font-semibold border transition-all ${
                      trafficLevel === t.id
                        ? 'border-brand-600 bg-brand-50 text-brand-700 ring-1 ring-brand-600'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Buffer time */}
            <div className="mt-4 flex items-center justify-between text-xs">
              <span className="text-slate-600 font-medium">Hospital Parking & Walk Buffer:</span>
              <div className="flex gap-1">
                {[5, 10, 15].map(b => (
                  <button
                    key={b}
                    onClick={() => setBufferMins(b)}
                    className={`px-2 py-0.5 rounded-lg border text-xs font-semibold ${
                      bufferMins === b ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    +{b}m
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Recommended Departure Output Box */}
          <div className="mt-5 bg-gradient-to-br from-brand-50 to-blue-50 border border-brand-200 rounded-2xl p-4">
            <span className="text-[11px] uppercase tracking-wider font-bold text-brand-700 block">Recommended Departure</span>
            <div className="text-2xl font-black text-brand-900 mt-1">
              {formatTime(departStart)} – {formatTime(departEnd)}
            </div>
            <p className="text-xs text-brand-800 mt-1 font-medium leading-relaxed">
              Travel time: <strong>~{travelTimeMinutes} mins</strong> ({travelSpeed} km/h avg speed) + <strong>{bufferMins} min buffer</strong>.
            </p>
          </div>
        </div>
      </div>

      {/* Queue Visualizer Progress Strip */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Live Token Flow Visualizer</h3>
            <p className="text-xs text-slate-500">Live movement in Dr. {currentDoctor?.name}’s OPD room</p>
          </div>
          <div className="flex items-center gap-4 text-xs font-medium">
            <span className="flex items-center gap-1.5 text-emerald-700"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> In Consultation</span>
            <span className="flex items-center gap-1.5 text-brand-700"><span className="w-2.5 h-2.5 rounded-full bg-brand-500"></span> Next In Line</span>
            <span className="flex items-center gap-1.5 text-amber-700"><span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span> You (#25)</span>
          </div>
        </div>

        {/* Token sequence horizontally scrollable */}
        <div className="flex items-center gap-3 overflow-x-auto pb-3 pt-1">
          {Array.from({ length: 10 }).map((_, index) => {
            const tokenNum = runningToken + index;
            const isRunning = tokenNum === runningToken;
            const isNext = tokenNum === runningToken + 1;
            const isMe = tokenNum === myTokenNumber;

            return (
              <div
                key={tokenNum}
                className={`flex-shrink-0 w-28 p-3 rounded-2xl border text-center transition-all ${
                  isRunning
                    ? 'border-emerald-500 bg-emerald-50 shadow-md ring-2 ring-emerald-400'
                    : isMe
                    ? 'border-amber-500 bg-amber-50 shadow-md ring-2 ring-amber-400'
                    : isNext
                    ? 'border-brand-300 bg-brand-50'
                    : 'border-slate-200 bg-slate-50 opacity-80'
                }`}
              >
                <span className={`text-[11px] font-bold uppercase tracking-wider block ${
                  isRunning ? 'text-emerald-700' : isMe ? 'text-amber-700' : 'text-slate-500'
                }`}>
                  {isRunning ? 'IN CABIN' : isMe ? 'YOUR TOKEN' : isNext ? 'UP NEXT' : 'WAITING'}
                </span>
                <span className={`text-2xl font-black tracking-tight block my-0.5 ${
                  isRunning ? 'text-emerald-900' : isMe ? 'text-amber-900' : 'text-slate-800'
                }`}>
                  #{tokenNum}
                </span>
                <span className="text-[10px] text-slate-500 block truncate">
                  {isRunning ? 'Amit V.' : isMe ? 'Rahul Sharma' : `Patient #${tokenNum}`}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Multi-Channel Notification Alerts Simulator */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-brand-600" />
              <h3 className="font-bold text-slate-900 text-base">Automatic Patient Notification Channels</h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Automated alerts trigger at 5, 3, 2, 1 patients remaining and when your token is called.
            </p>
          </div>

          {/* Test Action Trigger Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => sendTestNotification('whatsapp')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition shadow-sm"
            >
              <Send className="w-3.5 h-3.5" />
              Test WhatsApp Alert
            </button>
            <button
              onClick={() => sendTestNotification('sms')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-brand-600 text-white hover:bg-brand-700 transition shadow-sm"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              Test SMS Alert
            </button>
            <button
              onClick={() => sendTestNotification('push')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 text-white hover:bg-slate-900 transition shadow-sm"
            >
              <Bell className="w-3.5 h-3.5" />
              Test Push Alert
            </button>
          </div>
        </div>

        {/* Active Channel Toggles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="p-3.5 rounded-xl border border-slate-200 flex items-center justify-between bg-slate-50/50">
            <div>
              <span className="font-semibold text-xs text-slate-900 block">WhatsApp Notifications</span>
              <span className="text-[11px] text-slate-500">+91 98765 43210</span>
            </div>
            <button
              onClick={() => setWhatsappEnabled(!whatsappEnabled)}
              className={`w-11 h-6 rounded-full transition-colors relative ${whatsappEnabled ? 'bg-emerald-600' : 'bg-slate-300'}`}
            >
              <span className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${whatsappEnabled ? 'right-1' : 'left-1'}`} />
            </button>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-200 flex items-center justify-between bg-slate-50/50">
            <div>
              <span className="font-semibold text-xs text-slate-900 block">SMS Gateway</span>
              <span className="text-[11px] text-slate-500">Instant Delivery Alerts</span>
            </div>
            <button
              onClick={() => setSmsEnabled(!smsEnabled)}
              className={`w-11 h-6 rounded-full transition-colors relative ${smsEnabled ? 'bg-brand-600' : 'bg-slate-300'}`}
            >
              <span className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${smsEnabled ? 'right-1' : 'left-1'}`} />
            </button>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-200 flex items-center justify-between bg-slate-50/50">
            <div>
              <span className="font-semibold text-xs text-slate-900 block">Browser Push Notifications</span>
              <span className="text-[11px] text-slate-500">High-priority sound alerts</span>
            </div>
            <button
              onClick={() => setPushEnabled(!pushEnabled)}
              className={`w-11 h-6 rounded-full transition-colors relative ${pushEnabled ? 'bg-purple-600' : 'bg-slate-300'}`}
            >
              <span className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${pushEnabled ? 'right-1' : 'left-1'}`} />
            </button>
          </div>
        </div>

        {/* Notification Event History Tray */}
        {notificationLog.length > 0 && (
          <div className="mt-4 pt-4 border-t border-slate-100">
            <span className="text-xs font-bold text-slate-700 block mb-2">Recent Dispatched Alerts:</span>
            <div className="space-y-2">
              {notificationLog.slice(0, 3).map((item) => (
                <div key={item.id} className="p-3 rounded-xl bg-slate-100 text-xs text-slate-800 flex items-start gap-2.5">
                  <Bell className="w-4 h-4 text-brand-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-0.5">
                      <span className="font-bold text-[11px] uppercase tracking-wider text-brand-700">{item.channel} Notification</span>
                      <span className="text-[10px] text-slate-500 font-mono">{item.time}</span>
                    </div>
                    <p className="font-medium text-slate-700">{item.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
