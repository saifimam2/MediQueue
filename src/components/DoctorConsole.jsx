import React, { useState } from 'react';
import {
  Stethoscope, Play, CheckCircle2, SkipForward, Pause,
  Clock, PlusCircle, AlertCircle, Users, Activity,
  Radio, Sparkles, UserCheck, ShieldAlert
} from 'lucide-react';

export default function DoctorConsole({ doctors, onQueueAction, activeDoctorId, onSelectDoctor }) {
  const currentDoctor = doctors.find(d => d.id === activeDoctorId) || doctors[0];

  const [pauseReasonInput, setPauseReasonInput] = useState('Doctor reviewing inpatient ICU chart (15 mins)');
  const [durationInput, setDurationInput] = useState(currentDoctor?.avgDuration || 8);
  const [emergencyPatientName, setEmergencyPatientName] = useState('');
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [actionFeedback, setActionFeedback] = useState(null);

  const handleAction = async (action, value = null) => {
    try {
      const result = await onQueueAction(currentDoctor.id, action, value);
      setActionFeedback({
        type: 'success',
        message: result?.message || `Action executed: ${action}`
      });
      setTimeout(() => setActionFeedback(null), 4000);
    } catch (err) {
      setActionFeedback({
        type: 'error',
        message: 'Failed to update queue: ' + err.message
      });
      setTimeout(() => setActionFeedback(null), 4000);
    }
  };

  const handleAddEmergency = (e) => {
    e.preventDefault();
    if (!emergencyPatientName.trim()) return;
    handleAction('ADD_EMERGENCY_PATIENT', { patientName: emergencyPatientName });
    setEmergencyPatientName('');
    setShowEmergencyModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header with Doctor Selector */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-brand-50 border border-brand-200 flex items-center justify-center text-brand-600">
            <Stethoscope className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider bg-brand-100 text-brand-800 px-2.5 py-0.5 rounded-full">
                Doctor & Receptionist OPD Console
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600">
                <Radio className="w-3.5 h-3.5 animate-pulse" /> Live Broadcasting
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mt-1">{currentDoctor?.name}</h2>
            <p className="text-xs text-slate-500">{currentDoctor?.specialization} • {currentDoctor?.hospital} • {currentDoctor?.room}</p>
          </div>
        </div>

        {/* Change Doctor Profile */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-500">Doctor Profile:</label>
          <select
            value={currentDoctor?.id}
            onChange={(e) => onSelectDoctor(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-800 text-sm font-semibold rounded-xl px-3 py-2 focus:ring-2 focus:ring-brand-500"
          >
            {doctors.map(d => (
              <option key={d.id} value={d.id}>{d.name} ({d.specialization})</option>
            ))}
          </select>
        </div>
      </div>

      {/* Action Feedback Banner */}
      {actionFeedback && (
        <div className={`p-4 rounded-xl text-sm font-medium flex items-center gap-3 transition-all ${
          actionFeedback.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>{actionFeedback.message}</span>
        </div>
      )}

      {/* Primary Action Controls Ribbon */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
        <h3 className="font-bold text-slate-900 text-base mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-brand-600" />
          Live OPD Consultation Controls
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Complete Consultation */}
          <button
            onClick={() => handleAction('COMPLETE_CONSULTATION')}
            className="flex flex-col items-center justify-center p-5 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold shadow-md hover:shadow-lg transition-all active:scale-95"
          >
            <CheckCircle2 className="w-7 h-7 mb-2" />
            <span className="text-sm">Complete Consultation</span>
            <span className="text-[11px] font-normal text-emerald-100 mt-0.5">Finish Token #{currentDoctor?.currentToken} & Call Next</span>
          </button>

          {/* Call Next Token */}
          <button
            onClick={() => handleAction('NEXT_TOKEN')}
            className="flex flex-col items-center justify-center p-5 rounded-2xl bg-gradient-to-br from-brand-600 to-brand-700 hover:from-brand-700 hover:to-brand-800 text-white font-bold shadow-md hover:shadow-lg transition-all active:scale-95"
          >
            <Play className="w-7 h-7 mb-2 fill-current" />
            <span className="text-sm">Call Next Token</span>
            <span className="text-[11px] font-normal text-blue-100 mt-0.5">Summon next waiting patient</span>
          </button>

          {/* Skip Patient */}
          <button
            onClick={() => handleAction('SKIP_PATIENT')}
            className="flex flex-col items-center justify-center p-5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold border border-slate-300 transition-all active:scale-95"
          >
            <SkipForward className="w-7 h-7 mb-2 text-slate-600" />
            <span className="text-sm">Skip Absent Patient</span>
            <span className="text-[11px] font-normal text-slate-500 mt-0.5">Mark Token #{currentDoctor?.currentToken} as skipped</span>
          </button>

          {/* Toggle Pause / Break */}
          <button
            onClick={() => handleAction('TOGGLE_PAUSE', pauseReasonInput)}
            className={`flex flex-col items-center justify-center p-5 rounded-2xl font-bold transition-all active:scale-95 ${
              currentDoctor?.isPaused
                ? 'bg-amber-600 text-white shadow-md'
                : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300'
            }`}
          >
            <Pause className="w-7 h-7 mb-2" />
            <span className="text-sm">{currentDoctor?.isPaused ? 'Resume OPD Queue' : 'Pause Queue / Break'}</span>
            <span className="text-[11px] font-normal opacity-90 mt-0.5">{currentDoctor?.isPaused ? 'Click to restart consultations' : 'Add 15m delay to patient ETA'}</span>
          </button>
        </div>

        {/* Secondary Tweaks: Avg Duration & Emergency Insert */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 pt-6 border-t border-slate-100">
          {/* Average Duration Control */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-slate-700 block">Avg Consultation Duration</span>
              <span className="text-[11px] text-slate-500">Currently: <strong>{currentDoctor?.avgDuration} minutes</strong> per patient</span>
            </div>
            <div className="flex items-center gap-1.5">
              {[6, 8, 10, 12, 15].map(d => (
                <button
                  key={d}
                  onClick={() => handleAction('UPDATE_DURATION', d)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition ${
                    currentDoctor?.avgDuration === d
                      ? 'bg-brand-600 text-white border-brand-600'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  {d}m
                </button>
              ))}
            </div>
          </div>

          {/* Add Emergency Patient */}
          <div className="p-4 rounded-2xl bg-red-50/50 border border-red-200 flex items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-red-900 block">Emergency Priority Case</span>
              <span className="text-[11px] text-red-700">Bypass standard queue for critical patient</span>
            </div>
            <button
              onClick={() => setShowEmergencyModal(true)}
              className="px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              Add Priority
            </button>
          </div>
        </div>
      </div>

      {/* Queue Roster Table */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Today's Appointment Queue Roster</h3>
            <p className="text-xs text-slate-500">All registered tokens for {currentDoctor?.name}</p>
          </div>
          <span className="text-xs bg-slate-100 text-slate-700 font-semibold px-3 py-1 rounded-full">
            Total in Queue: {currentDoctor?.queue?.length || 0}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider border-y border-slate-200">
              <tr>
                <th className="py-3 px-4">Token #</th>
                <th className="py-3 px-4">Patient Name</th>
                <th className="py-3 px-4">Slot Time</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Queue Status</th>
                <th className="py-3 px-4 text-right">Quick Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {currentDoctor?.queue?.map((item) => {
                const isInRoom = item.status === 'IN_ROOM';
                const isCompleted = item.status === 'COMPLETED';
                const isSkipped = item.status === 'SKIPPED';
                const isWaiting = item.status === 'WAITING';

                return (
                  <tr
                    key={item.token}
                    className={`transition-colors ${
                      isInRoom ? 'bg-emerald-50/70 font-semibold' : 'hover:bg-slate-50'
                    }`}
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      <span className={`inline-flex items-center justify-center w-8 h-8 rounded-xl ${
                        isInRoom ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-800'
                      }`}>
                        #{item.token}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-900 flex items-center gap-1.5">
                        {item.patientName}
                        {item.isCurrentDemoUser && (
                          <span className="text-[10px] bg-brand-100 text-brand-700 font-bold px-1.5 py-0.5 rounded">You</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-500 font-mono">{item.time}</td>
                    <td className="py-3.5 px-4">
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        item.priority === 'EMERGENCY'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {item.priority}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${
                        isInRoom
                          ? 'bg-emerald-100 text-emerald-800'
                          : isCompleted
                          ? 'bg-slate-200 text-slate-700'
                          : isSkipped
                          ? 'bg-red-100 text-red-700'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {isInRoom && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>}
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {isWaiting && (
                        <button
                          onClick={() => handleAction('SKIP_PATIENT', item.token)}
                          className="text-xs text-slate-500 hover:text-red-600 font-semibold px-2 py-1 rounded hover:bg-red-50 transition"
                        >
                          Skip
                        </button>
                      )}
                      {isInRoom && (
                        <button
                          onClick={() => handleAction('COMPLETE_CONSULTATION')}
                          className="text-xs text-emerald-700 font-bold bg-emerald-100 hover:bg-emerald-200 px-3 py-1 rounded-lg transition"
                        >
                          Complete
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Emergency Modal */}
      {showEmergencyModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-red-200">
            <div className="flex items-center gap-3 text-red-600 mb-3">
              <ShieldAlert className="w-6 h-6" />
              <h3 className="font-bold text-lg text-slate-900">Insert Emergency Priority Token</h3>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              This will place the critical patient immediately after the currently running consultation.
            </p>
            <form onSubmit={handleAddEmergency} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Patient Name / Condition:</label>
                <input
                  type="text"
                  placeholder="e.g. Ramesh Kumar (Acute Chest Pain)"
                  value={emergencyPatientName}
                  onChange={(e) => setEmergencyPatientName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
                  autoFocus
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowEmergencyModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-red-600 text-white hover:bg-red-700 shadow-sm"
                >
                  Confirm Priority Insertion
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
