import React, { useState } from 'react';
import {
  PhoneCall, AlertOctagon, Siren, ShieldCheck, MapPin,
  Clock, CheckCircle2, ChevronRight, Activity, Radio
} from 'lucide-react';

export default function AmbulanceSection({ onDirectEmergencyCall }) {
  const [selectedCategory, setSelectedCategory] = useState('Advanced Life Support (ALS)');
  const [pickupAddress, setPickupAddress] = useState('Sector 18, Block B, Near Metro Pillar 142');
  const [patientCondition, setPatientCondition] = useState('Severe chest pain and breathlessness');
  const [destinationHospital, setDestinationHospital] = useState('Apex Metro Heart & Multi-Speciality Hospital');
  const [callerPhone, setCallerPhone] = useState('9876543210');

  // Active simulated dispatch state
  const [activeDispatch, setActiveDispatch] = useState(null);
  const [etaRemaining, setEtaRemaining] = useState(8);

  const ambulanceCategories = [
    {
      id: 'Basic Ambulance (BLS)',
      title: 'Basic Ambulance (BLS)',
      desc: 'Oxygen cylinder, emergency stretcher, first-aid kit, trained paramedic.',
      eta: '5-7 mins',
      fare: '₹800',
      badge: 'Quick Response',
      color: 'border-blue-200 bg-blue-50/50'
    },
    {
      id: 'Advanced Life Support (ALS)',
      title: 'Advanced Life Support (ALS)',
      desc: 'Transport ventilator, ECG cardiac monitor, defibrillator, critical emergency nurse.',
      eta: '8-10 mins',
      fare: '₹2,200',
      badge: 'Most Requested',
      color: 'border-red-200 bg-red-50/60 ring-2 ring-red-500'
    },
    {
      id: 'ICU on Wheels (Critical Care)',
      title: 'ICU on Wheels (Critical Care)',
      desc: 'Complete mobile ICU with specialized physician, infusion syringe pumps, arterial lines.',
      eta: '10-12 mins',
      fare: '₹3,500',
      badge: 'Intensive Care',
      color: 'border-purple-200 bg-purple-50/50'
    },
    {
      id: 'Patient Transfer Ambulance',
      title: 'Patient Transfer Ambulance',
      desc: 'Comfort non-emergency transfer for discharge, dialysis, inter-city transport.',
      eta: '12-15 mins',
      fare: '₹600',
      badge: 'Scheduled / Transfer',
      color: 'border-emerald-200 bg-emerald-50/50'
    }
  ];

  const handleRequestAmbulance = (e) => {
    e.preventDefault();
    const newDispatch = {
      id: `DISP-${Math.floor(1000 + Math.random() * 9000)}`,
      category: selectedCategory,
      plateNumber: 'DL 01 EM 8899',
      driver: 'Surendra Pal',
      driverPhone: '+91 98111 10802',
      eta: 8,
      status: 'DISPATCHED_EN_ROUTE',
      pickup: pickupAddress,
      destination: destinationHospital,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setActiveDispatch(newDispatch);
    setEtaRemaining(8);
  };

  return (
    <div className="space-y-6">
      {/* Zero Delay Emergency Call Banner */}
      <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="p-1.5 rounded-lg bg-white/20 backdrop-blur-md">
                <Siren className="w-5 h-5 animate-pulse text-white" />
              </span>
              <span className="text-xs font-black uppercase tracking-widest text-red-100">
                24/7 Zero-Delay Emergency Response
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight">
              Emergency Ambulance Dispatch
            </h2>
            <p className="text-sm text-red-100 mt-1 max-w-xl">
              Do not wait for registration. Dial immediate emergency services or request GPS-tracked ambulance below with 1 click.
            </p>
          </div>

          {/* Quick Direct Hotline Call Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <a
              href="tel:108"
              className="flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-white text-red-700 font-black text-sm shadow-lg hover:bg-red-50 transition active:scale-95"
            >
              <PhoneCall className="w-4 h-4 fill-current text-red-600" />
              Dial 108 (National)
            </a>
            <a
              href="tel:112"
              className="flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-red-900/60 backdrop-blur-md border border-white/20 text-white font-black text-sm hover:bg-red-900 transition active:scale-95"
            >
              <PhoneCall className="w-4 h-4 fill-current text-white" />
              Dial 112 (Emergency)
            </a>
          </div>
        </div>
      </div>

      {/* Active Dispatch Tracker (If Dispatched) */}
      {activeDispatch && (
        <div className="bg-white rounded-3xl p-6 md:p-8 border-2 border-red-500 shadow-xl space-y-4 relative">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center">
                <Siren className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <span className="text-xs font-bold text-red-600 uppercase tracking-wider">
                  Live Dispatch Active #{activeDispatch.id}
                </span>
                <h3 className="text-lg font-bold text-slate-900">{activeDispatch.category}</h3>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <span className="text-[11px] text-slate-500 block">Estimated Arrival (ETA)</span>
                <span className="text-2xl font-black text-red-600 font-mono">~{etaRemaining} mins</span>
              </div>
              <a
                href={`tel:${activeDispatch.driverPhone}`}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition"
              >
                <PhoneCall className="w-3.5 h-3.5" /> Call Driver
              </a>
            </div>
          </div>

          {/* Route progress */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
            <div className="flex justify-between items-center text-xs font-bold text-slate-700 mb-2">
              <span className="flex items-center gap-1.5 text-emerald-700">
                <Radio className="w-3.5 h-3.5 animate-pulse" /> Ambulance Unit En Route ({activeDispatch.plateNumber})
              </span>
              <span className="text-slate-500">Driver: {activeDispatch.driver}</span>
            </div>

            <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
              <div className="bg-gradient-to-r from-red-500 to-emerald-500 h-full w-2/3 rounded-full animate-pulse"></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 text-xs text-slate-600">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Pickup Address</span>
                <span className="font-semibold text-slate-800">{activeDispatch.pickup}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Destination Facility</span>
                <span className="font-semibold text-slate-800">{activeDispatch.destination}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Request Form & Vehicle Types */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Categories selector */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div>
            <h3 className="font-bold text-slate-900 text-lg">Select Required Ambulance Tier</h3>
            <p className="text-xs text-slate-500">Pick medical equipment standard suited for patient condition.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {ambulanceCategories.map(cat => {
              const isSelected = selectedCategory === cat.id;
              return (
                <div
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${cat.color} ${
                    isSelected ? 'ring-2 ring-brand-600 shadow-md' : 'hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-600 bg-white/80 px-2 py-0.5 rounded-md">
                      {cat.badge}
                    </span>
                    <span className="text-sm font-black text-slate-900">{cat.fare}</span>
                  </div>

                  <h4 className="font-bold text-sm text-slate-900 mt-2">{cat.title}</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-snug">{cat.desc}</p>

                  <div className="flex items-center justify-between text-xs mt-3 pt-2 border-t border-slate-200/60 font-semibold text-slate-700">
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-brand-600" /> Avg ETA: {cat.eta}</span>
                    <span className="text-brand-600">{isSelected ? '✓ Selected' : 'Choose'}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 1-Click Request Form */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          <form onSubmit={handleRequestAmbulance} className="space-y-4">
            <div>
              <h3 className="font-bold text-slate-900 text-lg">Request Ambulance Dispatch</h3>
              <p className="text-xs text-slate-500">Immediate GPS location and contact dispatch.</p>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Current Pickup Location:</label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-red-500 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={pickupAddress}
                  onChange={(e) => setPickupAddress(e.target.value)}
                  placeholder="Street, Landmark, City..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-xs font-medium focus:ring-2 focus:ring-red-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Destination Hospital:</label>
              <input
                type="text"
                required
                value={destinationHospital}
                onChange={(e) => setDestinationHospital(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-medium focus:ring-2 focus:ring-red-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Patient Condition / Symptoms:</label>
              <input
                type="text"
                required
                value={patientCondition}
                onChange={(e) => setPatientCondition(e.target.value)}
                placeholder="e.g. Unconscious, Trauma, High Fever, Fracture"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-medium focus:ring-2 focus:ring-red-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Caller Contact Phone:</label>
              <input
                type="tel"
                required
                value={callerPhone}
                onChange={(e) => setCallerPhone(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-medium focus:ring-2 focus:ring-red-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold text-sm shadow-lg hover:shadow-xl transition active:scale-95 flex items-center justify-center gap-2"
            >
              <Siren className="w-4 h-4" />
              Dispatch {selectedCategory.split(' ')[0]} Ambulance Now
            </button>
          </form>

          <p className="text-[11px] text-slate-400 text-center mt-3">
            🔒 Dispatched directly to closest available emergency vehicle unit with audio GPS beacon.
          </p>
        </div>
      </div>
    </div>
  );
}
