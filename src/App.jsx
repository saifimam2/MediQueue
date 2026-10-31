import React, { useState, useEffect } from 'react';
import {
  Activity, Stethoscope, Clock, ShieldCheck, Siren,
  Bed, Utensils, CheckSquare, Star, Users, PhoneCall,
  Bell, ChevronRight, Menu, X, Radio, AlertTriangle
} from 'lucide-react';

import LiveTokenTracker from './components/LiveTokenTracker';
import DoctorConsole from './components/DoctorConsole';
import DoctorDirectory from './components/DoctorDirectory';
import AmbulanceSection from './components/AmbulanceSection';
import AttendantSupport from './components/AttendantSupport';
import ChecklistSection from './components/ChecklistSection';
import DoctorReviews from './components/DoctorReviews';
import SecurityDashboard from './components/SecurityDashboard';

export default function App() {
  const [currentTab, setCurrentTab] = useState('tracker'); // tracker, directory, doctor-console, ambulance, attendant, checklist, reviews, security
  const [userRole, setUserRole] = useState('patient'); // patient, doctor, attendant, admin
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Core Platform Data State
  const [doctors, setDoctors] = useState([]);
  const [accommodations, setAccommodations] = useState([]);
  const [foodPlaces, setFoodPlaces] = useState([]);
  const [checklist, setChecklist] = useState({ documents: [], medicines: [], allergies: '' });
  const [reviews, setReviews] = useState([]);
  const [activeDoctorId, setActiveDoctorId] = useState('doc-1');
  const [myTokenNumber, setMyTokenNumber] = useState(25);
  const [liveToast, setLiveToast] = useState(null);

  // Initial Fetch of Data
  const fetchData = async () => {
    try {
      const [docRes, accRes, foodRes, checkRes, revRes] = await Promise.all([
        fetch('/api/doctors').then(r => r.json()),
        fetch('/api/accommodations').then(r => r.json()),
        fetch('/api/food').then(r => r.json()),
        fetch('/api/checklist').then(r => r.json()),
        fetch('/api/reviews').then(r => r.json()),
      ]);

      if (docRes.doctors) setDoctors(docRes.doctors);
      if (accRes.accommodations) setAccommodations(accRes.accommodations);
      if (foodRes.foodPlaces) setFoodPlaces(foodRes.foodPlaces);
      if (checkRes.checklist) setChecklist(checkRes.checklist);
      if (revRes.reviews) setReviews(revRes.reviews);
    } catch (err) {
      console.error('Failed to load initial data:', err);
    }
  };

  useEffect(() => {
    fetchData();

    // Setup Real-time Server-Sent Events (SSE) Stream
    const eventSource = new EventSource('/api/queue/stream');

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'INIT_SYNC' || data.type === 'QUEUE_UPDATED' || data.type === 'NEW_BOOKING') {
          if (data.doctors) {
            setDoctors(data.doctors);
          }
          if (data.message) {
            setLiveToast(data.message);
            setTimeout(() => setLiveToast(null), 5000);
          }
        }
      } catch (err) {
        console.error('SSE parse error:', err);
      }
    };

    return () => {
      eventSource.close();
    };
  }, []);

  // Queue Action Handler (Next, Complete, Skip, Pause, Duration)
  const handleQueueAction = async (doctorId, action, value) => {
    const res = await fetch('/api/queue/action', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ doctorId, action, value })
    });
    const result = await res.json();
    if (!result.success) throw new Error(result.error);
    fetchData();
    return result;
  };

  // Book Appointment
  const handleBookAppointment = async (bookingData) => {
    const res = await fetch('/api/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookingData)
    });
    const result = await res.json();
    if (!result.success) throw new Error(result.error);
    setMyTokenNumber(result.tokenNumber);
    setActiveDoctorId(bookingData.doctorId);
    fetchData();
    return result;
  };

  // Checklist actions
  const handleTogglePacked = async (id, type) => {
    const res = await fetch('/api/checklist/toggle-packed', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, type })
    });
    const result = await res.json();
    if (result.checklist) setChecklist(result.checklist);
  };

  const handleAddChecklistItem = async (item) => {
    const res = await fetch('/api/checklist/add-item', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item)
    });
    const result = await res.json();
    if (result.checklist) setChecklist(result.checklist);
  };

  // Submit Review
  const handleSubmitReview = async (reviewData) => {
    const res = await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reviewData)
    });
    const result = await res.json();
    if (!result.success) throw new Error(result.error);
    fetchData();
    return result;
  };

  const activeDoctor = doctors.find(d => d.id === activeDoctorId) || doctors[0];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Header / Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Brand Logo & Name */}
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentTab('tracker')}>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-blue-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
                <Activity className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h1 className="text-2xl font-black tracking-tight text-slate-900">
                    Medi<span className="text-brand-600">Queue</span>
                  </h1>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                </div>
                <p className="text-[11px] font-semibold text-slate-500 tracking-wide uppercase">
                  Smart Healthcare & Live OPD Token
                </p>
              </div>
            </div>

            {/* Desktop Navigation Tabs */}
            <nav className="hidden xl:flex items-center gap-1">
              {[
                { id: 'tracker', label: 'Live Token Tracker', icon: Clock },
                { id: 'directory', label: 'Find & Book Doctor', icon: Stethoscope },
                { id: 'doctor-console', label: 'Doctor OPD Console', icon: Activity },
                { id: 'attendant', label: 'Attendant Stay & Food', icon: Users },
                { id: 'checklist', label: 'Medicine Checklist', icon: CheckSquare },
                { id: 'reviews', label: 'Doctor Reviews', icon: Star },
                { id: 'security', label: 'Firewall & SOC', icon: ShieldCheck },
              ].map(tab => {
                const Icon = tab.icon;
                const isActive = currentTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setCurrentTab(tab.id)}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-brand-50 text-brand-700 ring-1 ring-brand-200 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>

            {/* Right Action Ribbon: Role Switcher & Emergency Button */}
            <div className="flex items-center gap-3">
              {/* Emergency Ambulance 1-Click Button */}
              <button
                onClick={() => setCurrentTab('ambulance')}
                className="flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white text-xs font-black shadow-md hover:shadow-lg transition-all animate-pulse"
              >
                <Siren className="w-4 h-4" />
                <span className="hidden sm:inline">Emergency Ambulance</span>
                <span className="sm:hidden">108</span>
              </button>

              {/* Mobile menu trigger */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="xl:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="xl:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-6 space-y-1">
            {[
              { id: 'tracker', label: 'Live Token Tracker', icon: Clock },
              { id: 'directory', label: 'Find & Book Doctor', icon: Stethoscope },
              { id: 'doctor-console', label: 'Doctor OPD Console', icon: Activity },
              { id: 'ambulance', label: 'Emergency Ambulance', icon: Siren },
              { id: 'attendant', label: 'Attendant Stay & Food', icon: Users },
              { id: 'checklist', label: 'Medicine Checklist', icon: CheckSquare },
              { id: 'reviews', label: 'Doctor Reviews', icon: Star },
              { id: 'security', label: 'Firewall & Security SOC', icon: ShieldCheck },
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = currentTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setCurrentTab(tab.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-left ${
                    isActive ? 'bg-brand-50 text-brand-700' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        )}
      </header>

      {/* Floating Live Broadcast Toast Notification */}
      {liveToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-brand-500/50 flex items-center gap-3 animate-bounce">
          <Radio className="w-5 h-5 text-emerald-400 animate-pulse flex-shrink-0" />
          <div>
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">Live Queue Update</span>
            <p className="text-xs font-semibold text-slate-100">{liveToast}</p>
          </div>
        </div>
      )}

      {/* Main Content View Switcher */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {currentTab === 'tracker' && (
          <LiveTokenTracker
            doctors={doctors}
            activeDoctorId={activeDoctorId}
            onSelectDoctor={setActiveDoctorId}
            myTokenNumber={myTokenNumber}
          />
        )}

        {currentTab === 'directory' && (
          <DoctorDirectory
            doctors={doctors}
            onBookAppointment={handleBookAppointment}
            onSelectDoctorForView={(id) => {
              setActiveDoctorId(id);
              setCurrentTab('tracker');
            }}
          />
        )}

        {currentTab === 'doctor-console' && (
          <DoctorConsole
            doctors={doctors}
            onQueueAction={handleQueueAction}
            activeDoctorId={activeDoctorId}
            onSelectDoctor={setActiveDoctorId}
          />
        )}

        {currentTab === 'ambulance' && (
          <AmbulanceSection onDirectEmergencyCall={() => window.open('tel:108')} />
        )}

        {currentTab === 'attendant' && (
          <AttendantSupport
            accommodations={accommodations}
            foodPlaces={foodPlaces}
            currentDoctor={activeDoctor}
            myToken={myTokenNumber}
          />
        )}

        {currentTab === 'checklist' && (
          <ChecklistSection
            checklist={checklist}
            onTogglePacked={handleTogglePacked}
            onAddItem={handleAddChecklistItem}
          />
        )}

        {currentTab === 'reviews' && (
          <DoctorReviews
            doctors={doctors}
            reviews={reviews}
            onSubmitReview={handleSubmitReview}
          />
        )}

        {currentTab === 'security' && (
          <SecurityDashboard />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-brand-600 flex items-center justify-center text-white font-black text-sm">
              M
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800">MediQueue Healthcare Platform</p>
              <p className="text-[11px] text-slate-500">Zero Unnecessary Hospital Waiting • Built with AI Precision & Active WAF</p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs font-semibold text-slate-500">
            <span className="flex items-center gap-1.5 text-emerald-600">
              <ShieldCheck className="w-4 h-4" /> HIPAA & WAF Shield Protected
            </span>
            <button onClick={() => setCurrentTab('security')} className="hover:text-brand-600">
              SOC Security Console
            </button>
            <button onClick={() => setCurrentTab('ambulance')} className="text-red-600 hover:text-red-700">
              Emergency 108
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
