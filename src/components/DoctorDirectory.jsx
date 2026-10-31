import React, { useState } from 'react';
import {
  Search, Star, Calendar, Clock, MapPin, Award,
  Users, CheckCircle, ChevronRight, Bed, Utensils
} from 'lucide-react';

export default function DoctorDirectory({ doctors, onBookAppointment, onSelectDoctorForView }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');
  const [bookingDoctor, setBookingDoctor] = useState(null);

  // Booking Form State
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [attendantCount, setAttendantCount] = useState(1);
  const [needsAccommodation, setNeedsAccommodation] = useState(false);
  const [needsFood, setNeedsFood] = useState(false);
  const [visitDuration, setVisitDuration] = useState('2-4 Hours (Consultation + Tests)');
  const [budgetRange, setBudgetRange] = useState('₹300 - ₹800 / day');
  const [bookingSuccessData, setBookingSuccessData] = useState(null);

  const specialties = ['All', 'Cardiology', 'Pediatrics', 'Orthopedics', 'Neurology'];

  const filteredDoctors = doctors.filter(doc => {
    const matchesSpec = selectedSpecialty === 'All' || doc.specialization.toLowerCase().includes(selectedSpecialty.toLowerCase());
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          doc.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          doc.hospital.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSpec && matchesSearch;
  });

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!patientName.trim()) return;

    try {
      const res = await onBookAppointment({
        doctorId: bookingDoctor.id,
        patientName,
        patientPhone,
        attendantCount,
        needsAccommodation,
        needsFood,
        visitDuration,
        budgetRange
      });
      setBookingSuccessData(res);
    } catch (err) {
      alert('Booking failed: ' + err.message);
    }
  };

  const closeBookingModal = () => {
    setBookingDoctor(null);
    setBookingSuccessData(null);
    setPatientName('');
    setPatientPhone('');
  };

  return (
    <div className="space-y-6">
      {/* Header & Search */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm">
        <div className="max-w-2xl">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-3 py-1 rounded-full">
            Doctor Network & Appointments
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-2">
            Find Top Specialists & Book with Live Token
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Choose certified consultants across major specialties. Token numbers are issued immediately with live queue tracking.
          </p>
        </div>

        {/* Filter bar */}
        <div className="flex flex-col md:flex-row gap-3 mt-6">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by doctor name, specialty, or hospital..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-11 pr-4 py-3 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {specialties.map(spec => (
              <button
                key={spec}
                onClick={() => setSelectedSpecialty(spec)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedSpecialty === spec
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {spec}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Doctors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredDoctors.map(doctor => {
          const queueLength = doctor.queue ? doctor.queue.filter(q => q.status === 'WAITING').length : 0;
          return (
            <div
              key={doctor.id}
              className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start gap-4">
                  <img
                    src={doctor.photo}
                    alt={doctor.name}
                    className="w-20 h-20 rounded-2xl object-cover border-2 border-slate-100 shadow-sm flex-shrink-0"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-brand-600 bg-brand-50 px-2.5 py-0.5 rounded-full">
                        {doctor.specialization}
                      </span>
                      <div className="flex items-center gap-1 text-amber-500 text-xs font-bold bg-amber-50 px-2 py-0.5 rounded-full">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span>{doctor.rating}</span>
                        <span className="text-slate-400 font-normal">({doctor.totalReviews})</span>
                      </div>
                    </div>

                    <h3 className="font-bold text-lg text-slate-900 mt-1">{doctor.name}</h3>
                    <p className="text-xs text-slate-500 mt-0.5 leading-snug">{doctor.qualifications}</p>
                    <p className="text-xs text-slate-600 font-medium mt-1">
                      <Award className="w-3.5 h-3.5 inline mr-1 text-brand-500" />
                      {doctor.experience} Years Experience
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-100 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-slate-400" /> {doctor.hospital}</span>
                    <span className="font-semibold text-slate-800">{doctor.room}</span>
                  </div>

                  <div className="flex items-center justify-between bg-slate-50 p-3 rounded-2xl">
                    <div>
                      <span className="text-[11px] text-slate-500 block">Live Queue Status</span>
                      <span className="font-bold text-slate-900 text-sm">Token #{doctor.currentToken} Running</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[11px] text-slate-500 block">Waiting in Line</span>
                      <span className="font-bold text-brand-600 text-sm">{queueLength} Patients</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                <div>
                  <span className="text-[11px] text-slate-400 block font-medium">Consultation Fee</span>
                  <span className="text-lg font-black text-slate-900">₹{doctor.fee}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onSelectDoctorForView(doctor.id)}
                    className="px-3.5 py-2 rounded-xl text-xs font-bold text-brand-700 bg-brand-50 hover:bg-brand-100 transition"
                  >
                    View Queue
                  </button>
                  <button
                    onClick={() => setBookingDoctor(doctor)}
                    className="px-5 py-2 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-sm transition"
                  >
                    Book Token
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Booking Modal with Attendant Requirements */}
      {bookingDoctor && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl border border-slate-200 my-8">
            {!bookingSuccessData ? (
              <form onSubmit={handleBookingSubmit} className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <span className="text-xs font-bold text-brand-600 uppercase">Book Instant Token</span>
                    <h3 className="text-xl font-bold text-slate-900">{bookingDoctor.name}</h3>
                    <p className="text-xs text-slate-500">{bookingDoctor.specialization} • Fee: ₹{bookingDoctor.fee}</p>
                  </div>
                  <button
                    type="button"
                    onClick={closeBookingModal}
                    className="text-slate-400 hover:text-slate-600 font-bold text-xl px-2"
                  >
                    ×
                  </button>
                </div>

                {/* Patient Information */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Patient Full Name:</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Chandra"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">WhatsApp / Mobile Number (for SMS & Tokens):</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 9876543210"
                    value={patientPhone}
                    onChange={(e) => setPatientPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>

                {/* Attendant & Family Support Section */}
                <div className="bg-blue-50/60 border border-blue-200/60 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center gap-2 text-brand-800">
                    <Users className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">Attendant & Family Travel Support</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-snug">
                    Mention your companions so we can recommend nearby dharamshalas, budget lodges, and nutritious food.
                  </p>

                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-700 block mb-1">Number of Attendants:</label>
                      <select
                        value={attendantCount}
                        onChange={(e) => setAttendantCount(parseInt(e.target.value, 10))}
                        className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-medium"
                      >
                        <option value={0}>Just the patient (0)</option>
                        <option value={1}>1 Attendant / Family Member</option>
                        <option value={2}>2 Attendants</option>
                        <option value={3}>3+ Attendants</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-slate-700 block mb-1">Expected Visit Duration:</label>
                      <select
                        value={visitDuration}
                        onChange={(e) => setVisitDuration(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-medium"
                      >
                        <option>2-4 Hours (OPD Visit)</option>
                        <option>Full Day (Tests + Reports)</option>
                        <option>Overnight (1-2 Days)</option>
                        <option>Extended (3+ Days)</option>
                      </select>
                    </div>
                  </div>

                  {/* Checkbox triggers */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-1">
                    <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={needsAccommodation}
                        onChange={(e) => setNeedsAccommodation(e.target.checked)}
                        className="rounded text-brand-600 focus:ring-brand-500 w-4 h-4"
                      />
                      <Bed className="w-3.5 h-3.5 text-brand-600" />
                      Need Nearby Accommodation
                    </label>

                    <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={needsFood}
                        onChange={(e) => setNeedsFood(e.target.checked)}
                        className="rounded text-brand-600 focus:ring-brand-500 w-4 h-4"
                      />
                      <Utensils className="w-3.5 h-3.5 text-brand-600" />
                      Need Food / Canteen Services
                    </label>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={closeBookingModal}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-md transition"
                  >
                    Confirm & Generate Token
                  </button>
                </div>
              </form>
            ) : (
              /* Booking Success Confirmation Card */
              <div className="text-center py-4 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8" />
                </div>

                <div>
                  <h3 className="text-2xl font-black text-slate-900">Token Confirmed!</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Your appointment has been booked with {bookingSuccessData.doctorName}.
                  </p>
                </div>

                <div className="bg-gradient-to-br from-brand-50 to-blue-50 border border-brand-200 rounded-2xl p-5 my-4">
                  <span className="text-xs uppercase font-bold tracking-wider text-brand-700 block">Your Token Number</span>
                  <div className="text-5xl font-black text-brand-900 my-1">
                    #{bookingSuccessData.tokenNumber}
                  </div>
                  <div className="text-xs text-slate-600 mt-2 flex justify-center gap-4">
                    <span>Current Running: <strong>#{bookingSuccessData.currentToken}</strong></span>
                    <span>Ahead of you: <strong>{bookingSuccessData.patientsAhead}</strong></span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200">
                  📱 SMS & WhatsApp confirmation sent with your unique token tracking link.
                </p>

                <div className="flex justify-center gap-3 pt-2">
                  <button
                    onClick={() => {
                      onSelectDoctorForView(bookingDoctor.id);
                      closeBookingModal();
                    }}
                    className="px-6 py-2.5 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-md"
                  >
                    Track Live Token Now
                  </button>
                  <button
                    onClick={closeBookingModal}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 border border-slate-200"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
