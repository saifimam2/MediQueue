import React, { useState } from 'react';
import {
  FileText, Pill, CheckSquare, Square, Upload,
  PlusCircle, AlertTriangle, ShieldCheck, CheckCircle2,
  Trash2, Info, Camera
} from 'lucide-react';

export default function ChecklistSection({ checklist, onTogglePacked, onAddItem }) {
  const [activeTab, setActiveTab] = useState('documents'); // 'documents' or 'medicines'

  // Add new medicine form state
  const [showAddMedModal, setShowAddMedModal] = useState(false);
  const [medName, setMedName] = useState('');
  const [medDosage, setMedDosage] = useState('');
  const [medCategory, setMedCategory] = useState('Prescribed Daily');
  const [medNote, setMedNote] = useState('');

  // Add new document form state
  const [showAddDocModal, setShowAddDocModal] = useState(false);
  const [docTitle, setDocTitle] = useState('');
  const [docCategory, setDocCategory] = useState('Lab Report');

  // File upload simulation
  const [uploadedFiles, setUploadedFiles] = useState([
    { name: 'Lipid_Profile_Oct2026.pdf', size: '1.2 MB', date: 'Oct 24, 2026' },
    { name: 'ECG_Baseline_Chart.jpg', size: '2.4 MB', date: 'Sep 12, 2026' }
  ]);

  const totalDocs = checklist.documents?.length || 0;
  const packedDocs = checklist.documents?.filter(d => d.packed).length || 0;

  const totalMeds = checklist.medicines?.length || 0;
  const packedMeds = checklist.medicines?.filter(m => m.packed).length || 0;

  const overallPacked = packedDocs + packedMeds;
  const overallTotal = totalDocs + totalMeds;
  const progressPercent = overallTotal > 0 ? Math.round((overallPacked / overallTotal) * 100) : 0;

  const handleCreateMedicine = (e) => {
    e.preventDefault();
    if (!medName.trim()) return;
    onAddItem({
      type: 'medicine',
      name: medName,
      dosage: medDosage,
      category: medCategory,
      note: medNote
    });
    setMedName('');
    setMedDosage('');
    setMedNote('');
    setShowAddMedModal(false);
  };

  const handleCreateDoc = (e) => {
    e.preventDefault();
    if (!docTitle.trim()) return;
    onAddItem({
      type: 'document',
      name: docTitle,
      category: docCategory
    });
    setDocTitle('');
    setShowAddDocModal(false);
  };

  const handleSimulateUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFiles(prev => [
        {
          name: file.name,
          size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
          date: 'Just now'
        },
        ...prev
      ]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Important Medical Guideline Disclaimer (Strict Requirement) */}
      <div className="bg-amber-50 border-l-4 border-amber-500 p-4 md:p-5 rounded-2xl flex items-start gap-3.5 shadow-sm">
        <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="text-xs text-amber-900 leading-relaxed">
          <p className="font-bold text-sm text-amber-950">Important Medical Safety Disclaimer</p>
          <p className="mt-1">
            MediQueue <strong>never</strong> automatically prescribes or recommends medicines. Only medicines prescribed by a qualified physician or manually cataloged by you are displayed here. Do not start, stop, or alter dosages without clinical consultation from a certified doctor.
          </p>
        </div>
      </div>

      {/* Progress & Overview Card */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-3 py-1 rounded-full">
              Preparation Before Leaving Home
            </span>
            <h2 className="text-2xl font-black text-slate-900 mt-2">
              Medicine & Medical Document Checklist
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Avoid missing critical reports or regular doses at the hospital. Mark items as packed before stepping out.
            </p>
          </div>

          {/* Progress Ring / Bar */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 min-w-[200px] text-center">
            <span className="text-[11px] font-bold text-slate-500 uppercase block">Packing Readiness</span>
            <div className="text-3xl font-black text-brand-600 my-1 font-mono">
              {progressPercent}%
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mt-1">
              <div
                className="bg-brand-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
            <span className="text-[10px] text-slate-500 block mt-1.5 font-medium">
              {overallPacked} of {overallTotal} items verified and packed
            </span>
          </div>
        </div>

        {/* Tab selection */}
        <div className="flex items-center gap-3 mt-6">
          <button
            onClick={() => setActiveTab('documents')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition ${
              activeTab === 'documents'
                ? 'bg-brand-600 text-white shadow-md'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            Medical Documents ({packedDocs}/{totalDocs})
          </button>

          <button
            onClick={() => setActiveTab('medicines')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition ${
              activeTab === 'medicines'
                ? 'bg-brand-600 text-white shadow-md'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Pill className="w-4 h-4" />
            Current Medicines & Allergies ({packedMeds}/{totalMeds})
          </button>
        </div>
      </div>

      {/* 1. DOCUMENTS SECTION */}
      {activeTab === 'documents' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Checklist items */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">Required Hospital Documents</h3>
              <button
                onClick={() => setShowAddDocModal(true)}
                className="flex items-center gap-1.5 text-xs font-bold text-brand-600 hover:text-brand-800"
              >
                <PlusCircle className="w-4 h-4" /> Add Document
              </button>
            </div>

            <div className="space-y-3">
              {checklist.documents?.map(doc => (
                <div
                  key={doc.id}
                  onClick={() => onTogglePacked(doc.id, 'document')}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                    doc.packed
                      ? 'border-emerald-300 bg-emerald-50/50 text-slate-900'
                      : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {doc.packed ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                    ) : (
                      <Square className="w-5 h-5 text-slate-400 flex-shrink-0" />
                    )}
                    <div>
                      <h4 className={`text-sm font-bold ${doc.packed ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                        {doc.title}
                      </h4>
                      <span className="text-[11px] text-slate-500 font-medium">Category: {doc.category}</span>
                    </div>
                  </div>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    doc.packed ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {doc.packed ? 'PACKED' : 'PENDING'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Secure Document Upload Simulation */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <Upload className="w-5 h-5 text-brand-600" />
                <h3 className="font-bold text-slate-900 text-base">Upload Past Prescriptions & Scans</h3>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                Encrypted digital copies accessible to your consulting doctor inside the OPD room.
              </p>

              {/* Upload trigger box */}
              <label className="mt-4 border-2 border-dashed border-brand-300 hover:border-brand-500 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer bg-brand-50/40 transition">
                <FileText className="w-8 h-8 text-brand-600 mb-2" />
                <span className="text-xs font-bold text-brand-800">Click to upload report or prescription</span>
                <span className="text-[10px] text-slate-500 mt-1">PDF, JPG, PNG up to 15MB</span>
                <input
                  type="file"
                  onChange={handleSimulateUpload}
                  className="hidden"
                  accept=".pdf,image/*"
                />
              </label>

              {/* Uploaded documents list */}
              <div className="mt-4 space-y-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Attached Reports:</span>
                {uploadedFiles.map((file, i) => (
                  <div key={i} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                    <div className="flex items-center gap-2 truncate">
                      <FileText className="w-4 h-4 text-brand-600 flex-shrink-0" />
                      <span className="font-semibold text-slate-800 truncate">{file.name}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono flex-shrink-0">{file.size}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-slate-100 text-[11px] text-slate-400 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              HIPAA compliant & protected by MediQueue WAF access controls.
            </div>
          </div>
        </div>
      )}

      {/* 2. MEDICINES SECTION */}
      {activeTab === 'medicines' && (
        <div className="space-y-6">
          {/* Allergies Warning Strip */}
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="p-2 bg-red-100 text-red-700 rounded-xl">
                <AlertTriangle className="w-5 h-5" />
              </span>
              <div>
                <span className="text-xs font-bold text-red-900 uppercase">Known Drug Allergy Record</span>
                <p className="text-xs font-semibold text-red-800 mt-0.5">{checklist.allergies}</p>
              </div>
            </div>
            <span className="text-xs bg-red-200 text-red-900 font-bold px-2.5 py-1 rounded-lg">CRITICAL ALERT</span>
          </div>

          {/* Medicines Grid */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Current Prescribed Medicines</h3>
                <p className="text-xs text-slate-500">Take current doses or strips along to show during consultation.</p>
              </div>
              <button
                onClick={() => setShowAddMedModal(true)}
                className="flex items-center gap-1.5 text-xs font-bold bg-brand-600 text-white px-3.5 py-2 rounded-xl hover:bg-brand-700 shadow-sm"
              >
                <PlusCircle className="w-4 h-4" /> Add Medicine
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              {checklist.medicines?.map(med => (
                <div
                  key={med.id}
                  onClick={() => onTogglePacked(med.id, 'medicine')}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                    med.packed
                      ? 'border-emerald-400 bg-emerald-50/50 shadow-sm'
                      : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[10px] font-bold text-brand-700 bg-brand-100 px-2 py-0.5 rounded-md">
                        {med.category}
                      </span>
                      {med.packed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-400" />
                      )}
                    </div>

                    <h4 className={`text-base font-bold mt-2 ${med.packed ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                      {med.name}
                    </h4>
                    <p className="text-xs text-slate-600 font-medium mt-1">Dosage: {med.dosage}</p>
                    {med.note && (
                      <p className="text-[11px] text-slate-500 mt-2 bg-white/70 p-2 rounded-lg border border-slate-200/50">
                        Note: {med.note}
                      </p>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-mono text-[10px]">Tap to pack</span>
                    <span className={`font-bold px-2 py-0.5 rounded-full text-[10px] ${
                      med.packed ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                    }`}>
                      {med.packed ? 'PACKED IN BAG' : 'NOT PACKED'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Add Medicine Modal */}
      {showAddMedModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-1">Add Current Prescribed Medicine</h3>
            <p className="text-xs text-slate-500 mb-4">Catalog your prescribed medicine to receive packing alerts.</p>

            <form onSubmit={handleCreateMedicine} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Medicine Name & Strength:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Metformin 500mg"
                  value={medName}
                  onChange={(e) => setMedName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Dosage & Frequency:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 1 tablet twice daily after meals"
                  value={medDosage}
                  onChange={(e) => setMedDosage(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Category / Reason:</label>
                <select
                  value={medCategory}
                  onChange={(e) => setMedCategory(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-brand-500"
                >
                  <option>Blood Pressure</option>
                  <option>Diabetes</option>
                  <option>Cardiac / Heart</option>
                  <option>Antibiotic Course</option>
                  <option>Pain Relief (SOS)</option>
                  <option>Vitamins & Supplements</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Doctor Note / Caution:</label>
                <input
                  type="text"
                  placeholder="e.g. Take with warm water"
                  value={medNote}
                  onChange={(e) => setMedNote(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddMedModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-brand-600 text-white hover:bg-brand-700 shadow-sm"
                >
                  Add to Checklist
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Document Modal */}
      {showAddDocModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-1">Add Medical Document Reminder</h3>
            <p className="text-xs text-slate-500 mb-4">Set a reminder for important medical records.</p>

            <form onSubmit={handleCreateDoc} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Document Title:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Echocardiogram Report 2026"
                  value={docTitle}
                  onChange={(e) => setDocTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Category:</label>
                <select
                  value={docCategory}
                  onChange={(e) => setDocCategory(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-brand-500"
                >
                  <option>Lab Report</option>
                  <option>Radiology (X-Ray / MRI)</option>
                  <option>Previous Prescription</option>
                  <option>Discharge Summary</option>
                  <option>Insurance Policy / Card</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddDocModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-brand-600 text-white hover:bg-brand-700 shadow-sm"
                >
                  Save Document Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
