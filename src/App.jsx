import { useState, useEffect } from "react";

// ─────────────────────────────────────────────────────────────
// GLOBAL STYLES
// ─────────────────────────────────────────────────────────────
const STYLE = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
:root {
  --bg: #0d1117; --surface: #161b22; --surface2: #1e2530; --surface3: #242c38;
  --border: #2a3340; --accent: #00e5a0; --accent2: #ff6b35; --accent3: #7c9eff;
  --text: #e8edf3; --muted: #6e7f94; --danger: #ff4d6a; --warning: #ffc857;
  --radius: 12px; --font-head: 'Syne', sans-serif; --font-body: 'DM Sans', sans-serif;
}
body { background: var(--bg); color: var(--text); font-family: var(--font-body); min-height: 100vh; }
button { cursor: pointer; font-family: var(--font-body); }
input, select, textarea { font-family: var(--font-body); }
.app-wrap { display: flex; flex-direction: column; min-height: 100vh; }

/* Header */
.header { background: rgba(22,27,34,0.95); border-bottom: 1px solid var(--border); padding: 0 28px; height: 64px; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; z-index: 100; backdrop-filter: blur(12px); }
.logo { font-family: var(--font-head); font-weight: 800; font-size: 1.3rem; color: var(--accent); display: flex; align-items: center; gap: 10px; letter-spacing: -0.5px; cursor: pointer; }
.logo-dot { width: 8px; height: 8px; background: var(--accent); border-radius: 50%; display: inline-block; animation: pulse 2s infinite; }
@keyframes pulse { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.4);opacity:.7} }
.header-right { display: flex; align-items: center; gap: 10px; }
.header-avatar { width: 36px; height: 36px; border-radius: 50%; background: linear-gradient(135deg,var(--accent),var(--accent3)); display: flex; align-items: center; justify-content: center; font-family: var(--font-head); font-weight: 800; font-size: 0.9rem; color: #000; cursor: pointer; border: 2px solid transparent; transition: border-color 0.2s; }
.header-avatar:hover { border-color: var(--accent); }
.nav-btn { background: transparent; border: 1px solid var(--border); color: var(--muted); padding: 7px 16px; border-radius: 8px; font-size: 0.85rem; font-weight: 500; transition: all 0.2s; }
.nav-btn:hover { background: var(--surface2); color: var(--text); border-color: var(--accent); }
.cart-btn { position: relative; background: var(--surface2); border: 1px solid var(--border); color: var(--text); padding: 7px 16px; border-radius: 8px; font-size: 0.85rem; font-weight: 600; transition: all 0.2s; display: flex; align-items: center; gap: 7px; }
.cart-btn:hover { border-color: var(--accent); }
.cart-count { background: var(--accent); color: #000; border-radius: 20px; padding: 1px 6px; font-size: 0.68rem; font-weight: 800; }
.role-badge { padding: 4px 10px; border-radius: 6px; font-size: 0.75rem; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase; }
.role-badge.restaurant { background: rgba(255,107,53,0.15); color: var(--accent2); border: 1px solid rgba(255,107,53,0.3); }
.role-badge.receiver { background: rgba(0,229,160,0.12); color: var(--accent); border: 1px solid rgba(0,229,160,0.25); }
.role-badge.admin { background: rgba(124,158,255,0.12); color: var(--accent3); border: 1px solid rgba(124,158,255,0.25); }

/* Layout */
.main { flex: 1; display: flex; }
.sidebar { width: 230px; background: var(--surface); border-right: 1px solid var(--border); padding: 24px 12px; display: flex; flex-direction: column; gap: 4px; min-height: calc(100vh - 64px); }
.sidebar-item { display: flex; align-items: center; gap: 10px; padding: 10px 14px; border-radius: 9px; color: var(--muted); font-size: 0.875rem; font-weight: 500; cursor: pointer; transition: all 0.18s; border: 1px solid transparent; position: relative; }
.sidebar-item:hover { background: var(--surface2); color: var(--text); }
.sidebar-item.active { background: var(--surface2); color: var(--text); border-color: var(--border); }
.sidebar-item .s-icon { font-size: 1.1rem; min-width: 22px; text-align: center; }
.sidebar-section { font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: var(--muted); padding: 14px 14px 6px; }
.sidebar-badge { position: absolute; right: 12px; background: var(--accent); color: #000; font-size: 0.65rem; font-weight: 800; padding: 2px 6px; border-radius: 20px; }
.content { flex: 1; padding: 32px; overflow-y: auto; max-height: calc(100vh - 64px); }

/* Cards */
.card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 24px; margin-bottom: 20px; }
.card-title { font-family: var(--font-head); font-size: 1.1rem; font-weight: 700; color: var(--text); margin-bottom: 18px; display: flex; align-items: center; gap: 8px; }

/* Forms */
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.form-grid.one-col { grid-template-columns: 1fr; }
.form-group { display: flex; flex-direction: column; gap: 6px; }
.form-group.full { grid-column: 1 / -1; }
label { font-size: 0.8rem; font-weight: 600; color: var(--muted); text-transform: uppercase; letter-spacing: 0.4px; }
input, select, textarea { background: var(--bg); border: 1px solid var(--border); color: var(--text); padding: 10px 13px; border-radius: 8px; font-size: 0.9rem; transition: border-color 0.2s; outline: none; width: 100%; }
input:focus, select:focus, textarea:focus { border-color: var(--accent); }
input.err { border-color: var(--danger) !important; }
textarea { resize: vertical; min-height: 80px; }
select option { background: var(--surface); }
.field-err { color: var(--danger); font-size: 0.74rem; margin-top: 2px; }
.pending-note { font-size: 0.74rem; color: var(--warning); margin-top: 3px; display: flex; align-items: center; gap: 4px; }

/* Buttons */
.btn { display: inline-flex; align-items: center; gap: 7px; padding: 9px 20px; border-radius: 8px; font-size: 0.875rem; font-weight: 600; border: none; transition: all 0.2s; }
.btn-primary { background: var(--accent); color: #000; }
.btn-primary:hover { background: #00cc8e; transform: translateY(-1px); }
.btn-secondary { background: var(--surface2); color: var(--text); border: 1px solid var(--border); }
.btn-secondary:hover { border-color: var(--accent); color: var(--accent); }
.btn-danger { background: rgba(255,77,106,0.12); color: var(--danger); border: 1px solid rgba(255,77,106,0.25); }
.btn-danger:hover { background: rgba(255,77,106,0.22); }
.btn-sm { padding: 6px 13px; font-size: 0.8rem; }
.btn-ghost { background: transparent; color: var(--muted); border: 1px solid var(--border); }
.btn-ghost:hover { color: var(--text); border-color: var(--accent); }
.btn:disabled { opacity: 0.42; cursor: not-allowed; transform: none !important; }

/* Badges */
.badge { display: inline-block; padding: 3px 9px; border-radius: 5px; font-size: 0.72rem; font-weight: 700; letter-spacing: 0.4px; text-transform: uppercase; }
.badge-active { background: rgba(0,229,160,0.12); color: var(--accent); border: 1px solid rgba(0,229,160,0.25); }
.badge-reserved { background: rgba(255,200,87,0.12); color: var(--warning); border: 1px solid rgba(255,200,87,0.25); }
.badge-expired { background: rgba(110,127,148,0.12); color: var(--muted); border: 1px solid var(--border); }
.badge-pending { background: rgba(124,158,255,0.12); color: var(--accent3); border: 1px solid rgba(124,158,255,0.25); }
.badge-free { background: rgba(255,107,53,0.12); color: var(--accent2); border: 1px solid rgba(255,107,53,0.25); }

/* Page transitions */
.page-enter { animation: fadeUp 0.28s ease; }
@keyframes fadeUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }

/* ── AUTH ── */
.auth-wrap { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: var(--bg); background-image: radial-gradient(ellipse at 20% 40%,rgba(0,229,160,0.07) 0%,transparent 60%), radial-gradient(ellipse at 80% 70%,rgba(124,158,255,0.05) 0%,transparent 55%); }
.auth-card { background: var(--surface); border: 1px solid var(--border); border-radius: 16px; padding: 40px; width: 480px; max-width: 95vw; max-height: 95vh; overflow-y: auto; }
.auth-logo { text-align: center; margin-bottom: 28px; }
.auth-logo .logo { justify-content: center; font-size: 1.6rem; }
.auth-tabs { display: grid; grid-template-columns: 1fr 1fr; background: var(--bg); border-radius: 9px; padding: 3px; gap: 2px; margin-bottom: 22px; }
.auth-tab { padding: 9px; text-align: center; border-radius: 7px; font-size: 0.875rem; font-weight: 600; color: var(--muted); cursor: pointer; transition: all 0.2s; border: none; background: transparent; }
.auth-tab.active { background: var(--surface2); color: var(--text); }
.role-selector { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin: 12px 0 18px; }
.role-option { border: 2px solid var(--border); border-radius: 10px; padding: 14px 12px; text-align: center; cursor: pointer; transition: all 0.2s; background: transparent; }
.role-option:hover { border-color: var(--accent); }
.role-option.selected.restaurant { border-color: var(--accent2); background: rgba(255,107,53,0.07); }
.role-option.selected.receiver { border-color: var(--accent); background: rgba(0,229,160,0.07); }
.role-icon { font-size: 1.6rem; display: block; margin-bottom: 5px; }
.role-label { font-size: 0.8rem; font-weight: 700; color: var(--text); }
.role-desc { font-size: 0.72rem; color: var(--muted); margin-top: 2px; }
.error-msg { background: rgba(255,77,106,0.1); border: 1px solid rgba(255,77,106,0.25); color: var(--danger); padding: 10px 14px; border-radius: 8px; font-size: 0.85rem; margin-bottom: 14px; }
.success-msg { background: rgba(0,229,160,0.1); border: 1px solid rgba(0,229,160,0.25); color: var(--accent); padding: 10px 14px; border-radius: 8px; font-size: 0.85rem; margin-bottom: 14px; }
.divider { text-align: center; color: var(--muted); font-size: 0.8rem; margin: 14px 0; position: relative; }
.divider::before, .divider::after { content:''; position:absolute; top:50%; width:37%; height:1px; background:var(--border); }
.divider::before { left:0; } .divider::after { right:0; }
.link-btn { background: none; border: none; color: var(--accent); font-size: 0.85rem; font-weight: 600; cursor: pointer; text-decoration: underline; padding: 0; }
.step-bar { display: flex; gap: 6px; justify-content: center; margin-bottom: 20px; }
.step-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--border); transition: all 0.25s; }
.step-dot.active { background: var(--accent); width: 26px; border-radius: 4px; }
.step-dot.done { background: var(--accent); opacity: 0.45; }

/* ── Browse / Delivery-app ── */
.browse-hero { background: linear-gradient(135deg,rgba(0,229,160,0.07),rgba(124,158,255,0.05)); border: 1px solid var(--border); border-radius: 16px; padding: 26px 30px; margin-bottom: 24px; display: flex; align-items: center; justify-content: space-between; gap: 20px; flex-wrap: wrap; }
.browse-hero h2 { font-family: var(--font-head); font-size: 1.45rem; font-weight: 800; color: var(--text); margin-bottom: 4px; }
.browse-hero p { color: var(--muted); font-size: 0.875rem; }
.search-wrap { display: flex; align-items: center; gap: 8px; background: var(--bg); border: 1px solid var(--border); border-radius: 10px; padding: 9px 14px; min-width: 260px; }
.search-wrap input { border: none; background: transparent; padding: 0; font-size: 0.875rem; color: var(--text); }
.search-wrap input:focus { border: none; }
.cat-scroll { display: flex; gap: 12px; overflow-x: auto; padding-bottom: 6px; margin-bottom: 20px; scrollbar-width: none; }
.cat-scroll::-webkit-scrollbar { display: none; }
.cat-card { flex: 0 0 auto; display: flex; flex-direction: column; align-items: center; gap: 7px; cursor: pointer; transition: all 0.2s; }
.cat-icon-wrap { width: 62px; height: 62px; border-radius: 16px; background: var(--surface); border: 2px solid var(--border); display: flex; align-items: center; justify-content: center; font-size: 1.75rem; transition: all 0.2s; }
.cat-card:hover .cat-icon-wrap, .cat-card.active .cat-icon-wrap { border-color: var(--accent); background: rgba(0,229,160,0.09); }
.cat-name { font-size: 0.7rem; font-weight: 700; color: var(--muted); text-transform: uppercase; letter-spacing: 0.4px; text-align: center; max-width: 64px; }
.cat-card.active .cat-name { color: var(--accent); }
.filter-bar { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; margin-bottom: 20px; }
.filter-pill { display: flex; align-items: center; gap: 6px; background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 7px 12px; font-size: 0.82rem; color: var(--muted); cursor: pointer; transition: all 0.2s; white-space: nowrap; }
.filter-pill:hover { border-color: var(--accent); color: var(--text); }
.filter-pill.on { border-color: var(--accent); color: var(--accent); background: rgba(0,229,160,0.07); }
.filter-pill select { background: transparent; border: none; color: inherit; font-size: 0.82rem; outline: none; cursor: pointer; padding: 0; }
.toggle { display: flex; align-items: center; gap: 8px; cursor: pointer; user-select: none; }
.toggle input[type=checkbox] { display: none; }
.toggle-track { width: 36px; height: 20px; background: var(--border); border-radius: 20px; position: relative; transition: background 0.2s; flex-shrink: 0; }
.toggle-track::after { content:''; position:absolute; top:3px; left:3px; width:14px; height:14px; background:white; border-radius:50%; transition:left 0.2s; }
.toggle input:checked + .toggle-track { background: var(--accent); }
.toggle input:checked + .toggle-track::after { left: 19px; }
.toggle-label { font-size: 0.82rem; color: var(--muted); font-weight: 600; }
.section-head { display: flex; align-items: center; gap: 8px; margin-bottom: 14px; }
.section-head-title { font-family: var(--font-head); font-weight: 700; font-size: 1rem; color: var(--text); }
.section-head-count { font-size: 0.75rem; color: var(--muted); }
.listings-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 14px; margin-bottom: 30px; }
.listing-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; transition: all 0.2s; cursor: pointer; }
.listing-card:hover { border-color: var(--accent); transform: translateY(-2px); box-shadow: 0 10px 28px rgba(0,229,160,0.09); }
.listing-card.reserved-card { opacity: 0.55; pointer-events: none; }
.card-img { height: 110px; background: var(--surface2); display: flex; align-items: center; justify-content: center; font-size: 2.8rem; position: relative; }
.card-body { padding: 13px 15px 15px; }
.card-name { font-family: var(--font-head); font-size: 0.94rem; font-weight: 700; color: var(--text); margin-bottom: 2px; }
.card-sub { font-size: 0.77rem; color: var(--muted); }
.card-tags { display: flex; gap: 5px; flex-wrap: wrap; margin-top: 8px; }
.tag { font-size: 0.67rem; font-weight: 700; padding: 2px 7px; border-radius: 4px; background: var(--surface2); color: var(--muted); border: 1px solid var(--border); text-transform: uppercase; letter-spacing: 0.3px; }
.card-row { display: flex; justify-content: space-between; align-items: center; margin-top: 10px; }
.price-lbl { font-family: var(--font-head); font-size: 1.08rem; font-weight: 800; color: var(--accent); }
.price-lbl.free { color: var(--accent2); }
.qty-lbl { font-size: 0.77rem; color: var(--muted); }
.add-btn { width: 100%; margin-top: 11px; padding: 9px; background: var(--accent); color: #000; border: none; border-radius: 8px; font-weight: 700; font-size: 0.85rem; transition: all 0.2s; }
.add-btn:hover { background: #00cc8e; }
.add-btn.incart { background: var(--surface2); color: var(--accent); border: 1px solid var(--accent); }
.add-btn:disabled { opacity: 0.42; cursor: not-allowed; }
.badge-abs { position: absolute; top: 10px; right: 10px; }

/* Listing detail modal */
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.72); backdrop-filter: blur(5px); z-index: 200; display: flex; align-items: center; justify-content: center; padding: 20px; }
.modal { background: var(--surface); border: 1px solid var(--border); border-radius: 16px; padding: 30px; width: 560px; max-width: 100%; max-height: 90vh; overflow-y: auto; position: relative; animation: fadeUp 0.24s ease; }
.modal-close { position: absolute; top: 14px; right: 14px; background: var(--surface2); border: 1px solid var(--border); color: var(--muted); width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 1rem; transition: color 0.2s; }
.modal-close:hover { color: var(--text); }
.modal-emoji { font-size: 4.5rem; text-align: center; padding: 22px; background: var(--surface2); border-radius: 12px; margin-bottom: 18px; }
.modal-title { font-family: var(--font-head); font-size: 1.3rem; font-weight: 800; margin-bottom: 4px; }
.modal-sub { color: var(--muted); font-size: 0.84rem; margin-bottom: 18px; }
.detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 18px; }
.detail-item label { font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: var(--muted); display: block; margin-bottom: 3px; }
.detail-item span { font-size: 0.88rem; color: var(--text); font-weight: 500; }
.info-box { background: var(--bg); border: 1px solid var(--border); border-radius: 9px; padding: 13px 15px; margin-bottom: 18px; font-size: 0.83rem; color: var(--muted); line-height: 1.7; }
.about-box { background: var(--bg); border: 1px solid var(--border); border-radius: 9px; padding: 13px 15px; margin-bottom: 18px; font-size: 0.85rem; color: var(--muted); line-height: 1.7; }
.about-box .about-head { font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: var(--text); margin-bottom: 6px; }

/* Cart drawer */
.cart-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 199; backdrop-filter: blur(3px); }
.cart-drawer { position: fixed; top: 0; right: 0; width: 380px; max-width: 95vw; height: 100vh; background: var(--surface); border-left: 1px solid var(--border); z-index: 200; display: flex; flex-direction: column; animation: slideRight 0.28s ease; }
@keyframes slideRight { from { transform: translateX(100%); } to { transform: translateX(0); } }
.cart-hdr { padding: 18px 22px; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; }
.cart-hdr h2 { font-family: var(--font-head); font-size: 1.05rem; font-weight: 800; }
.cart-body { flex: 1; overflow-y: auto; padding: 18px 22px; }
.cart-item { display: flex; gap: 12px; padding: 13px 0; border-bottom: 1px solid var(--border); }
.ci-icon { width: 46px; height: 46px; border-radius: 10px; background: var(--surface2); display: flex; align-items: center; justify-content: center; font-size: 1.5rem; flex-shrink: 0; }
.ci-info { flex: 1; min-width: 0; }
.ci-name { font-weight: 600; font-size: 0.875rem; color: var(--text); }
.ci-meta { font-size: 0.75rem; color: var(--muted); margin-top: 1px; }
.ci-timer { display: flex; align-items: center; gap: 5px; font-size: 0.73rem; color: var(--warning); margin-top: 4px; font-weight: 700; }
.ci-right { display: flex; flex-direction: column; align-items: flex-end; gap: 5px; flex-shrink: 0; }
.ci-price { font-family: var(--font-head); font-weight: 800; color: var(--accent); font-size: 0.92rem; }
.rm-btn { background: none; border: none; color: var(--muted); font-size: 0.9rem; cursor: pointer; padding: 2px; transition: color 0.2s; }
.rm-btn:hover { color: var(--danger); }
.cart-empty-state { text-align: center; padding: 60px 20px; color: var(--muted); }
.cart-empty-state .ce-icon { font-size: 2.5rem; margin-bottom: 12px; opacity: 0.4; }
.cart-ftr { padding: 18px 22px; border-top: 1px solid var(--border); }
.cart-total-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; }
.ct-label { font-size: 0.875rem; color: var(--muted); font-weight: 600; }
.ct-val { font-family: var(--font-head); font-size: 1.25rem; font-weight: 800; color: var(--text); }

/* Checkout */
.co-section { background: var(--bg); border: 1px solid var(--border); border-radius: 10px; padding: 16px; margin-bottom: 13px; }
.co-section h3 { font-family: var(--font-head); font-size: 0.88rem; font-weight: 700; margin-bottom: 12px; color: var(--text); }
.pay-option { display: flex; align-items: center; gap: 10px; cursor: pointer; padding: 9px 12px; border: 1px solid var(--border); border-radius: 8px; font-size: 0.875rem; color: var(--text); font-weight: 500; margin-bottom: 7px; transition: all 0.2s; background: transparent; width: 100%; }
.pay-option.selected { border-color: var(--accent); background: rgba(0,229,160,0.05); }
.pay-option input { width: auto; background: none; border: none; padding: 0; accent-color: var(--accent); }
.success-screen { display: flex; flex-direction: column; align-items: center; justify-content: center; flex: 1; padding: 40px; text-align: center; }

/* Stats */
.stats-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(138px, 1fr)); gap: 13px; margin-bottom: 22px; }
.stat-card { background: var(--surface); border: 1px solid var(--border); border-radius: 10px; padding: 17px; }
.stat-val { font-family: var(--font-head); font-size: 1.55rem; font-weight: 800; color: var(--accent); line-height: 1; }
.stat-val.o { color: var(--accent2); } .stat-val.b { color: var(--accent3); } .stat-val.r { color: var(--danger); }
.stat-lbl { font-size: 0.74rem; color: var(--muted); margin-top: 5px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.4px; }

/* Profile */
.profile-hdr { display: flex; align-items: center; gap: 18px; margin-bottom: 22px; }
.avatar-lg { width: 68px; height: 68px; border-radius: 50%; background: linear-gradient(135deg,var(--accent),var(--accent3)); display: flex; align-items: center; justify-content: center; font-size: 1.6rem; font-weight: 800; color: #000; font-family: var(--font-head); flex-shrink: 0; }
.pname { font-family: var(--font-head); font-size: 1.25rem; font-weight: 700; }
.pmeta { font-size: 0.84rem; color: var(--muted); display: flex; align-items: center; gap: 8px; margin-top: 4px; flex-wrap: wrap; }
.vtag { font-size: 0.72rem; padding: 2px 8px; border-radius: 4px; font-weight: 700; }
.vtag.verified { background: rgba(0,229,160,0.12); color: var(--accent); }
.vtag.pending { background: rgba(255,200,87,0.12); color: var(--warning); }
.activity-item { display: flex; align-items: flex-start; gap: 12px; padding: 11px 0; border-bottom: 1px solid var(--border); }
.activity-item:last-child { border-bottom: none; }
.act-icon { width: 34px; height: 34px; border-radius: 8px; background: var(--surface2); display: flex; align-items: center; justify-content: center; font-size: 0.95rem; flex-shrink: 0; }
.act-title { font-size: 0.865rem; font-weight: 600; color: var(--text); }
.act-time { font-size: 0.74rem; color: var(--muted); margin-top: 2px; }
.upload-area { border: 2px dashed var(--border); border-radius: 10px; padding: 22px; text-align: center; cursor: pointer; transition: all 0.2s; }
.upload-area:hover { border-color: var(--accent); background: rgba(0,229,160,0.03); }
.upload-icon { font-size: 1.9rem; margin-bottom: 7px; }

/* Wallet */
.bank-card { display: flex; align-items: center; justify-content: space-between; padding: 15px 17px; background: linear-gradient(135deg,var(--surface2),var(--surface3)); border-radius: 11px; border: 1px solid var(--border); margin-bottom: 13px; }

/* Listings (restaurant) */
.listings-mgmt-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 14px; }
.mgmt-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; }
.mgmt-card-img { height: 90px; background: var(--surface2); display: flex; align-items: center; justify-content: center; font-size: 2.5rem; position: relative; }
.mgmt-card-body { padding: 13px 15px 15px; }
.pickup-item { display: flex; align-items: center; justify-content: space-between; padding: 13px 0; border-bottom: 1px solid var(--border); }
.pickup-item:last-child { border-bottom: none; }
.emoji-picker-grid { display: flex; flex-wrap: wrap; gap: 6px; padding: 10px; background: var(--bg); border: 1px solid var(--border); border-radius: 10px; margin-top: 6px; }
.ep-opt { width: 38px; height: 38px; border-radius: 7px; background: var(--surface2); border: 2px solid transparent; display: flex; align-items: center; justify-content: center; font-size: 1.25rem; cursor: pointer; transition: all 0.15s; }
.ep-opt:hover, .ep-opt.sel { border-color: var(--accent); background: rgba(0,229,160,0.09); }

/* Empty / page header */
.page-header { margin-bottom: 22px; }
.page-header h1 { font-family: var(--font-head); font-size: 1.55rem; font-weight: 800; color: var(--text); }
.page-header p { color: var(--muted); font-size: 0.875rem; margin-top: 4px; }
.ph-row { display: flex; align-items: flex-start; justify-content: space-between; }
.empty-state { text-align: center; padding: 55px 20px; color: var(--muted); }
.empty-state .ei { font-size: 2.8rem; margin-bottom: 11px; opacity: 0.55; }
.empty-state p { font-size: 0.88rem; }

/* Toast */
.toast { position: fixed; bottom: 24px; right: 24px; background: var(--surface2); border: 1px solid var(--accent); color: var(--text); padding: 12px 18px; border-radius: 10px; font-size: 0.875rem; font-weight: 500; z-index: 400; max-width: 310px; box-shadow: 0 8px 24px rgba(0,0,0,0.4); animation: toastIn 0.3s ease, toastOut 0.3s 2.7s ease forwards; }
.toast.err { border-color: var(--danger); }
@keyframes toastIn { from { opacity:0; transform:translateX(40px); } to { opacity:1; transform:translateX(0); } }
@keyframes toastOut { from { opacity:1; } to { opacity:0; } }

::-webkit-scrollbar { width: 5px; }
::-webkit-scrollbar-track { background: var(--bg); }
::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }
`;

// ─────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────
const CATEGORIES = [
  { id:"All", icon:"🌐", label:"All" },
  { id:"Produce", icon:"🥬", label:"Produce" },
  { id:"Dairy", icon:"🧀", label:"Dairy" },
  { id:"Bakery", icon:"🥐", label:"Bakery" },
  { id:"Meat", icon:"🥩", label:"Meat" },
  { id:"Seafood", icon:"🐟", label:"Seafood" },
  { id:"Grains", icon:"🌾", label:"Grains" },
  { id:"Spices", icon:"🌶️", label:"Spices" },
  { id:"Beverages", icon:"🧃", label:"Beverages" },
  { id:"Desserts", icon:"🍮", label:"Desserts" },
];
const CAT_EMOJIS = {
  Produce:["🥬","🍅","🥕","🥦","🧅","🥑","🌽","🫑","🥒","🍋"],
  Dairy:["🧀","🥛","🧈","🍳"], Bakery:["🥐","🍞","🥖","🫓","🥯"],
  Meat:["🥩","🍗","🥓"], Seafood:["🐟","🦐","🦑","🦞"],
  Grains:["🌾","🍚","🍜","🌰"], Spices:["🌶️","🧄","🫚","🫛"],
  Beverages:["🧃","🍷","🥤","☕"], Desserts:["🍮","🍰","🧁","🍫","🍯"],
};
const SORT_OPTIONS = [
  { v:"newest", l:"Newest first" },
  { v:"price_asc", l:"Price: Low → High" },
  { v:"price_desc", l:"Price: High → Low" },
  { v:"expiry", l:"Expiring Soon" },
];
// Distance buckets (mock — every listing is assigned a fake distance for demo)
const DIST_OPTIONS = ["Any distance","< 1 km","< 3 km","< 5 km","< 10 km"];
const MOCK_DISTANCES = { 1:0.6, 2:2.1, 3:4.5, 4:0.9, 5:3.2, 6:0.8, 7:2.6, 8:4.1 };
const distKm = (id) => MOCK_DISTANCES[id] || (((id * 7) % 8) + 0.5);

// ─────────────────────────────────────────────────────────────
// SEED DATA
// ─────────────────────────────────────────────────────────────
const INIT_USERS = [
  { id:"u1", email:"rest@demo.com", password:"pass", role:"restaurant", name:"Arjun Mehta", biz:"The Green Fork", phone:"+91 98765 43210", address:"12 MG Road, Bengaluru 560001", storageCapacity:"Fridge 200L, Dry 500kg", operatingHours:"Mon–Sat 08:00–22:00", fssaiLicense:"10023040000123", bankLinked:true, bankName:"HDFC Bank", bankAccount:"•••• 4321", bankIFSC:"HDFC0001234", verified:true },
  { id:"u2", email:"recv@demo.com", password:"pass", role:"receiver", name:"Priya Nair", biz:"Feed Bengaluru NGO", phone:"+91 91234 56789", address:"45 Koramangala 5th Block, Bengaluru", acctType:"Nonprofit / NGO", taxExempt:true, docUploaded:true, verified:true },
  { id:"u3", email:"admin@demo.com", password:"pass", role:"admin", name:"Admin User", biz:"Platform Admin", verified:true },
];
const INIT_LISTINGS = [
  { id:1, name:"Heirloom Tomatoes", category:"Produce", emoji:"🍅", qty:15, unit:"kg", storage:"Refrigerated", expiry:"2025-07-12", pickup:"08:00–12:00", price:0, free:true, status:"active", restaurant:"The Green Fork", restaurantId:"u1", address:"12 MG Road, Bengaluru", description:"Vine-ripened heirloom tomatoes, mixed varieties. Slight cosmetic imperfections only.", allergens:"None", certifications:"Organic" },
  { id:2, name:"Brioche Dough", category:"Bakery", emoji:"🥐", qty:8, unit:"kg", storage:"Frozen", expiry:"2025-07-15", pickup:"14:00–18:00", price:320, free:false, status:"active", restaurant:"Lumière Bistro", restaurantId:"u1", address:"45 Lavelle Road, Bengaluru", description:"House-made brioche, enriched with French butter and free-range eggs. Ready to shape.", allergens:"Gluten, Eggs, Dairy", certifications:"" },
  { id:3, name:"Saffron (50g packs)", category:"Spices", emoji:"🌶️", qty:20, unit:"packs", storage:"Dry", expiry:"2025-09-01", pickup:"10:00–14:00", price:450, free:false, status:"active", restaurant:"Zaffran Kitchen", restaurantId:"u1", address:"9 Koramangala 4th Block", description:"Premium Kashmiri saffron, Grade A. Surplus from a cancelled catering event.", allergens:"None", certifications:"ISO 3632 Grade A" },
  { id:4, name:"Heavy Cream", category:"Dairy", emoji:"🧈", qty:12, unit:"L", storage:"Refrigerated", expiry:"2025-07-10", pickup:"07:00–10:00", price:0, free:true, status:"active", restaurant:"Café Prism", restaurantId:"u1", address:"22 Indiranagar 100ft Rd", description:"Fresh double cream 48% fat. Unopened Tetrapaks. Menu changed last minute.", allergens:"Dairy", certifications:"" },
  { id:5, name:"Arborio Rice", category:"Grains", emoji:"🌾", qty:25, unit:"kg", storage:"Dry", expiry:"2026-01-01", pickup:"09:00–13:00", price:180, free:false, status:"reserved", restaurant:"Sotto Voce", restaurantId:"u1", address:"77 Church Street, Bengaluru", description:"Italian Arborio, vacuum-sealed 5kg bags. Surplus from overstocking.", allergens:"None", certifications:"" },
  { id:6, name:"Fresh Basil Bunches", category:"Produce", emoji:"🥬", qty:30, unit:"bunches", storage:"Refrigerated", expiry:"2025-07-09", pickup:"08:00–11:00", price:0, free:true, status:"active", restaurant:"The Green Fork", restaurantId:"u1", address:"12 MG Road, Bengaluru", description:"Rooftop herb garden basil. Deeply fragrant — pick up urgently.", allergens:"None", certifications:"Homegrown" },
  { id:7, name:"Dark Chocolate Couverture", category:"Desserts", emoji:"🍫", qty:5, unit:"kg", storage:"Dry", expiry:"2025-12-01", pickup:"11:00–15:00", price:950, free:false, status:"active", restaurant:"Lumière Bistro", restaurantId:"u1", address:"45 Lavelle Road, Bengaluru", description:"Valrhona Guanaja 70% callets. Excess from our pastry kitchen.", allergens:"Soy, May contain Dairy", certifications:"" },
  { id:8, name:"Fresh Paneer Blocks", category:"Dairy", emoji:"🧀", qty:10, unit:"kg", storage:"Refrigerated", expiry:"2025-07-11", pickup:"08:00–12:00", price:220, free:false, status:"active", restaurant:"Zaffran Kitchen", restaurantId:"u1", address:"9 Koramangala 4th Block", description:"House-made fresh paneer, 1kg vacuum blocks. Surplus from cancelled catering.", allergens:"Dairy", certifications:"" },
];

// ─────────────────────────────────────────────────────────────
// UTILITIES
// ─────────────────────────────────────────────────────────────
const validEmail = e => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e);
const validPw    = p => p.length >= 6;

// Fields that require admin verification after profile save
const VERIFY_FIELDS = ["name","biz","address","fssaiLicense","phone","acctType"];

function Toast({ msg, type }) {
  return <div className={`toast${type==="err" ? " err" : ""}`}>{type==="err"?"⚠":"✓"} {msg}</div>;
}

function CartTimer({ reservedAt, onExpire }) {
  const [rem, setRem] = useState(7200);
  useEffect(() => {
    const tick = () => {
      const left = 7200 - Math.floor((Date.now() - reservedAt) / 1000);
      if (left <= 0) { onExpire(); return; }
      setRem(left);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [reservedAt, onExpire]);
  const h = Math.floor(rem / 3600);
  const m = Math.floor((rem % 3600) / 60);
  const s = rem % 60;
  const fmt = n => String(n).padStart(2,"0");
  const urgent = rem < 600;
  return (
    <span className="ci-timer" style={{ color: urgent ? "var(--danger)" : "var(--warning)" }}>
      ⏱ {h > 0 ? `${h}h ` : ""}{fmt(m)}:{fmt(s)} remaining
    </span>
  );
}

// ─────────────────────────────────────────────────────────────
// AUTH PAGE
// ─────────────────────────────────────────────────────────────
function AuthPage({ onLogin, usersDB, setUsersDB, intendedPage }) {
  const [tab, setTab] = useState("login");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPw, setLoginPw] = useState("");
  const [loginErr, setLoginErr] = useState("");
  const [forgot, setForgot] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetSent, setResetSent] = useState(false);

  // Registration
  const [step, setStep] = useState(1);
  const [role, setRole] = useState("restaurant");
  const [regErr, setRegErr] = useState("");
  const [reg, setReg] = useState({ name:"", email:"", password:"", confirmPw:"", biz:"", phone:"", address:"", acctType:"Nonprofit / NGO", fssaiLicense:"", storageCapacity:"", operatingHours:"", storageTypes:[] });
  const setR = (k,v) => setReg(r => ({...r,[k]:v}));
  const totalSteps = role === "restaurant" ? 3 : 2;

  const doLogin = () => {
    setLoginErr("");
    if (!validEmail(loginEmail)) { setLoginErr("Enter a valid email address (e.g. name@company.com)"); return; }
    if (!loginPw) { setLoginErr("Password is required"); return; }
    const u = usersDB.find(u => u.email === loginEmail && u.password === loginPw);
    if (u) onLogin(u, intendedPage || "dashboard");
    else setLoginErr("No account found with those credentials. Check your email and password, or register.");
  };

  const doResetRequest = () => {
    if (!validEmail(resetEmail)) return;
    const exists = usersDB.find(u => u.email === resetEmail);
    setResetSent(true);
    // In production: send email regardless (security); we just show the message
    setTimeout(() => { setForgot(false); setResetSent(false); setResetEmail(""); }, 3200);
  };

  const nextStep = () => {
    setRegErr("");
    if (step === 1) {
      if (!reg.name.trim()) return setRegErr("Full name is required");
      if (!validEmail(reg.email)) return setRegErr("Enter a valid email (e.g. name@company.com)");
      if (usersDB.find(u => u.email === reg.email)) return setRegErr("An account with this email already exists");
      if (!validPw(reg.password)) return setRegErr("Password must be at least 6 characters");
      if (reg.password !== reg.confirmPw) return setRegErr("Passwords do not match");
      setStep(2);
    } else if (step === 2) {
      if (!reg.biz.trim()) return setRegErr(role==="restaurant" ? "Restaurant name is required" : "Organisation name is required");
      if (!reg.phone.trim()) return setRegErr("Phone number is required");
      if (!reg.address.trim()) return setRegErr("Address is required");
      if (role === "receiver") submit();
      else setStep(3);
    } else submit();
  };

  const submit = () => {
    const newUser = { id:"u"+Date.now(), email:reg.email, password:reg.password, role, name:reg.name, biz:reg.biz, phone:reg.phone, address:reg.address, bankLinked:false, verified:false,
      ...(role==="restaurant" ? { fssaiLicense:reg.fssaiLicense, storageCapacity:reg.storageCapacity, operatingHours:reg.operatingHours, storageTypes:reg.storageTypes } : {}),
      ...(role==="receiver" ? { acctType:reg.acctType, docUploaded:false } : {}),
    };
    setUsersDB(db => [...db, newUser]);
    onLogin(newUser, intendedPage || "dashboard");
  };

  if (forgot) return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="auth-logo"><div className="logo"><span className="logo-dot"/><span>Surplus</span><span style={{color:"var(--text)"}}>Link</span></div></div>
        <div className="card-title" style={{justifyContent:"center",marginBottom:6}}>Reset Password</div>
        <p style={{color:"var(--muted)",fontSize:"0.85rem",textAlign:"center",marginBottom:20}}>We'll send a reset link to your registered email</p>
        {resetSent
          ? <div className="success-msg">✓ If that email is registered, a reset link is on its way.</div>
          : <>
            <div className="form-group" style={{marginBottom:14}}>
              <label>Email Address</label>
              <input value={resetEmail} onChange={e=>setResetEmail(e.target.value)} placeholder="you@company.com" type="email" className={resetEmail&&!validEmail(resetEmail)?"err":""}/>
              {resetEmail&&!validEmail(resetEmail)&&<span className="field-err">Enter a valid email address</span>}
            </div>
            <button className="btn btn-primary" style={{width:"100%"}} onClick={doResetRequest} disabled={!validEmail(resetEmail)}>Send Reset Link</button>
          </>
        }
        <div style={{textAlign:"center",marginTop:14}}><button className="link-btn" onClick={()=>{setForgot(false);setResetSent(false);}}>← Back to Sign In</button></div>
      </div>
    </div>
  );

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="auth-logo"><div className="logo"><span className="logo-dot"/><span>Surplus</span><span style={{color:"var(--text)"}}>Link</span></div></div>
        <div className="auth-tabs">
          <button className={`auth-tab${tab==="login"?" active":""}`} onClick={()=>{setTab("login");setLoginErr("");setStep(1);}}>Sign In</button>
          <button className={`auth-tab${tab==="register"?" active":""}`} onClick={()=>{setTab("register");setLoginErr("");}}>Register</button>
        </div>

        {/* ── LOGIN ── */}
        {tab==="login" && <>
          {loginErr && <div className="error-msg">{loginErr}</div>}
          <div className="form-group" style={{marginBottom:12}}>
            <label>Email Address</label>
            <input value={loginEmail} onChange={e=>{setLoginEmail(e.target.value);setLoginErr("");}} placeholder="you@company.com" type="email" className={loginEmail&&!validEmail(loginEmail)?"err":""}/>
            {loginEmail&&!validEmail(loginEmail)&&<span className="field-err">Must be a valid email (e.g. name@domain.com)</span>}
          </div>
          <div className="form-group" style={{marginBottom:6}}>
            <label>Password</label>
            <input value={loginPw} onChange={e=>{setLoginPw(e.target.value);setLoginErr("");}} placeholder="••••••••" type="password" onKeyDown={e=>e.key==="Enter"&&doLogin()}/>
          </div>
          <div style={{textAlign:"right",marginBottom:18}}><button className="link-btn" onClick={()=>setForgot(true)}>Forgot password?</button></div>
          <button className="btn btn-primary" style={{width:"100%",padding:"12px"}} onClick={doLogin}>Sign In →</button>
          <div className="divider" style={{marginTop:18}}>demo accounts</div>
          <div style={{display:"flex",gap:8,justifyContent:"center",flexWrap:"wrap"}}>
            {[{l:"🍽️ Restaurant",e:"rest@demo.com"},{l:"🤝 Receiver",e:"recv@demo.com"},{l:"🛡️ Admin",e:"admin@demo.com"}].map(d=>(
              <button key={d.e} className="btn btn-ghost btn-sm" onClick={()=>{setLoginEmail(d.e);setLoginPw("pass");setLoginErr("");}}>{d.l}</button>
            ))}
          </div>
        </>}

        {/* ── REGISTER ── */}
        {tab==="register" && <>
          <div className="step-bar">
            {Array.from({length:totalSteps}).map((_,i)=>(
              <div key={i} className={`step-dot${step===i+1?" active":step>i+1?" done":""}`}/>
            ))}
          </div>
          {regErr && <div className="error-msg">{regErr}</div>}

          {step===1 && <>
            <p style={{color:"var(--muted)",fontSize:"0.82rem",marginBottom:10}}>Choose your account type:</p>
            <div className="role-selector">
              <button className={`role-option${role==="restaurant"?" selected restaurant":""}`} onClick={()=>setRole("restaurant")}>
                <span className="role-icon">🍽️</span><span className="role-label">Restaurant</span><span className="role-desc">List surplus ingredients</span>
              </button>
              <button className={`role-option${role==="receiver"?" selected receiver":""}`} onClick={()=>setRole("receiver")}>
                <span className="role-icon">🤝</span><span className="role-label">Receiver</span><span className="role-desc">Browse & claim items</span>
              </button>
            </div>
            <div className="form-grid one-col" style={{gap:11,marginBottom:16}}>
              <div className="form-group"><label>Full Name *</label><input value={reg.name} onChange={e=>setR("name",e.target.value)} placeholder="Your full name"/></div>
              <div className="form-group">
                <label>Email Address *</label>
                <input value={reg.email} onChange={e=>setR("email",e.target.value)} placeholder="you@company.com" type="email" className={reg.email&&!validEmail(reg.email)?"err":""}/>
                {reg.email&&!validEmail(reg.email)&&<span className="field-err">Must be valid (e.g. name@domain.com)</span>}
              </div>
              <div className="form-group"><label>Password * (min 6 chars)</label><input value={reg.password} onChange={e=>setR("password",e.target.value)} placeholder="••••••••" type="password"/></div>
              <div className="form-group">
                <label>Confirm Password *</label>
                <input value={reg.confirmPw} onChange={e=>setR("confirmPw",e.target.value)} placeholder="••••••••" type="password" className={reg.confirmPw&&reg.password!==reg.confirmPw?"err":""}/>
                {reg.confirmPw&&reg.password!==reg.confirmPw&&<span className="field-err">Passwords do not match</span>}
              </div>
            </div>
          </>}

          {step===2 && <>
            <p style={{color:"var(--muted)",fontSize:"0.82rem",marginBottom:12}}>{role==="restaurant"?"Tell us about your restaurant:":"Tell us about your organisation:"}</p>
            <div className="form-grid one-col" style={{gap:11,marginBottom:16}}>
              <div className="form-group"><label>{role==="restaurant"?"Restaurant Name *":"Organisation Name *"}</label><input value={reg.biz} onChange={e=>setR("biz",e.target.value)} placeholder="Business name"/></div>
              <div className="form-group"><label>Phone Number *</label><input value={reg.phone} onChange={e=>setR("phone",e.target.value)} placeholder="+91 98765 43210"/></div>
              <div className="form-group"><label>Full Address *</label><input value={reg.address} onChange={e=>setR("address",e.target.value)} placeholder="Street, area, city, PIN"/></div>
              {role==="receiver" && <div className="form-group"><label>Organisation Type</label>
                <select value={reg.acctType} onChange={e=>setR("acctType",e.target.value)}>
                  {["Nonprofit / NGO","Small Business","Individual","Community Kitchen"].map(o=><option key={o}>{o}</option>)}
                </select>
              </div>}
            </div>
          </>}

          {step===3 && role==="restaurant" && <>
            <p style={{color:"var(--muted)",fontSize:"0.82rem",marginBottom:12}}>Storage & compliance details (optional, can add later):</p>
            <div className="form-grid one-col" style={{gap:11,marginBottom:16}}>
              <div className="form-group"><label>FSSAI License Number</label><input value={reg.fssaiLicense} onChange={e=>setR("fssaiLicense",e.target.value)} placeholder="14-digit license number"/></div>
              <div className="form-group"><label>Operating Hours</label><input value={reg.operatingHours} onChange={e=>setR("operatingHours",e.target.value)} placeholder="e.g. Mon–Sat 08:00–22:00"/></div>
              <div className="form-group">
                <label>Storage Facilities Available</label>
                <div style={{display:"flex",flexWrap:"wrap",gap:8,marginTop:4}}>
                  {["Refrigerated","Frozen","Dry Storage","Warm Holding"].map(s=>(
                    <button key={s} type="button" className={`filter-pill${reg.storageTypes.includes(s)?" on":""}`} style={{fontSize:"0.78rem"}}
                      onClick={()=>setR("storageTypes",reg.storageTypes.includes(s)?reg.storageTypes.filter(x=>x!==s):[...reg.storageTypes,s])}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <div className="form-group"><label>Storage Capacity</label><input value={reg.storageCapacity} onChange={e=>setR("storageCapacity",e.target.value)} placeholder="e.g. Fridge 200L, Dry 500kg"/></div>
            </div>
          </>}

          <div style={{display:"flex",gap:10}}>
            {step>1&&<button className="btn btn-secondary" style={{flex:1,padding:"11px"}} onClick={()=>setStep(s=>s-1)}>← Back</button>}
            <button className="btn btn-primary" style={{flex:1,padding:"11px"}} onClick={nextStep}>
              {step===totalSteps?"Create Account →":"Next →"}
            </button>
          </div>
        </>}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// BROWSE PAGE — delivery-app style
// ─────────────────────────────────────────────────────────────
function BrowsePage({ listings, setListings, onToast, cart, setCart, onShowDetail }) {
  const [cat, setCat] = useState("All");
  const [storage, setStorage] = useState("All");
  const [dist, setDist] = useState("Any distance");
  const [freeOnly, setFreeOnly] = useState(false);
  const [sort, setSort] = useState("newest");
  const [search, setSearch] = useState("");

  const inCart = id => cart.some(c => c.id === id);

  const visible = listings
    .filter(l => l.status === "active")
    .filter(l => cat==="All" || l.category===cat)
    .filter(l => storage==="All" || l.storage===storage)
    .filter(l => !freeOnly || l.free)
    .filter(l => {
      if (dist==="Any distance") return true;
      const km = distKm(l.id);
      const cap = parseFloat(dist.replace("< ","").replace(" km",""));
      return km < cap;
    })
    .filter(l => !search || l.name.toLowerCase().includes(search.toLowerCase()) || l.restaurant.toLowerCase().includes(search.toLowerCase()))
    .sort((a,b) => {
      if (sort==="price_asc") return a.price - b.price;
      if (sort==="price_desc") return b.price - a.price;
      if (sort==="expiry") return new Date(a.expiry) - new Date(b.expiry);
      return b.id - a.id;
    });

  const handleAddToCart = (l, e) => {
    e?.stopPropagation();
    if (l.status==="reserved") { onToast("This item is already reserved","err"); return; }
    if (inCart(l.id)) { onToast("Already in your cart"); return; }
    setCart(c => [...c, {...l, reservedAt:Date.now()}]);
    onToast(`${l.name} added — reserved for 2 hours`);
  };

  // Delivery-app grouping: when "All" selected, show sections by category
  const sections = cat==="All"
    ? CATEGORIES.filter(c=>c.id!=="All").map(c=>({cat:c, items:visible.filter(l=>l.category===c.id)})).filter(g=>g.items.length>0)
    : [{ cat:CATEGORIES.find(c=>c.id===cat)||{icon:"📦",label:cat}, items:visible }];

  return (
    <div className="page-enter">
      <div className="browse-hero">
        <div>
          <h2>Fresh Surplus, Near You</h2>
          <p>Bengaluru · <strong style={{color:"var(--accent)"}}>{listings.filter(l=>l.status==="active").length}</strong> items available now</p>
        </div>
        <div className="search-wrap">
          <span>🔍</span>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search ingredients or restaurants…"/>
        </div>
      </div>

      {/* Category scroll */}
      <div className="cat-scroll">
        {CATEGORIES.map(c=>(
          <div key={c.id} className={`cat-card${cat===c.id?" active":""}`} onClick={()=>setCat(c.id)}>
            <div className="cat-icon-wrap">{c.icon}</div>
            <span className="cat-name">{c.label}</span>
          </div>
        ))}
      </div>

      {/* Filter + Sort bar */}
      <div className="filter-bar">
        <div className={`filter-pill${storage!=="All"?" on":""}`}>
          <span>📦</span>
          <select value={storage} onChange={e=>setStorage(e.target.value)}>
            {["All","Refrigerated","Frozen","Dry","Room Temp"].map(s=><option key={s}>{s}</option>)}
          </select>
        </div>
        {/* Distance radius filter */}
        <div className={`filter-pill${dist!=="Any distance"?" on":""}`}>
          <span>📍</span>
          <select value={dist} onChange={e=>setDist(e.target.value)}>
            {DIST_OPTIONS.map(d=><option key={d}>{d}</option>)}
          </select>
        </div>
        <div className="filter-pill">
          <span>↕️</span>
          <select value={sort} onChange={e=>setSort(e.target.value)}>
            {SORT_OPTIONS.map(o=><option key={o.v} value={o.v}>{o.l}</option>)}
          </select>
        </div>
        <label className="toggle">
          <input type="checkbox" checked={freeOnly} onChange={e=>setFreeOnly(e.target.checked)}/>
          <span className="toggle-track"/><span className="toggle-label">Free only</span>
        </label>
        <span style={{marginLeft:"auto",fontSize:"0.78rem",color:"var(--muted)"}}>{visible.length} result{visible.length!==1?"s":""}</span>
      </div>

      {visible.length===0 && <div className="empty-state"><div className="ei">🔍</div><p>No listings match your filters</p></div>}

      {sections.map(({cat:c, items})=>(
        <div key={c.id||c.label}>
          <div className="section-head">
            <span style={{fontSize:"1.2rem"}}>{c.icon}</span>
            <span className="section-head-title">{c.label}</span>
            <span className="section-head-count">({items.length})</span>
          </div>
          <div className="listings-grid">
            {items.map(l=>(
              <div key={l.id} className={`listing-card${l.status==="reserved"?" reserved-card":""}`} onClick={()=>onShowDetail(l)}>
                <div className="card-img">{l.emoji||"📦"}
                  {l.free && <span className="badge badge-free badge-abs">FREE</span>}
                </div>
                <div className="card-body">
                  <div className="card-name">{l.name}</div>
                  <div className="card-sub">{l.restaurant} · {distKm(l.id).toFixed(1)} km away</div>
                  <div className="card-tags">
                    <span className="tag">{l.storage}</span>
                    <span className="tag">{l.category}</span>
                    <span className="tag">Exp {l.expiry}</span>
                  </div>
                  <div className="card-row">
                    <span className={`price-lbl${l.free?" free":""}`}>{l.free?"Free":`₹${l.price}`}</span>
                    <span className="qty-lbl">{l.qty} {l.unit}</span>
                  </div>
                  <button className={`add-btn${inCart(l.id)?" incart":""}`}
                    onClick={e=>handleAddToCart(l,e)} disabled={l.status==="reserved"}>
                    {inCart(l.id)?"✓ In Cart":l.status==="reserved"?"Reserved":"+ Add to Cart"}
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
function ProductDetailModal({ listing:l, onClose, cart, setCart, setListings, onToast }) {
  const inCart = cart.some(c => c.id === l.id);

  const handleReserve = () => {
    if (l.status==="reserved") return;
    if (inCart) { onToast("Already in your cart"); onClose(); return; }
    // Lock the listing status to reserved in shared state
    setListings(ls => ls.map(x => x.id===l.id ? {...x, status:"reserved"} : x));
    setCart(c => [...c, {...l, reservedAt:Date.now()}]);
    onToast(`${l.name} reserved for 2 hours — proceed to checkout`);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e=>e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <div className="modal-emoji">{l.emoji||"📦"}</div>
        <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:4}}>
          <div className="modal-title">{l.name}</div>
          <span className={`price-lbl${l.free?" free":""}`} style={{fontSize:"1.2rem",flexShrink:0,marginLeft:12}}>{l.free?"Free":`₹${l.price}`}</span>
        </div>
        <div className="modal-sub">🏪 {l.restaurant} · 📍 {l.address} · 📏 {distKm(l.id).toFixed(1)} km away</div>

        {l.description && (
          <div className="about-box">
            <div className="about-head">About this product</div>
            {l.description}
          </div>
        )}

        <div className="detail-grid">
          {[["Category",l.category],["Storage",l.storage],["Quantity",`${l.qty} ${l.unit}`],["Expiry Date",l.expiry],["Pickup Window",l.pickup||"Contact restaurant"],["Price",l.free?"Free / Donation":`₹${l.price}`],
            ...(l.allergens?[["Allergens",l.allergens]]:[]),
            ...(l.certifications?[["Certifications",l.certifications]]:[])
          ].map(([k,v])=>(
            <div key={k} className="detail-item"><label>{k}</label><span>{v}</span></div>
          ))}
        </div>

        <div className="info-box">
          📍 Pickup at: <span style={{color:"var(--text)"}}>{l.address}</span><br/>
          ⏰ Window: <span style={{color:"var(--text)"}}>{l.pickup||"Contact restaurant directly"}</span><br/>
          📏 Distance: <span style={{color:"var(--text)"}}>{distKm(l.id).toFixed(1)} km from your location</span>
        </div>

        {l.status==="reserved"
          ? <div className="error-msg" style={{marginBottom:0}}>⏳ This item is currently reserved by another user</div>
          : <button className="btn btn-primary" style={{width:"100%",padding:"13px",fontSize:"0.95rem"}} onClick={handleReserve} disabled={inCart}>
              {inCart?"✓ Already in Cart — check your cart":"🛒 Reserve — locks for 2 hours & initiates checkout"}
            </button>
        }
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// CART DRAWER + CHECKOUT
// ─────────────────────────────────────────────────────────────
function CartDrawer({ cart, setCart, setListings, onClose, onToast }) {
  const [step, setStep] = useState("cart"); // cart | checkout | done
  const [payMethod, setPayMethod] = useState("upi");
  const [upiId, setUpiId] = useState("");

  const total = cart.reduce((s,i)=>s+i.price, 0);
  const freeCount = cart.filter(i=>i.free).length;

  const handleExpire = (id) => {
    // Release listing back to active
    setListings(ls => ls.map(l => l.id===id ? {...l, status:"active"} : l));
    setCart(c => c.filter(i=>i.id!==id));
    onToast("A reservation expired and was removed","err");
  };

  const handleRemove = (id) => {
    setListings(ls => ls.map(l => l.id===id ? {...l, status:"active"} : l));
    setCart(c => c.filter(i=>i.id!==id));
    onToast("Item removed — listing is available again");
  };

  const handleConfirmOrder = () => {
    setStep("done");
    setTimeout(()=>{
      setCart([]);
      onClose();
      onToast("Order confirmed! Pickup details sent to your email 🎉");
    }, 2600);
  };

  return (
    <>
      <div className="cart-overlay" onClick={step==="done"?null:onClose}/>
      <div className="cart-drawer">
        <div className="cart-hdr">
          <h2>🛒 Cart {cart.length>0&&<span style={{color:"var(--accent)",marginLeft:6}}>({cart.length})</span>}</h2>
          {step!=="done"&&<button className="modal-close" style={{position:"static"}} onClick={onClose}>✕</button>}
        </div>

        {step==="done" && (
          <div className="success-screen">
            <div style={{fontSize:"4rem",marginBottom:16}}>🎉</div>
            <div style={{fontFamily:"var(--font-head)",fontSize:"1.3rem",fontWeight:800,marginBottom:8}}>Order Confirmed!</div>
            <p style={{color:"var(--muted)",fontSize:"0.875rem",maxWidth:260}}>Pickup details have been sent to your email. Items are locked for you.</p>
          </div>
        )}

        {step==="cart" && <>
          <div className="cart-body">
            {cart.length===0
              ? <div className="cart-empty-state"><div className="ce-icon">🛒</div><p>Your cart is empty</p><p style={{fontSize:"0.78rem",marginTop:8}}>Browse surplus and add items here</p></div>
              : cart.map(item=>(
                <div key={item.id} className="cart-item">
                  <div className="ci-icon">{item.emoji||"📦"}</div>
                  <div className="ci-info">
                    <div className="ci-name">{item.name}</div>
                    <div className="ci-meta">{item.restaurant} · {item.qty} {item.unit}</div>
                    <CartTimer reservedAt={item.reservedAt} onExpire={()=>handleExpire(item.id)}/>
                  </div>
                  <div className="ci-right">
                    <div className="ci-price">{item.free?"Free":`₹${item.price}`}</div>
                    <button className="rm-btn" onClick={()=>handleRemove(item.id)}>✕</button>
                  </div>
                </div>
              ))
            }
          </div>
          {cart.length>0&&(
            <div className="cart-ftr">
              {freeCount>0&&<div style={{fontSize:"0.78rem",color:"var(--accent2)",marginBottom:10,fontWeight:600}}>🎁 {freeCount} free item{freeCount>1?"s":""} included</div>}
              <div className="cart-total-row">
                <span className="ct-label">Total</span>
                <span className="ct-val">{total===0?"Free":`₹${total}`}</span>
              </div>
              <button className="btn btn-primary" style={{width:"100%",padding:"12px"}} onClick={()=>setStep("checkout")}>Proceed to Checkout →</button>
            </div>
          )}
        </>}

        {step==="checkout" && <>
          <div className="cart-body">
            <div className="co-section">
              <h3>📦 Order Summary</h3>
              {cart.map(i=>(
                <div key={i.id} style={{display:"flex",justifyContent:"space-between",fontSize:"0.84rem",marginBottom:7,color:"var(--muted)"}}>
                  <span style={{color:"var(--text)"}}>{i.emoji} {i.name}</span>
                  <span style={{color:i.free?"var(--accent2)":"var(--text)",fontWeight:600}}>{i.free?"Free":`₹${i.price}`}</span>
                </div>
              ))}
              <div style={{borderTop:"1px solid var(--border)",paddingTop:10,marginTop:6,display:"flex",justifyContent:"space-between",fontWeight:700}}>
                <span>Total</span><span style={{color:"var(--accent)"}}>{total===0?"Free":`₹${total}`}</span>
              </div>
            </div>

            <div className="co-section">
              <h3>💳 Payment Method</h3>
              {total===0
                ? <div style={{color:"var(--muted)",fontSize:"0.85rem"}}>No payment required — all items are free / donation</div>
                : <>
                  {[{v:"upi",l:"UPI / GPay / PhonePe"},{v:"card",l:"Credit / Debit Card"},{v:"cash",l:"Cash on Pickup"}].map(o=>(
                    <button key={o.v} className={`pay-option${payMethod===o.v?" selected":""}`} onClick={()=>setPayMethod(o.v)}>
                      <input type="radio" readOnly checked={payMethod===o.v}/>{o.l}
                    </button>
                  ))}
                  {payMethod==="upi"&&<input value={upiId} onChange={e=>setUpiId(e.target.value)} placeholder="yourname@upi" style={{marginTop:8}}/>}
                </>
              }
            </div>

            <div className="co-section">
              <h3>⏰ Pickup Schedule</h3>
              {cart.map(i=>(
                <div key={i.id} style={{fontSize:"0.82rem",color:"var(--muted)",marginBottom:7,lineHeight:1.5}}>
                  <span style={{color:"var(--text)",fontWeight:600}}>{i.name}</span><br/>
                  {i.restaurant} · {i.pickup||"Contact restaurant"} · {i.address}
                </div>
              ))}
            </div>
          </div>
          <div className="cart-ftr">
            <button className="btn btn-secondary" style={{width:"100%",marginBottom:9}} onClick={()=>setStep("cart")}>← Back to Cart</button>
            <button className="btn btn-primary" style={{width:"100%",padding:"13px"}} onClick={handleConfirmOrder}>Confirm Order 🎉</button>
          </div>
        </>}
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────
// MY LISTINGS (Restaurant)
// ─────────────────────────────────────────────────────────────
function MyListingsPage({ listings, setListings, user, onToast }) {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [tab, setTab] = useState("active");
  const [showEmoji, setShowEmoji] = useState(false);
  const emptyForm = { name:"", category:"Produce", emoji:"🥬", qty:"", unit:"kg", storage:"Refrigerated", expiry:"", pickup:"", price:"", free:false, description:"", allergens:"", certifications:"" };
  const [form, setForm] = useState(emptyForm);
  const setF = (k,v) => setForm(f=>({...f,[k]:v}));

  const mine = listings.filter(l => l.restaurantId===user.id || l.restaurant===user.biz);
  const filtered = mine.filter(l => l.status===tab);
  const pendingPickups = mine.filter(l => l.status==="reserved");

  const handleSubmit = () => {
    if (!form.name.trim()||!form.qty||!form.expiry) { onToast("Name, quantity and expiry are required","err"); return; }
    if (editing!==null) {
      setListings(ls => ls.map(l => l.id===editing ? {...l,...form,price:form.free?0:Number(form.price)} : l));
      onToast("Listing updated");
    } else {
      setListings(ls => [...ls, {...form, id:Date.now(), price:form.free?0:Number(form.price), status:"active", restaurant:user.biz, restaurantId:user.id, address:user.address||""}]);
      onToast("Listing created");
    }
    setShowForm(false); setEditing(null); setForm(emptyForm);
  };

  const startEdit = (l) => {
    setEditing(l.id);
    setForm({name:l.name,category:l.category,emoji:l.emoji||"📦",qty:l.qty,unit:l.unit,storage:l.storage,expiry:l.expiry,pickup:l.pickup||"",price:l.price,free:l.free,description:l.description||"",allergens:l.allergens||"",certifications:l.certifications||""});
    setShowForm(true);
    setShowEmoji(false);
  };

  const currentEmojis = CAT_EMOJIS[form.category]||["📦"];

  return (
    <div className="page-enter">
      <div className="page-header ph-row">
        <div><h1>My Listings</h1><p>Manage your surplus ingredient postings</p></div>
        <button className="btn btn-primary" onClick={()=>{setShowForm(true);setEditing(null);setForm(emptyForm);setShowEmoji(false);}}>+ New Listing</button>
      </div>

      {/* Pending pickups */}
      {pendingPickups.length>0&&(
        <div className="card" style={{borderColor:"rgba(255,200,87,0.35)"}}>
          <div className="card-title">⏳ Pickup Confirmations Pending</div>
          {pendingPickups.map(l=>(
            <div key={l.id} className="pickup-item">
              <div style={{flex:1}}>
                <div style={{fontWeight:600,fontSize:"0.9rem"}}>{l.name}</div>
                <div style={{fontSize:"0.78rem",color:"var(--muted)",marginTop:3}}>Reserved · {l.qty} {l.unit} · Pickup: {l.pickup||"TBD"}</div>
              </div>
              <button className="btn btn-primary btn-sm" onClick={()=>{
                setListings(ls=>ls.map(x=>x.id===l.id?{...x,status:"active",confirmed:true}:x));
                onToast("Pickup confirmed!");
              }}>Confirm Pickup ✓</button>
            </div>
          ))}
        </div>
      )}

      {/* New / edit form */}
      {showForm&&(
        <div className="card" style={{borderColor:"var(--accent)"}}>
          <div className="card-title">{editing!==null?"✏️ Edit Listing":"📝 New Listing"}</div>
          <div className="form-grid">
            <div className="form-group"><label>Ingredient Name *</label><input value={form.name} onChange={e=>setF("name",e.target.value)} placeholder="e.g. Heirloom Tomatoes"/></div>
            <div className="form-group">
              <label>Category</label>
              <select value={form.category} onChange={e=>{setF("category",e.target.value);setF("emoji",CAT_EMOJIS[e.target.value]?.[0]||"📦");}}>
                {CATEGORIES.filter(c=>c.id!=="All").map(c=><option key={c.id}>{c.id}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Product Icon</label>
              <div style={{display:"flex",gap:8,alignItems:"center"}}>
                <button type="button" className="btn btn-ghost btn-sm" style={{fontSize:"1.3rem",padding:"5px 12px"}} onClick={()=>setShowEmoji(v=>!v)}>{form.emoji} ▾</button>
              </div>
              {showEmoji&&<div className="emoji-picker-grid">
                {currentEmojis.map(em=><button key={em} type="button" className={`ep-opt${form.emoji===em?" sel":""}`} onClick={()=>{setF("emoji",em);setShowEmoji(false);}}>{em}</button>)}
              </div>}
            </div>
            <div className="form-group"><label>Quantity *</label><input type="number" min="0" value={form.qty} onChange={e=>setF("qty",e.target.value)} placeholder="0"/></div>
            <div className="form-group"><label>Unit</label><select value={form.unit} onChange={e=>setF("unit",e.target.value)}>{["kg","g","L","ml","packs","units","bunches","boxes","portions"].map(u=><option key={u}>{u}</option>)}</select></div>
            <div className="form-group"><label>Storage Type</label><select value={form.storage} onChange={e=>setF("storage",e.target.value)}>{["Refrigerated","Frozen","Dry","Room Temp","Warm Holding"].map(s=><option key={s}>{s}</option>)}</select></div>
            <div className="form-group"><label>Expiry Date *</label><input type="date" value={form.expiry} onChange={e=>setF("expiry",e.target.value)}/></div>
            <div className="form-group"><label>Pickup Window</label><input value={form.pickup} onChange={e=>setF("pickup",e.target.value)} placeholder="e.g. 08:00–12:00"/></div>
            <div className="form-group">
              <label>Price (₹)</label>
              <div style={{display:"flex",gap:8,alignItems:"center"}}>
                <input type="number" min="0" value={form.price} disabled={form.free} onChange={e=>setF("price",e.target.value)} placeholder="0"/>
                <label className="toggle" style={{whiteSpace:"nowrap"}}>
                  <input type="checkbox" checked={form.free} onChange={e=>setF("free",e.target.checked)}/>
                  <span className="toggle-track"/><span className="toggle-label">Free</span>
                </label>
              </div>
            </div>
            <div className="form-group full"><label>Description</label><textarea value={form.description} onChange={e=>setF("description",e.target.value)} placeholder="Describe the item — condition, source, best uses, why it's surplus…"/></div>
            <div className="form-group"><label>Allergens</label><input value={form.allergens} onChange={e=>setF("allergens",e.target.value)} placeholder="e.g. Gluten, Dairy, Nuts"/></div>
            <div className="form-group"><label>Certifications / Notes</label><input value={form.certifications} onChange={e=>setF("certifications",e.target.value)} placeholder="e.g. Organic, FSSAI compliant"/></div>
          </div>
          <div style={{display:"flex",gap:10,marginTop:18}}>
            <button className="btn btn-primary" onClick={handleSubmit}>{editing!==null?"Save Changes":"Create Listing"}</button>
            <button className="btn btn-secondary" onClick={()=>{setShowForm(false);setEditing(null);}}>Cancel</button>
          </div>
        </div>
      )}

      {/* Tab bar */}
      <div style={{display:"flex",gap:6,marginBottom:18}}>
        {["active","reserved","expired"].map(t=>(
          <button key={t} className={`btn btn-sm ${tab===t?"btn-primary":"btn-ghost"}`} onClick={()=>setTab(t)}>
            {t.charAt(0).toUpperCase()+t.slice(1)} ({mine.filter(l=>l.status===t).length})
          </button>
        ))}
      </div>

      {filtered.length===0
        ? <div className="empty-state"><div className="ei">📦</div><p>No {tab} listings</p></div>
        : <div className="listings-mgmt-grid">
          {filtered.map(l=>(
            <div key={l.id} className="mgmt-card">
              <div className="mgmt-card-img">{l.emoji||"📦"}
                <span className={`badge badge-${l.status}`} style={{position:"absolute",top:10,right:10}}>{l.status}</span>
              </div>
              <div className="mgmt-card-body">
                <div className="card-name">{l.name}</div>
                <div className="card-sub" style={{marginBottom:6}}>{l.category} · {l.storage}</div>
                <div className="card-tags">
                  <span className="tag">{l.qty} {l.unit}</span>
                  <span className="tag">Exp {l.expiry}</span>
                  <span className="tag" style={{color:l.free?"var(--accent2)":"var(--accent)"}}>{l.free?"Free":`₹${l.price}`}</span>
                </div>
                {/* Edit/delete only for active listings, not reserved or expired */}
                {l.status==="active"&&(
                  <div style={{display:"flex",gap:8,marginTop:12}}>
                    <button className="btn btn-secondary btn-sm" onClick={()=>startEdit(l)}>Edit</button>
                    <button className="btn btn-danger btn-sm" onClick={()=>{setListings(ls=>ls.filter(x=>x.id!==l.id));onToast("Listing deleted");}}>Delete</button>
                  </div>
                )}
                {l.status==="reserved"&&<p style={{fontSize:"0.75rem",color:"var(--warning)",marginTop:10}}>⏳ Reserved — cannot edit until pickup confirmed</p>}
              </div>
            </div>
          ))}
        </div>
      }
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// WALLET (Restaurant)
// ─────────────────────────────────────────────────────────────
function WalletPage({ user, usersDB, setUsersDB, onToast }) {
  const [linking, setLinking] = useState(false);
  const [bf, setBf] = useState({ holder:"", account:"", confirm:"", ifsc:"", bank:"" });
  const cur = usersDB.find(u=>u.id===user.id)||user;

  const payHistory = [
    { id:"PO-1042", date:"Jun 28, 2025", item:"Heirloom Tomatoes", amt:0,    status:"Donation" },
    { id:"PO-1031", date:"Jun 15, 2025", item:"Brioche Dough (8kg)", amt:2560, status:"Paid" },
    { id:"PO-1019", date:"Jun 01, 2025", item:"Saffron ×4 packs",   amt:1800, status:"Paid" },
    { id:"PO-1008", date:"May 22, 2025", item:"Heavy Cream (6L)",    amt:0,    status:"Donation" },
    { id:"PO-0995", date:"May 10, 2025", item:"Choc Couverture",     amt:4750, status:"Paid" },
  ];
  const totalEarned = payHistory.reduce((s,h)=>s+h.amt,0);

  const handleLink = () => {
    if (!bf.holder||!bf.account||!bf.ifsc||!bf.bank) { onToast("Fill all fields","err"); return; }
    if (bf.account!==bf.confirm) { onToast("Account numbers do not match","err"); return; }
    setUsersDB(db=>db.map(u=>u.id===user.id?{...u,bankLinked:true,bankName:bf.bank,bankAccount:"•••• "+bf.account.slice(-4),bankIFSC:bf.ifsc}:u));
    setLinking(false); setBf({holder:"",account:"",confirm:"",ifsc:"",bank:""});
    onToast("Bank account linked via Stripe Connect");
  };

  return (
    <div className="page-enter">
      <div className="page-header"><h1>Wallet & Payouts</h1><p>Manage your bank account and payout history</p></div>
      <div className="stats-row">
        <div className="stat-card"><div className="stat-val">₹4,210</div><div className="stat-lbl">Pending Payout</div></div>
        <div className="stat-card"><div className="stat-val o">₹{totalEarned.toLocaleString()}</div><div className="stat-lbl">Total Earned</div></div>
        <div className="stat-card"><div className="stat-val b">{payHistory.length}</div><div className="stat-lbl">Transactions</div></div>
      </div>

      <div className="card">
        <div className="card-title">🏦 Linked Bank Account</div>
        {cur.bankLinked
          ? <div className="bank-card">
              <div><div style={{fontWeight:700,fontSize:"0.95rem",marginBottom:3}}>{cur.bankName} {cur.bankAccount}</div><div style={{fontSize:"0.78rem",color:"var(--muted)"}}>IFSC: {cur.bankIFSC} · Stripe Connect · Verified</div></div>
              <span className="badge badge-active">Active</span>
            </div>
          : <p style={{color:"var(--muted)",fontSize:"0.875rem",marginBottom:14}}>No bank account linked. Add one to receive payouts.</p>
        }
        <button className="btn btn-secondary" style={{marginTop:6}} onClick={()=>setLinking(v=>!v)}>
          {linking?"Cancel":cur.bankLinked?"+ Link Another Account":"+ Link Bank Account"}
        </button>
        {linking&&(
          <div style={{marginTop:16,padding:16,background:"var(--bg)",borderRadius:10,border:"1px solid var(--border)"}}>
            <div className="form-grid" style={{marginBottom:12}}>
              <div className="form-group"><label>Account Holder Name</label><input value={bf.holder} onChange={e=>setBf(f=>({...f,holder:e.target.value}))} placeholder="As on bank records"/></div>
              <div className="form-group"><label>Bank Name</label><input value={bf.bank} onChange={e=>setBf(f=>({...f,bank:e.target.value}))} placeholder="HDFC, ICICI, SBI…"/></div>
              <div className="form-group">
                <label>Account Number</label>
                <input value={bf.account} onChange={e=>setBf(f=>({...f,account:e.target.value}))} placeholder="Account number" type="password"
                  className={bf.account&&bf.confirm&&bf.account!==bf.confirm?"err":""}/>
              </div>
              <div className="form-group">
                <label>Confirm Account Number</label>
                <input value={bf.confirm} onChange={e=>setBf(f=>({...f,confirm:e.target.value}))} placeholder="Re-enter account number"
                  className={bf.confirm&&bf.account!==bf.confirm?"err":""}/>
                {bf.confirm&&bf.account!==bf.confirm&&<span className="field-err">Account numbers do not match</span>}
              </div>
              <div className="form-group"><label>IFSC Code</label><input value={bf.ifsc} onChange={e=>setBf(f=>({...f,ifsc:e.target.value.toUpperCase()}))} placeholder="HDFC0001234"/></div>
            </div>
            <button className="btn btn-primary btn-sm" onClick={handleLink}>Verify & Link Account</button>
          </div>
        )}
      </div>

      <div className="card">
        <div className="card-title">📊 Payout History</div>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:"0.875rem"}}>
          <thead><tr style={{borderBottom:"1px solid var(--border)"}}>
            {["Reference","Date","Item","Amount","Status"].map(h=><th key={h} style={{textAlign:"left",padding:"8px 10px",color:"var(--muted)",fontWeight:700,fontSize:"0.72rem",textTransform:"uppercase",letterSpacing:"0.4px"}}>{h}</th>)}
          </tr></thead>
          <tbody>{payHistory.map(r=><tr key={r.id} style={{borderBottom:"1px solid var(--border)"}}>
            <td style={{padding:"11px 10px",fontFamily:"var(--font-head)",fontWeight:600,color:"var(--accent3)"}}>{r.id}</td>
            <td style={{padding:"11px 10px",color:"var(--muted)",fontSize:"0.81rem"}}>{r.date}</td>
            <td style={{padding:"11px 10px"}}>{r.item}</td>
            <td style={{padding:"11px 10px",fontWeight:700,color:r.amt===0?"var(--accent2)":"var(--accent)"}}>{r.amt===0?"Donation":`₹${r.amt.toLocaleString()}`}</td>
            <td style={{padding:"11px 10px"}}><span className={`badge ${r.status==="Paid"?"badge-active":"badge-pending"}`}>{r.status}</span></td>
          </tr>)}</tbody>
        </table>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// PROFILE
// ─────────────────────────────────────────────────────────────
function ProfilePage({ user, usersDB, setUsersDB, onToast }) {
  const cur = usersDB.find(u=>u.id===user.id)||user;
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({...cur});
  // Track which fields changed so we can show "pending verification"
  const [pendingFields, setPendingFields] = useState([]);
  const [docUploaded, setDocUploaded] = useState(cur.docUploaded||false);
  const setF = (k,v) => setForm(f=>({...f,[k]:v}));

  // non-profit: doc required for payment exemption
  const needsDoc = cur.role==="receiver" && cur.acctType==="Nonprofit / NGO";
  const docMissing = needsDoc && !docUploaded;

  const handleSave = () => {
    const changed = VERIFY_FIELDS.filter(k => form[k]!==cur[k]);
    setPendingFields(changed);
    setUsersDB(db=>db.map(u=>u.id===user.id?{...u,...form}:u));
    setEditing(false);
    onToast(changed.length ? "Profile saved — some fields pending verification" : "Profile saved");
  };

  const restActivity = [
    { icon:"📦", title:"Listed Fresh Basil Bunches — 30 bunches", time:"2 hours ago" },
    { icon:"✅", title:"Pickup confirmed for Brioche Dough", time:"Yesterday" },
    { icon:"💳", title:"Payout of ₹2,560 received", time:"Jun 28" },
    { icon:"📝", title:"Profile updated", time:"Jun 15" },
    { icon:"🏦", title:"Bank account linked", time:"Jun 01" },
  ];
  const recvActivity = [
    { icon:"🛒", title:"Reserved Heirloom Tomatoes — 5 kg", time:"1 hour ago" },
    { icon:"✅", title:"Picked up Fresh Basil from The Green Fork", time:"Yesterday" },
    { icon:"📄", title:"Compliance document uploaded", time:"Jun 20" },
    { icon:"🏠", title:"Account created", time:"Jun 01" },
  ];

  return (
    <div className="page-enter">
      <div className="page-header ph-row">
        <div><h1>Profile</h1><p>Manage your account information</p></div>
        {!editing&&<button className="btn btn-secondary" onClick={()=>{setForm({...cur});setEditing(true);}}>✏️ Edit Profile</button>}
      </div>

      <div className="profile-hdr">
        <div className="avatar-lg">{cur.name[0].toUpperCase()}</div>
        <div>
          <div className="pname">{form.name}</div>
          <div className="pmeta">
            <span className={`role-badge ${cur.role}`}>{cur.role}</span>
            <span className={`vtag ${cur.verified?"verified":"pending"}`}>{cur.verified?"✓ Verified":"⏳ Pending"}</span>
            {pendingFields.length>0&&<span className="vtag pending">⏳ {pendingFields.length} field{pendingFields.length>1?"s":""} pending re-verification</span>}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-title">📋 Personal Information</div>
        {pendingFields.length>0&&<div style={{marginBottom:16}}>
          <div className="success-msg">Profile saved. The following fields are pending verification: <strong>{pendingFields.join(", ")}</strong></div>
        </div>}
        <div className="form-grid">
          <div className="form-group">
            <label>Full Name</label>
            <input value={form.name} disabled={!editing} onChange={e=>setF("name",e.target.value)}/>
            {pendingFields.includes("name")&&<span className="pending-note">⏳ Pending verification</span>}
          </div>
          <div className="form-group">
            <label>{cur.role==="restaurant"?"Restaurant Name":"Organisation Name"}</label>
            <input value={form.biz||""} disabled={!editing} onChange={e=>setF("biz",e.target.value)}/>
            {pendingFields.includes("biz")&&<span className="pending-note">⏳ Pending verification</span>}
          </div>
          <div className="form-group"><label>Email</label><input value={cur.email} disabled/></div>
          <div className="form-group">
            <label>Phone</label>
            <input value={form.phone||""} disabled={!editing} onChange={e=>setF("phone",e.target.value)} placeholder="+91 98765 43210"/>
            {pendingFields.includes("phone")&&<span className="pending-note">⏳ Pending verification</span>}
          </div>
          <div className="form-group full">
            <label>Address</label>
            <input value={form.address||""} disabled={!editing} onChange={e=>setF("address",e.target.value)}/>
            {pendingFields.includes("address")&&<span className="pending-note">⏳ Pending verification</span>}
          </div>
          {cur.role==="restaurant"&&<>
            <div className="form-group">
              <label>Restock Schedule / Operating Hours</label>
              <input value={form.operatingHours||""} disabled={!editing} onChange={e=>setF("operatingHours",e.target.value)} placeholder="e.g. Mon–Sat 08:00–22:00"/>
            </div>
            <div className="form-group">
              <label>FSSAI License</label>
              <input value={form.fssaiLicense||""} disabled={!editing} onChange={e=>setF("fssaiLicense",e.target.value)} placeholder="14-digit license"/>
              {pendingFields.includes("fssaiLicense")&&<span className="pending-note">⏳ Pending verification</span>}
            </div>
            <div className="form-group full"><label>Storage Capacity</label><input value={form.storageCapacity||""} disabled={!editing} onChange={e=>setF("storageCapacity",e.target.value)}/></div>
          </>}
          {cur.role==="receiver"&&(
            <div className="form-group">
              <label>Account Type</label>
              {editing
                ? <select value={form.acctType||""} onChange={e=>setF("acctType",e.target.value)}>
                    {["Nonprofit / NGO","Small Business","Individual","Community Kitchen"].map(o=><option key={o}>{o}</option>)}
                  </select>
                : <input value={form.acctType||""} disabled/>
              }
              {pendingFields.includes("acctType")&&<span className="pending-note">⏳ Pending verification</span>}
            </div>
          )}
        </div>
        {editing&&<div style={{display:"flex",gap:10,marginTop:18}}>
          <button className="btn btn-primary" onClick={handleSave}>Save Changes</button>
          <button className="btn btn-secondary" onClick={()=>{setForm({...cur});setEditing(false);setPendingFields([]);}}>Cancel</button>
        </div>}
      </div>

      {/* Compliance doc — mandatory for nonprofit receivers */}
      {cur.role==="receiver"&&(
        <div className="card" style={docMissing?{borderColor:"rgba(255,77,106,0.4)"}:{}}>
          <div className="card-title">📄 Compliance Documents {docMissing&&<span className="badge badge-pending" style={{marginLeft:6}}>Required</span>}</div>
          <p style={{color:"var(--muted)",fontSize:"0.85rem",marginBottom:14}}>
            {needsDoc
              ? "Upload your tax exemption certificate to receive items at no charge. This is <strong>required</strong> for nonprofits claiming payment exemption."
              : "Optional compliance documents for your account."
            }
          </p>
          {docMissing&&<div className="error-msg" style={{marginBottom:14}}>⚠ Exemption certificate is required for nonprofit payment exemption. Please upload below.</div>}
          {docUploaded
            ? <div className="success-msg">✓ Exemption certificate uploaded — pending admin verification</div>
            : <div className="upload-area" onClick={()=>{setDocUploaded(true);setUsersDB(db=>db.map(u=>u.id===user.id?{...u,docUploaded:true}:u));onToast("Document uploaded for verification");}}>
                <div className="upload-icon">📑</div>
                <p><strong style={{color:"var(--accent)"}}>Click to upload</strong> or drag and drop</p>
                <p style={{marginTop:4,fontSize:"0.75rem"}}>PDF, JPG, PNG up to 10 MB</p>
              </div>
          }
        </div>
      )}

      {/* Activity feed */}
      <div className="card">
        <div className="card-title">📅 Recent Activity</div>
        {(cur.role==="restaurant"?restActivity:recvActivity).map((a,i)=>(
          <div key={i} className="activity-item">
            <div className="act-icon">{a.icon}</div>
            <div><div className="act-title">{a.title}</div><div className="act-time">{a.time}</div></div>
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
  const mine = listings.filter(l=>l.restaurant===user.biz||l.restaurantId===user.id);
  return (
    <div className="page-enter">
      <div className="page-header"><h1>Welcome back, {user.name.split(" ")[0]} 👋</h1><p>Here's your platform overview</p></div>
      <div className="stats-row">
        {user.role==="restaurant"&&<>
          <div className="stat-card"><div className="stat-val">{mine.filter(l=>l.status==="active").length}</div><div className="stat-lbl">Active Listings</div></div>
          <div className="stat-card"><div className="stat-val o">{mine.filter(l=>l.status==="reserved").length}</div><div className="stat-lbl">Reserved</div></div>
          <div className="stat-card"><div className="stat-val b">₹4,210</div><div className="stat-lbl">Pending Payout</div></div>
        </>}
        {user.role==="receiver"&&<>
          <div className="stat-card"><div className="stat-val">{listings.filter(l=>l.status==="active").length}</div><div className="stat-lbl">Items Available</div></div>
          <div className="stat-card"><div className="stat-val o">3</div><div className="stat-lbl">My Reservations</div></div>
          <div className="stat-card"><div className="stat-val b">7</div><div className="stat-lbl">Total Claims</div></div>
        </>}
        {user.role==="admin"&&<>
          <div className="stat-card"><div className="stat-val">{listings.length}</div><div className="stat-lbl">Total Listings</div></div>
          <div className="stat-card"><div className="stat-val o">5</div><div className="stat-lbl">Active Users</div></div>
          <div className="stat-card"><div className="stat-val b">12</div><div className="stat-lbl">Transactions</div></div>
        </>}
      </div>
      <div className="card">
        <div className="card-title">🌿 Platform Impact</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(148px,1fr))",gap:16}}>
          {[["🥗","142 kg","Food saved this month"],["🤝","28","Successful handoffs"],["🏢","9","Partner restaurants"],["📉","₹18,400","Value recovered"]].map(([ic,v,l])=>(
            <div key={l} style={{textAlign:"center",padding:"18px 12px",background:"var(--bg)",borderRadius:10,border:"1px solid var(--border)"}}>
              <div style={{fontSize:"1.5rem",marginBottom:6}}>{ic}</div>
              <div style={{fontFamily:"var(--font-head)",fontWeight:800,fontSize:"1.1rem",color:"var(--accent)"}}>{v}</div>
              <div style={{fontSize:"0.74rem",color:"var(--muted)",marginTop:4}}>{l}</div>
            </div>
          ))}
        </div>
      </div>
      {user.role==="receiver"&&(
        <div className="card">
          <div className="card-title" style={{marginBottom:14}}>🔍 Recent Listings</div>
          <div className="listings-grid">
            {listings.filter(l=>l.status==="active").slice(0,3).map(l=>(
              <div key={l.id} className="listing-card" onClick={()=>onNavigate("browse")}>
                <div className="card-img">{l.emoji||"📦"}</div>
                <div className="card-body">
                  <div className="card-name">{l.name}</div>
                  <div className="card-sub">{l.restaurant}</div>
                  <div className="card-row"><span className={`price-lbl${l.free?" free":""}`}>{l.free?"Free":`₹${l.price}`}</span><span className="qty-lbl">{l.qty} {l.unit}</span></div>
                </div>
              </div>
            ))}
          </div>
          <button className="btn btn-primary" style={{marginTop:16}} onClick={()=>onNavigate("browse")}>Browse all items →</button>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// ADMIN
// ─────────────────────────────────────────────────────────────
function AdminPage({ listings, usersDB, onToast }) {
  const [flagged, setFlagged] = useState([]);
  const [suspended, setSuspended] = useState([]);
  return (
    <div className="page-enter">
      <div className="page-header"><h1>Admin Panel</h1><p>User management, listings overview, and platform stats</p></div>
      <div className="stats-row">
        <div className="stat-card"><div className="stat-val">{usersDB.length}</div><div className="stat-lbl">Total Users</div></div>
        <div className="stat-card"><div className="stat-val o">{listings.length}</div><div className="stat-lbl">All Listings</div></div>
        <div className="stat-card"><div className="stat-val b">12</div><div className="stat-lbl">Transactions</div></div>
        <div className="stat-card"><div className="stat-val r">{flagged.length}</div><div className="stat-lbl">Flagged</div></div>
      </div>
      <div className="card">
        <div className="card-title">👥 User Management</div>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:"0.875rem"}}>
          <thead><tr style={{borderBottom:"1px solid var(--border)"}}>
            {["Name","Role","Email","Status","Actions"].map(h=><th key={h} style={{textAlign:"left",padding:"8px 10px",color:"var(--muted)",fontWeight:700,fontSize:"0.72rem",textTransform:"uppercase",letterSpacing:"0.4px"}}>{h}</th>)}
          </tr></thead>
          <tbody>{usersDB.filter(u=>u.role!=="admin").map(u=>{
            const fl=flagged.includes(u.id), su=suspended.includes(u.id);
            return <tr key={u.id} style={{borderBottom:"1px solid var(--border)",opacity:su?.5:1}}>
              <td style={{padding:"11px 10px",fontWeight:600}}>{u.name}</td>
              <td style={{padding:"11px 10px"}}><span className={`role-badge ${u.role}`}>{u.role}</span></td>
              <td style={{padding:"11px 10px",color:"var(--muted)",fontSize:"0.81rem"}}>{u.email}</td>
              <td style={{padding:"11px 10px"}}><span className={`badge ${su?"badge-expired":fl?"badge-reserved":"badge-active"}`}>{su?"Suspended":fl?"Flagged":"Active"}</span></td>
              <td style={{padding:"11px 10px"}}><div style={{display:"flex",gap:6}}>
                <button className="btn btn-secondary btn-sm" onClick={()=>{setFlagged(f=>fl?f.filter(x=>x!==u.id):[...f,u.id]);onToast(fl?"Flag removed":"User flagged");}}>{fl?"Unflag":"Flag"}</button>
                <button className="btn btn-danger btn-sm" onClick={()=>{setSuspended(s=>su?s.filter(x=>x!==u.id):[...s,u.id]);onToast(su?"User reinstated":"User suspended");}}>{su?"Reinstate":"Suspend"}</button>
              </div></td>
            </tr>;
          })}</tbody>
        </table>
      </div>
      <div className="card">
        <div className="card-title">📋 All Listings</div>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:"0.875rem"}}>
          <thead><tr style={{borderBottom:"1px solid var(--border)"}}>
            {["Item","Restaurant","Category","Status","Price"].map(h=><th key={h} style={{textAlign:"left",padding:"8px 10px",color:"var(--muted)",fontWeight:700,fontSize:"0.72rem",textTransform:"uppercase",letterSpacing:"0.4px"}}>{h}</th>)}
          </tr></thead>
          <tbody>{listings.map(l=><tr key={l.id} style={{borderBottom:"1px solid var(--border)"}}>
            <td style={{padding:"11px 10px",fontWeight:600}}>{l.emoji} {l.name}</td>
            <td style={{padding:"11px 10px",color:"var(--muted)",fontSize:"0.81rem"}}>{l.restaurant}</td>
            <td style={{padding:"11px 10px"}}>{l.category}</td>
            <td style={{padding:"11px 10px"}}><span className={`badge badge-${l.status}`}>{l.status}</span></td>
            <td style={{padding:"11px 10px",color:l.free?"var(--accent2)":"var(--accent)",fontWeight:700}}>{l.free?"Free":`₹${l.price}`}</td>
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
  const [usersDB, setUsersDB] = useState(INIT_USERS);
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("dashboard");
  const [listings, setListings] = useState(INIT_LISTINGS);
  const [toast, setToast] = useState(null);
  const [toastType, setToastType] = useState("success");
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [detailItem, setDetailItem] = useState(null);
  // intendedPage: where to redirect after login if user triggered auth from a protected action
  const [intendedPage, setIntendedPage] = useState(null);

  const showToast = (msg, type="success") => {
    setToast(null);
    requestAnimationFrame(()=>{ setToast(msg); setToastType(type); });
    setTimeout(()=>setToast(null), 3200);
  };

  const handleLogin = (u, redirectTo="dashboard") => {
    setUser(u);
    setPage(redirectTo);
    setIntendedPage(null);
  };

  const handleSignOut = () => {
    setUser(null);
    setPage("dashboard");
    setCart([]);
    setDetailItem(null);
    setCartOpen(false);
  };

  if (!user) return (
    <>
      <style>{STYLE}</style>
      <AuthPage onLogin={handleLogin} usersDB={usersDB} setUsersDB={setUsersDB} intendedPage={intendedPage}/>
    </>
  );

  const curUser = usersDB.find(u=>u.id===user.id)||user;

  const restaurantNav = [
    { id:"dashboard", icon:"🏠", label:"Dashboard" },
    { id:"listings",  icon:"📦", label:"My Listings" },
    { id:"wallet",    icon:"💳", label:"Wallet & Payouts" },
    { id:"profile",   icon:"👤", label:"Profile" },
  ];
  const receiverNav = [
    { id:"dashboard", icon:"🏠", label:"Dashboard" },
    { id:"browse",    icon:"🛍️", label:"Browse Surplus", badge:listings.filter(l=>l.status==="active").length },
    { id:"profile",   icon:"👤", label:"Profile" },
  ];
  const adminNav = [
    { id:"dashboard", icon:"🏠", label:"Dashboard" },
    { id:"admin",     icon:"🛡️", label:"Admin Panel" },
    { id:"profile",   icon:"👤", label:"Profile" },
  ];
  const nav = user.role==="restaurant" ? restaurantNav : user.role==="receiver" ? receiverNav : adminNav;

  const renderPage = () => {
    switch(page) {
      case "dashboard": return <Dashboard user={curUser} listings={listings} onNavigate={setPage}/>;
      case "profile":   return <ProfilePage user={user} usersDB={usersDB} setUsersDB={setUsersDB} onToast={showToast}/>;
      case "listings":  return <MyListingsPage listings={listings} setListings={setListings} user={curUser} onToast={showToast}/>;
      case "wallet":    return <WalletPage user={user} usersDB={usersDB} setUsersDB={setUsersDB} onToast={showToast}/>;
      case "browse":    return <BrowsePage listings={listings} setListings={setListings} onToast={showToast} cart={cart} setCart={setCart} onShowDetail={setDetailItem}/>;
      case "admin":     return <AdminPage listings={listings} usersDB={usersDB} onToast={showToast}/>;
      default:          return <Dashboard user={curUser} listings={listings} onNavigate={setPage}/>;
    }
  };

  return (
    <>
      <style>{STYLE}</style>
      <div className="app-wrap">
        <header className="header">
          {/* Logo — click to go home */}
          <div className="logo" onClick={()=>setPage("dashboard")}>
            <span className="logo-dot"/>
            <span>Surplus</span><span style={{color:"var(--text)"}}>Link</span>
          </div>

          <div className="header-right">
            {/* Cart button — receivers only */}
            {user.role==="receiver"&&(
              <button className="cart-btn" onClick={()=>setCartOpen(true)}>
                🛒 Cart {cart.length>0&&<span className="cart-count">{cart.length}</span>}
              </button>
            )}
            {/* Role badge */}
            <span className={`role-badge ${user.role}`}>{curUser.biz||curUser.name}</span>
            {/* Avatar — click to go to profile */}
            <div className="header-avatar" onClick={()=>setPage("profile")} title="Go to profile">
              {curUser.name[0].toUpperCase()}
            </div>
            <button className="nav-btn" onClick={handleSignOut}>Sign Out</button>
          </div>
        </header>

        <div className="main">
          <nav className="sidebar">
            <div className="sidebar-section">Navigation</div>
            {nav.map(n=>(
              <div key={n.id} className={`sidebar-item${page===n.id?" active":""}`} onClick={()=>setPage(n.id)}>
                <span className="s-icon">{n.icon}</span>{n.label}
                {n.badge&&<span className="sidebar-badge">{n.badge}</span>}
              </div>
            ))}
          </nav>
          <main className="content">{renderPage()}</main>
        </div>
      </div>

      {cartOpen&&<CartDrawer cart={cart} setCart={setCart} setListings={setListings} onClose={()=>setCartOpen(false)} onToast={showToast}/>}
      {detailItem&&<ProductDetailModal listing={detailItem} onClose={()=>setDetailItem(null)} cart={cart} setCart={setCart} setListings={setListings} onToast={showToast}/>}
      {toast&&<Toast msg={toast} type={toastType}/>}
    </>
  );
}
