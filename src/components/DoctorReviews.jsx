import React, { useState } from 'react';
import {
  Star, MessageSquare, CheckCircle, ShieldCheck,
  Clock, ThumbsUp, UserCheck, AlertCircle
} from 'lucide-react';

export default function DoctorReviews({ doctors, reviews, onSubmitReview }) {
  const [selectedDoctorId, setSelectedDoctorId] = useState(doctors[0]?.id || 'doc-1');
  const [showReviewModal, setShowReviewModal] = useState(false);

  // Form inputs
  const [rating, setRating] = useState(5);
  const [commRating, setCommRating] = useState(5);
  const [waitingRating, setWaitingRating] = useState(5);
  const [comment, setComment] = useState('');
  const [tokenInput, setTokenInput] = useState('#25');
  const [patientName, setPatientName] = useState('Rahul Sharma');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const currentDoctor = doctors.find(d => d.id === selectedDoctorId) || doctors[0];
  const doctorReviews = reviews.filter(r => r.doctorId === selectedDoctorId);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!tokenInput.trim()) {
      setErrorMessage('A verified completed appointment token is strictly required to review.');
      return;
    }

    try {
      await onSubmitReview({
        doctorId: selectedDoctorId,
        patientName,
        rating,
        communicationRating: commRating,
        waitingRating,
        comment,
        verifiedAppointmentToken: tokenInput
      });

      setSuccessMessage('Review verified and published to doctor profile!');
      setTimeout(() => {
        setShowReviewModal(false);
        setComment('');
        setSuccessMessage('');
      }, 2000);
    } catch (err) {
      setErrorMessage(err.message || 'Failed to submit review');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Doctor Selector */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-3 py-1 rounded-full">
            Transparent Healthcare Quality
          </span>
          <h2 className="text-2xl font-black text-slate-900 mt-2">
            Verified Doctor Ratings & Patient Reviews
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Real feedback from patients with completed appointments. Evaluated on consultation, empathy & waiting-time management.
          </p>
        </div>

        {/* Doctor Switcher */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-500">Select Doctor:</label>
          <select
            value={selectedDoctorId}
            onChange={(e) => setSelectedDoctorId(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-800 text-sm font-semibold rounded-xl px-3 py-2"
          >
            {doctors.map(d => (
              <option key={d.id} value={d.id}>{d.name} ({d.specialization})</option>
            ))}
          </select>
        </div>
      </div>

      {/* Doctor Summary & Metric Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-4">
              <img
                src={currentDoctor?.photo}
                alt={currentDoctor?.name}
                className="w-18 h-18 rounded-2xl object-cover border-2 border-slate-100 shadow-md"
              />
              <div>
                <h3 className="font-bold text-lg text-slate-900">{currentDoctor?.name}</h3>
                <p className="text-xs text-brand-600 font-semibold">{currentDoctor?.specialization}</p>
                <p className="text-xs text-slate-500 mt-0.5">{currentDoctor?.qualifications}</p>
              </div>
            </div>

            {/* Star Score Overview */}
            <div className="mt-6 p-4 rounded-2xl bg-amber-50/60 border border-amber-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-amber-900 uppercase">Average Rating</span>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-4xl font-black text-amber-900">{currentDoctor?.rating}</span>
                  <div>
                    <div className="flex text-amber-500">
                      {[1, 2, 3, 4, 5].map(s => (
                        <Star key={s} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                    <span className="text-[11px] text-amber-800 font-medium">{currentDoctor?.totalReviews} verified reviews</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowReviewModal(true)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white shadow-sm transition"
              >
                Write Review
              </button>
            </div>

            {/* Rating Breakdown Bars */}
            <div className="mt-5 space-y-3">
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span>Communication & Empathy:</span>
                  <span className="font-bold text-slate-900">{currentDoctor?.ratingBreakdown?.communication || 4.9} / 5</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: '98%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span>Waiting-Time Management:</span>
                  <span className="font-bold text-slate-900">{currentDoctor?.ratingBreakdown?.waitingManagement || 4.8} / 5</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-brand-600 h-full rounded-full" style={{ width: '96%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span>Overall Medical Treatment:</span>
                  <span className="font-bold text-slate-900">{currentDoctor?.ratingBreakdown?.overall || 4.9} / 5</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-purple-600 h-full rounded-full" style={{ width: '98%' }}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 text-[11px] text-slate-400 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Verification Shield: Fake or unverified reviews are strictly blocked by MediQueue.
          </div>
        </div>

        {/* Patient Reviews Feed */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-base">Verified Patient Experiences</h3>
            <span className="text-xs bg-slate-100 text-slate-600 font-bold px-2.5 py-0.5 rounded-full">
              {doctorReviews.length} Reviews
            </span>
          </div>

          <div className="space-y-4">
            {doctorReviews.map(rev => (
              <div key={rev.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-xs">
                      {rev.patientName[0]}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        {rev.patientName}
                        <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.2 rounded-full inline-flex items-center gap-0.5">
                          <CheckCircle className="w-3 h-3 text-emerald-600" /> Token {rev.verifiedAppointmentToken}
                        </span>
                      </h4>
                      <span className="text-[10px] text-slate-400 font-medium">{rev.date}</span>
                    </div>
                  </div>

                  <div className="flex text-amber-400">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  "{rev.comment}"
                </p>

                <div className="flex items-center gap-4 text-[10px] font-semibold text-slate-500 pt-1">
                  <span>Communication: <strong className="text-slate-800">{rev.communicationRating}/5</strong></span>
                  <span>Wait-Time: <strong className="text-slate-800">{rev.waitingRating}/5</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Review Submission Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold uppercase text-brand-600">Verified Patient Review</span>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">{currentDoctor.name}</h3>
              </div>
              <button
                onClick={() => setShowReviewModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-xl px-2"
              >
                ×
              </button>
            </div>

            {errorMessage && (
              <div className="mt-3 p-3 rounded-xl bg-red-50 text-red-700 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {errorMessage}
              </div>
            )}

            {successMessage && (
              <div className="mt-3 p-3 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-semibold flex items-center gap-2">
                <CheckCircle className="w-4 h-4 flex-shrink-0" />
                {successMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Completed Appointment Token (Verification):
                </label>
                <input
                  type="text"
                  required
                  value={tokenInput}
                  onChange={(e) => setTokenInput(e.target.value)}
                  placeholder="e.g. #25 or #14"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-bold focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">Only patients with verified appointments can submit ratings.</span>
              </div>

              {/* Star selection */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-500 block mb-1">Overall</span>
                  <select
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="text-xs font-bold bg-white border border-slate-200 rounded-lg p-1 w-full"
                  >
                    <option value={5}>5 ★ (Excellent)</option>
                    <option value={4}>4 ★ (Good)</option>
                    <option value={3}>3 ★ (Average)</option>
                    <option value={2}>2 ★ (Poor)</option>
                    <option value={1}>1 ★ (Bad)</option>
                  </select>
                </div>

                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-500 block mb-1">Communication</span>
                  <select
                    value={commRating}
                    onChange={(e) => setCommRating(Number(e.target.value))}
                    className="text-xs font-bold bg-white border border-slate-200 rounded-lg p-1 w-full"
                  >
                    <option value={5}>5 ★</option>
                    <option value={4}>4 ★</option>
                    <option value={3}>3 ★</option>
                  </select>
                </div>

                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-500 block mb-1">Wait Management</span>
                  <select
                    value={waitingRating}
                    onChange={(e) => setWaitingRating(Number(e.target.value))}
                    className="text-xs font-bold bg-white border border-slate-200 rounded-lg p-1 w-full"
                  >
                    <option value={5}>5 ★</option>
                    <option value={4}>4 ★</option>
                    <option value={3}>3 ★</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Review & Experience:</label>
                <textarea
                  required
                  rows={3}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share details about your consultation, queue timing accuracy, and doctor advice..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowReviewModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-brand-600 text-white hover:bg-brand-700 shadow-sm"
                >
                  Submit Verified Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
