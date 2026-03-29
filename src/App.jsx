import { useState, useEffect } from "react";

// ── Palette & Fonts via Google Fonts ──
const STYLE = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --bg: #0d1117;
  --surface: #161b22;
  --surface2: #1e2530;
  --border: #2a3340;
  --accent: #00e5a0;
  --accent2: #ff6b35;
  --accent3: #7c9eff;
  --text: #e8edf3;
  --muted: #6e7f94;
  --danger: #ff4d6a;
  --warning: #ffc857;
  --radius: 12px;
  --font-head: 'Syne', sans-serif;
  --font-body: 'DM Sans', sans-serif;
}

body { background: var(--bg); color: var(--text); font-family: var(--font-body); min-height: 100vh; }

button { cursor: pointer; font-family: var(--font-body); }
input, select, textarea { font-family: var(--font-body); }

.app-wrap { display: flex; flex-direction: column; min-height: 100vh; }

/* ── Header ── */
.header {
  background: var(--surface);
  border-bottom: 1px solid var(--border);
  padding: 0 28px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(10px);
}
.logo {
  font-family: var(--font-head);
  font-weight: 800;
  font-size: 1.3rem;
  color: var(--accent);
  display: flex; align-items: center; gap: 10px;
  letter-spacing: -0.5px;
}
.logo span { color: var(--text); }
.logo-dot { width: 8px; height: 8px; background: var(--accent); border-radius: 50%; display: inline-block; }

.header-nav { display: flex; align-items: center; gap: 8px; }
.nav-btn {
  background: transparent;
  border: 1px solid var(--border);
  color: var(--muted);
  padding: 7px 16px;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 500;
  transition: all 0.2s;
}
.nav-btn:hover, .nav-btn.active {
  background: var(--surface2);
  color: var(--text);
  border-color: var(--accent);
}
.nav-btn.primary {
  background: var(--accent);
  color: #000;
  border-color: var(--accent);
  font-weight: 700;
}
.nav-btn.primary:hover { background: #00cc8e; }

.role-badge {
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}
.role-badge.restaurant { background: rgba(255,107,53,0.15); color: var(--accent2); border: 1px solid rgba(255,107,53,0.3); }
.role-badge.receiver { background: rgba(0,229,160,0.12); color: var(--accent); border: 1px solid rgba(0,229,160,0.25); }
.role-badge.admin { background: rgba(124,158,255,0.12); color: var(--accent3); border: 1px solid rgba(124,158,255,0.25); }

/* ── Main Layout ── */
.main { flex: 1; display: flex; }
.sidebar {
  width: 230px;
  background: var(--surface);
  border-right: 1px solid var(--border);
  padding: 24px 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-height: calc(100vh - 64px);
}
.sidebar-item {
  display: flex; align-items: center; gap: 10px;
  padding: 10px 14px;
  border-radius: 9px;
  color: var(--muted);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.18s;
  border: 1px solid transparent;
}
.sidebar-item:hover { background: var(--surface2); color: var(--text); }
.sidebar-item.active { background: var(--surface2); color: var(--text); border-color: var(--border); }
.sidebar-item .icon { font-size: 1.1rem; min-width: 22px; text-align: center; }
.sidebar-section { font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: var(--muted); padding: 14px 14px 6px; }

.content { flex: 1; padding: 32px; overflow-y: auto; max-height: calc(100vh - 64px); }

/* ── Cards ── */
.card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 24px;
  margin-bottom: 20px;
}
.card-title {
  font-family: var(--font-head);
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 18px;
  display: flex; align-items: center; gap: 8px;
}

/* ── Forms ── */
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.form-grid.one-col { grid-template-columns: 1fr; }
.form-group { display: flex; flex-direction: column; gap: 6px; }
.form-group.full { grid-column: 1 / -1; }
label { font-size: 0.8rem; font-weight: 600; color: var(--muted); text-transform: uppercase; letter-spacing: 0.4px; }
input, select, textarea {
  background: var(--bg);
  border: 1px solid var(--border);
  color: var(--text);
  padding: 10px 13px;
  border-radius: 8px;
  font-size: 0.9rem;
  transition: border-color 0.2s;
  outline: none;
  width: 100%;
}
input:focus, select:focus, textarea:focus { border-color: var(--accent); }
textarea { resize: vertical; min-height: 80px; }
select option { background: var(--surface); }

/* ── Buttons ── */
.btn {
  display: inline-flex; align-items: center; gap: 7px;
  padding: 9px 20px;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  border: none;
  transition: all 0.2s;
}
.btn-primary { background: var(--accent); color: #000; }
.btn-primary:hover { background: #00cc8e; transform: translateY(-1px); }
.btn-secondary { background: var(--surface2); color: var(--text); border: 1px solid var(--border); }
.btn-secondary:hover { border-color: var(--accent); color: var(--accent); }
.btn-danger { background: rgba(255,77,106,0.12); color: var(--danger); border: 1px solid rgba(255,77,106,0.25); }
.btn-danger:hover { background: rgba(255,77,106,0.22); }
.btn-sm { padding: 6px 13px; font-size: 0.8rem; }
.btn-ghost { background: transparent; color: var(--muted); border: 1px solid var(--border); }
.btn-ghost:hover { color: var(--text); }

/* ── Status badges ── */
.badge {
  display: inline-block;
  padding: 3px 9px;
  border-radius: 5px;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.4px;
  text-transform: uppercase;
}
.badge-active { background: rgba(0,229,160,0.12); color: var(--accent); border: 1px solid rgba(0,229,160,0.25); }
.badge-reserved { background: rgba(255,200,87,0.12); color: var(--warning); border: 1px solid rgba(255,200,87,0.25); }
.badge-expired { background: rgba(110,127,148,0.12); color: var(--muted); border: 1px solid var(--border); }
.badge-pending { background: rgba(124,158,255,0.12); color: var(--accent3); border: 1px solid rgba(124,158,255,0.25); }

/* ── Listing Cards ── */
.listings-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; }
.listing-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 18px;
  transition: all 0.2s;
  cursor: pointer;
}
.listing-card:hover { border-color: var(--accent); transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,229,160,0.08); }
.listing-card-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; }
.listing-name { font-family: var(--font-head); font-size: 1rem; font-weight: 700; color: var(--text); }
.listing-restaurant { font-size: 0.8rem; color: var(--muted); margin-top: 2px; }
.listing-meta { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 12px; }
.listing-meta-item { font-size: 0.78rem; color: var(--muted); }
.listing-meta-item strong { color: var(--text); display: block; font-size: 0.85rem; }
.listing-price { font-family: var(--font-head); font-size: 1.15rem; font-weight: 800; color: var(--accent); }
.listing-price.free { color: var(--accent2); }
.listing-actions { display: flex; gap: 8px; margin-top: 14px; flex-wrap: wrap; }

/* ── Page transitions ── */
.page-enter { animation: fadeUp 0.3s ease; }
@keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }

/* ── Login / Auth ── */
.auth-wrap {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg);
  background-image: radial-gradient(ellipse at 20% 40%, rgba(0,229,160,0.06) 0%, transparent 60%),
                    radial-gradient(ellipse at 80% 70%, rgba(124,158,255,0.05) 0%, transparent 55%);
}
.auth-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 40px;
  width: 440px;
  max-width: 95vw;
}
.auth-logo { text-align: center; margin-bottom: 28px; }
.auth-logo .logo { justify-content: center; font-size: 1.6rem; }
.auth-tabs { display: grid; grid-template-columns: 1fr 1fr; background: var(--bg); border-radius: 9px; padding: 3px; gap: 2px; margin-bottom: 24px; }
.auth-tab { padding: 9px; text-align: center; border-radius: 7px; font-size: 0.875rem; font-weight: 600; color: var(--muted); cursor: pointer; transition: all 0.2s; border: none; background: transparent; }
.auth-tab.active { background: var(--surface2); color: var(--text); }
.role-selector { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin: 16px 0; }
.role-option {
  border: 2px solid var(--border);
  border-radius: 10px;
  padding: 14px 12px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
  background: transparent;
}
.role-option:hover { border-color: var(--accent); }
.role-option.selected.restaurant { border-color: var(--accent2); background: rgba(255,107,53,0.07); }
.role-option.selected.receiver { border-color: var(--accent); background: rgba(0,229,160,0.07); }
.role-option .role-icon { font-size: 1.6rem; display: block; margin-bottom: 5px; }
.role-option .role-label { font-size: 0.8rem; font-weight: 700; color: var(--text); }
.role-option .role-desc { font-size: 0.72rem; color: var(--muted); margin-top: 2px; }
.error-msg { background: rgba(255,77,106,0.1); border: 1px solid rgba(255,77,106,0.25); color: var(--danger); padding: 10px 14px; border-radius: 8px; font-size: 0.85rem; margin-bottom: 14px; }
.success-msg { background: rgba(0,229,160,0.1); border: 1px solid rgba(0,229,160,0.25); color: var(--accent); padding: 10px 14px; border-radius: 8px; font-size: 0.85rem; margin-bottom: 14px; }
.divider { text-align: center; color: var(--muted); font-size: 0.8rem; margin: 14px 0; position: relative; }
.divider::before, .divider::after { content: ''; position: absolute; top: 50%; width: 40%; height: 1px; background: var(--border); }
.divider::before { left: 0; } .divider::after { right: 0; }
.link-btn { background: none; border: none; color: var(--accent); font-size: 0.85rem; font-weight: 600; cursor: pointer; text-decoration: underline; padding: 0; }

/* ── Profile ── */
.profile-header { display: flex; align-items: center; gap: 18px; margin-bottom: 24px; }
.avatar { width: 64px; height: 64px; border-radius: 50%; background: linear-gradient(135deg, var(--accent), var(--accent3)); display: flex; align-items: center; justify-content: center; font-size: 1.5rem; font-weight: 800; color: #000; font-family: var(--font-head); }
.profile-name { font-family: var(--font-head); font-size: 1.3rem; font-weight: 700; }
.profile-meta { font-size: 0.85rem; color: var(--muted); display: flex; align-items: center; gap: 8px; margin-top: 4px; }
.verification-tag { font-size: 0.72rem; padding: 2px 8px; border-radius: 4px; font-weight: 700; }
.verification-tag.verified { background: rgba(0,229,160,0.12); color: var(--accent); }
.verification-tag.pending { background: rgba(255,200,87,0.12); color: var(--warning); }

/* ── Upload area ── */
.upload-area {
  border: 2px dashed var(--border);
  border-radius: 10px;
  padding: 24px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
}
.upload-area:hover { border-color: var(--accent); background: rgba(0,229,160,0.03); }
.upload-area .upload-icon { font-size: 2rem; margin-bottom: 8px; }
.upload-area p { font-size: 0.85rem; color: var(--muted); }
.upload-area p strong { color: var(--accent); }

/* ── Browse filters ── */
.filter-bar {
  display: flex; gap: 10px; flex-wrap: wrap; align-items: center;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 14px 18px;
  margin-bottom: 20px;
}
.filter-bar label { font-size: 0.78rem; font-weight: 700; color: var(--muted); text-transform: uppercase; letter-spacing: 0.4px; }
.filter-bar input, .filter-bar select {
  width: auto;
  padding: 7px 11px;
  font-size: 0.82rem;
  border-radius: 7px;
}
.toggle-switch { display: flex; align-items: center; gap: 8px; cursor: pointer; user-select: none; }
.toggle-switch input[type=checkbox] { display: none; }
.toggle-track {
  width: 36px; height: 20px;
  background: var(--border);
  border-radius: 20px;
  position: relative;
  transition: background 0.2s;
}
.toggle-track::after { content: ''; position: absolute; top: 3px; left: 3px; width: 14px; height: 14px; background: white; border-radius: 50%; transition: left 0.2s; }
.toggle-switch input:checked + .toggle-track { background: var(--accent); }
.toggle-switch input:checked + .toggle-track::after { left: 19px; }
.toggle-label { font-size: 0.82rem; color: var(--muted); font-weight: 600; }

/* ── Listing detail modal ── */
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); z-index: 200; display: flex; align-items: center; justify-content: center; padding: 20px; }
.modal { background: var(--surface); border: 1px solid var(--border); border-radius: 16px; padding: 32px; width: 520px; max-width: 100%; max-height: 90vh; overflow-y: auto; position: relative; }
.modal-close { position: absolute; top: 16px; right: 16px; background: var(--surface2); border: 1px solid var(--border); color: var(--muted); width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 1rem; }
.modal-close:hover { color: var(--text); }
.modal-title { font-family: var(--font-head); font-size: 1.3rem; font-weight: 800; margin-bottom: 4px; }
.modal-subtitle { color: var(--muted); font-size: 0.85rem; margin-bottom: 20px; }
.detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 20px; }
.detail-item label { font-size: 0.73rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: var(--muted); display: block; margin-bottom: 4px; }
.detail-item span { font-size: 0.9rem; color: var(--text); font-weight: 500; }

/* ── Stats row ── */
.stats-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 14px; margin-bottom: 24px; }
.stat-card { background: var(--surface); border: 1px solid var(--border); border-radius: 10px; padding: 18px; }
.stat-value { font-family: var(--font-head); font-size: 1.6rem; font-weight: 800; color: var(--accent); line-height: 1; }
.stat-value.orange { color: var(--accent2); }
.stat-value.blue { color: var(--accent3); }
.stat-label { font-size: 0.75rem; color: var(--muted); margin-top: 6px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.4px; }

/* ── Pickup confirmations ── */
.pickup-item { display: flex; align-items: center; justify-content: space-between; padding: 14px 0; border-bottom: 1px solid var(--border); }
.pickup-item:last-child { border-bottom: none; }
.pickup-info { flex: 1; }
.pickup-name { font-weight: 600; font-size: 0.9rem; }
.pickup-meta { font-size: 0.78rem; color: var(--muted); margin-top: 3px; }

/* ── Toast ── */
.toast {
  position: fixed; bottom: 24px; right: 24px;
  background: var(--surface2);
  border: 1px solid var(--accent);
  color: var(--text);
  padding: 13px 20px;
  border-radius: 10px;
  font-size: 0.875rem;
  font-weight: 500;
  z-index: 300;
  animation: slideIn 0.3s ease, fadeOut 0.3s ease 2.7s forwards;
  max-width: 320px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.4);
}
@keyframes slideIn { from { opacity: 0; transform: translateX(40px); } to { opacity: 1; transform: translateX(0); } }
@keyframes fadeOut { from { opacity: 1; } to { opacity: 0; } }

/* ── Page headers ── */
.page-header { margin-bottom: 24px; }
.page-header h1 { font-family: var(--font-head); font-size: 1.6rem; font-weight: 800; color: var(--text); }
.page-header p { color: var(--muted); font-size: 0.875rem; margin-top: 4px; }
.page-header-row { display: flex; align-items: flex-start; justify-content: space-between; }

/* ── Empty state ── */
.empty-state { text-align: center; padding: 60px 20px; color: var(--muted); }
.empty-state .empty-icon { font-size: 3rem; margin-bottom: 12px; opacity: 0.6; }
.empty-state p { font-size: 0.9rem; }

/* ── Scrollbar ── */
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: var(--bg); }
::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }
`;

// ── Seed Data ──
const SEED_LISTINGS = [
  { id: 1, name: "Heirloom Tomatoes", category: "Produce", qty: 15, unit: "kg", storage: "Refrigerated", expiry: "2025-07-12", pickup: "08:00–12:00", price: 0, free: true, status: "active", restaurant: "The Green Fork", address: "12 MG Road, Bengaluru" },
  { id: 2, name: "Brioche Dough", category: "Bakery", qty: 8, unit: "kg", storage: "Frozen", expiry: "2025-07-15", pickup: "14:00–18:00", price: 320, free: false, status: "active", restaurant: "Lumière Bistro", address: "45 Lavelle Road, Bengaluru" },
  { id: 3, name: "Saffron (50g packs)", category: "Spices", qty: 20, unit: "packs", storage: "Dry", expiry: "2025-09-01", pickup: "10:00–14:00", price: 450, free: false, status: "active", restaurant: "Zaffran Kitchen", address: "9 Koramangala 4th Block" },
  { id: 4, name: "Heavy Cream", category: "Dairy", qty: 12, unit: "L", storage: "Refrigerated", expiry: "2025-07-10", pickup: "07:00–10:00", price: 0, free: true, status: "active", restaurant: "Café Prism", address: "22 Indiranagar 100ft Rd" },
  { id: 5, name: "Arborio Rice", category: "Grains", qty: 25, unit: "kg", storage: "Dry", expiry: "2026-01-01", pickup: "09:00–13:00", price: 180, free: false, status: "reserved", restaurant: "Sotto Voce", address: "77 Church Street, Bengaluru" },
  { id: 6, name: "Fresh Basil Bunches", category: "Produce", qty: 30, unit: "bunches", storage: "Refrigerated", expiry: "2025-07-09", pickup: "08:00–11:00", price: 0, free: true, status: "active", restaurant: "The Green Fork", address: "12 MG Road, Bengaluru" },
];

// ── Toast ──
function Toast({ msg }) {
  return <div className="toast">✓ {msg}</div>;
}

// ── AUTH ──
function AuthPage({ onLogin }) {
  const [tab, setTab] = useState("login");
  const [role, setRole] = useState("restaurant");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [biz, setBiz] = useState("");
  const [error, setError] = useState("");
  const [forgot, setForgot] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const mockUsers = [
    { email: "rest@demo.com", password: "pass", role: "restaurant", name: "The Green Fork", biz: "The Green Fork" },
    { email: "recv@demo.com", password: "pass", role: "receiver", name: "Feed Bengaluru NGO", biz: "Feed Bengaluru" },
    { email: "admin@demo.com", password: "pass", role: "admin", name: "Admin User", biz: "Platform Admin" },
  ];

  const handleLogin = () => {
    setError("");
    const user = mockUsers.find(u => u.email === email && u.password === password);
    if (user) onLogin(user);
    else setError("Invalid credentials. Try rest@demo.com / pass");
  };

  const handleRegister = () => {
    if (!email || !password || !name) { setError("Please fill all required fields."); return; }
    onLogin({ email, password, role, name, biz: biz || name });
  };

  const handleForgot = () => { setResetSent(true); setTimeout(() => { setForgot(false); setResetSent(false); }, 2500); };

  if (forgot) return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="auth-logo"><div className="logo"><span className="logo-dot"></span>Surplus<span>Link</span></div></div>
        <div className="card-title" style={{justifyContent:'center',marginBottom:6}}>Reset Password</div>
        <p style={{color:'var(--muted)',fontSize:'0.85rem',textAlign:'center',marginBottom:20}}>Enter your email to receive a reset link</p>
        {resetSent && <div className="success-msg">Reset link sent! Check your inbox.</div>}
        {!resetSent && <>
          <div className="form-group" style={{marginBottom:14}}><label>Email</label><input value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com"/></div>
          <button className="btn btn-primary" style={{width:'100%'}} onClick={handleForgot}>Send Reset Link</button>
        </>}
        <div style={{textAlign:'center',marginTop:14}}><button className="link-btn" onClick={()=>setForgot(false)}>← Back to Login</button></div>
      </div>
    </div>
  );

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="auth-logo"><div className="logo"><span className="logo-dot"></span>Surplus<span>Link</span></div></div>
        <div className="auth-tabs">
          <button className={`auth-tab${tab==='login'?' active':''}`} onClick={()=>{setTab('login');setError('');}}>Sign In</button>
          <button className={`auth-tab${tab==='register'?' active':''}`} onClick={()=>{setTab('register');setError('');}}>Register</button>
        </div>
        {error && <div className="error-msg">{error}</div>}
        {tab === "login" && <>
          <div className="form-group" style={{marginBottom:12}}><label>Email</label><input value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" type="email"/></div>
          <div className="form-group" style={{marginBottom:6}}><label>Password</label><input value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" type="password"/></div>
          <div style={{textAlign:'right',marginBottom:18}}><button className="link-btn" onClick={()=>setForgot(true)}>Forgot password?</button></div>
          <button className="btn btn-primary" style={{width:'100%',padding:'12px'}} onClick={handleLogin}>Sign In</button>
          <div className="divider" style={{marginTop:18}}>demo accounts</div>
          <div style={{display:'flex',gap:8,flexWrap:'wrap',justifyContent:'center',marginTop:8}}>
            {[{label:'Restaurant',e:'rest@demo.com'},{label:'Receiver',e:'recv@demo.com'},{label:'Admin',e:'admin@demo.com'}].map(d=>(
              <button key={d.e} className="btn btn-ghost btn-sm" onClick={()=>{setEmail(d.e);setPassword('pass');}}>
                {d.label}
              </button>
            ))}
          </div>
        </>}
        {tab === "register" && <>
          <p style={{color:'var(--muted)',fontSize:'0.82rem',marginBottom:10}}>Select your account type:</p>
          <div className="role-selector">
            <button className={`role-option${role==='restaurant'?' selected restaurant':''}`} onClick={()=>setRole('restaurant')}>
              <span className="role-icon">🍽️</span>
              <span className="role-label">Restaurant</span>
              <span className="role-desc">List surplus ingredients</span>
            </button>
            <button className={`role-option${role==='receiver'?' selected receiver':''}`} onClick={()=>setRole('receiver')}>
              <span className="role-icon">🤝</span>
              <span className="role-label">Receiver</span>
              <span className="role-desc">Browse & claim items</span>
            </button>
          </div>
          <div className="form-grid one-col" style={{gap:12,marginBottom:16}}>
            <div className="form-group"><label>Full Name *</label><input value={name} onChange={e=>setName(e.target.value)} placeholder="Your name"/></div>
            <div className="form-group"><label>{role==='restaurant'?'Restaurant Name':'Organisation Name'}</label><input value={biz} onChange={e=>setBiz(e.target.value)} placeholder="Business name"/></div>
            <div className="form-group"><label>Email *</label><input value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" type="email"/></div>
            <div className="form-group"><label>Password *</label><input value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" type="password"/></div>
            {role==='restaurant' && <div className="form-group"><label>Address</label><input placeholder="Restaurant address"/></div>}
            {role==='receiver' && <div className="form-group"><label>Account Type</label><select><option>Nonprofit / NGO</option><option>Small Business</option><option>Individual</option><option>Community Kitchen</option></select></div>}
          </div>
          <button className="btn btn-primary" style={{width:'100%',padding:'12px'}} onClick={handleRegister}>Create Account</button>
        </>}
      </div>
    </div>
  );
}

// ── PROFILE ──
function ProfilePage({ user, onToast }) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [biz, setBiz] = useState(user.biz);
  const [address, setAddress] = useState("12 MG Road, Bengaluru 560001");
  const [schedule, setSchedule] = useState("Mon–Sat, morning");
  const [acctType, setAcctType] = useState("Nonprofit / NGO");
  const [saved, setSaved] = useState(false);
  const [docUploaded, setDocUploaded] = useState(false);

  const handleSave = () => {
    setSaved(true); setEditing(false);
    onToast("Profile updated — some fields are pending verification");
    setTimeout(()=>setSaved(false), 4000);
  };

  return (
    <div className="page-enter">
      <div className="page-header page-header-row">
        <div><h1>Profile</h1><p>Manage your account information</p></div>
        {!editing && <button className="btn btn-secondary" onClick={()=>setEditing(true)}>✏️ Edit Profile</button>}
      </div>
      <div className="profile-header">
        <div className="avatar">{user.name[0]}</div>
        <div>
          <div className="profile-name">{user.name}</div>
          <div className="profile-meta">
            <span className={`role-badge ${user.role}`}>{user.role}</span>
            <span className={`verification-tag ${saved?'pending':'verified'}`}>{saved?'Pending Verification':'Verified'}</span>
          </div>
        </div>
      </div>
      <div className="card">
        <div className="card-title">📋 Personal Information</div>
        {saved && <div className="success-msg">Profile saved — email and address pending verification</div>}
        <div className="form-grid">
          <div className="form-group"><label>Full Name</label><input value={name} disabled={!editing} onChange={e=>setName(e.target.value)}/></div>
          <div className="form-group"><label>{user.role==='restaurant'?'Restaurant Name':'Organisation Name'}</label><input value={biz} disabled={!editing} onChange={e=>setBiz(e.target.value)}/></div>
          <div className="form-group"><label>Email</label><input value={user.email} disabled/></div>
          <div className="form-group"><label>Phone</label><input placeholder="+91 98765 43210" disabled={!editing}/></div>
          <div className="form-group full"><label>Address</label><input value={address} disabled={!editing} onChange={e=>setAddress(e.target.value)}/></div>
          {user.role==='restaurant' && <div className="form-group"><label>Restock Schedule</label><input value={schedule} disabled={!editing} onChange={e=>setSchedule(e.target.value)}/></div>}
          {user.role==='receiver' && <div className="form-group"><label>Account Type</label>
            {editing ? <select value={acctType} onChange={e=>setAcctType(e.target.value)}><option>Nonprofit / NGO</option><option>Small Business</option><option>Individual</option><option>Community Kitchen</option></select>
            : <input value={acctType} disabled/>}
          </div>}
        </div>
        {editing && <div style={{display:'flex',gap:10,marginTop:18}}>
          <button className="btn btn-primary" onClick={handleSave}>Save Changes</button>
          <button className="btn btn-secondary" onClick={()=>setEditing(false)}>Cancel</button>
        </div>}
      </div>
      {user.role==='receiver' && (
        <div className="card">
          <div className="card-title">📄 Compliance Documents</div>
          <p style={{color:'var(--muted)',fontSize:'0.85rem',marginBottom:16}}>Upload your tax exemption certificate to receive items at no charge as a verified nonprofit.</p>
          {docUploaded
            ? <div className="success-msg">✓ Exemption certificate uploaded — pending admin verification</div>
            : <div className="upload-area" onClick={()=>{setDocUploaded(true);onToast("Document uploaded for verification");}}>
                <div className="upload-icon">📑</div>
                <p><strong>Click to upload</strong> or drag and drop</p>
                <p style={{marginTop:4,fontSize:'0.75rem'}}>PDF, JPG, PNG up to 10MB</p>
              </div>
          }
        </div>
      )}
    </div>
  );
}

// ── WALLET (Restaurant) ──
function WalletPage({ onToast }) {
  const [linking, setLinking] = useState(false);
  const [linked, setLinked] = useState(true);
  const history = [
    { id: "PO-1042", date: "Jun 28, 2025", amt: "₹1,240", status: "Paid" },
    { id: "PO-1031", date: "Jun 15, 2025", amt: "₹870", status: "Paid" },
    { id: "PO-1019", date: "Jun 01, 2025", amt: "₹2,100", status: "Paid" },
  ];
  return (
    <div className="page-enter">
      <div className="page-header"><h1>Wallet & Payouts</h1><p>Manage your bank account and payout history</p></div>
      <div className="stats-row">
        <div className="stat-card"><div className="stat-value">₹4,210</div><div className="stat-label">Pending Payout</div></div>
        <div className="stat-card"><div className="stat-value orange">₹12,450</div><div className="stat-label">Total Earned</div></div>
        <div className="stat-card"><div className="stat-value blue">18</div><div className="stat-label">Transactions</div></div>
      </div>
      <div className="card">
        <div className="card-title">🏦 Linked Bank Account</div>
        {linked
          ? <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'14px 16px',background:'var(--bg)',borderRadius:10,border:'1px solid var(--border)'}}>
              <div>
                <div style={{fontWeight:600,fontSize:'0.9rem'}}>HDFC Bank •••• 4321</div>
                <div style={{fontSize:'0.78rem',color:'var(--muted)',marginTop:2}}>Stripe Connect · Verified</div>
              </div>
              <span className="badge badge-active">Active</span>
            </div>
          : <p style={{color:'var(--muted)',fontSize:'0.875rem',marginBottom:14}}>No bank account linked yet.</p>
        }
        <button className="btn btn-secondary" style={{marginTop:14}} onClick={()=>{setLinking(true);}}>+ Link New Account</button>
        {linking && <div style={{marginTop:16,padding:16,background:'var(--bg)',borderRadius:10,border:'1px solid var(--border)'}}>
          <div className="form-grid" style={{marginBottom:12}}>
            <div className="form-group"><label>Account Holder</label><input placeholder="Name on account"/></div>
            <div className="form-group"><label>Account Number</label><input placeholder="••••••••••"/></div>
            <div className="form-group"><label>IFSC Code</label><input placeholder="HDFC0001234"/></div>
            <div className="form-group"><label>Bank Name</label><input placeholder="Bank name"/></div>
          </div>
          <div style={{display:'flex',gap:10}}>
            <button className="btn btn-primary btn-sm" onClick={()=>{setLinking(false);setLinked(true);onToast("Bank account linked via Stripe Connect");}}>Link Account</button>
            <button className="btn btn-ghost btn-sm" onClick={()=>setLinking(false)}>Cancel</button>
          </div>
        </div>}
      </div>
      <div className="card">
        <div className="card-title">📊 Payout History</div>
        <table style={{width:'100%',borderCollapse:'collapse',fontSize:'0.875rem'}}>
          <thead><tr style={{borderBottom:'1px solid var(--border)'}}>
            {['Reference','Date','Amount','Status'].map(h=><th key={h} style={{textAlign:'left',padding:'8px 10px',color:'var(--muted)',fontWeight:700,fontSize:'0.75rem',textTransform:'uppercase',letterSpacing:'0.4px'}}>{h}</th>)}
          </tr></thead>
          <tbody>{history.map(r=><tr key={r.id} style={{borderBottom:'1px solid var(--border)'}}>
            <td style={{padding:'12px 10px',fontFamily:'var(--font-head)',fontWeight:600}}>{r.id}</td>
            <td style={{padding:'12px 10px',color:'var(--muted)'}}>{r.date}</td>
            <td style={{padding:'12px 10px',fontWeight:700,color:'var(--accent)'}}>{r.amt}</td>
            <td style={{padding:'12px 10px'}}><span className="badge badge-active">{r.status}</span></td>
          </tr>)}</tbody>
        </table>
      </div>
    </div>
  );
}

// ── MY LISTINGS (Restaurant) ──
function MyListingsPage({ listings, setListings, onToast }) {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [tab, setTab] = useState("active");
  const emptyForm = { name:"", category:"Produce", qty:"", unit:"kg", storage:"Refrigerated", expiry:"", pickup:"", price:"", free:false };
  const [form, setForm] = useState(emptyForm);

  const filtered = listings.filter(l => l.status === tab);

  const handleSubmit = () => {
    if (!form.name || !form.qty || !form.expiry) { onToast("Fill required fields"); return; }
    if (editing !== null) {
      setListings(ls=>ls.map(l=>l.id===editing?{...l,...form,price:form.free?0:Number(form.price)}:l));
      onToast("Listing updated");
    } else {
      setListings(ls=>[...ls,{...form, id:Date.now(), price:form.free?0:Number(form.price), status:"active", restaurant:"The Green Fork", address:"12 MG Road, Bengaluru"}]);
      onToast("Listing created successfully");
    }
    setShowForm(false); setEditing(null); setForm(emptyForm);
  };

  const handleDelete = (id) => {
    setListings(ls=>ls.filter(l=>l.id!==id));
    onToast("Listing deleted");
  };

  const handleConfirmPickup = (id) => {
    setListings(ls=>ls.map(l=>l.id===id?{...l,status:'active',confirmed:true}:l));
    onToast("Pickup confirmed!");
  };

  const pendingPickups = listings.filter(l=>l.status==='reserved');

  return (
    <div className="page-enter">
      <div className="page-header page-header-row">
        <div><h1>My Listings</h1><p>Manage your surplus ingredient postings</p></div>
        <button className="btn btn-primary" onClick={()=>{setShowForm(true);setEditing(null);setForm(emptyForm);}}>+ New Listing</button>
      </div>

      {pendingPickups.length > 0 && (
        <div className="card" style={{borderColor:'rgba(255,200,87,0.3)'}}>
          <div className="card-title">⏳ Pickup Confirmations Pending</div>
          {pendingPickups.map(l=>(
            <div key={l.id} className="pickup-item">
              <div className="pickup-info">
                <div className="pickup-name">{l.name}</div>
                <div className="pickup-meta">Reserved · {l.qty} {l.unit} · Pickup: {l.pickup}</div>
              </div>
              <button className="btn btn-primary btn-sm" onClick={()=>handleConfirmPickup(l.id)}>Confirm Pickup</button>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="card" style={{borderColor:'var(--accent)'}}>
          <div className="card-title">{editing!==null?'✏️ Edit Listing':'📝 New Listing'}</div>
          <div className="form-grid">
            <div className="form-group"><label>Ingredient Name *</label><input value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} placeholder="e.g. Heirloom Tomatoes"/></div>
            <div className="form-group"><label>Category</label><select value={form.category} onChange={e=>setForm(f=>({...f,category:e.target.value}))}><option>Produce</option><option>Dairy</option><option>Bakery</option><option>Meat</option><option>Seafood</option><option>Grains</option><option>Spices</option><option>Beverages</option></select></div>
            <div className="form-group"><label>Quantity *</label><input type="number" value={form.qty} onChange={e=>setForm(f=>({...f,qty:e.target.value}))} placeholder="0"/></div>
            <div className="form-group"><label>Unit</label><select value={form.unit} onChange={e=>setForm(f=>({...f,unit:e.target.value}))}><option>kg</option><option>g</option><option>L</option><option>packs</option><option>units</option><option>bunches</option><option>boxes</option></select></div>
            <div className="form-group"><label>Storage Type</label><select value={form.storage} onChange={e=>setForm(f=>({...f,storage:e.target.value}))}><option>Refrigerated</option><option>Frozen</option><option>Dry</option><option>Room Temp</option></select></div>
            <div className="form-group"><label>Expiry Date *</label><input type="date" value={form.expiry} onChange={e=>setForm(f=>({...f,expiry:e.target.value}))}/></div>
            <div className="form-group"><label>Pickup Window</label><input value={form.pickup} onChange={e=>setForm(f=>({...f,pickup:e.target.value}))} placeholder="e.g. 08:00–12:00"/></div>
            <div className="form-group">
              <label>Price (₹)</label>
              <div style={{display:'flex',gap:8,alignItems:'center'}}>
                <input type="number" value={form.price} disabled={form.free} onChange={e=>setForm(f=>({...f,price:e.target.value}))} placeholder="0"/>
                <label className="toggle-switch" style={{whiteSpace:'nowrap'}}>
                  <input type="checkbox" checked={form.free} onChange={e=>setForm(f=>({...f,free:e.target.checked,price:e.target.checked?0:f.price}))}/>
                  <span className="toggle-track"></span>
                  <span className="toggle-label">Free</span>
                </label>
              </div>
            </div>
          </div>
          <div style={{display:'flex',gap:10,marginTop:18}}>
            <button className="btn btn-primary" onClick={handleSubmit}>{editing!==null?'Save Changes':'Create Listing'}</button>
            <button className="btn btn-secondary" onClick={()=>{setShowForm(false);setEditing(null);}}>Cancel</button>
          </div>
        </div>
      )}

      <div style={{display:'flex',gap:6,marginBottom:18}}>
        {['active','reserved','expired'].map(t=>(
          <button key={t} className={`btn btn-sm ${tab===t?'btn-primary':'btn-ghost'}`} onClick={()=>setTab(t)}>
            {t.charAt(0).toUpperCase()+t.slice(1)} ({listings.filter(l=>l.status===t).length})
          </button>
        ))}
      </div>

      {filtered.length===0
        ? <div className="empty-state"><div className="empty-icon">📦</div><p>No {tab} listings</p></div>
        : <div className="listings-grid">
            {filtered.map(l=>(
              <div key={l.id} className="listing-card">
                <div className="listing-card-header">
                  <div>
                    <div className="listing-name">{l.name}</div>
                    <div className="listing-restaurant">{l.category} · {l.storage}</div>
                  </div>
                  <span className={`badge badge-${l.status}`}>{l.status}</span>
                </div>
                <div className="listing-meta">
                  <div className="listing-meta-item"><strong>{l.qty} {l.unit}</strong>Quantity</div>
                  <div className="listing-meta-item"><strong>{l.expiry}</strong>Expiry</div>
                  <div className="listing-meta-item"><strong>{l.pickup||'–'}</strong>Pickup</div>
                  <div className="listing-meta-item"><strong className={`listing-price${l.free?' free':''}`}>{l.free?'Free':'₹'+l.price}</strong>Price</div>
                </div>
                {l.status==='active' && (
                  <div className="listing-actions">
                    <button className="btn btn-secondary btn-sm" onClick={()=>{setEditing(l.id);setForm({name:l.name,category:l.category,qty:l.qty,unit:l.unit,storage:l.storage,expiry:l.expiry,pickup:l.pickup,price:l.price,free:l.free});setShowForm(true);}}>Edit</button>
                    <button className="btn btn-danger btn-sm" onClick={()=>handleDelete(l.id)}>Delete</button>
                  </div>
                )}
              </div>
            ))}
          </div>
      }
    </div>
  );
}

// ── BROWSE (Receiver) ──
function BrowsePage({ listings, onToast }) {
  const [catFilter, setCatFilter] = useState("All");
  const [storageFilter, setStorageFilter] = useState("All");
  const [freeOnly, setFreeOnly] = useState(false);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [reserved, setReserved] = useState([]);

  const categories = ["All","Produce","Dairy","Bakery","Meat","Seafood","Grains","Spices","Beverages"];
  const storageTypes = ["All","Refrigerated","Frozen","Dry","Room Temp"];

  const visible = listings.filter(l => l.status==='active')
    .filter(l => catFilter==='All' || l.category===catFilter)
    .filter(l => storageFilter==='All' || l.storage===storageFilter)
    .filter(l => !freeOnly || l.free)
    .filter(l => !search || l.name.toLowerCase().includes(search.toLowerCase()));

  const handleReserve = (l) => {
    if (reserved.includes(l.id)) { onToast("Already reserved"); return; }
    setReserved(r=>[...r,l.id]);
    onToast(`${l.name} reserved for 2 hours — proceed to checkout`);
    setSelected(null);
  };

  return (
    <div className="page-enter">
      <div className="page-header"><h1>Browse Surplus</h1><p>Available ingredients near Bengaluru</p></div>
      <div className="filter-bar">
        <div style={{display:'flex',alignItems:'center',gap:6}}>
          <label>Search</label>
          <input placeholder="Ingredient…" value={search} onChange={e=>setSearch(e.target.value)} style={{width:160}}/>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:6}}>
          <label>Category</label>
          <select value={catFilter} onChange={e=>setCatFilter(e.target.value)}>
            {categories.map(c=><option key={c}>{c}</option>)}
          </select>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:6}}>
          <label>Storage</label>
          <select value={storageFilter} onChange={e=>setStorageFilter(e.target.value)}>
            {storageTypes.map(s=><option key={s}>{s}</option>)}
          </select>
        </div>
        <label className="toggle-switch">
          <input type="checkbox" checked={freeOnly} onChange={e=>setFreeOnly(e.target.checked)}/>
          <span className="toggle-track"></span>
          <span className="toggle-label">Free only</span>
        </label>
      </div>

      {visible.length===0
        ? <div className="empty-state"><div className="empty-icon">🔍</div><p>No listings match your filters</p></div>
        : <div className="listings-grid">
            {visible.map(l=>(
              <div key={l.id} className="listing-card" onClick={()=>setSelected(l)}>
                <div className="listing-card-header">
                  <div>
                    <div className="listing-name">{l.name}</div>
                    <div className="listing-restaurant">{l.restaurant}</div>
                  </div>
                  {l.free ? <span className="badge" style={{background:'rgba(255,107,53,0.12)',color:'var(--accent2)',border:'1px solid rgba(255,107,53,0.25)'}}>FREE</span>
                  : <span className="listing-price">₹{l.price}</span>}
                </div>
                <div className="listing-meta">
                  <div className="listing-meta-item"><strong>{l.qty} {l.unit}</strong>Available</div>
                  <div className="listing-meta-item"><strong>{l.category}</strong>Category</div>
                  <div className="listing-meta-item"><strong>{l.storage}</strong>Storage</div>
                  <div className="listing-meta-item"><strong>{l.expiry}</strong>Expiry</div>
                </div>
                <div className="listing-actions">
                  <button className="btn btn-primary btn-sm" onClick={e=>{e.stopPropagation();handleReserve(l);}}>
                    {reserved.includes(l.id)?'✓ Reserved':'Reserve'}
                  </button>
                  <button className="btn btn-ghost btn-sm">View Details</button>
                </div>
              </div>
            ))}
          </div>
      }

      {selected && (
        <div className="modal-overlay" onClick={()=>setSelected(null)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <button className="modal-close" onClick={()=>setSelected(null)}>✕</button>
            <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:4}}>
              <div className="modal-title">{selected.name}</div>
              {selected.free ? <span className="badge" style={{background:'rgba(255,107,53,0.12)',color:'var(--accent2)',border:'1px solid rgba(255,107,53,0.25)'}}>FREE</span>
              : <span className="listing-price">₹{selected.price}</span>}
            </div>
            <div className="modal-subtitle">{selected.restaurant} · {selected.address}</div>
            <div className="detail-grid">
              {[['Category',selected.category],['Storage Type',selected.storage],['Quantity',`${selected.qty} ${selected.unit}`],['Expiry Date',selected.expiry],['Pickup Window',selected.pickup||'To be confirmed'],['Price',selected.free?'Free / Donation':'₹'+selected.price]].map(([k,v])=>(
                <div key={k} className="detail-item"><label>{k}</label><span>{v}</span></div>
              ))}
            </div>
            <div style={{background:'var(--bg)',borderRadius:9,padding:'12px 14px',marginBottom:20,fontSize:'0.82rem',color:'var(--muted)',lineHeight:1.6}}>
              📍 Pickup at: <span style={{color:'var(--text)'}}>{selected.address}</span><br/>
              ⏰ Window: <span style={{color:'var(--text)'}}>{selected.pickup||'Contact restaurant'}</span>
            </div>
            <button className="btn btn-primary" style={{width:'100%',padding:'12px'}} onClick={()=>handleReserve(selected)}>
              {reserved.includes(selected.id)?'✓ Already Reserved':'Reserve — Locks for 2 hours'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── DASHBOARD ──
function Dashboard({ user, listings }) {
  const myActive = listings.filter(l=>l.status==='active').length;
  const myReserved = listings.filter(l=>l.status==='reserved').length;
  return (
    <div className="page-enter">
      <div className="page-header"><h1>Welcome back, {user.name.split(' ')[0]} 👋</h1><p>Here's your platform overview</p></div>
      <div className="stats-row">
        {user.role==='restaurant' && <>
          <div className="stat-card"><div className="stat-value">{myActive}</div><div className="stat-label">Active Listings</div></div>
          <div className="stat-card"><div className="stat-value orange">{myReserved}</div><div className="stat-label">Reserved</div></div>
          <div className="stat-card"><div className="stat-value blue">₹4,210</div><div className="stat-label">Pending Payout</div></div>
        </>}
        {user.role==='receiver' && <>
          <div className="stat-card"><div className="stat-value">{listings.filter(l=>l.status==='active').length}</div><div className="stat-label">Available Items</div></div>
          <div className="stat-card"><div className="stat-value orange">3</div><div className="stat-label">My Reservations</div></div>
          <div className="stat-card"><div className="stat-value blue">7</div><div className="stat-label">Total Claims</div></div>
        </>}
        {user.role==='admin' && <>
          <div className="stat-card"><div className="stat-value">{listings.length}</div><div className="stat-label">Total Listings</div></div>
          <div className="stat-card"><div className="stat-value orange">5</div><div className="stat-label">Active Users</div></div>
          <div className="stat-card"><div className="stat-value blue">12</div><div className="stat-label">Transactions</div></div>
        </>}
      </div>
      <div className="card">
        <div className="card-title">🌿 Platform Impact</div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))',gap:20}}>
          {[['🥗','142 kg','Food saved this month'],['🤝','28','Successful handoffs'],['🏢','9','Partner restaurants'],['📉','₹18,400','Value recovered']].map(([ic,v,l])=>(
            <div key={l} style={{textAlign:'center',padding:'18px 12px',background:'var(--bg)',borderRadius:10,border:'1px solid var(--border)'}}>
              <div style={{fontSize:'1.6rem',marginBottom:6}}>{ic}</div>
              <div style={{fontFamily:'var(--font-head)',fontWeight:800,fontSize:'1.2rem',color:'var(--accent)'}}>{v}</div>
              <div style={{fontSize:'0.75rem',color:'var(--muted)',marginTop:4}}>{l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── ADMIN ──
function AdminPage({ listings }) {
  const users = [
    {name:"The Green Fork",role:"restaurant",email:"rest@demo.com",status:"active"},
    {name:"Feed Bengaluru NGO",role:"receiver",email:"recv@demo.com",status:"active"},
    {name:"Lumière Bistro",role:"restaurant",email:"lumiere@demo.com",status:"active"},
    {name:"Zaffran Kitchen",role:"restaurant",email:"zaffran@demo.com",status:"flagged"},
  ];
  return (
    <div className="page-enter">
      <div className="page-header"><h1>Admin Panel</h1><p>User management, listings overview, and transaction log</p></div>
      <div className="stats-row">
        <div className="stat-card"><div className="stat-value">{users.length}</div><div className="stat-label">Total Users</div></div>
        <div className="stat-card"><div className="stat-value orange">{listings.length}</div><div className="stat-label">All Listings</div></div>
        <div className="stat-card"><div className="stat-value blue">12</div><div className="stat-label">Transactions</div></div>
      </div>
      <div className="card">
        <div className="card-title">👥 User Management</div>
        <table style={{width:'100%',borderCollapse:'collapse',fontSize:'0.875rem'}}>
          <thead><tr style={{borderBottom:'1px solid var(--border)'}}>
            {['Name','Role','Email','Status','Actions'].map(h=><th key={h} style={{textAlign:'left',padding:'8px 10px',color:'var(--muted)',fontWeight:700,fontSize:'0.73rem',textTransform:'uppercase',letterSpacing:'0.4px'}}>{h}</th>)}
          </tr></thead>
          <tbody>{users.map(u=><tr key={u.email} style={{borderBottom:'1px solid var(--border)'}}>
            <td style={{padding:'12px 10px',fontWeight:600}}>{u.name}</td>
            <td style={{padding:'12px 10px'}}><span className={`role-badge ${u.role}`}>{u.role}</span></td>
            <td style={{padding:'12px 10px',color:'var(--muted)'}}>{u.email}</td>
            <td style={{padding:'12px 10px'}}><span className={`badge ${u.status==='active'?'badge-active':'badge-reserved'}`}>{u.status}</span></td>
            <td style={{padding:'12px 10px',display:'flex',gap:6}}>
              <button className="btn btn-secondary btn-sm">Flag</button>
              <button className="btn btn-danger btn-sm">Suspend</button>
            </td>
          </tr>)}</tbody>
        </table>
      </div>
      <div className="card">
        <div className="card-title">📋 Listings Overview</div>
        <table style={{width:'100%',borderCollapse:'collapse',fontSize:'0.875rem'}}>
          <thead><tr style={{borderBottom:'1px solid var(--border)'}}>
            {['Item','Restaurant','Status','Price'].map(h=><th key={h} style={{textAlign:'left',padding:'8px 10px',color:'var(--muted)',fontWeight:700,fontSize:'0.73rem',textTransform:'uppercase',letterSpacing:'0.4px'}}>{h}</th>)}
          </tr></thead>
          <tbody>{listings.slice(0,6).map(l=><tr key={l.id} style={{borderBottom:'1px solid var(--border)'}}>
            <td style={{padding:'12px 10px',fontWeight:600}}>{l.name}</td>
            <td style={{padding:'12px 10px',color:'var(--muted)'}}>{l.restaurant}</td>
            <td style={{padding:'12px 10px'}}><span className={`badge badge-${l.status}`}>{l.status}</span></td>
            <td style={{padding:'12px 10px',color:l.free?'var(--accent2)':'var(--accent)',fontWeight:700}}>{l.free?'Free':'₹'+l.price}</td>
          </tr>)}</tbody>
        </table>
      </div>
    </div>
  );
}

// ── APP ──
export default function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("dashboard");
  const [listings, setListings] = useState(SEED_LISTINGS);
  const [toast, setToast] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(()=>setToast(null), 3200);
  };

  if (!user) return (
    <>
      <style>{STYLE}</style>
      <AuthPage onLogin={(u)=>{setUser(u);setPage("dashboard");}}/>
    </>
  );

  const restaurantNav = [
    {id:"dashboard",icon:"🏠",label:"Dashboard"},
    {id:"listings",icon:"📦",label:"My Listings"},
    {id:"wallet",icon:"💳",label:"Wallet & Payouts"},
    {id:"profile",icon:"👤",label:"Profile"},
  ];
  const receiverNav = [
    {id:"dashboard",icon:"🏠",label:"Dashboard"},
    {id:"browse",icon:"🔍",label:"Browse Surplus"},
    {id:"profile",icon:"👤",label:"Profile"},
  ];
  const adminNav = [
    {id:"dashboard",icon:"🏠",label:"Dashboard"},
    {id:"admin",icon:"🛡️",label:"Admin Panel"},
    {id:"profile",icon:"👤",label:"Profile"},
  ];

  const nav = user.role==='restaurant' ? restaurantNav : user.role==='receiver' ? receiverNav : adminNav;

  const renderPage = () => {
    switch(page) {
      case "dashboard": return <Dashboard user={user} listings={listings}/>;
      case "profile": return <ProfilePage user={user} onToast={showToast}/>;
      case "listings": return <MyListingsPage listings={listings} setListings={setListings} onToast={showToast}/>;
      case "wallet": return <WalletPage onToast={showToast}/>;
      case "browse": return <BrowsePage listings={listings} onToast={showToast}/>;
      case "admin": return <AdminPage listings={listings}/>;
      default: return <Dashboard user={user} listings={listings}/>;
    }
  };

  return (
    <>
      <style>{STYLE}</style>
      <div className="app-wrap">
        <header className="header">
          <div className="logo"><span className="logo-dot"></span>Surplus<span>Link</span></div>
          <div className="header-nav">
            <span className={`role-badge ${user.role}`}>{user.biz || user.name}</span>
            <button className="nav-btn" onClick={()=>{setUser(null);setPage("dashboard");}}>Sign Out</button>
          </div>
        </header>
        <div className="main">
          <nav className="sidebar">
            <div className="sidebar-section">Navigation</div>
            {nav.map(n=>(
              <div key={n.id} className={`sidebar-item${page===n.id?' active':''}`} onClick={()=>setPage(n.id)}>
                <span className="icon">{n.icon}</span>{n.label}
              </div>
            ))}
          </nav>
          <main className="content">{renderPage()}</main>
        </div>
      </div>
      {toast && <Toast msg={toast}/>}
    </>
  );
}
