import { useState, useEffect, useRef } from "react";

// ── Google Fonts + Global Styles ──
const STYLE = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
:root {
  --bg: #0d1117;
  --surface: #161b22;
  --surface2: #1e2530;
  --surface3: #242c38;
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
  background: rgba(22,27,34,0.92);
  border-bottom: 1px solid var(--border);
  padding: 0 28px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(12px);
}
.logo { font-family: var(--font-head); font-weight: 800; font-size: 1.3rem; color: var(--accent); display: flex; align-items: center; gap: 10px; letter-spacing: -0.5px; }
.logo span { color: var(--text); }
.logo-dot { width: 8px; height: 8px; background: var(--accent); border-radius: 50%; display: inline-block; animation: pulse 2s infinite; }
@keyframes pulse { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.4);opacity:.7} }
.header-nav { display: flex; align-items: center; gap: 8px; }
.nav-btn { background: transparent; border: 1px solid var(--border); color: var(--muted); padding: 7px 16px; border-radius: 8px; font-size: 0.85rem; font-weight: 500; transition: all 0.2s; }
.nav-btn:hover { background: var(--surface2); color: var(--text); border-color: var(--accent); }
.role-badge { padding: 4px 10px; border-radius: 6px; font-size: 0.75rem; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase; }
.role-badge.restaurant { background: rgba(255,107,53,0.15); color: var(--accent2); border: 1px solid rgba(255,107,53,0.3); }
.role-badge.receiver { background: rgba(0,229,160,0.12); color: var(--accent); border: 1px solid rgba(0,229,160,0.25); }
.role-badge.admin { background: rgba(124,158,255,0.12); color: var(--accent3); border: 1px solid rgba(124,158,255,0.25); }

/* ── Main Layout ── */
.main { flex: 1; display: flex; }
.sidebar { width: 230px; background: var(--surface); border-right: 1px solid var(--border); padding: 24px 12px; display: flex; flex-direction: column; gap: 4px; min-height: calc(100vh - 64px); }
.sidebar-item { display: flex; align-items: center; gap: 10px; padding: 10px 14px; border-radius: 9px; color: var(--muted); font-size: 0.875rem; font-weight: 500; cursor: pointer; transition: all 0.18s; border: 1px solid transparent; position: relative; }
.sidebar-item:hover { background: var(--surface2); color: var(--text); }
.sidebar-item.active { background: var(--surface2); color: var(--text); border-color: var(--border); }
.sidebar-item .icon { font-size: 1.1rem; min-width: 22px; text-align: center; }
.sidebar-section { font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: var(--muted); padding: 14px 14px 6px; }
.sidebar-badge { position: absolute; right: 12px; background: var(--accent); color: #000; font-size: 0.65rem; font-weight: 800; padding: 2px 6px; border-radius: 20px; }
.content { flex: 1; padding: 32px; overflow-y: auto; max-height: calc(100vh - 64px); }

/* ── Cards ── */
.card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 24px; margin-bottom: 20px; }
.card-title { font-family: var(--font-head); font-size: 1.1rem; font-weight: 700; color: var(--text); margin-bottom: 18px; display: flex; align-items: center; gap: 8px; }

/* ── Forms ── */
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.form-grid.one-col { grid-template-columns: 1fr; }
.form-grid.three-col { grid-template-columns: 1fr 1fr 1fr; }
.form-group { display: flex; flex-direction: column; gap: 6px; }
.form-group.full { grid-column: 1 / -1; }
label { font-size: 0.8rem; font-weight: 600; color: var(--muted); text-transform: uppercase; letter-spacing: 0.4px; }
input, select, textarea { background: var(--bg); border: 1px solid var(--border); color: var(--text); padding: 10px 13px; border-radius: 8px; font-size: 0.9rem; transition: border-color 0.2s; outline: none; width: 100%; }
input:focus, select:focus, textarea:focus { border-color: var(--accent); }
input.error-field { border-color: var(--danger); }
textarea { resize: vertical; min-height: 80px; }
select option { background: var(--surface); }
.field-error { color: var(--danger); font-size: 0.75rem; margin-top: 2px; }

/* ── Buttons ── */
.btn { display: inline-flex; align-items: center; gap: 7px; padding: 9px 20px; border-radius: 8px; font-size: 0.875rem; font-weight: 600; border: none; transition: all 0.2s; }
.btn-primary { background: var(--accent); color: #000; }
.btn-primary:hover { background: #00cc8e; transform: translateY(-1px); }
.btn-secondary { background: var(--surface2); color: var(--text); border: 1px solid var(--border); }
.btn-secondary:hover { border-color: var(--accent); color: var(--accent); }
.btn-danger { background: rgba(255,77,106,0.12); color: var(--danger); border: 1px solid rgba(255,77,106,0.25); }
.btn-danger:hover { background: rgba(255,77,106,0.22); }
.btn-sm { padding: 6px 13px; font-size: 0.8rem; }
.btn-ghost { background: transparent; color: var(--muted); border: 1px solid var(--border); }
.btn-ghost:hover { color: var(--text); }
.btn:disabled { opacity: 0.45; cursor: not-allowed; transform: none !important; }

/* ── Badges ── */
.badge { display: inline-block; padding: 3px 9px; border-radius: 5px; font-size: 0.72rem; font-weight: 700; letter-spacing: 0.4px; text-transform: uppercase; }
.badge-active { background: rgba(0,229,160,0.12); color: var(--accent); border: 1px solid rgba(0,229,160,0.25); }
.badge-reserved { background: rgba(255,200,87,0.12); color: var(--warning); border: 1px solid rgba(255,200,87,0.25); }
.badge-expired { background: rgba(110,127,148,0.12); color: var(--muted); border: 1px solid var(--border); }
.badge-pending { background: rgba(124,158,255,0.12); color: var(--accent3); border: 1px solid rgba(124,158,255,0.25); }
.badge-free { background: rgba(255,107,53,0.12); color: var(--accent2); border: 1px solid rgba(255,107,53,0.25); }

/* ── Page transitions ── */
.page-enter { animation: fadeUp 0.3s ease; }
@keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }

/* ── Auth ── */
.auth-wrap { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: var(--bg); background-image: radial-gradient(ellipse at 20% 40%, rgba(0,229,160,0.06) 0%, transparent 60%), radial-gradient(ellipse at 80% 70%, rgba(124,158,255,0.05) 0%, transparent 55%); }
.auth-card { background: var(--surface); border: 1px solid var(--border); border-radius: 16px; padding: 40px; width: 480px; max-width: 95vw; }
.auth-logo { text-align: center; margin-bottom: 28px; }
.auth-logo .logo { justify-content: center; font-size: 1.6rem; }
.auth-tabs { display: grid; grid-template-columns: 1fr 1fr; background: var(--bg); border-radius: 9px; padding: 3px; gap: 2px; margin-bottom: 24px; }
.auth-tab { padding: 9px; text-align: center; border-radius: 7px; font-size: 0.875rem; font-weight: 600; color: var(--muted); cursor: pointer; transition: all 0.2s; border: none; background: transparent; }
.auth-tab.active { background: var(--surface2); color: var(--text); }
.role-selector { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin: 16px 0; }
.role-option { border: 2px solid var(--border); border-radius: 10px; padding: 14px 12px; text-align: center; cursor: pointer; transition: all 0.2s; background: transparent; }
.role-option:hover { border-color: var(--accent); }
.role-option.selected.restaurant { border-color: var(--accent2); background: rgba(255,107,53,0.07); }
.role-option.selected.receiver { border-color: var(--accent); background: rgba(0,229,160,0.07); }
.role-option .role-icon { font-size: 1.6rem; display: block; margin-bottom: 5px; }
.role-option .role-label { font-size: 0.8rem; font-weight: 700; color: var(--text); }
.role-option .role-desc { font-size: 0.72rem; color: var(--muted); margin-top: 2px; }
.error-msg { background: rgba(255,77,106,0.1); border: 1px solid rgba(255,77,106,0.25); color: var(--danger); padding: 10px 14px; border-radius: 8px; font-size: 0.85rem; margin-bottom: 14px; }
.success-msg { background: rgba(0,229,160,0.1); border: 1px solid rgba(0,229,160,0.25); color: var(--accent); padding: 10px 14px; border-radius: 8px; font-size: 0.85rem; margin-bottom: 14px; }
.divider { text-align: center; color: var(--muted); font-size: 0.8rem; margin: 14px 0; position: relative; }
.divider::before, .divider::after { content: ''; position: absolute; top: 50%; width: 38%; height: 1px; background: var(--border); }
.divider::before { left: 0; } .divider::after { right: 0; }
.link-btn { background: none; border: none; color: var(--accent); font-size: 0.85rem; font-weight: 600; cursor: pointer; text-decoration: underline; padding: 0; }
.reg-step { display: none; }
.reg-step.active { display: block; }
.step-indicators { display: flex; gap: 6px; justify-content: center; margin-bottom: 20px; }
.step-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--border); transition: all 0.2s; }
.step-dot.active { background: var(--accent); width: 24px; border-radius: 4px; }
.step-dot.done { background: var(--accent); opacity: 0.5; }

/* ── Delivery-app Browse ── */
.browse-hero { background: linear-gradient(135deg, rgba(0,229,160,0.08), rgba(124,158,255,0.06)); border: 1px solid var(--border); border-radius: 16px; padding: 28px 32px; margin-bottom: 24px; display: flex; align-items: center; justify-content: space-between; gap: 20px; }
.browse-hero h2 { font-family: var(--font-head); font-size: 1.5rem; font-weight: 800; color: var(--text); margin-bottom: 4px; }
.browse-hero p { color: var(--muted); font-size: 0.875rem; }
.search-bar { display: flex; gap: 10px; align-items: center; background: var(--bg); border: 1px solid var(--border); border-radius: 10px; padding: 10px 16px; width: 280px; }
.search-bar input { border: none; background: transparent; padding: 0; font-size: 0.9rem; color: var(--text); }
.search-bar input:focus { border: none; }
.search-bar span { color: var(--muted); font-size: 1.1rem; }

/* Category scroll */
.cat-section { margin-bottom: 28px; }
.cat-section-title { font-family: var(--font-head); font-size: 1rem; font-weight: 700; color: var(--text); margin-bottom: 14px; }
.cat-scroll { display: flex; gap: 12px; overflow-x: auto; padding-bottom: 8px; scrollbar-width: none; }
.cat-scroll::-webkit-scrollbar { display: none; }
.cat-card { flex: 0 0 auto; display: flex; flex-direction: column; align-items: center; gap: 8px; cursor: pointer; transition: all 0.2s; }
.cat-card:hover .cat-icon-wrap { border-color: var(--accent); transform: translateY(-2px); }
.cat-card.active .cat-icon-wrap { border-color: var(--accent); background: rgba(0,229,160,0.1); }
.cat-card.active .cat-label { color: var(--accent); }
.cat-icon-wrap { width: 64px; height: 64px; border-radius: 16px; background: var(--surface); border: 2px solid var(--border); display: flex; align-items: center; justify-content: center; font-size: 1.8rem; transition: all 0.2s; }
.cat-label { font-size: 0.72rem; font-weight: 700; color: var(--muted); text-align: center; text-transform: uppercase; letter-spacing: 0.4px; max-width: 64px; }

/* Filter + Sort bar */
.filter-sort-bar { display: flex; gap: 10px; align-items: center; flex-wrap: wrap; margin-bottom: 20px; }
.filter-pill { display: flex; align-items: center; gap: 6px; background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 7px 12px; font-size: 0.82rem; color: var(--muted); cursor: pointer; transition: all 0.2s; white-space: nowrap; }
.filter-pill:hover { border-color: var(--accent); color: var(--text); }
.filter-pill.active { border-color: var(--accent); color: var(--accent); background: rgba(0,229,160,0.07); }
.filter-pill select { background: transparent; border: none; color: inherit; font-size: 0.82rem; outline: none; cursor: pointer; padding: 0; }
.toggle-switch { display: flex; align-items: center; gap: 8px; cursor: pointer; user-select: none; }
.toggle-switch input[type=checkbox] { display: none; }
.toggle-track { width: 36px; height: 20px; background: var(--border); border-radius: 20px; position: relative; transition: background 0.2s; }
.toggle-track::after { content: ''; position: absolute; top: 3px; left: 3px; width: 14px; height: 14px; background: white; border-radius: 50%; transition: left 0.2s; }
.toggle-switch input:checked + .toggle-track { background: var(--accent); }
.toggle-switch input:checked + .toggle-track::after { left: 19px; }
.toggle-label { font-size: 0.82rem; color: var(--muted); font-weight: 600; }

/* Listings grid / cards */
.listings-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 16px; }
.listing-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; transition: all 0.2s; cursor: pointer; }
.listing-card:hover { border-color: var(--accent); transform: translateY(-3px); box-shadow: 0 12px 32px rgba(0,229,160,0.1); }
.listing-card-img { height: 120px; background: var(--surface2); display: flex; align-items: center; justify-content: center; font-size: 3rem; position: relative; }
.listing-card-body { padding: 14px 16px 16px; }
.listing-name { font-family: var(--font-head); font-size: 0.95rem; font-weight: 700; color: var(--text); margin-bottom: 2px; }
.listing-restaurant { font-size: 0.78rem; color: var(--muted); }
.listing-meta-row { display: flex; justify-content: space-between; align-items: center; margin-top: 10px; }
.listing-price { font-family: var(--font-head); font-size: 1.1rem; font-weight: 800; color: var(--accent); }
.listing-price.free { color: var(--accent2); }
.listing-qty { font-size: 0.78rem; color: var(--muted); }
.listing-tags { display: flex; gap: 5px; flex-wrap: wrap; margin-top: 8px; }
.listing-tag { font-size: 0.68rem; font-weight: 700; padding: 2px 7px; border-radius: 4px; background: var(--surface2); color: var(--muted); border: 1px solid var(--border); text-transform: uppercase; letter-spacing: 0.3px; }
.add-to-cart-btn { width: 100%; margin-top: 12px; padding: 9px; background: var(--accent); color: #000; border: none; border-radius: 8px; font-weight: 700; font-size: 0.85rem; transition: all 0.2s; display: flex; align-items: center; justify-content: center; gap: 6px; }
.add-to-cart-btn:hover { background: #00cc8e; }
.add-to-cart-btn.in-cart { background: var(--surface2); color: var(--accent); border: 1px solid var(--accent); }

/* ── Cart sidebar ── */
.cart-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 199; backdrop-filter: blur(3px); }
.cart-drawer { position: fixed; top: 0; right: 0; width: 380px; max-width: 95vw; height: 100vh; background: var(--surface); border-left: 1px solid var(--border); z-index: 200; display: flex; flex-direction: column; animation: slideInRight 0.3s ease; }
@keyframes slideInRight { from { transform: translateX(100%); } to { transform: translateX(0); } }
.cart-header { padding: 20px 24px; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; }
.cart-header h2 { font-family: var(--font-head); font-size: 1.1rem; font-weight: 800; }
.cart-body { flex: 1; overflow-y: auto; padding: 20px 24px; }
.cart-item { display: flex; gap: 12px; padding: 14px 0; border-bottom: 1px solid var(--border); }
.cart-item-icon { width: 48px; height: 48px; border-radius: 10px; background: var(--surface2); display: flex; align-items: center; justify-content: center; font-size: 1.5rem; flex-shrink: 0; }
.cart-item-info { flex: 1; }
.cart-item-name { font-weight: 600; font-size: 0.875rem; color: var(--text); }
.cart-item-meta { font-size: 0.75rem; color: var(--muted); margin-top: 2px; }
.cart-item-price { font-family: var(--font-head); font-weight: 800; color: var(--accent); font-size: 0.95rem; }
.cart-timer { display: flex; align-items: center; gap: 6px; font-size: 0.75rem; color: var(--warning); margin-top: 4px; font-weight: 600; }
.remove-from-cart { background: none; border: none; color: var(--muted); font-size: 1rem; cursor: pointer; padding: 2px 4px; }
.remove-from-cart:hover { color: var(--danger); }
.cart-footer { padding: 20px 24px; border-top: 1px solid var(--border); }
.cart-total { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
.cart-total-label { font-size: 0.875rem; color: var(--muted); font-weight: 600; }
.cart-total-val { font-family: var(--font-head); font-size: 1.3rem; font-weight: 800; color: var(--text); }
.cart-empty { text-align: center; padding: 60px 20px; color: var(--muted); }
.cart-empty .cart-empty-icon { font-size: 2.5rem; margin-bottom: 12px; opacity: 0.5; }

/* ── Checkout ── */
.checkout-section { background: var(--bg); border: 1px solid var(--border); border-radius: 10px; padding: 18px; margin-bottom: 14px; }
.checkout-section h3 { font-family: var(--font-head); font-size: 0.9rem; font-weight: 700; margin-bottom: 12px; color: var(--text); }

/* ── Modal ── */
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.72); backdrop-filter: blur(5px); z-index: 200; display: flex; align-items: center; justify-content: center; padding: 20px; }
.modal { background: var(--surface); border: 1px solid var(--border); border-radius: 16px; padding: 32px; width: 560px; max-width: 100%; max-height: 90vh; overflow-y: auto; position: relative; animation: fadeUp 0.25s ease; }
.modal-close { position: absolute; top: 16px; right: 16px; background: var(--surface2); border: 1px solid var(--border); color: var(--muted); width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 1rem; }
.modal-close:hover { color: var(--text); }
.modal-title { font-family: var(--font-head); font-size: 1.3rem; font-weight: 800; margin-bottom: 4px; }
.modal-subtitle { color: var(--muted); font-size: 0.85rem; margin-bottom: 20px; }
.detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 20px; }
.detail-item label { font-size: 0.73rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: var(--muted); display: block; margin-bottom: 4px; }
.detail-item span { font-size: 0.9rem; color: var(--text); font-weight: 500; }
.product-emoji-lg { font-size: 5rem; text-align: center; padding: 24px; background: var(--surface2); border-radius: 12px; margin-bottom: 20px; }

/* ── Stats ── */
.stats-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 14px; margin-bottom: 24px; }
.stat-card { background: var(--surface); border: 1px solid var(--border); border-radius: 10px; padding: 18px; }
.stat-value { font-family: var(--font-head); font-size: 1.6rem; font-weight: 800; color: var(--accent); line-height: 1; }
.stat-value.orange { color: var(--accent2); }
.stat-value.blue { color: var(--accent3); }
.stat-label { font-size: 0.75rem; color: var(--muted); margin-top: 6px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.4px; }

/* ── Profile ── */
.profile-header { display: flex; align-items: center; gap: 18px; margin-bottom: 24px; }
.avatar { width: 68px; height: 68px; border-radius: 50%; background: linear-gradient(135deg, var(--accent), var(--accent3)); display: flex; align-items: center; justify-content: center; font-size: 1.6rem; font-weight: 800; color: #000; font-family: var(--font-head); flex-shrink: 0; }
.profile-name { font-family: var(--font-head); font-size: 1.3rem; font-weight: 700; }
.profile-meta { font-size: 0.85rem; color: var(--muted); display: flex; align-items: center; gap: 8px; margin-top: 4px; flex-wrap: wrap; }
.verification-tag { font-size: 0.72rem; padding: 2px 8px; border-radius: 4px; font-weight: 700; }
.verification-tag.verified { background: rgba(0,229,160,0.12); color: var(--accent); }
.verification-tag.pending { background: rgba(255,200,87,0.12); color: var(--warning); }
.activity-item { display: flex; align-items: flex-start; gap: 12px; padding: 12px 0; border-bottom: 1px solid var(--border); }
.activity-icon { width: 36px; height: 36px; border-radius: 9px; background: var(--surface2); display: flex; align-items: center; justify-content: center; font-size: 1rem; flex-shrink: 0; }
.activity-info { flex: 1; }
.activity-title { font-size: 0.875rem; font-weight: 600; color: var(--text); }
.activity-time { font-size: 0.75rem; color: var(--muted); margin-top: 2px; }

/* ── Upload ── */
.upload-area { border: 2px dashed var(--border); border-radius: 10px; padding: 24px; text-align: center; cursor: pointer; transition: all 0.2s; }
.upload-area:hover { border-color: var(--accent); background: rgba(0,229,160,0.03); }
.upload-area .upload-icon { font-size: 2rem; margin-bottom: 8px; }
.upload-area p { font-size: 0.85rem; color: var(--muted); }
.upload-area p strong { color: var(--accent); }

/* ── Wallet ── */
.bank-card { display: flex; align-items: center; justify-content: space-between; padding: 16px 18px; background: linear-gradient(135deg, var(--surface2), var(--surface3)); border-radius: 12px; border: 1px solid var(--border); margin-bottom: 14px; }
.bank-card-info h3 { font-weight: 700; font-size: 0.95rem; margin-bottom: 3px; }
.bank-card-info p { font-size: 0.78rem; color: var(--muted); }
.payout-item { display: flex; align-items: center; justify-content: space-between; padding: 14px 0; border-bottom: 1px solid var(--border); }
.payout-item:last-child { border-bottom: none; }

/* ── Pickup confirmations ── */
.pickup-item { display: flex; align-items: center; justify-content: space-between; padding: 14px 0; border-bottom: 1px solid var(--border); }
.pickup-item:last-child { border-bottom: none; }
.pickup-info { flex: 1; }
.pickup-name { font-weight: 600; font-size: 0.9rem; }
.pickup-meta { font-size: 0.78rem; color: var(--muted); margin-top: 3px; }

/* ── Toast ── */
.toast { position: fixed; bottom: 24px; right: 24px; background: var(--surface2); border: 1px solid var(--accent); color: var(--text); padding: 13px 20px; border-radius: 10px; font-size: 0.875rem; font-weight: 500; z-index: 300; animation: slideIn 0.3s ease, fadeOut 0.3s ease 2.7s forwards; max-width: 320px; box-shadow: 0 8px 24px rgba(0,0,0,0.4); }
@keyframes slideIn { from { opacity: 0; transform: translateX(40px); } to { opacity: 1; transform: translateX(0); } }
@keyframes fadeOut { from { opacity: 1; } to { opacity: 0; } }
.toast.error-toast { border-color: var(--danger); }

/* ── Page headers ── */
.page-header { margin-bottom: 24px; }
.page-header h1 { font-family: var(--font-head); font-size: 1.6rem; font-weight: 800; color: var(--text); }
.page-header p { color: var(--muted); font-size: 0.875rem; margin-top: 4px; }
.page-header-row { display: flex; align-items: flex-start; justify-content: space-between; }

/* ── Empty ── */
.empty-state { text-align: center; padding: 60px 20px; color: var(--muted); }
.empty-state .empty-icon { font-size: 3rem; margin-bottom: 12px; opacity: 0.6; }
.empty-state p { font-size: 0.9rem; }

/* ── Scrollbar ── */
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: var(--bg); }
::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }

/* ── Listing form image picker ── */
.emoji-picker { display: flex; flex-wrap: wrap; gap: 8px; padding: 10px; background: var(--bg); border: 1px solid var(--border); border-radius: 10px; }
.emoji-opt { width: 40px; height: 40px; border-radius: 8px; border: 2px solid transparent; background: var(--surface2); display: flex; align-items: center; justify-content: center; font-size: 1.3rem; cursor: pointer; transition: all 0.15s; }
.emoji-opt:hover { border-color: var(--accent); }
.emoji-opt.selected { border-color: var(--accent); background: rgba(0,229,160,0.1); }
`;

// ── Constants ──
const CATEGORIES = [
  { id: "All", icon: "🌐", label: "All" },
  { id: "Produce", icon: "🥬", label: "Produce" },
  { id: "Dairy", icon: "🧀", label: "Dairy" },
  { id: "Bakery", icon: "🥐", label: "Bakery" },
  { id: "Meat", icon: "🥩", label: "Meat" },
  { id: "Seafood", icon: "🐟", label: "Seafood" },
  { id: "Grains", icon: "🌾", label: "Grains" },
  { id: "Spices", icon: "🌶️", label: "Spices" },
  { id: "Beverages", icon: "🧃", label: "Beverages" },
  { id: "Desserts", icon: "🍮", label: "Desserts" },
];

const CAT_EMOJIS = {
  Produce: ["🥬","🍅","🥕","🥦","🧅","🥑","🌽","🫑","🥒","🍋"],
  Dairy: ["🧀","🥛","🧈","🍳"],
  Bakery: ["🥐","🍞","🥖","🫓","🥯","🎂"],
  Meat: ["🥩","🍗","🥓","🌭"],
  Seafood: ["🐟","🦐","🦑","🦞","🐙"],
  Grains: ["🌾","🍚","🍜","🌰"],
  Spices: ["🌶️","🧄","🫚","🫛","🍵"],
  Beverages: ["🧃","🍷","🥤","☕","🍵"],
  Desserts: ["🍮","🍰","🧁","🍫","🍯"],
};

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "price_asc", label: "Price: Low → High" },
  { value: "price_desc", label: "Price: High → Low" },
  { value: "expiry", label: "Expiring Soon" },
];

// ── Mock "Database" ──
const MOCK_USERS_DB = [
  {
    id: "u1", email: "rest@demo.com", password: "pass", role: "restaurant",
    name: "Arjun Mehta", biz: "The Green Fork",
    phone: "+91 98765 43210",
    address: "12 MG Road, Bengaluru 560001",
    storageCapacity: "Refrigerated: 200L, Dry: 500kg",
    operatingHours: "Mon–Sat 08:00–22:00",
    fssaiLicense: "10023040000123",
    bankLinked: true, bankName: "HDFC Bank", bankAccount: "•••• 4321", bankIFSC: "HDFC0001234",
    verified: true,
  },
  {
    id: "u2", email: "recv@demo.com", password: "pass", role: "receiver",
    name: "Priya Nair", biz: "Feed Bengaluru NGO",
    phone: "+91 91234 56789",
    address: "45 Koramangala 5th Block, Bengaluru",
    acctType: "Nonprofit / NGO",
    taxExempt: true, docUploaded: true,
    verified: true,
  },
  {
    id: "u3", email: "admin@demo.com", password: "pass", role: "admin",
    name: "Admin User", biz: "Platform Admin",
    verified: true,
  },
];

const SEED_LISTINGS = [
  { id: 1, name: "Heirloom Tomatoes", category: "Produce", emoji: "🍅", qty: 15, unit: "kg", storage: "Refrigerated", expiry: "2025-07-12", pickup: "08:00–12:00", price: 0, free: true, status: "active", restaurant: "The Green Fork", restaurantId: "u1", address: "12 MG Road, Bengaluru", description: "Vine-ripened heirloom tomatoes, perfect for salads and sauces. Mixed varieties including Cherokee Purple and Brandywine. Harvested fresh, slight cosmetic imperfections only.", allergens: "None", certifications: "Organic" },
  { id: 2, name: "Brioche Dough", category: "Bakery", emoji: "🥐", qty: 8, unit: "kg", storage: "Frozen", expiry: "2025-07-15", pickup: "14:00–18:00", price: 320, free: false, status: "active", restaurant: "Lumière Bistro", restaurantId: "u1", address: "45 Lavelle Road, Bengaluru", description: "House-made brioche dough, enriched with French butter and free-range eggs. Proofed and ready to shape. Excellent for burger buns, French toast, or pastries.", allergens: "Gluten, Eggs, Dairy", certifications: "" },
  { id: 3, name: "Saffron (50g packs)", category: "Spices", emoji: "🌶️", qty: 20, unit: "packs", storage: "Dry", expiry: "2025-09-01", pickup: "10:00–14:00", price: 450, free: false, status: "active", restaurant: "Zaffran Kitchen", restaurantId: "u1", address: "9 Koramangala 4th Block", description: "Premium Kashmiri saffron in sealed 50g packs. Grade A threads, rich aroma. Sourced directly from Pampore. Surplus from a cancelled catering event.", allergens: "None", certifications: "ISO 3632 Grade A" },
  { id: 4, name: "Heavy Cream", category: "Dairy", emoji: "🧈", qty: 12, unit: "L", storage: "Refrigerated", expiry: "2025-07-10", pickup: "07:00–10:00", price: 0, free: true, status: "active", restaurant: "Café Prism", restaurantId: "u1", address: "22 Indiranagar 100ft Rd", description: "Fresh double cream 48% fat. Unopened 1L Tetrapaks. Purchased for a dessert menu that got changed last minute. Best used for ganache, whipped cream, or ice cream.", allergens: "Dairy", certifications: "" },
  { id: 5, name: "Arborio Rice", category: "Grains", emoji: "🌾", qty: 25, unit: "kg", storage: "Dry", expiry: "2026-01-01", pickup: "09:00–13:00", price: 180, free: false, status: "reserved", restaurant: "Sotto Voce", restaurantId: "u1", address: "77 Church Street, Bengaluru", description: "Italian-origin Arborio rice, perfect for risotto, rice pudding, or arancini. Vacuum-sealed 5kg bags. No expiry concerns — sold as surplus from overstocking.", allergens: "None", certifications: "" },
  { id: 6, name: "Fresh Basil Bunches", category: "Produce", emoji: "🥬", qty: 30, unit: "bunches", storage: "Refrigerated", expiry: "2025-07-09", pickup: "08:00–11:00", price: 0, free: true, status: "active", restaurant: "The Green Fork", restaurantId: "u1", address: "12 MG Road, Bengaluru", description: "Large fresh basil bunches from our rooftop herb garden. Slightly overgrown — deeply fragrant, ideal for pesto, pasta, or cocktail garnish. Pick up urgently.", allergens: "None", certifications: "Homegrown" },
  { id: 7, name: "Dark Chocolate Couverture", category: "Desserts", emoji: "🍫", qty: 5, unit: "kg", storage: "Dry", expiry: "2025-12-01", pickup: "11:00–15:00", price: 950, free: false, status: "active", restaurant: "Lumière Bistro", restaurantId: "u1", address: "45 Lavelle Road, Bengaluru", description: "Valrhona Guanaja 70% couverture chocolate callets. Professional grade, ideal for tempering, ganache, and moulding. Excess from our pastry kitchen.", allergens: "Soy, May contain Dairy", certifications: "" },
  { id: 8, name: "Fresh Paneer Blocks", category: "Dairy", emoji: "🧀", qty: 10, unit: "kg", storage: "Refrigerated", expiry: "2025-07-11", pickup: "08:00–12:00", price: 220, free: false, status: "active", restaurant: "Zaffran Kitchen", restaurantId: "u1", address: "9 Koramangala 4th Block", description: "House-made fresh paneer, 1kg vacuum blocks. Soft, crumbly texture. Made fresh this morning from full-fat cow milk. Surplus from a cancelled bulk catering order.", allergens: "Dairy", certifications: "" },
];

// ── Validation helpers ──
const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  return re.test(email);
};
const validatePassword = (pw) => pw.length >= 6;

// ── Toast ──
function Toast({ msg, type = "success" }) {
  return <div className={`toast ${type === "error" ? "error-toast" : ""}`}>{type === "success" ? "✓" : "⚠"} {msg}</div>;
}

// ── Cart Timer ──
function CartTimer({ reservedAt, onExpire }) {
  const [remaining, setRemaining] = useState(0);
  useEffect(() => {
    const tick = () => {
      const elapsed = Math.floor((Date.now() - reservedAt) / 1000);
      const left = 7200 - elapsed;
      if (left <= 0) { onExpire(); return; }
      setRemaining(left);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [reservedAt, onExpire]);
  const h = Math.floor(remaining / 3600);
  const m = Math.floor((remaining % 3600) / 60);
  const s = remaining % 60;
  const fmt = (n) => String(n).padStart(2, "0");
  return <span className="cart-timer">⏱ Expires in {h > 0 ? `${h}h ` : ""}{fmt(m)}:{fmt(s)}</span>;
}

// ─────────────────────────────────────────────────────────────
// AUTH PAGE (multi-step registration)
// ─────────────────────────────────────────────────────────────
function AuthPage({ onLogin, usersDB, setUsersDB }) {
  const [tab, setTab] = useState("login");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPw, setLoginPw] = useState("");
  const [loginError, setLoginError] = useState("");
  const [forgot, setForgot] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [resetEmail, setResetEmail] = useState("");

  // Registration multi-step
  const [step, setStep] = useState(1);
  const [role, setRole] = useState("restaurant");
  const [regError, setRegError] = useState("");
  const [reg, setReg] = useState({
    name: "", email: "", password: "", confirmPw: "", biz: "",
    phone: "", address: "", acctType: "Nonprofit / NGO",
    fssaiLicense: "", storageCapacity: "", operatingHours: "",
    storageTypes: [],
  });
  const setR = (k, v) => setReg(r => ({ ...r, [k]: v }));
  const totalSteps = role === "restaurant" ? 3 : 2;

  const handleLogin = () => {
    setLoginError("");
    if (!validateEmail(loginEmail)) { setLoginError("Please enter a valid email address (e.g. name@domain.com)"); return; }
    const user = usersDB.find(u => u.email === loginEmail && u.password === loginPw);
    if (user) onLogin(user);
    else setLoginError("Invalid credentials. Try rest@demo.com / pass");
  };

  const handleRegNext = () => {
    setRegError("");
    if (step === 1) {
      if (!reg.name) { setRegError("Full name is required"); return; }
      if (!reg.email) { setRegError("Email is required"); return; }
      if (!validateEmail(reg.email)) { setRegError("Email must be a valid address (e.g. name@company.com)"); return; }
      if (usersDB.find(u => u.email === reg.email)) { setRegError("An account with this email already exists"); return; }
      if (!validatePassword(reg.password)) { setRegError("Password must be at least 6 characters"); return; }
      if (reg.password !== reg.confirmPw) { setRegError("Passwords do not match"); return; }
      setStep(2);
    } else if (step === 2) {
      if (!reg.biz) { setRegError("Business / organisation name is required"); return; }
      if (!reg.phone) { setRegError("Phone number is required"); return; }
      if (!reg.address) { setRegError("Address is required"); return; }
      if (role === "restaurant") setStep(3); else handleRegSubmit();
    } else if (step === 3) {
      handleRegSubmit();
    }
  };

  const handleRegSubmit = () => {
    const newUser = {
      id: "u" + Date.now(),
      email: reg.email, password: reg.password, role,
      name: reg.name, biz: reg.biz, phone: reg.phone, address: reg.address,
      ...(role === "restaurant" ? { fssaiLicense: reg.fssaiLicense, storageCapacity: reg.storageCapacity, operatingHours: reg.operatingHours } : {}),
      ...(role === "receiver" ? { acctType: reg.acctType } : {}),
      bankLinked: false, verified: false,
    };
    setUsersDB(db => [...db, newUser]);
    onLogin(newUser);
  };

  const handleForgot = () => { setResetSent(true); setTimeout(() => { setForgot(false); setResetSent(false); }, 3000); };

  if (forgot) return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="auth-logo"><div className="logo"><span className="logo-dot" /><span>Surplus</span><span style={{ color: "var(--text)" }}>Link</span></div></div>
        <div className="card-title" style={{ justifyContent: "center", marginBottom: 6 }}>Reset Password</div>
        <p style={{ color: "var(--muted)", fontSize: "0.85rem", textAlign: "center", marginBottom: 20 }}>Enter your registered email to receive a reset link</p>
        {resetSent && <div className="success-msg">✓ Reset link sent to {resetEmail} — check your inbox</div>}
        {!resetSent && <>
          <div className="form-group" style={{ marginBottom: 14 }}>
            <label>Email</label>
            <input value={resetEmail} onChange={e => setResetEmail(e.target.value)} placeholder="you@company.com" type="email" className={resetEmail && !validateEmail(resetEmail) ? "error-field" : ""} />
            {resetEmail && !validateEmail(resetEmail) && <span className="field-error">Enter a valid email address</span>}
          </div>
          <button className="btn btn-primary" style={{ width: "100%" }} onClick={handleForgot} disabled={!validateEmail(resetEmail)}>Send Reset Link</button>
        </>}
        <div style={{ textAlign: "center", marginTop: 14 }}><button className="link-btn" onClick={() => setForgot(false)}>← Back to Login</button></div>
      </div>
    </div>
  );

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="auth-logo"><div className="logo"><span className="logo-dot" /><span>Surplus</span><span style={{ color: "var(--text)" }}>Link</span></div></div>
        <div className="auth-tabs">
          <button className={`auth-tab${tab === "login" ? " active" : ""}`} onClick={() => { setTab("login"); setStep(1); setRegError(""); setLoginError(""); }}>Sign In</button>
          <button className={`auth-tab${tab === "register" ? " active" : ""}`} onClick={() => { setTab("register"); setStep(1); setLoginError(""); }}>Register</button>
        </div>

        {tab === "login" && <>
          {loginError && <div className="error-msg">{loginError}</div>}
          <div className="form-group" style={{ marginBottom: 12 }}>
            <label>Email</label>
            <input value={loginEmail} onChange={e => setLoginEmail(e.target.value)} placeholder="you@company.com" type="email" className={loginEmail && !validateEmail(loginEmail) ? "error-field" : ""} />
            {loginEmail && !validateEmail(loginEmail) && <span className="field-error">Must be a valid email (e.g. name@domain.com)</span>}
          </div>
          <div className="form-group" style={{ marginBottom: 6 }}>
            <label>Password</label>
            <input value={loginPw} onChange={e => setLoginPw(e.target.value)} placeholder="••••••••" type="password" onKeyDown={e => e.key === "Enter" && handleLogin()} />
          </div>
          <div style={{ textAlign: "right", marginBottom: 18 }}><button className="link-btn" onClick={() => setForgot(true)}>Forgot password?</button></div>
          <button className="btn btn-primary" style={{ width: "100%", padding: "12px" }} onClick={handleLogin}>Sign In</button>
          <div className="divider" style={{ marginTop: 18 }}>demo accounts</div>
          <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
            {[{ label: "🍽️ Restaurant", e: "rest@demo.com" }, { label: "🤝 Receiver", e: "recv@demo.com" }, { label: "🛡️ Admin", e: "admin@demo.com" }].map(d => (
              <button key={d.e} className="btn btn-ghost btn-sm" onClick={() => { setLoginEmail(d.e); setLoginPw("pass"); }}>{d.label}</button>
            ))}
          </div>
        </>}

        {tab === "register" && <>
          <div className="step-indicators">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div key={i} className={`step-dot${step === i + 1 ? " active" : step > i + 1 ? " done" : ""}`} />
            ))}
          </div>
          {regError && <div className="error-msg">{regError}</div>}

          {/* Step 1 — Account */}
          {step === 1 && <>
            <p style={{ color: "var(--muted)", fontSize: "0.82rem", marginBottom: 10 }}>Choose account type:</p>
            <div className="role-selector" style={{ marginBottom: 16 }}>
              <button className={`role-option${role === "restaurant" ? " selected restaurant" : ""}`} onClick={() => setRole("restaurant")}>
                <span className="role-icon">🍽️</span><span className="role-label">Restaurant</span><span className="role-desc">List surplus ingredients</span>
              </button>
              <button className={`role-option${role === "receiver" ? " selected receiver" : ""}`} onClick={() => setRole("receiver")}>
                <span className="role-icon">🤝</span><span className="role-label">Receiver</span><span className="role-desc">Browse & claim items</span>
              </button>
            </div>
            <div className="form-grid one-col" style={{ gap: 12, marginBottom: 16 }}>
              <div className="form-group"><label>Full Name *</label><input value={reg.name} onChange={e => setR("name", e.target.value)} placeholder="Your full name" /></div>
              <div className="form-group">
                <label>Email *</label>
                <input value={reg.email} onChange={e => setR("email", e.target.value)} placeholder="you@company.com" type="email" className={reg.email && !validateEmail(reg.email) ? "error-field" : ""} />
                {reg.email && !validateEmail(reg.email) && <span className="field-error">Must be a valid email (e.g. name@domain.com)</span>}
              </div>
              <div className="form-group"><label>Password * (min 6 chars)</label><input value={reg.password} onChange={e => setR("password", e.target.value)} placeholder="••••••••" type="password" /></div>
              <div className="form-group"><label>Confirm Password *</label><input value={reg.confirmPw} onChange={e => setR("confirmPw", e.target.value)} placeholder="••••••••" type="password" className={reg.confirmPw && reg.password !== reg.confirmPw ? "error-field" : ""} /></div>
            </div>
          </>}

          {/* Step 2 — Business Info */}
          {step === 2 && <>
            <p style={{ color: "var(--muted)", fontSize: "0.82rem", marginBottom: 12 }}>{role === "restaurant" ? "Tell us about your restaurant:" : "Tell us about your organisation:"}</p>
            <div className="form-grid one-col" style={{ gap: 12, marginBottom: 16 }}>
              <div className="form-group"><label>{role === "restaurant" ? "Restaurant Name *" : "Organisation Name *"}</label><input value={reg.biz} onChange={e => setR("biz", e.target.value)} placeholder="Business name" /></div>
              <div className="form-group"><label>Phone Number *</label><input value={reg.phone} onChange={e => setR("phone", e.target.value)} placeholder="+91 98765 43210" /></div>
              <div className="form-group"><label>Address *</label><input value={reg.address} onChange={e => setR("address", e.target.value)} placeholder="Full address with city" /></div>
              {role === "receiver" && <div className="form-group"><label>Organisation Type</label><select value={reg.acctType} onChange={e => setR("acctType", e.target.value)}><option>Nonprofit / NGO</option><option>Small Business</option><option>Individual</option><option>Community Kitchen</option></select></div>}
            </div>
          </>}

          {/* Step 3 — Restaurant Storage Details */}
          {step === 3 && role === "restaurant" && <>
            <p style={{ color: "var(--muted)", fontSize: "0.82rem", marginBottom: 12 }}>Storage & compliance details:</p>
            <div className="form-grid one-col" style={{ gap: 12, marginBottom: 16 }}>
              <div className="form-group"><label>FSSAI License Number</label><input value={reg.fssaiLicense} onChange={e => setR("fssaiLicense", e.target.value)} placeholder="14-digit license number" /></div>
              <div className="form-group"><label>Operating Hours</label><input value={reg.operatingHours} onChange={e => setR("operatingHours", e.target.value)} placeholder="e.g. Mon–Sat 08:00–22:00" /></div>
              <div className="form-group">
                <label>Storage Facilities</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 4 }}>
                  {["Refrigerated", "Frozen", "Dry Storage", "Warm Holding"].map(s => (
                    <button key={s} type="button" className={`filter-pill${reg.storageTypes.includes(s) ? " active" : ""}`}
                      onClick={() => setR("storageTypes", reg.storageTypes.includes(s) ? reg.storageTypes.filter(x => x !== s) : [...reg.storageTypes, s])}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <div className="form-group"><label>Storage Capacity</label><input value={reg.storageCapacity} onChange={e => setR("storageCapacity", e.target.value)} placeholder="e.g. Fridge 200L, Dry 500kg" /></div>
            </div>
          </>}

          <div style={{ display: "flex", gap: 10 }}>
            {step > 1 && <button className="btn btn-secondary" style={{ flex: 1, padding: "11px" }} onClick={() => setStep(s => s - 1)}>← Back</button>}
            <button className="btn btn-primary" style={{ flex: 1, padding: "11px" }} onClick={handleRegNext}>
              {step === totalSteps ? "Create Account" : "Next →"}
            </button>
          </div>
        </>}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// BROWSE PAGE — Delivery-app style
// ─────────────────────────────────────────────────────────────
function BrowsePage({ listings, onToast, cart, setCart, onShowDetail }) {
  const [cat, setCat] = useState("All");
  const [storage, setStorage] = useState("All");
  const [freeOnly, setFreeOnly] = useState(false);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");

  const visible = listings
    .filter(l => l.status === "active")
    .filter(l => cat === "All" || l.category === cat)
    .filter(l => storage === "All" || l.storage === storage)
    .filter(l => !freeOnly || l.free)
    .filter(l => !search || l.name.toLowerCase().includes(search.toLowerCase()) || l.restaurant.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sort === "price_asc") return (a.price) - (b.price);
      if (sort === "price_desc") return (b.price) - (a.price);
      if (sort === "expiry") return new Date(a.expiry) - new Date(b.expiry);
      return b.id - a.id;
    });

  const inCart = (id) => cart.some(c => c.id === id);

  const handleAddToCart = (l, e) => {
    e?.stopPropagation();
    if (inCart(l.id)) { onToast("Already in your cart"); return; }
    setCart(c => [...c, { ...l, reservedAt: Date.now() }]);
    onToast(`${l.name} added to cart — reserved for 2 hours`);
  };

  // Section: group by category for deliver-app feel when "All" selected
  const grouped = cat === "All"
    ? CATEGORIES.filter(c => c.id !== "All").map(c => ({
        cat: c, items: visible.filter(l => l.category === c.id)
      })).filter(g => g.items.length > 0)
    : [{ cat: CATEGORIES.find(c => c.id === cat), items: visible }];

  return (
    <div className="page-enter">
      {/* Hero */}
      <div className="browse-hero">
        <div>
          <h2>Fresh Surplus, Near You</h2>
          <p>Bengaluru · {listings.filter(l => l.status === "active").length} items available now</p>
        </div>
        <div className="search-bar">
          <span>🔍</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search ingredients or restaurants…" />
        </div>
      </div>

      {/* Category scroll */}
      <div className="cat-section">
        <div className="cat-label" style={{ fontSize: "0.85rem", fontWeight: 700, fontFamily: "var(--font-head)", color: "var(--text)", marginBottom: 12 }}>Browse by Category</div>
        <div className="cat-scroll">
          {CATEGORIES.map(c => (
            <div key={c.id} className={`cat-card${cat === c.id ? " active" : ""}`} onClick={() => setCat(c.id)}>
              <div className="cat-icon-wrap">{c.icon}</div>
              <span className="cat-label">{c.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Filter + Sort bar */}
      <div className="filter-sort-bar">
        <div className="filter-pill">
          <span>📦</span>
          <select value={storage} onChange={e => setStorage(e.target.value)}>
            {["All", "Refrigerated", "Frozen", "Dry", "Room Temp"].map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div className="filter-pill">
          <span>↕️</span>
          <select value={sort} onChange={e => setSort(e.target.value)}>
            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
        <label className="toggle-switch">
          <input type="checkbox" checked={freeOnly} onChange={e => setFreeOnly(e.target.checked)} />
          <span className="toggle-track" /><span className="toggle-label">Free only</span>
        </label>
        <span style={{ marginLeft: "auto", fontSize: "0.8rem", color: "var(--muted)" }}>{visible.length} result{visible.length !== 1 ? "s" : ""}</span>
      </div>

      {/* Items */}
      {visible.length === 0 && <div className="empty-state"><div className="empty-icon">🔍</div><p>No listings match your filters</p></div>}

      {grouped.map(({ cat: c, items }) => (
        <div key={c.id} style={{ marginBottom: 32 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
            <span style={{ fontSize: "1.2rem" }}>{c.icon}</span>
            <span style={{ fontFamily: "var(--font-head)", fontWeight: 700, fontSize: "1rem", color: "var(--text)" }}>{c.label}</span>
            <span style={{ fontSize: "0.75rem", color: "var(--muted)", marginLeft: 4 }}>({items.length})</span>
          </div>
          <div className="listings-grid">
            {items.map(l => (
              <div key={l.id} className="listing-card" onClick={() => onShowDetail(l)}>
                <div className="listing-card-img">{l.emoji || "📦"}
                  {l.free && <span className="badge badge-free" style={{ position: "absolute", top: 10, right: 10 }}>FREE</span>}
                  {l.status === "reserved" && <span className="badge badge-reserved" style={{ position: "absolute", top: 10, right: 10 }}>RESERVED</span>}
                </div>
                <div className="listing-card-body">
                  <div className="listing-name">{l.name}</div>
                  <div className="listing-restaurant">{l.restaurant}</div>
                  <div className="listing-tags">
                    <span className="listing-tag">{l.storage}</span>
                    <span className="listing-tag">{l.category}</span>
                    <span className="listing-tag">Exp: {l.expiry}</span>
                  </div>
                  <div className="listing-meta-row">
                    <span className={`listing-price${l.free ? " free" : ""}`}>{l.free ? "Free" : `₹${l.price}`}</span>
                    <span className="listing-qty">{l.qty} {l.unit} avail.</span>
                  </div>
                  <button className={`add-to-cart-btn${inCart(l.id) ? " in-cart" : ""}`}
                    onClick={e => handleAddToCart(l, e)}>
                    {inCart(l.id) ? "✓ In Cart" : "+ Add to Cart"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// PRODUCT DETAIL MODAL
// ─────────────────────────────────────────────────────────────
function ProductDetailModal({ listing, onClose, cart, setCart, onToast }) {
  const inCart = cart.some(c => c.id === listing.id);
  const handleAdd = () => {
    if (inCart) { onToast("Already in your cart"); return; }
    setCart(c => [...c, { ...listing, reservedAt: Date.now() }]);
    onToast(`${listing.name} reserved for 2 hours — check your cart`);
    onClose();
  };
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <div className="product-emoji-lg">{listing.emoji || "📦"}</div>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 4 }}>
          <div className="modal-title">{listing.name}</div>
          <span className={`listing-price${listing.free ? " free" : ""}`} style={{ fontSize: "1.3rem", flexShrink: 0, marginLeft: 12 }}>{listing.free ? "Free" : `₹${listing.price}`}</span>
        </div>
        <div className="modal-subtitle">🏪 {listing.restaurant} · 📍 {listing.address}</div>
        {listing.description && (
          <div style={{ background: "var(--bg)", borderRadius: 10, padding: "14px 16px", marginBottom: 18, fontSize: "0.875rem", color: "var(--muted)", lineHeight: 1.7, border: "1px solid var(--border)" }}>
            <div style={{ fontWeight: 700, color: "var(--text)", marginBottom: 6, fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.4px" }}>About this product</div>
            {listing.description}
          </div>
        )}
        <div className="detail-grid">
          {[
            ["Category", listing.category],
            ["Storage", listing.storage],
            ["Quantity", `${listing.qty} ${listing.unit}`],
            ["Expiry Date", listing.expiry],
            ["Pickup Window", listing.pickup || "Contact restaurant"],
            ["Price", listing.free ? "Free / Donation" : `₹${listing.price}`],
            ...(listing.allergens ? [["Allergens", listing.allergens]] : []),
            ...(listing.certifications ? [["Certifications", listing.certifications]] : []),
          ].map(([k, v]) => (
            <div key={k} className="detail-item"><label>{k}</label><span>{v}</span></div>
          ))}
        </div>
        <div style={{ background: "var(--bg)", borderRadius: 9, padding: "12px 14px", marginBottom: 20, fontSize: "0.82rem", color: "var(--muted)", lineHeight: 1.6, border: "1px solid var(--border)" }}>
          📍 <span style={{ color: "var(--text)" }}>{listing.address}</span> &nbsp;·&nbsp;
          ⏰ <span style={{ color: "var(--text)" }}>{listing.pickup || "Contact restaurant"}</span>
        </div>
        <button className="btn btn-primary" style={{ width: "100%", padding: "13px", fontSize: "0.95rem" }} onClick={handleAdd} disabled={listing.status === "reserved"}>
          {inCart ? "✓ Already in Cart" : listing.status === "reserved" ? "Currently Reserved" : "🛒 Add to Cart — locks for 2 hrs"}
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// CART DRAWER + CHECKOUT
// ─────────────────────────────────────────────────────────────
function CartDrawer({ cart, setCart, onClose, onToast }) {
  const [checking, setChecking] = useState(false);
  const [payMethod, setPayMethod] = useState("upi");
  const [upiId, setUpiId] = useState("");
  const [orderDone, setOrderDone] = useState(false);

  const total = cart.reduce((s, i) => s + (i.price || 0), 0);
  const freeItems = cart.filter(i => i.free).length;

  const handleExpire = (id) => {
    setCart(c => c.filter(i => i.id !== id));
    onToast("A reserved item expired and was removed from cart", "error");
  };

  const handleRemove = (id) => {
    setCart(c => c.filter(i => i.id !== id));
    onToast("Item removed from cart");
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;
    setOrderDone(true);
    setTimeout(() => {
      setCart([]);
      onClose();
      onToast("Order placed! Pickup details sent to your email.");
    }, 2500);
  };

  if (orderDone) return (
    <>
      <div className="cart-overlay" onClick={onClose} />
      <div className="cart-drawer" style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", padding: 40 }}>
          <div style={{ fontSize: "4rem", marginBottom: 16 }}>🎉</div>
          <div style={{ fontFamily: "var(--font-head)", fontSize: "1.3rem", fontWeight: 800, marginBottom: 8 }}>Order Placed!</div>
          <p style={{ color: "var(--muted)", fontSize: "0.875rem" }}>Pickup details have been sent to your email. Items are confirmed reserved.</p>
        </div>
      </div>
    </>
  );

  return (
    <>
      <div className="cart-overlay" onClick={onClose} />
      <div className="cart-drawer">
        <div className="cart-header">
          <h2>🛒 Your Cart {cart.length > 0 && <span style={{ color: "var(--accent)", marginLeft: 6 }}>({cart.length})</span>}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        {!checking ? (
          <>
            <div className="cart-body">
              {cart.length === 0
                ? <div className="cart-empty"><div className="cart-empty-icon">🛒</div><p>Your cart is empty</p><p style={{ fontSize: "0.78rem", marginTop: 8 }}>Browse surplus items and add them here</p></div>
                : cart.map(item => (
                  <div key={item.id} className="cart-item">
                    <div className="cart-item-icon">{item.emoji || "📦"}</div>
                    <div className="cart-item-info">
                      <div className="cart-item-name">{item.name}</div>
                      <div className="cart-item-meta">{item.restaurant} · {item.qty} {item.unit}</div>
                      <CartTimer reservedAt={item.reservedAt} onExpire={() => handleExpire(item.id)} />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
                      <div className="cart-item-price">{item.free ? "Free" : `₹${item.price}`}</div>
                      <button className="remove-from-cart" onClick={() => handleRemove(item.id)}>✕</button>
                    </div>
                  </div>
                ))
              }
            </div>
            {cart.length > 0 && (
              <div className="cart-footer">
                {freeItems > 0 && <div style={{ fontSize: "0.78rem", color: "var(--accent2)", marginBottom: 10, fontWeight: 600 }}>🎁 {freeItems} free item{freeItems > 1 ? "s" : ""} in your cart</div>}
                <div className="cart-total">
                  <span className="cart-total-label">Total</span>
                  <span className="cart-total-val">{total === 0 ? "Free" : `₹${total}`}</span>
                </div>
                <button className="btn btn-primary" style={{ width: "100%", padding: "12px" }} onClick={() => setChecking(true)}>Proceed to Checkout →</button>
              </div>
            )}
          </>
        ) : (
          /* Checkout view */
          <>
            <div className="cart-body">
              <div className="checkout-section">
                <h3>📦 Order Summary</h3>
                {cart.map(i => <div key={i.id} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", marginBottom: 8, color: "var(--muted)" }}>
                  <span style={{ color: "var(--text)" }}>{i.name}</span>
                  <span style={{ color: i.free ? "var(--accent2)" : "var(--text)", fontWeight: 600 }}>{i.free ? "Free" : `₹${i.price}`}</span>
                </div>)}
                <div style={{ borderTop: "1px solid var(--border)", paddingTop: 10, marginTop: 6, display: "flex", justifyContent: "space-between", fontWeight: 700 }}>
                  <span>Total</span><span style={{ color: "var(--accent)" }}>{total === 0 ? "Free" : `₹${total}`}</span>
                </div>
              </div>
              <div className="checkout-section">
                <h3>💳 Payment Method</h3>
                {total === 0
                  ? <div style={{ color: "var(--muted)", fontSize: "0.85rem" }}>No payment required — all items are free</div>
                  : <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {[{ val: "upi", label: "UPI / GPay / PhonePe" }, { val: "card", label: "Credit / Debit Card" }, { val: "cash", label: "Cash on Pickup" }].map(o => (
                      <label key={o.val} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", padding: "10px 12px", border: `1px solid ${payMethod === o.val ? "var(--accent)" : "var(--border)"}`, borderRadius: 8, background: payMethod === o.val ? "rgba(0,229,160,0.05)" : "transparent", fontSize: "0.875rem", color: "var(--text)", fontWeight: 500 }}>
                        <input type="radio" name="pay" value={o.val} checked={payMethod === o.val} onChange={() => setPayMethod(o.val)} style={{ width: "auto", background: "none", border: "none", padding: 0, accentColor: "var(--accent)" }} />
                        {o.label}
                      </label>
                    ))}
                    {payMethod === "upi" && <input value={upiId} onChange={e => setUpiId(e.target.value)} placeholder="yourname@upi" style={{ marginTop: 8 }} />}
                  </div>
                }
              </div>
              <div className="checkout-section">
                <h3>⏰ Pickup Schedule</h3>
                {cart.map(i => <div key={i.id} style={{ fontSize: "0.82rem", color: "var(--muted)", marginBottom: 6 }}>
                  <span style={{ color: "var(--text)", fontWeight: 600 }}>{i.name}</span> — {i.restaurant}, {i.pickup || "Contact restaurant"}
                </div>)}
              </div>
            </div>
            <div className="cart-footer">
              <button className="btn btn-secondary" style={{ width: "100%", marginBottom: 10 }} onClick={() => setChecking(false)}>← Back to Cart</button>
              <button className="btn btn-primary" style={{ width: "100%", padding: "13px" }} onClick={handleCheckout}>Confirm Order 🎉</button>
            </div>
          </>
        )}
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────
// MY LISTINGS PAGE (Restaurant)
// ─────────────────────────────────────────────────────────────
function MyListingsPage({ listings, setListings, user, onToast }) {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [tab, setTab] = useState("active");
  const emptyForm = { name: "", category: "Produce", emoji: "🥬", qty: "", unit: "kg", storage: "Refrigerated", expiry: "", pickup: "", price: "", free: false, description: "", allergens: "", certifications: "" };
  const [form, setForm] = useState(emptyForm);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const myListings = listings.filter(l => l.restaurantId === user.id || l.restaurant === user.biz);
  const filtered = myListings.filter(l => l.status === tab);
  const pendingPickups = myListings.filter(l => l.status === "reserved");

  const setF = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = () => {
    if (!form.name || !form.qty || !form.expiry) { onToast("Fill required fields (Name, Qty, Expiry)"); return; }
    if (editing !== null) {
      setListings(ls => ls.map(l => l.id === editing ? { ...l, ...form, price: form.free ? 0 : Number(form.price) } : l));
      onToast("Listing updated");
    } else {
      const newListing = { ...form, id: Date.now(), price: form.free ? 0 : Number(form.price), status: "active", restaurant: user.biz, restaurantId: user.id, address: user.address || "" };
      setListings(ls => [...ls, newListing]);
      onToast("Listing created successfully");
    }
    setShowForm(false); setEditing(null); setForm(emptyForm);
  };

  const handleEdit = (l) => {
    setEditing(l.id);
    setForm({ name: l.name, category: l.category, emoji: l.emoji || "📦", qty: l.qty, unit: l.unit, storage: l.storage, expiry: l.expiry, pickup: l.pickup, price: l.price, free: l.free, description: l.description || "", allergens: l.allergens || "", certifications: l.certifications || "" });
    setShowForm(true);
  };

  const currentEmojis = CAT_EMOJIS[form.category] || ["📦"];

  return (
    <div className="page-enter">
      <div className="page-header page-header-row">
        <div><h1>My Listings</h1><p>Manage your surplus ingredient postings</p></div>
        <button className="btn btn-primary" onClick={() => { setShowForm(true); setEditing(null); setForm(emptyForm); }}>+ New Listing</button>
      </div>

      {pendingPickups.length > 0 && (
        <div className="card" style={{ borderColor: "rgba(255,200,87,0.3)" }}>
          <div className="card-title">⏳ Pickup Confirmations Pending</div>
          {pendingPickups.map(l => (
            <div key={l.id} className="pickup-item">
              <div className="pickup-info">
                <div className="pickup-name">{l.name}</div>
                <div className="pickup-meta">Reserved · {l.qty} {l.unit} · Pickup: {l.pickup}</div>
              </div>
              <button className="btn btn-primary btn-sm" onClick={() => {
                setListings(ls => ls.map(x => x.id === l.id ? { ...x, status: "active", confirmed: true } : x));
                onToast("Pickup confirmed!");
              }}>Confirm Pickup ✓</button>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="card" style={{ borderColor: "var(--accent)" }}>
          <div className="card-title">{editing !== null ? "✏️ Edit Listing" : "📝 New Listing"}</div>
          <div className="form-grid">
            <div className="form-group"><label>Ingredient Name *</label><input value={form.name} onChange={e => setF("name", e.target.value)} placeholder="e.g. Heirloom Tomatoes" /></div>
            <div className="form-group"><label>Category</label>
              <select value={form.category} onChange={e => { setF("category", e.target.value); setF("emoji", CAT_EMOJIS[e.target.value]?.[0] || "📦"); }}>
                {CATEGORIES.filter(c => c.id !== "All").map(c => <option key={c.id}>{c.id}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Product Icon</label>
              <button type="button" className="btn btn-ghost btn-sm" style={{ fontSize: "1.4rem", padding: "6px 12px" }} onClick={() => setShowEmojiPicker(v => !v)}>{form.emoji}</button>
              {showEmojiPicker && <div className="emoji-picker">
                {currentEmojis.map(em => <button key={em} type="button" className={`emoji-opt${form.emoji === em ? " selected" : ""}`} onClick={() => { setF("emoji", em); setShowEmojiPicker(false); }}>{em}</button>)}
              </div>}
            </div>
            <div className="form-group"><label>Quantity *</label><input type="number" value={form.qty} onChange={e => setF("qty", e.target.value)} placeholder="0" /></div>
            <div className="form-group"><label>Unit</label><select value={form.unit} onChange={e => setF("unit", e.target.value)}>{["kg","g","L","ml","packs","units","bunches","boxes","portions"].map(u => <option key={u}>{u}</option>)}</select></div>
            <div className="form-group"><label>Storage Type</label><select value={form.storage} onChange={e => setF("storage", e.target.value)}>{["Refrigerated","Frozen","Dry","Room Temp","Warm Holding"].map(s => <option key={s}>{s}</option>)}</select></div>
            <div className="form-group"><label>Expiry Date *</label><input type="date" value={form.expiry} onChange={e => setF("expiry", e.target.value)} /></div>
            <div className="form-group"><label>Pickup Window</label><input value={form.pickup} onChange={e => setF("pickup", e.target.value)} placeholder="e.g. 08:00–12:00" /></div>
            <div className="form-group">
              <label>Price (₹)</label>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <input type="number" value={form.price} disabled={form.free} onChange={e => setF("price", e.target.value)} placeholder="0" />
                <label className="toggle-switch" style={{ whiteSpace: "nowrap" }}>
                  <input type="checkbox" checked={form.free} onChange={e => setF("free", e.target.checked)} />
                  <span className="toggle-track" /><span className="toggle-label">Free</span>
                </label>
              </div>
            </div>
            <div className="form-group full"><label>Description</label><textarea value={form.description} onChange={e => setF("description", e.target.value)} placeholder="Describe the item — condition, source, best uses, why it's surplus…" /></div>
            <div className="form-group"><label>Allergens</label><input value={form.allergens} onChange={e => setF("allergens", e.target.value)} placeholder="e.g. Gluten, Dairy, Nuts" /></div>
            <div className="form-group"><label>Certifications / Notes</label><input value={form.certifications} onChange={e => setF("certifications", e.target.value)} placeholder="e.g. Organic, FSSAI compliant" /></div>
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
            <button className="btn btn-primary" onClick={handleSubmit}>{editing !== null ? "Save Changes" : "Create Listing"}</button>
            <button className="btn btn-secondary" onClick={() => { setShowForm(false); setEditing(null); }}>Cancel</button>
          </div>
        </div>
      )}

      <div style={{ display: "flex", gap: 6, marginBottom: 18 }}>
        {["active", "reserved", "expired"].map(t => (
          <button key={t} className={`btn btn-sm ${tab === t ? "btn-primary" : "btn-ghost"}`} onClick={() => setTab(t)}>
            {t.charAt(0).toUpperCase() + t.slice(1)} ({myListings.filter(l => l.status === t).length})
          </button>
        ))}
      </div>

      {filtered.length === 0
        ? <div className="empty-state"><div className="empty-icon">📦</div><p>No {tab} listings</p></div>
        : <div className="listings-grid">
          {filtered.map(l => (
            <div key={l.id} className="listing-card">
              <div className="listing-card-img">{l.emoji || "📦"}
                <span className={`badge badge-${l.status}`} style={{ position: "absolute", top: 10, right: 10 }}>{l.status}</span>
              </div>
              <div className="listing-card-body">
                <div className="listing-name">{l.name}</div>
                <div className="listing-restaurant">{l.category} · {l.storage}</div>
                <div className="listing-tags">
                  <span className="listing-tag">{l.qty} {l.unit}</span>
                  <span className="listing-tag">Exp {l.expiry}</span>
                  <span className="listing-tag">{l.free ? "Free" : `₹${l.price}`}</span>
                </div>
                {l.status === "active" && (
                  <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                    <button className="btn btn-secondary btn-sm" onClick={() => handleEdit(l)}>Edit</button>
                    <button className="btn btn-danger btn-sm" onClick={() => { setListings(ls => ls.filter(x => x.id !== l.id)); onToast("Listing deleted"); }}>Delete</button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      }
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// WALLET PAGE
// ─────────────────────────────────────────────────────────────
function WalletPage({ user, usersDB, setUsersDB, onToast }) {
  const [linking, setLinking] = useState(false);
  const [bankForm, setBankForm] = useState({ holder: "", account: "", confirm: "", ifsc: "", bank: "" });
  const [bf, setBf] = useState(null);
  const currentUser = usersDB.find(u => u.id === user.id) || user;

  const history = [
    { id: "PO-1042", date: "Jun 28, 2025", item: "Heirloom Tomatoes", amt: 0, status: "Donation" },
    { id: "PO-1031", date: "Jun 15, 2025", item: "Brioche Dough (8kg)", amt: 2560, status: "Paid" },
    { id: "PO-1019", date: "Jun 01, 2025", item: "Saffron x4 packs", amt: 1800, status: "Paid" },
    { id: "PO-1008", date: "May 22, 2025", item: "Heavy Cream (6L)", amt: 0, status: "Donation" },
    { id: "PO-0995", date: "May 10, 2025", item: "Dark Choc Couverture", amt: 4750, status: "Paid" },
  ];

  const handleLink = () => {
    if (!bankForm.holder || !bankForm.account || !bankForm.ifsc || !bankForm.bank) { onToast("Fill all bank fields"); return; }
    if (bankForm.account !== bankForm.confirm) { onToast("Account numbers don't match"); return; }
    setUsersDB(db => db.map(u => u.id === user.id ? { ...u, bankLinked: true, bankName: bankForm.bank, bankAccount: "•••• " + bankForm.account.slice(-4), bankIFSC: bankForm.ifsc } : u));
    setLinking(false); setBankForm({ holder: "", account: "", confirm: "", ifsc: "", bank: "" });
    onToast("Bank account linked via Stripe Connect");
  };

  return (
    <div className="page-enter">
      <div className="page-header"><h1>Wallet & Payouts</h1><p>Manage your bank account and payout history</p></div>
      <div className="stats-row">
        <div className="stat-card"><div className="stat-value">₹4,210</div><div className="stat-label">Pending Payout</div></div>
        <div className="stat-card"><div className="stat-value orange">₹{history.reduce((s, h) => s + h.amt, 0).toLocaleString()}</div><div className="stat-label">Total Earned</div></div>
        <div className="stat-card"><div className="stat-value blue">{history.length}</div><div className="stat-label">Transactions</div></div>
      </div>
      <div className="card">
        <div className="card-title">🏦 Linked Bank Account</div>
        {currentUser.bankLinked
          ? <div className="bank-card">
            <div className="bank-card-info">
              <h3>{currentUser.bankName} {currentUser.bankAccount}</h3>
              <p>IFSC: {currentUser.bankIFSC} · Stripe Connect · Verified</p>
            </div>
            <span className="badge badge-active">Active</span>
          </div>
          : <div style={{ color: "var(--muted)", fontSize: "0.875rem", marginBottom: 14 }}>No bank account linked. Link one to receive payouts.</div>
        }
        <button className="btn btn-secondary" style={{ marginTop: 6 }} onClick={() => setLinking(v => !v)}>
          {linking ? "Cancel" : currentUser.bankLinked ? "Link Another Account" : "+ Link Bank Account"}
        </button>
        {linking && (
          <div style={{ marginTop: 16, padding: 16, background: "var(--bg)", borderRadius: 10, border: "1px solid var(--border)" }}>
            <div className="form-grid" style={{ marginBottom: 12 }}>
              <div className="form-group"><label>Account Holder Name</label><input value={bankForm.holder} onChange={e => setBankForm(f => ({ ...f, holder: e.target.value }))} placeholder="As on bank records" /></div>
              <div className="form-group"><label>Bank Name</label><input value={bankForm.bank} onChange={e => setBankForm(f => ({ ...f, bank: e.target.value }))} placeholder="HDFC, ICICI, SBI…" /></div>
              <div className="form-group"><label>Account Number</label><input value={bankForm.account} onChange={e => setBankForm(f => ({ ...f, account: e.target.value }))} placeholder="Account number" type="password" /></div>
              <div className="form-group"><label>Confirm Account Number</label><input value={bankForm.confirm} onChange={e => setBankForm(f => ({ ...f, confirm: e.target.value }))} placeholder="Re-enter account number" /></div>
              <div className="form-group"><label>IFSC Code</label><input value={bankForm.ifsc} onChange={e => setBankForm(f => ({ ...f, ifsc: e.target.value.toUpperCase() }))} placeholder="HDFC0001234" /></div>
            </div>
            <button className="btn btn-primary btn-sm" onClick={handleLink}>Verify & Link</button>
          </div>
        )}
      </div>
      <div className="card">
        <div className="card-title">📊 Payment History</div>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
          <thead><tr style={{ borderBottom: "1px solid var(--border)" }}>
            {["Reference", "Date", "Item", "Amount", "Status"].map(h => <th key={h} style={{ textAlign: "left", padding: "8px 10px", color: "var(--muted)", fontWeight: 700, fontSize: "0.73rem", textTransform: "uppercase", letterSpacing: "0.4px" }}>{h}</th>)}
          </tr></thead>
          <tbody>{history.map(r => <tr key={r.id} style={{ borderBottom: "1px solid var(--border)" }}>
            <td style={{ padding: "12px 10px", fontFamily: "var(--font-head)", fontWeight: 600, color: "var(--accent3)" }}>{r.id}</td>
            <td style={{ padding: "12px 10px", color: "var(--muted)", fontSize: "0.82rem" }}>{r.date}</td>
            <td style={{ padding: "12px 10px" }}>{r.item}</td>
            <td style={{ padding: "12px 10px", fontWeight: 700, color: r.amt === 0 ? "var(--accent2)" : "var(--accent)" }}>{r.amt === 0 ? "Donation" : `₹${r.amt.toLocaleString()}`}</td>
            <td style={{ padding: "12px 10px" }}><span className={`badge ${r.status === "Paid" ? "badge-active" : "badge-pending"}`}>{r.status}</span></td>
          </tr>)}</tbody>
        </table>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// PROFILE PAGE
// ─────────────────────────────────────────────────────────────
function ProfilePage({ user, usersDB, setUsersDB, onToast }) {
  const currentUser = usersDB.find(u => u.id === user.id) || user;
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ ...currentUser });
  const [docUploaded, setDocUploaded] = useState(currentUser.docUploaded || false);
  const setF = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const activity = [
    { icon: "📦", title: "Listed Fresh Basil Bunches — 30 bunches", time: "2 hours ago" },
    { icon: "✅", title: "Pickup confirmed for Brioche Dough", time: "Yesterday" },
    { icon: "💳", title: "Payout of ₹2,560 received", time: "Jun 28" },
    { icon: "📝", title: "Profile updated", time: "Jun 15" },
    { icon: "🏦", title: "Bank account linked", time: "Jun 01" },
  ];

  const recvActivity = [
    { icon: "🛒", title: "Reserved Heirloom Tomatoes — 5kg", time: "1 hour ago" },
    { icon: "✅", title: "Picked up Fresh Basil from The Green Fork", time: "Yesterday" },
    { icon: "📄", title: "Compliance document uploaded", time: "Jun 20" },
    { icon: "🏠", title: "Account created", time: "Jun 01" },
  ];

  const handleSave = () => {
    setUsersDB(db => db.map(u => u.id === user.id ? { ...u, ...form } : u));
    setEditing(false);
    onToast("Profile updated successfully");
  };

  return (
    <div className="page-enter">
      <div className="page-header page-header-row">
        <div><h1>Profile</h1><p>Manage your account information</p></div>
        {!editing && <button className="btn btn-secondary" onClick={() => setEditing(true)}>✏️ Edit Profile</button>}
      </div>
      <div className="profile-header">
        <div className="avatar">{currentUser.name[0].toUpperCase()}</div>
        <div>
          <div className="profile-name">{form.name}</div>
          <div className="profile-meta">
            <span className={`role-badge ${currentUser.role}`}>{currentUser.role}</span>
            <span className={`verification-tag ${currentUser.verified ? "verified" : "pending"}`}>{currentUser.verified ? "✓ Verified" : "⏳ Pending"}</span>
            {currentUser.role === "restaurant" && <span style={{ fontSize: "0.78rem", color: "var(--muted)" }}>{currentUser.fssaiLicense ? `FSSAI: ${currentUser.fssaiLicense}` : "No FSSAI on file"}</span>}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-title">📋 Personal Information</div>
        <div className="form-grid">
          <div className="form-group"><label>Full Name</label><input value={form.name} disabled={!editing} onChange={e => setF("name", e.target.value)} /></div>
          <div className="form-group"><label>{currentUser.role === "restaurant" ? "Restaurant Name" : "Organisation Name"}</label><input value={form.biz || ""} disabled={!editing} onChange={e => setF("biz", e.target.value)} /></div>
          <div className="form-group"><label>Email</label><input value={currentUser.email} disabled /></div>
          <div className="form-group"><label>Phone</label><input value={form.phone || ""} disabled={!editing} onChange={e => setF("phone", e.target.value)} placeholder="+91 98765 43210" /></div>
          <div className="form-group full"><label>Address</label><input value={form.address || ""} disabled={!editing} onChange={e => setF("address", e.target.value)} /></div>
          {currentUser.role === "restaurant" && <>
            <div className="form-group"><label>FSSAI License</label><input value={form.fssaiLicense || ""} disabled={!editing} onChange={e => setF("fssaiLicense", e.target.value)} placeholder="14-digit license" /></div>
            <div className="form-group"><label>Operating Hours</label><input value={form.operatingHours || ""} disabled={!editing} onChange={e => setF("operatingHours", e.target.value)} /></div>
            <div className="form-group full"><label>Storage Capacity</label><input value={form.storageCapacity || ""} disabled={!editing} onChange={e => setF("storageCapacity", e.target.value)} /></div>
          </>}
          {currentUser.role === "receiver" && <div className="form-group"><label>Account Type</label>
            {editing ? <select value={form.acctType || ""} onChange={e => setF("acctType", e.target.value)}><option>Nonprofit / NGO</option><option>Small Business</option><option>Individual</option><option>Community Kitchen</option></select>
              : <input value={form.acctType || ""} disabled />}
          </div>}
        </div>
        {editing && <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
          <button className="btn btn-primary" onClick={handleSave}>Save Changes</button>
          <button className="btn btn-secondary" onClick={() => { setForm({ ...currentUser }); setEditing(false); }}>Cancel</button>
        </div>}
      </div>

      {currentUser.role === "receiver" && (
        <div className="card">
          <div className="card-title">📄 Compliance Documents</div>
          <p style={{ color: "var(--muted)", fontSize: "0.85rem", marginBottom: 16 }}>Upload your tax exemption certificate to receive items at no charge as a verified nonprofit.</p>
          {docUploaded
            ? <div className="success-msg">✓ Exemption certificate uploaded — <span style={{ fontWeight: 700 }}>pending admin verification</span></div>
            : <div className="upload-area" onClick={() => { setDocUploaded(true); onToast("Document uploaded for verification"); }}>
              <div className="upload-icon">📑</div>
              <p><strong>Click to upload</strong> or drag and drop</p>
              <p style={{ marginTop: 4, fontSize: "0.75rem" }}>PDF, JPG, PNG up to 10MB</p>
            </div>
          }
        </div>
      )}

      <div className="card">
        <div className="card-title">📅 Recent Activity</div>
        {(currentUser.role === "restaurant" ? activity : recvActivity).map((a, i) => (
          <div key={i} className="activity-item">
            <div className="activity-icon">{a.icon}</div>
            <div className="activity-info">
              <div className="activity-title">{a.title}</div>
              <div className="activity-time">{a.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// DASHBOARD
// ─────────────────────────────────────────────────────────────
function Dashboard({ user, listings, onNavigate }) {
  const myListings = listings.filter(l => l.restaurant === user.biz || l.restaurantId === user.id);
  return (
    <div className="page-enter">
      <div className="page-header"><h1>Welcome back, {user.name.split(" ")[0]} 👋</h1><p>Here's your platform overview for today</p></div>
      <div className="stats-row">
        {user.role === "restaurant" && <>
          <div className="stat-card"><div className="stat-value">{myListings.filter(l => l.status === "active").length}</div><div className="stat-label">Active Listings</div></div>
          <div className="stat-card"><div className="stat-value orange">{myListings.filter(l => l.status === "reserved").length}</div><div className="stat-label">Reserved</div></div>
          <div className="stat-card"><div className="stat-value blue">₹4,210</div><div className="stat-label">Pending Payout</div></div>
        </>}
        {user.role === "receiver" && <>
          <div className="stat-card"><div className="stat-value">{listings.filter(l => l.status === "active").length}</div><div className="stat-label">Items Available</div></div>
          <div className="stat-card"><div className="stat-value orange">3</div><div className="stat-label">My Reservations</div></div>
          <div className="stat-card"><div className="stat-value blue">7</div><div className="stat-label">Total Claims</div></div>
        </>}
        {user.role === "admin" && <>
          <div className="stat-card"><div className="stat-value">{listings.length}</div><div className="stat-label">Total Listings</div></div>
          <div className="stat-card"><div className="stat-value orange">5</div><div className="stat-label">Active Users</div></div>
          <div className="stat-card"><div className="stat-value blue">12</div><div className="stat-label">Transactions</div></div>
        </>}
      </div>
      <div className="card">
        <div className="card-title">🌿 Platform Impact</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 16 }}>
          {[["🥗", "142 kg", "Food saved this month"], ["🤝", "28", "Successful handoffs"], ["🏢", "9", "Partner restaurants"], ["📉", "₹18,400", "Value recovered"]].map(([ic, v, l]) => (
            <div key={l} style={{ textAlign: "center", padding: "18px 12px", background: "var(--bg)", borderRadius: 10, border: "1px solid var(--border)" }}>
              <div style={{ fontSize: "1.6rem", marginBottom: 6 }}>{ic}</div>
              <div style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: "1.15rem", color: "var(--accent)" }}>{v}</div>
              <div style={{ fontSize: "0.75rem", color: "var(--muted)", marginTop: 4 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
      {user.role === "receiver" && (
        <div className="card" style={{ cursor: "pointer" }} onClick={() => onNavigate("browse")}>
          <div className="card-title">🔍 Browse Available Items</div>
          <div className="listings-grid">
            {listings.filter(l => l.status === "active").slice(0, 3).map(l => (
              <div key={l.id} className="listing-card">
                <div className="listing-card-img">{l.emoji || "📦"}</div>
                <div className="listing-card-body">
                  <div className="listing-name">{l.name}</div>
                  <div className="listing-restaurant">{l.restaurant}</div>
                  <div className="listing-meta-row"><span className={`listing-price${l.free ? " free" : ""}`}>{l.free ? "Free" : `₹${l.price}`}</span><span className="listing-qty">{l.qty} {l.unit}</span></div>
                </div>
              </div>
            ))}
          </div>
          <button className="btn btn-primary" style={{ marginTop: 16 }}>View all items →</button>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// ADMIN PAGE
// ─────────────────────────────────────────────────────────────
function AdminPage({ listings, usersDB, onToast }) {
  const [flagged, setFlagged] = useState([]);
  const [suspended, setSuspended] = useState([]);
  return (
    <div className="page-enter">
      <div className="page-header"><h1>Admin Panel</h1><p>User management, listings overview, and transaction log</p></div>
      <div className="stats-row">
        <div className="stat-card"><div className="stat-value">{usersDB.length}</div><div className="stat-label">Total Users</div></div>
        <div className="stat-card"><div className="stat-value orange">{listings.length}</div><div className="stat-label">All Listings</div></div>
        <div className="stat-card"><div className="stat-value blue">12</div><div className="stat-label">Transactions</div></div>
        <div className="stat-card"><div className="stat-value" style={{ color: "var(--danger)" }}>{flagged.length}</div><div className="stat-label">Flagged</div></div>
      </div>
      <div className="card">
        <div className="card-title">👥 User Management</div>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
          <thead><tr style={{ borderBottom: "1px solid var(--border)" }}>
            {["Name", "Role", "Email", "Status", "Actions"].map(h => <th key={h} style={{ textAlign: "left", padding: "8px 10px", color: "var(--muted)", fontWeight: 700, fontSize: "0.73rem", textTransform: "uppercase", letterSpacing: "0.4px" }}>{h}</th>)}
          </tr></thead>
          <tbody>{usersDB.filter(u => u.role !== "admin").map(u => {
            const isFlagged = flagged.includes(u.id);
            const isSuspended = suspended.includes(u.id);
            return <tr key={u.id} style={{ borderBottom: "1px solid var(--border)", opacity: isSuspended ? 0.5 : 1 }}>
              <td style={{ padding: "12px 10px", fontWeight: 600 }}>{u.name}</td>
              <td style={{ padding: "12px 10px" }}><span className={`role-badge ${u.role}`}>{u.role}</span></td>
              <td style={{ padding: "12px 10px", color: "var(--muted)", fontSize: "0.82rem" }}>{u.email}</td>
              <td style={{ padding: "12px 10px" }}>
                <span className={`badge ${isSuspended ? "badge-expired" : isFlagged ? "badge-reserved" : "badge-active"}`}>
                  {isSuspended ? "Suspended" : isFlagged ? "Flagged" : "Active"}
                </span>
              </td>
              <td style={{ padding: "12px 10px", display: "flex", gap: 6 }}>
                <button className="btn btn-secondary btn-sm" onClick={() => { setFlagged(f => isFlagged ? f.filter(x => x !== u.id) : [...f, u.id]); onToast(isFlagged ? "Flag removed" : "User flagged"); }}>{isFlagged ? "Unflag" : "Flag"}</button>
                <button className="btn btn-danger btn-sm" onClick={() => { setSuspended(s => isSuspended ? s.filter(x => x !== u.id) : [...s, u.id]); onToast(isSuspended ? "User reinstated" : "User suspended"); }}>{isSuspended ? "Reinstate" : "Suspend"}</button>
              </td>
            </tr>;
          })}</tbody>
        </table>
      </div>
      <div className="card">
        <div className="card-title">📋 All Listings</div>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
          <thead><tr style={{ borderBottom: "1px solid var(--border)" }}>
            {["Item", "Restaurant", "Category", "Status", "Price"].map(h => <th key={h} style={{ textAlign: "left", padding: "8px 10px", color: "var(--muted)", fontWeight: 700, fontSize: "0.73rem", textTransform: "uppercase", letterSpacing: "0.4px" }}>{h}</th>)}
          </tr></thead>
          <tbody>{listings.map(l => <tr key={l.id} style={{ borderBottom: "1px solid var(--border)" }}>
            <td style={{ padding: "12px 10px", fontWeight: 600 }}>{l.emoji} {l.name}</td>
            <td style={{ padding: "12px 10px", color: "var(--muted)", fontSize: "0.82rem" }}>{l.restaurant}</td>
            <td style={{ padding: "12px 10px" }}>{l.category}</td>
            <td style={{ padding: "12px 10px" }}><span className={`badge badge-${l.status}`}>{l.status}</span></td>
            <td style={{ padding: "12px 10px", color: l.free ? "var(--accent2)" : "var(--accent)", fontWeight: 700 }}>{l.free ? "Free" : `₹${l.price}`}</td>
          </tr>)}</tbody>
        </table>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// ROOT APP
// ─────────────────────────────────────────────────────────────
export default function App() {
  const [usersDB, setUsersDB] = useState(MOCK_USERS_DB);
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("dashboard");
  const [listings, setListings] = useState(SEED_LISTINGS);
  const [toast, setToast] = useState(null);
  const [toastType, setToastType] = useState("success");
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [detailItem, setDetailItem] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast(msg); setToastType(type);
    setTimeout(() => setToast(null), 3200);
  };

  if (!user) return (
    <>
      <style>{STYLE}</style>
      <AuthPage onLogin={(u) => { setUser(u); setPage("dashboard"); }} usersDB={usersDB} setUsersDB={setUsersDB} />
    </>
  );

  const restaurantNav = [
    { id: "dashboard", icon: "🏠", label: "Dashboard" },
    { id: "listings", icon: "📦", label: "My Listings" },
    { id: "wallet", icon: "💳", label: "Wallet & Payouts" },
    { id: "profile", icon: "👤", label: "Profile" },
  ];
  const receiverNav = [
    { id: "dashboard", icon: "🏠", label: "Dashboard" },
    { id: "browse", icon: "🛍️", label: "Browse Surplus", badge: listings.filter(l => l.status === "active").length },
    { id: "profile", icon: "👤", label: "Profile" },
  ];
  const adminNav = [
    { id: "dashboard", icon: "🏠", label: "Dashboard" },
    { id: "admin", icon: "🛡️", label: "Admin Panel" },
    { id: "profile", icon: "👤", label: "Profile" },
  ];
  const nav = user.role === "restaurant" ? restaurantNav : user.role === "receiver" ? receiverNav : adminNav;

  const renderPage = () => {
    switch (page) {
      case "dashboard": return <Dashboard user={user} listings={listings} onNavigate={setPage} />;
      case "profile": return <ProfilePage user={user} usersDB={usersDB} setUsersDB={setUsersDB} onToast={showToast} />;
      case "listings": return <MyListingsPage listings={listings} setListings={setListings} user={user} onToast={showToast} />;
      case "wallet": return <WalletPage user={user} usersDB={usersDB} setUsersDB={setUsersDB} onToast={showToast} />;
      case "browse": return <BrowsePage listings={listings} onToast={showToast} cart={cart} setCart={setCart} onShowDetail={setDetailItem} />;
      case "admin": return <AdminPage listings={listings} usersDB={usersDB} onToast={showToast} />;
      default: return <Dashboard user={user} listings={listings} onNavigate={setPage} />;
    }
  };

  return (
    <>
      <style>{STYLE}</style>
      <div className="app-wrap">
        <header className="header">
          <div className="logo"><span className="logo-dot" /><span>Surplus</span><span style={{ color: "var(--text)" }}>Link</span></div>
          <div className="header-nav">
            {user.role === "receiver" && (
              <button className="nav-btn" style={{ position: "relative" }} onClick={() => setCartOpen(true)}>
                🛒 Cart {cart.length > 0 && <span style={{ marginLeft: 4, background: "var(--accent)", color: "#000", borderRadius: "20px", padding: "1px 6px", fontSize: "0.7rem", fontWeight: 800 }}>{cart.length}</span>}
              </button>
            )}
            <span className={`role-badge ${user.role}`}>{user.biz || user.name}</span>
            <button className="nav-btn" onClick={() => { setUser(null); setPage("dashboard"); setCart([]); }}>Sign Out</button>
          </div>
        </header>
        <div className="main">
          <nav className="sidebar">
            <div className="sidebar-section">Navigation</div>
            {nav.map(n => (
              <div key={n.id} className={`sidebar-item${page === n.id ? " active" : ""}`} onClick={() => setPage(n.id)}>
                <span className="icon">{n.icon}</span>{n.label}
                {n.badge && <span className="sidebar-badge">{n.badge}</span>}
              </div>
            ))}
          </nav>
          <main className="content">{renderPage()}</main>
        </div>
      </div>
      {cartOpen && <CartDrawer cart={cart} setCart={setCart} onClose={() => setCartOpen(false)} onToast={showToast} />}
      {detailItem && <ProductDetailModal listing={detailItem} onClose={() => setDetailItem(null)} cart={cart} setCart={setCart} onToast={showToast} />}
      {toast && <Toast msg={toast} type={toastType} />}
    </>
  );
}
