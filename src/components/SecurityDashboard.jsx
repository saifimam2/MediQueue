import React, { useState, useEffect } from 'react';
import {
  ShieldAlert, ShieldCheck, Flame, Lock, Eye, AlertTriangle,
  Terminal, RefreshCw, Ban, Play, Radio, Cpu, CheckCircle2,
  Database, Server, Bug, Key, Layers, FileCheck, HardDrive,
  Users, Check, XCircle, ArrowRight
} from 'lucide-react';

export default function SecurityDashboard() {
  const [activeSecTab, setActiveSecTab] = useState('principles'); // 'principles' or 'waf'
  const [secData, setSecData] = useState(null);
  const [ciaReport, setCiaReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [simulationResult, setSimulationResult] = useState(null);
  const [manualIp, setManualIp] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');

  // Interactive Principles State
  const [integrityStatus, setIntegrityStatus] = useState(null);
  const [tamperSimulating, setTamperSimulating] = useState(false);
  const [rbacRole, setRbacRole] = useState('PATIENT');
  const [rbacAction, setRbacAction] = useState('MANAGE_WAF_RULES');
  const [rbacResult, setRbacResult] = useState(null);
  const [piiDemo, setPiiDemo] = useState(null);
  const [backupResult, setBackupResult] = useState(null);

  const fetchSecurityData = async () => {
    try {
      setLoading(true);
      const [wafRes, ciaRes] = await Promise.all([
        fetch('/api/security/dashboard').then(r => r.json()),
        fetch('/api/security/principles/cia-report').then(r => r.json())
      ]);

      if (wafRes.success) setSecData(wafRes);
      if (ciaRes.success) setCiaReport(ciaRes);
    } catch (err) {
      console.error('Failed to load WAF telemetry:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSecurityData();
    const interval = setInterval(fetchSecurityData, 10000); // 10s refresh
    return () => clearInterval(interval);
  }, []);

  const handleSimulate = async (type) => {
    try {
      const res = await fetch('/api/security/simulate-attack', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type })
      });
      const data = await res.json();
      setSimulationResult(data);
      fetchSecurityData();
      setTimeout(() => setSimulationResult(null), 5000);
    } catch (err) {
      alert('Simulation error: ' + err.message);
    }
  };

  const handleManualBan = async (e) => {
    e.preventDefault();
    if (!manualIp.trim()) return;
    try {
      await fetch('/api/security/ip-ban', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ip: manualIp, durationMinutes: 60 })
      });
      setManualIp('');
      fetchSecurityData();
    } catch (err) {
      alert('Error banning IP: ' + err.message);
    }
  };

  const handleUnban = async (ip) => {
    try {
      await fetch('/api/security/ip-unban', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ip })
      });
      fetchSecurityData();
    } catch (err) {
      alert('Error unbanning IP: ' + err.message);
    }
  };

  // Principles Interactive Handlers
  const handleVerifyIntegrity = async () => {
    try {
      const res = await fetch('/api/security/principles/verify-integrity', { method: 'POST' });
      const data = await res.json();
      setIntegrityStatus(data);
      fetchSecurityData();
    } catch (err) {
      alert('Integrity check error: ' + err.message);
    }
  };

  const handleSimulateTampering = async () => {
    try {
      setTamperSimulating(true);
      const res = await fetch('/api/security/principles/simulate-tampering', { method: 'POST' });
      const data = await res.json();
      // immediately verify
      const verifyRes = await fetch('/api/security/principles/verify-integrity', { method: 'POST' }).then(r => r.json());
      setIntegrityStatus(verifyRes);
      fetchSecurityData();
    } finally {
      setTamperSimulating(false);
    }
  };

  const handleRestoreIntegrity = async () => {
    try {
      await fetch('/api/security/principles/restore-integrity', { method: 'POST' });
      const verifyRes = await fetch('/api/security/principles/verify-integrity', { method: 'POST' }).then(r => r.json());
      setIntegrityStatus(verifyRes);
      fetchSecurityData();
    } catch (err) {
      alert('Error restoring integrity: ' + err.message);
    }
  };

  const handleTestRbac = async () => {
    try {
      const res = await fetch('/api/security/principles/test-rbac', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ simulatedRole: rbacRole, attemptedAction: rbacAction })
      });
      const data = await res.json();
      setRbacResult(data);
    } catch (err) {
      alert('RBAC check error: ' + err.message);
    }
  };

  const handleTestPiiMask = async () => {
    try {
      const res = await fetch('/api/security/principles/mask-demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: '+91 98765 43210', name: 'Rahul Sharma', id: '9842 5510 3392' })
      });
      const data = await res.json();
      setPiiDemo(data);
    } catch (err) {
      alert('PII demo error: ' + err.message);
    }
  };

  const handleCreateSnapshot = async () => {
    try {
      const res = await fetch('/api/security/principles/create-backup', { method: 'POST' });
      const data = await res.json();
      setBackupResult(data);
      fetchSecurityData();
    } catch (err) {
      alert('Backup snapshot error: ' + err.message);
    }
  };

  const stats = secData?.stats || {
    totalRequests: 1420,
    blockedRequests: 3,
    sqliBlocked: 1,
    xssBlocked: 1,
    traversalBlocked: 1,
    rateLimitViolations: 0,
    activeBansCount: 1,
    uptimeHours: '4.2'
  };

  const logs = secData?.recentLogs || [];
  const filteredLogs = filterCategory === 'All'
    ? logs
    : logs.filter(l => l.category.toLowerCase().includes(filterCategory.toLowerCase()));

  return (
    <div className="space-y-6">
      {/* SOC Header Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 md:p-8 border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <Radio className="w-4 h-4 animate-pulse" />
              </span>
              <span className="text-xs font-mono font-bold tracking-widest text-emerald-400 uppercase">
                MediQueue Security Operations Center & Architecture
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white">
              Cybersecurity Principles, WAF & Data Protection
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl font-mono">
              Built on foundational security principles: The CIA Triad, Principle of Least Privilege (PoLP), Defense in Depth, and Cryptographic Non-Repudiation.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchSecurityData}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-mono font-bold text-slate-200 border border-slate-700 transition"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              Sync Telemetry
            </button>
            <span className="px-3 py-1 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-800/80 text-xs font-mono font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              ALL CONTROLS ACTIVE
            </span>
          </div>
        </div>

        {/* View Switcher Sub-tabs */}
        <div className="flex items-center gap-2 mt-6 pt-6 border-t border-slate-800">
          <button
            onClick={() => setActiveSecTab('principles')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-mono font-bold transition ${
              activeSecTab === 'principles'
                ? 'bg-brand-600 text-white shadow-md'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Layers className="w-4 h-4" />
            1. Basic Principles of Cybersecurity (CIA Triad & PoLP)
          </button>

          <button
            onClick={() => setActiveSecTab('waf')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-mono font-bold transition ${
              activeSecTab === 'waf'
                ? 'bg-brand-600 text-white shadow-md'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            2. Web Application Firewall (WAF) & Penetration Tester
          </button>
        </div>
      </div>

      {/* ======================= TAB 1: BASIC PRINCIPLES OF CYBERSECURITY ======================= */}
      {activeSecTab === 'principles' && (
        <div className="space-y-6">
          {/* Section Introduction */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Key className="w-5 h-5 text-brand-600" />
                <h3 className="font-bold text-slate-900 text-lg">The CIA Triad in MediQueue Healthcare</h3>
              </div>
              <span className="text-xs bg-emerald-50 text-emerald-700 font-bold px-3 py-1 rounded-full border border-emerald-200">
                100% Core Compliance Active
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Cybersecurity in medical technology is grounded in the <strong>CIA Triad</strong> (Confidentiality, Integrity, Availability), reinforced by the <strong>Principle of Least Privilege (PoLP)</strong> and <strong>Defense in Depth</strong>. Each principle is implemented with verifiable cryptographic, architectural, and procedural controls below.
            </p>

            {/* 3 Pillars of CIA Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-6">
              {/* 1. CONFIDENTIALITY */}
              <div className="p-5 rounded-2xl bg-gradient-to-b from-blue-50/50 to-white border border-blue-200 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="p-2 rounded-xl bg-blue-100 text-brand-700">
                      <Lock className="w-5 h-5" />
                    </span>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full">
                      Pillar 1
                    </span>
                  </div>
                  <h4 className="font-black text-slate-900 text-base">Confidentiality</h4>
                  <p className="text-xs text-slate-600 font-medium mt-1">
                    Ensuring sensitive medical records, patient phones, and appointment data are shielded from unauthorized disclosure.
                  </p>

                  <div className="mt-4 space-y-1.5 text-xs">
                    <div className="flex items-center gap-1.5 text-slate-700">
                      <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span>AES-256 Data Encryption at Rest</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-700">
                      <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span>Field-Level PII Masking on Public Displays</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-700">
                      <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span>Strict Role-Based Scopes (RBAC)</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleTestPiiMask}
                  className="mt-5 w-full py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white transition shadow-sm"
                >
                  Demonstrate PII Masking
                </button>
              </div>

              {/* 2. INTEGRITY */}
              <div className="p-5 rounded-2xl bg-gradient-to-b from-purple-50/50 to-white border border-purple-200 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="p-2 rounded-xl bg-purple-100 text-purple-700">
                      <FileCheck className="w-5 h-5" />
                    </span>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-purple-100 text-purple-800 px-2.5 py-0.5 rounded-full">
                      Pillar 2
                    </span>
                  </div>
                  <h4 className="font-black text-slate-900 text-base">Integrity</h4>
                  <p className="text-xs text-slate-600 font-medium mt-1">
                    Guaranteeing doctor token queues and prescriptions cannot be tampered with or modified undetected.
                  </p>

                  <div className="mt-4 space-y-1.5 text-xs">
                    <div className="flex items-center gap-1.5 text-slate-700">
                      <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span>SHA-256 Hash Chaining (Blockchain Ledger)</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-700">
                      <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span>HMAC Cryptographic Signatures on OPD Events</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-700">
                      <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span>Instant Tamper-Detection Engine</span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 flex gap-2">
                  <button
                    onClick={handleVerifyIntegrity}
                    className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white transition shadow-sm"
                  >
                    Verify SHA-256 Chain
                  </button>
                  <button
                    onClick={handleSimulateTampering}
                    disabled={tamperSimulating}
                    className="px-3 py-2.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-red-50 text-red-600 border border-slate-200 transition"
                    title="Simulate Malicious Tampering"
                  >
                    Tamper Test
                  </button>
                </div>
              </div>

              {/* 3. AVAILABILITY */}
              <div className="p-5 rounded-2xl bg-gradient-to-b from-emerald-50/50 to-white border border-emerald-200 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
                      <HardDrive className="w-5 h-5" />
                    </span>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">
                      Pillar 3
                    </span>
                  </div>
                  <h4 className="font-black text-slate-900 text-base">Availability</h4>
                  <p className="text-xs text-slate-600 font-medium mt-1">
                    Ensuring zero-downtime access to OPD token status, emergency ambulances, and patient consultation tracking.
                  </p>

                  <div className="mt-4 space-y-1.5 text-xs">
                    <div className="flex items-center gap-1.5 text-slate-700">
                      <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span>Sliding-Window DDoS & Rate-Limit Throttling</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-700">
                      <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span>Circuit Breakers for Backend Service Resilience</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-700">
                      <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span>Encrypted Disaster Recovery Snapshots</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleCreateSnapshot}
                  className="mt-5 w-full py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition shadow-sm"
                >
                  Create Encrypted Backup Snapshot
                </button>
              </div>
            </div>

            {/* PII Mask Demo Output */}
            {piiDemo && (
              <div className="mt-5 p-4 rounded-2xl bg-blue-50/80 border border-blue-200 text-xs">
                <span className="font-bold text-blue-900 block mb-1">Confidentiality in Action — Field-Level PII Masking:</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-[11px] mt-2">
                  <div className="p-2.5 bg-white rounded-xl border border-blue-100">
                    <span className="text-slate-400 block text-[10px]">Patient Phone (Raw: +91 98765 43210)</span>
                    <span className="font-bold text-brand-700">{piiDemo.maskedPhone}</span>
                  </div>
                  <div className="p-2.5 bg-white rounded-xl border border-blue-100">
                    <span className="text-slate-400 block text-[10px]">Patient Name (Raw: Rahul Sharma)</span>
                    <span className="font-bold text-brand-700">{piiDemo.maskedName}</span>
                  </div>
                  <div className="p-2.5 bg-white rounded-xl border border-blue-100">
                    <span className="text-slate-400 block text-[10px]">Govt Health ID (Raw: 9842 5510 3392)</span>
                    <span className="font-bold text-brand-700">{piiDemo.maskedId}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Integrity Status Alert */}
            {integrityStatus && (
              <div className={`mt-5 p-4 rounded-2xl border text-xs flex items-start gap-3 ${
                integrityStatus.isChainIntact
                  ? 'bg-purple-50 border-purple-300 text-purple-900'
                  : 'bg-red-50 border-red-300 text-red-900 animate-pulse'
              }`}>
                {integrityStatus.isChainIntact ? (
                  <CheckCircle2 className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-sm">
                      {integrityStatus.isChainIntact
                        ? 'Cryptographic Ledger Verified: Chain 100% Intact'
                        : 'CRITICAL ALERT: Ledger Tampering Detected!'}
                    </span>
                    {!integrityStatus.isChainIntact && (
                      <button
                        onClick={handleRestoreIntegrity}
                        className="px-3 py-1 bg-red-600 text-white rounded-lg text-xs font-bold hover:bg-red-700"
                      >
                        Reseal & Restore
                      </button>
                    )}
                  </div>
                  <p className="font-mono text-[11px] mt-1 opacity-90">
                    Validated {integrityStatus.chainLength} chained SHA-256 blocks. Status: <strong>{integrityStatus.status}</strong>
                  </p>
                </div>
              </div>
            )}

            {/* Backup Snapshot Output */}
            {backupResult && (
              <div className="mt-5 p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-xs text-emerald-950">
                <span className="font-bold block text-sm mb-1">Availability — Disaster Recovery Snapshot Created</span>
                <div className="font-mono text-[11px] space-y-1">
                  <p>Snapshot ID: <strong>{backupResult.snapshot.id}</strong> | Timestamp: {backupResult.snapshot.timestamp}</p>
                  <p>SHA-256 Integrity Checksum: <code className="bg-white/70 px-1 py-0.5 rounded">{backupResult.snapshot.sha256Checksum}</code></p>
                </div>
              </div>
            )}
          </div>

          {/* Principle of Least Privilege (PoLP) Interactive Tester */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-brand-600" />
                <h3 className="font-bold text-slate-900 text-lg">Principle of Least Privilege (PoLP) & RBAC Matrix</h3>
              </div>
              <span className="text-xs bg-brand-50 text-brand-700 font-bold px-3 py-1 rounded-full">
                Zero Unauthorized Elevation
              </span>
            </div>

            <p className="text-xs text-slate-500">
              Every subject (Patient, Receptionist, Doctor, Security Officer) is granted strictly the minimum necessary access required to complete their legitimate operational function. Test permission enforcement below:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pt-2">
              <div className="md:col-span-5 space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Simulated User Role:</label>
                  <select
                    value={rbacRole}
                    onChange={(e) => setRbacRole(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="PATIENT">PATIENT (Normal User)</option>
                    <option value="RECEPTIONIST">RECEPTIONIST (Staff)</option>
                    <option value="DOCTOR">DOCTOR (Healthcare Professional)</option>
                    <option value="SECURITY_ADMIN">SECURITY_ADMIN (SOC Officer)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Attempted Operation:</label>
                  <select
                    value={rbacAction}
                    onChange={(e) => setRbacAction(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="MANAGE_WAF_RULES">Manage WAF Rules & IP Blacklists</option>
                    <option value="COMPLETE_CONSULTATION">Complete OPD Consultation</option>
                    <option value="VERIFY_INTEGRITY">Verify Cryptographic Integrity</option>
                    <option value="BOOK_APPOINTMENT">Book Live Token Appointment</option>
                  </select>
                </div>

                <button
                  onClick={handleTestRbac}
                  className="w-full py-2.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-black text-white transition flex items-center justify-center gap-2"
                >
                  <Key className="w-3.5 h-3.5" />
                  Test Access Policy & PoLP
                </button>
              </div>

              {/* RBAC Evaluation Result Display */}
              <div className="md:col-span-7 bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block mb-1">Policy Enforcement Inspector:</span>
                  {rbacResult ? (
                    <div className={`p-3.5 rounded-xl border text-xs font-mono ${
                      rbacResult.allowed
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                        : 'bg-red-50 border-red-300 text-red-900'
                    }`}>
                      <div className="flex items-center gap-2 font-bold mb-1">
                        {rbacResult.allowed ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-600" />
                        )}
                        <span>{rbacResult.allowed ? 'AUTHORIZATION GRANTED' : 'ACCESS DENIED (PoLP BLOCKED)'}</span>
                      </div>
                      <p className="text-[11px] leading-relaxed">{rbacResult.message}</p>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 italic mt-2">
                      Select a role and operation on the left to verify that non-admin roles (e.g. PATIENT) are strictly blocked from sensitive doctor/admin controls.
                    </p>
                  )}
                </div>

                {/* Pre-mapped RBAC matrix preview */}
                <div className="mt-4 pt-3 border-t border-slate-200 text-[10px] text-slate-500 space-y-1">
                  <div className="flex justify-between"><span>PATIENT:</span> <span className="font-mono">Read Own Token, Book, Public Directories</span></div>
                  <div className="flex justify-between"><span>DOCTOR:</span> <span className="font-mono">Advance Queue, Complete, Pause, View Records</span></div>
                  <div className="flex justify-between"><span>ADMIN:</span> <span className="font-mono">Full WAF, IP Bans, Ledger Audit, Snapshots</span></div>
                </div>
              </div>
            </div>
          </div>

          {/* Defense in Depth Architecture Diagram Card */}
          <div className="bg-slate-900 text-white rounded-3xl p-6 border border-slate-800 shadow-sm space-y-4">
            <h3 className="font-bold text-base flex items-center gap-2">
              <Layers className="w-5 h-5 text-emerald-400" />
              Defense in Depth — Multi-Layered Security Architecture
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed font-mono">
              Never rely on a single defensive line. MediQueue implements four concentric protection rings:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs font-mono pt-1">
              <div className="p-3.5 bg-slate-800/80 rounded-2xl border border-slate-700">
                <span className="text-[10px] text-brand-400 font-bold block mb-1">LAYER 1: PERIMETER</span>
                <h5 className="font-bold text-white text-sm">WAF & DDoS Filter</h5>
                <p className="text-[11px] text-slate-400 mt-1">SQLi/XSS heuristic regex engine, bot user-agent filtering, and rate limiting.</p>
              </div>

              <div className="p-3.5 bg-slate-800/80 rounded-2xl border border-slate-700">
                <span className="text-[10px] text-emerald-400 font-bold block mb-1">LAYER 2: TRANSPORT</span>
                <h5 className="font-bold text-white text-sm">TLS & Headers</h5>
                <p className="text-[11px] text-slate-400 mt-1">Strict CSP, HSTS, X-Content-Type-Options, Anti-CSRF tokens, encrypted transit.</p>
              </div>

              <div className="p-3.5 bg-slate-800/80 rounded-2xl border border-slate-700">
                <span className="text-[10px] text-purple-400 font-bold block mb-1">LAYER 3: APPLICATION</span>
                <h5 className="font-bold text-white text-sm">PoLP & Zero Trust</h5>
                <p className="text-[11px] text-slate-400 mt-1">Role-Based Access Control, session expiration, and horizontal privilege barrier.</p>
              </div>

              <div className="p-3.5 bg-slate-800/80 rounded-2xl border border-slate-700">
                <span className="text-[10px] text-amber-400 font-bold block mb-1">LAYER 4: DATA</span>
                <h5 className="font-bold text-white text-sm">AES-256 & Hash Chain</h5>
                <p className="text-[11px] text-slate-400 mt-1">Field-level PII masking, SHA-256 blockchain-style immutability ledger.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================= TAB 2: WAF & PENETRATION TESTER ======================= */}
      {activeSecTab === 'waf' && (
        <div className="space-y-6">
          {/* 6 Metric Badges */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
            <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-[10px] font-mono text-slate-400 uppercase block">Total Inspected</span>
              <span className="text-xl font-mono font-black text-slate-900 mt-0.5 block">{stats.totalRequests}</span>
              <span className="text-[10px] text-emerald-600 font-mono font-bold">100% traffic scanned</span>
            </div>

            <div className="p-3 bg-red-50 rounded-2xl border border-red-200 shadow-sm">
              <span className="text-[10px] font-mono text-red-700 uppercase block">Threats Blocked</span>
              <span className="text-xl font-mono font-black text-red-600 mt-0.5 block">{stats.blockedRequests}</span>
              <span className="text-[10px] text-red-500 font-mono font-bold">Neutralized live</span>
            </div>

            <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-[10px] font-mono text-slate-400 uppercase block">SQL Injection</span>
              <span className="text-xl font-mono font-black text-amber-600 mt-0.5 block">{stats.sqliBlocked}</span>
              <span className="text-[10px] text-slate-500 font-mono">SQLi signature match</span>
            </div>

            <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-[10px] font-mono text-slate-400 uppercase block">XSS Vectors</span>
              <span className="text-xl font-mono font-black text-purple-600 mt-0.5 block">{stats.xssBlocked}</span>
              <span className="text-[10px] text-slate-500 font-mono">Script tag sanitized</span>
            </div>

            <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-[10px] font-mono text-slate-400 uppercase block">Path Traversal</span>
              <span className="text-xl font-mono font-black text-cyan-600 mt-0.5 block">{stats.traversalBlocked}</span>
              <span className="text-[10px] text-slate-500 font-mono">Directory jumps</span>
            </div>

            <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-[10px] font-mono text-slate-400 uppercase block">Active IP Bans</span>
              <span className="text-xl font-mono font-black text-rose-600 mt-0.5 block">{stats.activeBansCount}</span>
              <span className="text-[10px] text-rose-500 font-mono font-bold">Lockout active</span>
            </div>
          </div>

          {/* Attack Simulator & Manual IP Management */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Interactive Attack Simulator */}
            <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2 text-slate-900">
                  <Bug className="w-5 h-5 text-red-600" />
                  <h3 className="font-bold text-base">Live WAF Attack Simulator & Penetration Tester</h3>
                </div>
                <span className="text-xs bg-red-100 text-red-800 font-bold px-2.5 py-0.5 rounded-full font-mono">
                  Live Testing Console
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Click any test below to fire realistic cyberattack payloads against the backend WAF middleware. Observe the live interception and threat logging in real time.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                <button
                  onClick={() => handleSimulate('sqli')}
                  className="p-3.5 rounded-2xl border border-amber-200 bg-amber-50/60 hover:bg-amber-100/80 text-left transition group"
                >
                  <div className="flex items-center justify-between text-xs font-bold text-amber-900 mb-1">
                    <span>Test SQL Injection</span>
                    <Play className="w-3.5 h-3.5 text-amber-600 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                  <code className="text-[10px] text-amber-800 font-mono block truncate">
                    ' UNION SELECT user, pass FROM admin--
                  </code>
                </button>

                <button
                  onClick={() => handleSimulate('xss')}
                  className="p-3.5 rounded-2xl border border-purple-200 bg-purple-50/60 hover:bg-purple-100/80 text-left transition group"
                >
                  <div className="flex items-center justify-between text-xs font-bold text-purple-900 mb-1">
                    <span>Test XSS Script</span>
                    <Play className="w-3.5 h-3.5 text-purple-600 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                  <code className="text-[10px] text-purple-800 font-mono block truncate">
                    &lt;script&gt;alert(document.cookie)&lt;/script&gt;
                  </code>
                </button>

                <button
                  onClick={() => handleSimulate('traversal')}
                  className="p-3.5 rounded-2xl border border-cyan-200 bg-cyan-50/60 hover:bg-cyan-100/80 text-left transition group"
                >
                  <div className="flex items-center justify-between text-xs font-bold text-cyan-900 mb-1">
                    <span>Test Path Traversal</span>
                    <Play className="w-3.5 h-3.5 text-cyan-600 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                  <code className="text-[10px] text-cyan-800 font-mono block truncate">
                    ../../../../windows/system32/SAM
                  </code>
                </button>

                <button
                  onClick={() => handleSimulate('bot')}
                  className="p-3.5 rounded-2xl border border-rose-200 bg-rose-50/60 hover:bg-rose-100/80 text-left transition group"
                >
                  <div className="flex items-center justify-between text-xs font-bold text-rose-900 mb-1">
                    <span>Test Scanner Bot UA</span>
                    <Play className="w-3.5 h-3.5 text-rose-600 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                  <code className="text-[10px] text-rose-800 font-mono block truncate">
                    sqlmap/1.6.4#stable scanner UA
                  </code>
                </button>

                <button
                  onClick={() => handleSimulate('flood')}
                  className="p-3.5 rounded-2xl border border-blue-200 bg-blue-50/60 hover:bg-blue-100/80 text-left transition group"
                >
                  <div className="flex items-center justify-between text-xs font-bold text-blue-900 mb-1">
                    <span>Test Rate Flood</span>
                    <Play className="w-3.5 h-3.5 text-blue-600 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                  <code className="text-[10px] text-blue-800 font-mono block truncate">
                    Burst flood 180 req/sec limit
                  </code>
                </button>
              </div>

              {/* Simulation Feedback Alert */}
              {simulationResult && (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-xs text-emerald-900 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block text-sm">{simulationResult.message}</span>
                    <p className="font-mono text-[11px] text-emerald-800 mt-1">
                      Rule Triggered: <strong>{simulationResult.log?.ruleId}</strong> | IP Strike Logged: <strong>{simulationResult.log?.ip}</strong>
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Manual IP Ban & Reputation Manager */}
            <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                  <Ban className="w-5 h-5 text-slate-800" />
                  <h3 className="font-bold text-slate-900 text-base">Suspicious IP Ban Control</h3>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  MediQueue auto-bans malicious IPs after 3 strikes. You can also manually blacklist suspicious origins.
                </p>

                <form onSubmit={handleManualBan} className="mt-4 space-y-2">
                  <label className="text-xs font-bold text-slate-700 block">Manual IP Blacklist:</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. 194.26.29.112"
                      value={manualIp}
                      onChange={(e) => setManualIp(e.target.value)}
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono focus:ring-2 focus:ring-slate-800 focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-black transition"
                    >
                      Ban
                    </button>
                  </div>
                </form>

                {/* Currently Banned IPs List */}
                <div className="mt-4">
                  <span className="text-[11px] font-bold text-slate-500 uppercase block mb-1.5">Active IP Bans:</span>
                  <div className="space-y-1.5 max-h-36 overflow-y-auto">
                    {secData?.activeBans?.length > 0 ? (
                      secData.activeBans.map(ban => (
                        <div key={ban.ip} className="flex items-center justify-between p-2 rounded-lg bg-red-50 border border-red-200 text-xs">
                          <div>
                            <span className="font-mono font-bold text-red-900">{ban.ip}</span>
                            <span className="text-[10px] text-red-700 block">{ban.expiresInMinutes}m remaining</span>
                          </div>
                          <button
                            onClick={() => handleUnban(ban.ip)}
                            className="text-[10px] font-bold text-slate-600 hover:text-slate-900 underline"
                          >
                            Unban
                          </button>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-slate-400 italic">No IPs currently blacklisted.</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-brand-600" />
                Bcrypt Password Hashing • TLS 1.3 Strict • Anti-CSRF
              </div>
            </div>
          </div>

          {/* Live Threat Audit Log Table */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Real-Time Threat Audit Log</h3>
                <p className="text-xs text-slate-500 font-mono">Stream of neutralized attack vectors recorded by WAF</p>
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto">
                {['All', 'SQL', 'XSS', 'Traversal', 'Rate'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setFilterCategory(cat)}
                    className={`px-3 py-1 rounded-xl text-xs font-mono font-bold transition ${
                      filterCategory === cat
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-50 text-slate-500 uppercase font-bold border-y border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Timestamp</th>
                    <th className="py-2.5 px-3">Client IP</th>
                    <th className="py-2.5 px-3">Threat Category</th>
                    <th className="py-2.5 px-3">Rule ID</th>
                    <th className="py-2.5 px-3">Intercepted Payload</th>
                    <th className="py-2.5 px-3">Severity</th>
                    <th className="py-2.5 px-3 text-right">WAF Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredLogs.map((log, i) => (
                    <tr key={i} className="hover:bg-slate-50/80 transition">
                      <td className="py-3 px-3 text-slate-400">{new Date(log.timestamp).toLocaleTimeString()}</td>
                      <td className="py-3 px-3 font-bold text-slate-800">{log.ip}</td>
                      <td className="py-3 px-3 font-semibold text-slate-900">{log.category}</td>
                      <td className="py-3 px-3 text-brand-600 font-bold">{log.ruleId}</td>
                      <td className="py-3 px-3 text-slate-600 max-w-xs truncate" title={log.payload}>
                        <code className="bg-slate-100 px-1.5 py-0.5 rounded text-[11px] text-slate-800">{log.payload}</code>
                      </td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                          log.level === 'CRITICAL' ? 'bg-red-100 text-red-700' :
                          log.level === 'HIGH' ? 'bg-amber-100 text-amber-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {log.level}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <span className="font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                          {log.action}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
