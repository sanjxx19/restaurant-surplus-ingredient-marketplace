import { useState, useEffect, useCallback, useRef } from "react";
import {
  supabase,
  getMyProfile,
  getListings,
  getMyCart,
  addToCart,
  removeFromCart,
  confirmOrder,
  releaseExpiredReservations,
} from "./supabase.js";

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
.main { flex: 1; display: flex; }
.sidebar { width: 230px; background: var(--surface); border-right: 1px solid var(--border); padding: 24px 12px; display: flex; flex-direction: column; gap: 4px; min-height: calc(100vh - 64px); }
.sidebar-item { display: flex; align-items: center; gap: 10px; padding: 10px 14px; border-radius: 9px; color: var(--muted); font-size: 0.875rem; font-weight: 500; cursor: pointer; transition: all 0.18s; border: 1px solid transparent; position: relative; }
.sidebar-item:hover { background: var(--surface2); color: var(--text); }
.sidebar-item.active { background: var(--surface2); color: var(--text); border-color: var(--border); }
.sidebar-item .s-icon { font-size: 1.1rem; min-width: 22px; text-align: center; }
.sidebar-section { font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: var(--muted); padding: 14px 14px 6px; }
.sidebar-badge { position: absolute; right: 12px; background: var(--accent); color: #000; font-size: 0.65rem; font-weight: 800; padding: 2px 6px; border-radius: 20px; }
.content { flex: 1; padding: 32px; overflow-y: auto; max-height: calc(100vh - 64px); }
.card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 24px; margin-bottom: 20px; }
.card-title { font-family: var(--font-head); font-size: 1.1rem; font-weight: 700; color: var(--text); margin-bottom: 18px; display: flex; align-items: center; gap: 8px; }
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
.badge { display: inline-block; padding: 3px 9px; border-radius: 5px; font-size: 0.72rem; font-weight: 700; letter-spacing: 0.4px; text-transform: uppercase; }
.badge-active { background: rgba(0,229,160,0.12); color: var(--accent); border: 1px solid rgba(0,229,160,0.25); }
.badge-reserved { background: rgba(255,200,87,0.12); color: var(--warning); border: 1px solid rgba(255,200,87,0.25); }
.badge-expired { background: rgba(110,127,148,0.12); color: var(--muted); border: 1px solid var(--border); }
.badge-pending { background: rgba(124,158,255,0.12); color: var(--accent3); border: 1px solid rgba(124,158,255,0.25); }
.badge-free { background: rgba(255,107,53,0.12); color: var(--accent2); border: 1px solid rgba(255,107,53,0.25); }
.badge-completed { background: rgba(0,229,160,0.12); color: var(--accent); border: 1px solid rgba(0,229,160,0.25); }
.badge-claimed { background: rgba(124,158,255,0.12); color: var(--accent3); border: 1px solid rgba(124,158,255,0.25); }
.badge-flagged { background: rgba(255,77,106,0.12); color: var(--danger); border: 1px solid rgba(255,77,106,0.25); }
.badge-alert { background: rgba(255,200,87,0.15); color: var(--warning); border: 1px solid rgba(255,200,87,0.35); }
.page-enter { animation: fadeUp 0.28s ease; }
@keyframes fadeUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
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
.warning-msg { background: rgba(255,200,87,0.1); border: 1px solid rgba(255,200,87,0.3); color: var(--warning); padding: 10px 14px; border-radius: 8px; font-size: 0.85rem; margin-bottom: 14px; }
.divider { text-align: center; color: var(--muted); font-size: 0.8rem; margin: 14px 0; position: relative; }
.divider::before, .divider::after { content:''; position:absolute; top:50%; width:37%; height:1px; background:var(--border); }
.divider::before { left:0; } .divider::after { right:0; }
.link-btn { background: none; border: none; color: var(--accent); font-size: 0.85rem; font-weight: 600; cursor: pointer; text-decoration: underline; padding: 0; }
.step-bar { display: flex; gap: 6px; justify-content: center; margin-bottom: 20px; }
.step-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--border); transition: all 0.25s; }
.step-dot.active { background: var(--accent); width: 26px; border-radius: 4px; }
.step-dot.done { background: var(--accent); opacity: 0.45; }
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
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.72); backdrop-filter: blur(5px); z-index: 200; display: flex; align-items: center; justify-content: center; padding: 20px; }
.modal { background: var(--surface); border: 1px solid var(--border); border-radius: 16px; padding: 30px; width: 600px; max-width: 100%; max-height: 90vh; overflow-y: auto; position: relative; animation: fadeUp 0.24s ease; }
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
.cart-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 199; backdrop-filter: blur(3px); }
.cart-drawer { position: fixed; top: 0; right: 0; width: 420px; max-width: 95vw; height: 100vh; background: var(--surface); border-left: 1px solid var(--border); z-index: 200; display: flex; flex-direction: column; animation: slideRight 0.28s ease; }
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
.co-section { background: var(--bg); border: 1px solid var(--border); border-radius: 10px; padding: 16px; margin-bottom: 13px; }
.co-section h3 { font-family: var(--font-head); font-size: 0.88rem; font-weight: 700; margin-bottom: 12px; color: var(--text); }
.pay-option { display: flex; align-items: center; gap: 10px; cursor: pointer; padding: 9px 12px; border: 1px solid var(--border); border-radius: 8px; font-size: 0.875rem; color: var(--text); font-weight: 500; margin-bottom: 7px; transition: all 0.2s; background: transparent; width: 100%; }
.pay-option.selected { border-color: var(--accent); background: rgba(0,229,160,0.05); }
.pay-option input { width: auto; background: none; border: none; padding: 0; accent-color: var(--accent); }
.stats-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(138px, 1fr)); gap: 13px; margin-bottom: 22px; }
.stat-card { background: var(--surface); border: 1px solid var(--border); border-radius: 10px; padding: 17px; }
.stat-val { font-family: var(--font-head); font-size: 1.55rem; font-weight: 800; color: var(--accent); line-height: 1; }
.stat-val.o { color: var(--accent2); } .stat-val.b { color: var(--accent3); } .stat-val.r { color: var(--danger); }
.stat-lbl { font-size: 0.74rem; color: var(--muted); margin-top: 5px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.4px; }
.profile-hdr { display: flex; align-items: center; gap: 18px; margin-bottom: 22px; }
.avatar-lg { width: 68px; height: 68px; border-radius: 50%; background: linear-gradient(135deg,var(--accent),var(--accent3)); display: flex; align-items: center; justify-content: center; font-size: 1.6rem; font-weight: 800; color: #000; font-family: var(--font-head); flex-shrink: 0; }
.pname { font-family: var(--font-head); font-size: 1.25rem; font-weight: 700; }
.pmeta { font-size: 0.84rem; color: var(--muted); display: flex; align-items: center; gap: 8px; margin-top: 4px; flex-wrap: wrap; }
.vtag { font-size: 0.72rem; padding: 2px 8px; border-radius: 4px; font-weight: 700; }
.vtag.verified { background: rgba(0,229,160,0.12); color: var(--accent); }
.vtag.pending { background: rgba(255,200,87,0.12); color: var(--warning); }
.upload-area { border: 2px dashed var(--border); border-radius: 10px; padding: 22px; text-align: center; cursor: pointer; transition: all 0.2s; }
.upload-area:hover { border-color: var(--accent); background: rgba(0,229,160,0.03); }
.upload-icon { font-size: 1.9rem; margin-bottom: 7px; }
.bank-card { display: flex; align-items: center; justify-content: space-between; padding: 15px 17px; background: linear-gradient(135deg,var(--surface2),var(--surface3)); border-radius: 11px; border: 1px solid var(--border); margin-bottom: 13px; }
.listings-mgmt-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 14px; }
.mgmt-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; }
.mgmt-card-img { height: 90px; background: var(--surface2); display: flex; align-items: center; justify-content: center; font-size: 2.5rem; position: relative; }
.mgmt-card-body { padding: 13px 15px 15px; }
.pickup-item { display: flex; align-items: center; justify-content: space-between; padding: 13px 0; border-bottom: 1px solid var(--border); }
.pickup-item:last-child { border-bottom: none; }
.emoji-picker-grid { display: flex; flex-wrap: wrap; gap: 6px; padding: 10px; background: var(--bg); border: 1px solid var(--border); border-radius: 10px; margin-top: 6px; }
.ep-opt { width: 38px; height: 38px; border-radius: 7px; background: var(--surface2); border: 2px solid transparent; display: flex; align-items: center; justify-content: center; font-size: 1.25rem; cursor: pointer; transition: all 0.15s; }
.ep-opt:hover, .ep-opt.sel { border-color: var(--accent); background: rgba(0,229,160,0.09); }
.page-header { margin-bottom: 22px; }
.page-header h1 { font-family: var(--font-head); font-size: 1.55rem; font-weight: 800; color: var(--text); }
.page-header p { color: var(--muted); font-size: 0.875rem; margin-top: 4px; }
.ph-row { display: flex; align-items: flex-start; justify-content: space-between; }
.empty-state { text-align: center; padding: 55px 20px; color: var(--muted); }
.empty-state .ei { font-size: 2.8rem; margin-bottom: 11px; opacity: 0.55; }
.empty-state p { font-size: 0.88rem; }
.toast { position: fixed; bottom: 24px; right: 24px; background: var(--surface2); border: 1px solid var(--accent); color: var(--text); padding: 12px 18px; border-radius: 10px; font-size: 0.875rem; font-weight: 500; z-index: 400; max-width: 310px; box-shadow: 0 8px 24px rgba(0,0,0,0.4); animation: toastIn 0.3s ease, toastOut 0.3s 2.7s ease forwards; }
.toast.err { border-color: var(--danger); }
.toast.warn { border-color: var(--warning); }
@keyframes toastIn { from { opacity:0; transform:translateX(40px); } to { opacity:1; transform:translateX(0); } }
@keyframes toastOut { from { opacity:1; } to { opacity:0; } }
.loading-screen { display:flex; align-items:center; justify-content:center; height:100vh; background:var(--bg); flex-direction:column; gap:16px; }
.spinner { width:40px; height:40px; border:3px solid var(--border); border-top-color:var(--accent); border-radius:50%; animation:spin 0.8s linear infinite; }
@keyframes spin { to { transform:rotate(360deg); } }
::-webkit-scrollbar { width: 5px; }
::-webkit-scrollbar-track { background: var(--bg); }
::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }
.split-bar { background: var(--bg); border: 1px solid var(--border); border-radius: 8px; padding: 12px 14px; margin: 10px 0; }
.split-bar-row { display: flex; justify-content: space-between; font-size: 0.82rem; margin-bottom: 4px; }
.split-visual { height: 6px; border-radius: 3px; background: var(--border); overflow: hidden; margin-top: 6px; }
.split-fill { height: 100%; background: var(--accent); border-radius: 3px; transition: width 0.3s; }
.tab-bar { display: flex; gap: 4px; background: var(--bg); border-radius: 9px; padding: 3px; margin-bottom: 20px; }
.tab-btn { flex: 1; padding: 8px; border-radius: 7px; font-size: 0.82rem; font-weight: 600; color: var(--muted); cursor: pointer; transition: all 0.2s; border: none; background: transparent; }
.tab-btn.active { background: var(--surface2); color: var(--text); }
.claim-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 18px; margin-bottom: 14px; display: flex; gap: 16px; align-items: flex-start; }
.claim-icon { width: 52px; height: 52px; border-radius: 12px; background: var(--surface2); display: flex; align-items: center; justify-content: center; font-size: 1.6rem; flex-shrink: 0; }
.claim-info { flex: 1; min-width: 0; }
.claim-name { font-family: var(--font-head); font-weight: 700; font-size: 0.95rem; color: var(--text); }
.claim-meta { font-size: 0.78rem; color: var(--muted); margin-top: 3px; }
.claim-actions { display: flex; gap: 8px; margin-top: 12px; flex-wrap: wrap; }
.ref-chip { display: inline-flex; align-items: center; gap: 5px; background: rgba(124,158,255,0.1); border: 1px solid rgba(124,158,255,0.25); color: var(--accent3); padding: 3px 9px; border-radius: 5px; font-size: 0.72rem; font-weight: 700; font-family: var(--font-head); margin-top: 6px; }
.summary-line { display: flex; justify-content: space-between; align-items: center; padding: 6px 0; font-size: 0.85rem; border-bottom: 1px solid var(--border); }
.summary-line:last-child { border-bottom: none; }
.summary-line .label { color: var(--muted); }
.summary-line .value { font-weight: 600; color: var(--text); }
.platform-fee { color: var(--warning); }
.total-line { font-family: var(--font-head); font-weight: 800; font-size: 1rem; }
.slot-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-top: 8px; }
.slot-btn { padding: 8px 6px; border: 1px solid var(--border); border-radius: 7px; font-size: 0.78rem; font-weight: 600; color: var(--muted); background: transparent; cursor: pointer; transition: all 0.2s; text-align: center; }
.slot-btn:hover { border-color: var(--accent); color: var(--text); }
.slot-btn.selected { border-color: var(--accent); background: rgba(0,229,160,0.1); color: var(--accent); }
.nonprofit-bypass { background: rgba(0,229,160,0.07); border: 1px solid rgba(0,229,160,0.25); border-radius: 10px; padding: 16px; margin-bottom: 14px; display: flex; align-items: center; gap: 12px; }
.alert-banner { background: rgba(255,200,87,0.08); border: 1px solid rgba(255,200,87,0.3); border-radius: 10px; padding: 13px 16px; margin-bottom: 16px; display: flex; align-items: flex-start; gap: 10px; }
.alert-banner .ab-icon { font-size: 1.2rem; flex-shrink: 0; margin-top: 1px; }
.alert-banner .ab-body { flex: 1; }
.alert-banner .ab-title { font-weight: 700; font-size: 0.875rem; color: var(--warning); margin-bottom: 2px; }
.alert-banner .ab-msg { font-size: 0.78rem; color: var(--muted); line-height: 1.5; }
.flagged-banner { background: rgba(255,77,106,0.08); border: 1px solid rgba(255,77,106,0.3); border-radius: 10px; padding: 13px 16px; margin-bottom: 16px; display: flex; align-items: flex-start; gap: 10px; }
.flagged-banner .ab-title { color: var(--danger); }
.cleanup-bar { background: var(--surface2); border: 1px solid var(--border); border-radius: 10px; padding: 14px 18px; margin-bottom: 18px; display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.cleanup-bar p { font-size: 0.82rem; color: var(--muted); }
.cleanup-bar strong { color: var(--text); }
`;

// ─────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────
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
  Produce: ["🥬", "🍅", "🥕", "🥦", "🧅", "🥑", "🌽", "🫑", "🥒", "🍋"],
  Dairy: ["🧀", "🥛", "🧈", "🍳"],
  Bakery: ["🥐", "🍞", "🥖", "🫓", "🥯"],
  Meat: ["🥩", "🍗", "🥓"],
  Seafood: ["🐟", "🦐", "🦑", "🦞"],
  Grains: ["🌾", "🍚", "🍜", "🌰"],
  Spices: ["🌶️", "🧄", "🫚", "🫛"],
  Beverages: ["🧃", "🍷", "🥤", "☕"],
  Desserts: ["🍮", "🍰", "🧁", "🍫", "🍯"],
};
const SORT_OPTIONS = [
  { v: "newest", l: "Newest first" },
  { v: "price_asc", l: "Price: Low → High" },
  { v: "price_desc", l: "Price: High → Low" },
  { v: "expiry", l: "Expiring Soon" },
];
const DIST_OPTIONS = ["Any distance", "< 1 km", "< 3 km", "< 5 km", "< 10 km"];
const PLATFORM_FEE_RATE = 0.05;

const distKm = (id) => {
  const n = id ? parseInt(id.replace(/-/g, "").slice(0, 8), 16) : 0;
  return ((n % 95) + 5) / 10;
};

// ─────────────────────────────────────────────────────────────
// UTILITIES
// ─────────────────────────────────────────────────────────────
const validEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e);
const validPw = (p) => p.length >= 6;
const genRef = () => Math.random().toString(36).slice(2, 10).toUpperCase();

// Check if listing expires within 12 hours
const expiresWithin12h = (expiry) => {
  if (!expiry) return false;
  const exp = new Date(expiry);
  const now = new Date();
  const diffMs = exp.getTime() - now.getTime();
  return diffMs > 0 && diffMs <= 12 * 60 * 60 * 1000;
};

// Check if listing is past expiry
const isPastExpiry = (expiry) => {
  if (!expiry) return false;
  return new Date(expiry) < new Date();
};

function Toast({ msg, type }) {
  return (
    <div className={`toast${type === "err" ? " err" : type === "warn" ? " warn" : ""}`}>
      {type === "err" ? "⚠" : type === "warn" ? "⏰" : "✓"} {msg}
    </div>
  );
}

function Spinner() {
  return (
    <div className="loading-screen">
      <div className="spinner" />
      <span style={{ color: "var(--muted)", fontSize: "0.875rem" }}>Loading…</span>
    </div>
  );
}

function CartTimer({ expiresAt, onExpire }) {
  const [rem, setRem] = useState(Math.max(0, Math.floor((expiresAt - Date.now()) / 1000)));
  useEffect(() => {
    if (rem <= 0) { onExpire(); return; }
    const id = setInterval(() => {
      const left = Math.max(0, Math.floor((expiresAt - Date.now()) / 1000));
      if (left <= 0) { onExpire(); clearInterval(id); return; }
      setRem(left);
    }, 1000);
    return () => clearInterval(id);
  }, [expiresAt, onExpire]);
  const h = Math.floor(rem / 3600);
  const m = Math.floor((rem % 3600) / 60);
  const s = rem % 60;
  const fmt = (n) => String(n).padStart(2, "0");
  const urgent = rem < 600;
  return (
    <span className="ci-timer" style={{ color: urgent ? "var(--danger)" : "var(--warning)" }}>
      ⏱ {h > 0 ? `${h}h ` : ""}{fmt(m)}:{fmt(s)} remaining
    </span>
  );
}

// ─────────────────────────────────────────────────────────────
// DOCUMENT GENERATION
// ─────────────────────────────────────────────────────────────
function generateCompliancePDF(order, items, restaurantName) {
  const ref = order.reference || order.id?.slice(0, 8).toUpperCase() || genRef();
  const date = new Date(order.created_at || Date.now()).toLocaleDateString("en-IN", {
    day: "2-digit", month: "long", year: "numeric"
  });
  const itemRows = items.map(i =>
    `<tr><td>${i.emoji || "📦"} ${i.name}</td><td>${i.category || "—"}</td><td>${i.storage || "—"}</td><td>${i.qty} ${i.unit}</td><td>${i.expiry || "—"}</td><td>${i.free ? "Free/Donation" : `₹${i.price}`}</td></tr>`
  ).join("");

  const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Compliance — ${ref}</title>
<style>
  body{font-family:Arial,sans-serif;margin:40px;color:#1a1a2e;font-size:13px}
  h1{color:#00b37a;font-size:22px;margin-bottom:4px}.sub{color:#555;font-size:12px;margin-bottom:24px}
  .header-row{display:flex;justify-content:space-between;margin-bottom:28px}
  .block{background:#f4f8f6;border-left:3px solid #00b37a;padding:12px 16px;border-radius:0 8px 8px 0;margin-bottom:16px}
  .block h3{font-size:11px;text-transform:uppercase;letter-spacing:.5px;color:#888;margin-bottom:6px}
  table{width:100%;border-collapse:collapse;margin-top:16px}
  th{background:#00b37a;color:white;padding:8px 10px;text-align:left;font-size:11px}
  td{padding:9px 10px;border-bottom:1px solid #eee;font-size:12px}
  tr:nth-child(even) td{background:#f9fafb}
  .liability{background:#fff8e6;border:1px solid #ffc857;border-radius:8px;padding:14px;margin-top:24px;font-size:11px;color:#7a5c00;line-height:1.6}
  .footer{margin-top:32px;text-align:center;color:#aaa;font-size:10px;border-top:1px solid #eee;padding-top:12px}
  .ref{font-size:18px;font-weight:bold;color:#00b37a;letter-spacing:1px}
</style></head><body>
<div class="header-row">
  <div><h1>SurplusLink — Compliance Document</h1><div class="sub">Food Transfer &amp; Liability Record</div></div>
  <div style="text-align:right"><div class="ref">${ref}</div><div style="color:#888;font-size:11px">${date}</div></div>
</div>
<div class="block"><h3>Origin Restaurant</h3><strong>${restaurantName}</strong><br/>${items[0]?.address || "Address on file"}</div>
<div class="block"><h3>Transferred To</h3>${order.receiverName || "Verified Receiver"} · ${order.receiverType || "Organisation"}</div>
<h3 style="margin-top:20px;font-size:11px;text-transform:uppercase;letter-spacing:.5px;color:#888">Item Details</h3>
<table><tr><th>Item</th><th>Category</th><th>Storage</th><th>Quantity</th><th>Expiry</th><th>Value</th></tr>${itemRows}</table>
<div class="liability"><strong>Liability Protection Notice:</strong> This transfer is conducted under the Good Samaritan Food Donation Act (as applicable). The donor restaurant has represented that these goods were safe for consumption at time of transfer. SurplusLink and the originating restaurant shall not be held liable for mishandling or improper storage by the receiving party after transfer. This document serves as a record of voluntary surplus food redistribution.</div>
<div class="footer">Generated by SurplusLink · Bengaluru · ${date} · Reference: ${ref}</div>
</body></html>`;

  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = `SurplusLink-Compliance-${ref}.html`; a.click();
  URL.revokeObjectURL(url);
}

function generateDonationReceipt(order, items, restaurantName) {
  const ref = order.reference || order.id?.slice(0, 8).toUpperCase() || genRef();
  const date = new Date(order.created_at || Date.now()).toLocaleDateString("en-IN", {
    day: "2-digit", month: "long", year: "numeric"
  });
  const totalFMV = items.reduce((s, i) => s + (i.market_value || i.price * 3 || 100), 0);

  const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Donation Receipt — ${ref}</title>
<style>
  body{font-family:Arial,sans-serif;margin:40px;color:#1a1a2e;font-size:13px}
  h1{color:#ff6b35;font-size:22px;margin-bottom:4px}.sub{color:#555;font-size:12px;margin-bottom:24px}
  .block{background:#fff5f0;border-left:3px solid #ff6b35;padding:12px 16px;border-radius:0 8px 8px 0;margin-bottom:16px}
  .block h3{font-size:11px;text-transform:uppercase;letter-spacing:.5px;color:#888;margin-bottom:6px}
  .fmv-box{background:#f0fff8;border:2px solid #00b37a;border-radius:10px;padding:20px;margin:20px 0;text-align:center}
  .fmv-val{font-size:32px;font-weight:bold;color:#00b37a}.fmv-label{font-size:12px;color:#555;margin-top:4px}
  table{width:100%;border-collapse:collapse;margin-top:12px}
  th{background:#ff6b35;color:white;padding:8px 10px;text-align:left;font-size:11px}
  td{padding:8px 10px;border-bottom:1px solid #eee;font-size:12px}
  .footer{margin-top:32px;text-align:center;color:#aaa;font-size:10px;border-top:1px solid #eee;padding-top:12px}
  .ref{font-size:18px;font-weight:bold;color:#ff6b35;letter-spacing:1px}
</style></head><body>
<div style="display:flex;justify-content:space-between;margin-bottom:28px">
  <div><h1>Tax Deduction Receipt</h1><div class="sub">Surplus Food Donation — SurplusLink Platform</div></div>
  <div style="text-align:right"><div class="ref">${ref}</div><div style="color:#888;font-size:11px">${date}</div></div>
</div>
<div class="block"><h3>Donor (Restaurant)</h3><strong>${restaurantName}</strong></div>
<div class="block"><h3>Recipient Organisation</h3>${order.receiverName || "Verified Nonprofit / NGO"} · ${order.receiverType || "Nonprofit / NGO"}</div>
<div class="fmv-box">
  <div class="fmv-val">₹${totalFMV.toLocaleString()}</div>
  <div class="fmv-label">Estimated Fair Market Value of Donated Goods</div>
  <div style="font-size:11px;color:#888;margin-top:6px">Basis: retail market prices at time of donation, per SurplusLink valuation guidelines</div>
</div>
<table><tr><th>Item</th><th>Qty</th><th>Unit</th><th>Est. FMV</th></tr>
${items.map(i => `<tr><td>${i.emoji || "📦"} ${i.name}</td><td>${i.qty}</td><td>${i.unit}</td><td>₹${(i.market_value || i.price * 3 || 100).toLocaleString()}</td></tr>`).join("")}
</table>
<p style="margin-top:20px;font-size:11px;color:#555;line-height:1.7">This receipt confirms the voluntary donation of surplus food items by the above-named restaurant to a registered receiver through the SurplusLink platform. The donor may claim this donation as a deductible business expense under applicable Indian tax provisions for food donation (subject to individual tax advice). SurplusLink is not a registered charitable institution and this document does not constitute a Section 80G certificate.</p>
<div class="footer">Generated by SurplusLink · Bengaluru · ${date} · Reference: ${ref}</div>
</body></html>`;

  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = `SurplusLink-DonationReceipt-${ref}.html`; a.click();
  URL.revokeObjectURL(url);
}

// ─────────────────────────────────────────────────────────────
// NOTIFICATIONS
// ─────────────────────────────────────────────────────────────
async function sendNotification(type, payload) {
  try {
    await supabase.functions.invoke("send-notification", { body: { type, ...payload } });
  } catch { /* best-effort */ }
}

// ─────────────────────────────────────────────────────────────
// EXPIRY MANAGEMENT (client-side trigger for Supabase RPCs)
// ─────────────────────────────────────────────────────────────
async function runExpiryCheck(onToast) {
  try {
    // Call the DB function that flags expiring/expired listings
    const { data, error } = await supabase.rpc("flag_expiring_listings");
    if (error) throw error;

    // For each listing needing a 12h alert, notify restaurant
    if (data && data.length > 0) {
      for (const row of data) {
        await sendNotification("expiry_alert_12h", {
          restaurantId: row.restaurant_id,
          listingName: row.name,
          listingId: row.listing_id,
        });
      }
    }
  } catch (e) {
    console.warn("Expiry check failed (RPC may not exist yet):", e.message);
  }
}

async function runDailyArchive() {
  try {
    const { data, error } = await supabase.rpc("archive_expired_listings");
    if (error) throw error;
    return data || 0;
  } catch (e) {
    console.warn("Archive job failed (RPC may not exist yet):", e.message);
    return 0;
  }
}

// ─────────────────────────────────────────────────────────────
// AUTH PAGE
// ─────────────────────────────────────────────────────────────
function AuthPage({ onLogin }) {
  const [tab, setTab] = useState("login");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPw, setLoginPw] = useState("");
  const [loginErr, setLoginErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [forgot, setForgot] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetSent, setResetSent] = useState(false);
  const [step, setStep] = useState(1);
  const [role, setRole] = useState("restaurant");
  const [regErr, setRegErr] = useState("");
  const [reg, setReg] = useState({
    name: "", email: "", password: "", confirmPw: "", biz: "", phone: "",
    address: "", acctType: "Nonprofit / NGO", fssaiLicense: "",
    storageCapacity: "", operatingHours: "", storageTypes: [],
  });
  const setR = (k, v) => setReg((r) => ({ ...r, [k]: v }));
  const totalSteps = role === "restaurant" ? 3 : 2;

  const doLogin = async () => {
    setLoginErr(""); setLoading(true);
    if (!validEmail(loginEmail)) { setLoginErr("Enter a valid email address"); setLoading(false); return; }
    if (!loginPw) { setLoginErr("Password is required"); setLoading(false); return; }
    const { error } = await supabase.auth.signInWithPassword({ email: loginEmail, password: loginPw });
    if (error) setLoginErr(error.message === "Invalid login credentials" ? "No account found with those credentials." : error.message);
    setLoading(false);
  };

  const doResetRequest = async () => {
    if (!validEmail(resetEmail)) return;
    await supabase.auth.resetPasswordForEmail(resetEmail, { redirectTo: window.location.origin + "/?reset=1" });
    setResetSent(true);
    setTimeout(() => { setForgot(false); setResetSent(false); setResetEmail(""); }, 3200);
  };

  const nextStep = () => {
    setRegErr("");
    if (step === 1) {
      if (!reg.name.trim()) return setRegErr("Full name is required");
      if (!validEmail(reg.email)) return setRegErr("Enter a valid email");
      if (!validPw(reg.password)) return setRegErr("Password must be at least 6 characters");
      if (reg.password !== reg.confirmPw) return setRegErr("Passwords do not match");
      setStep(2);
    } else if (step === 2) {
      if (!reg.biz.trim()) return setRegErr(role === "restaurant" ? "Restaurant name required" : "Organisation name required");
      if (!reg.phone.trim()) return setRegErr("Phone number is required");
      if (!reg.address.trim()) return setRegErr("Address is required");
      if (role === "receiver") doRegister(); else setStep(3);
    } else doRegister();
  };

  const doRegister = async () => {
    setLoading(true); setRegErr("");
    const metadata = {
      role, name: reg.name, biz: reg.biz, phone: reg.phone, address: reg.address,
      ...(role === "restaurant"
        ? { fssaiLicense: reg.fssaiLicense, storageCapacity: reg.storageCapacity, operatingHours: reg.operatingHours, storageTypes: reg.storageTypes }
        : { acctType: reg.acctType }),
    };
    const { error } = await supabase.auth.signUp({ email: reg.email, password: reg.password, options: { data: metadata } });
    if (error) { setRegErr(error.message); setLoading(false); return; }
    setLoading(false);
  };

  if (forgot) return (
    <div className="auth-wrap"><div className="auth-card">
      <div className="auth-logo"><div className="logo"><span className="logo-dot"/><span>Surplus</span><span style={{color:"var(--text)"}}>Link</span></div></div>
      <div className="card-title" style={{justifyContent:"center",marginBottom:6}}>Reset Password</div>
      <p style={{color:"var(--muted)",fontSize:"0.85rem",textAlign:"center",marginBottom:20}}>We'll send a reset link to your email</p>
      {resetSent ? <div className="success-msg">✓ If that email is registered, a reset link is on its way.</div> : (
        <>
          <div className="form-group" style={{marginBottom:14}}>
            <label>Email Address</label>
            <input value={resetEmail} onChange={e=>setResetEmail(e.target.value)} placeholder="you@company.com" type="email"/>
          </div>
          <button className="btn btn-primary" style={{width:"100%"}} onClick={doResetRequest} disabled={!validEmail(resetEmail)||loading}>{loading?"Sending…":"Send Reset Link"}</button>
        </>
      )}
      <div style={{textAlign:"center",marginTop:14}}><button className="link-btn" onClick={()=>setForgot(false)}>← Back to Sign In</button></div>
    </div></div>
  );

  return (
    <div className="auth-wrap"><div className="auth-card">
      <div className="auth-logo"><div className="logo"><span className="logo-dot"/><span>Surplus</span><span style={{color:"var(--text)"}}>Link</span></div></div>
      <div className="auth-tabs">
        <button className={`auth-tab${tab==="login"?" active":""}`} onClick={()=>{setTab("login");setLoginErr("");setStep(1);}}>Sign In</button>
        <button className={`auth-tab${tab==="register"?" active":""}`} onClick={()=>{setTab("register");setLoginErr("");}}>Register</button>
      </div>
      {tab==="login" && (
        <>
          {loginErr && <div className="error-msg">{loginErr}</div>}
          <div className="form-group" style={{marginBottom:12}}>
            <label>Email Address</label>
            <input value={loginEmail} onChange={e=>{setLoginEmail(e.target.value);setLoginErr("");}} placeholder="you@company.com" type="email"/>
          </div>
          <div className="form-group" style={{marginBottom:6}}>
            <label>Password</label>
            <input value={loginPw} onChange={e=>{setLoginPw(e.target.value);setLoginErr("");}} placeholder="••••••••" type="password" onKeyDown={e=>e.key==="Enter"&&doLogin()}/>
          </div>
          <div style={{textAlign:"right",marginBottom:18}}><button className="link-btn" onClick={()=>setForgot(true)}>Forgot password?</button></div>
          <button className="btn btn-primary" style={{width:"100%",padding:"12px"}} onClick={doLogin} disabled={loading}>{loading?"Signing in…":"Sign In →"}</button>
          <div className="divider" style={{marginTop:18}}>new here?</div>
          <p style={{fontSize:"0.75rem",color:"var(--muted)",textAlign:"center"}}>Use the Register tab to create an account as a restaurant or receiver.</p>
        </>
      )}
      {tab==="register" && (
        <>
          <div className="step-bar">{Array.from({length:totalSteps}).map((_,i)=><div key={i} className={`step-dot${step===i+1?" active":step>i+1?" done":""}`}/>)}</div>
          {regErr && <div className="error-msg">{regErr}</div>}
          {step===1 && (
            <>
              <p style={{color:"var(--muted)",fontSize:"0.82rem",marginBottom:10}}>Choose your account type:</p>
              <div className="role-selector">
                <button className={`role-option${role==="restaurant"?" selected restaurant":""}`} onClick={()=>setRole("restaurant")}><span className="role-icon">🍽️</span><span className="role-label">Restaurant</span><span className="role-desc">List surplus ingredients</span></button>
                <button className={`role-option${role==="receiver"?" selected receiver":""}`} onClick={()=>setRole("receiver")}><span className="role-icon">🤝</span><span className="role-label">Receiver</span><span className="role-desc">Browse & claim items</span></button>
              </div>
              <div className="form-grid one-col" style={{gap:11,marginBottom:16}}>
                <div className="form-group"><label>Full Name *</label><input value={reg.name} onChange={e=>setR("name",e.target.value)} placeholder="Your full name"/></div>
                <div className="form-group"><label>Email Address *</label><input value={reg.email} onChange={e=>setR("email",e.target.value)} placeholder="you@company.com" type="email"/></div>
                <div className="form-group"><label>Password *</label><input value={reg.password} onChange={e=>setR("password",e.target.value)} placeholder="••••••••" type="password"/></div>
                <div className="form-group"><label>Confirm Password *</label><input value={reg.confirmPw} onChange={e=>setR("confirmPw",e.target.value)} placeholder="••••••••" type="password"/></div>
              </div>
            </>
          )}
          {step===2 && (
            <>
              <p style={{color:"var(--muted)",fontSize:"0.82rem",marginBottom:12}}>{role==="restaurant"?"About your restaurant:":"About your organisation:"}</p>
              <div className="form-grid one-col" style={{gap:11,marginBottom:16}}>
                <div className="form-group"><label>{role==="restaurant"?"Restaurant Name *":"Organisation Name *"}</label><input value={reg.biz} onChange={e=>setR("biz",e.target.value)} placeholder="Business name"/></div>
                <div className="form-group"><label>Phone Number *</label><input value={reg.phone} onChange={e=>setR("phone",e.target.value)} placeholder="+91 98765 43210"/></div>
                <div className="form-group"><label>Full Address *</label><input value={reg.address} onChange={e=>setR("address",e.target.value)} placeholder="Street, area, city, PIN"/></div>
                {role==="receiver" && <div className="form-group"><label>Organisation Type</label><select value={reg.acctType} onChange={e=>setR("acctType",e.target.value)}>{["Nonprofit / NGO","Small Business","Individual","Community Kitchen"].map(o=><option key={o}>{o}</option>)}</select></div>}
              </div>
            </>
          )}
          {step===3 && role==="restaurant" && (
            <>
              <p style={{color:"var(--muted)",fontSize:"0.82rem",marginBottom:12}}>Storage & compliance (optional):</p>
              <div className="form-grid one-col" style={{gap:11,marginBottom:16}}>
                <div className="form-group"><label>FSSAI License Number</label><input value={reg.fssaiLicense} onChange={e=>setR("fssaiLicense",e.target.value)} placeholder="14-digit license number"/></div>
                <div className="form-group"><label>Operating Hours</label><input value={reg.operatingHours} onChange={e=>setR("operatingHours",e.target.value)} placeholder="e.g. Mon–Sat 08:00–22:00"/></div>
                <div className="form-group">
                  <label>Storage Facilities</label>
                  <div style={{display:"flex",flexWrap:"wrap",gap:8,marginTop:4}}>
                    {["Refrigerated","Frozen","Dry Storage","Warm Holding"].map(s=>(
                      <button key={s} type="button" className={`filter-pill${reg.storageTypes.includes(s)?" on":""}`} style={{fontSize:"0.78rem"}} onClick={()=>setR("storageTypes",reg.storageTypes.includes(s)?reg.storageTypes.filter(x=>x!==s):[...reg.storageTypes,s])}>{s}</button>
                    ))}
                  </div>
                </div>
                <div className="form-group"><label>Storage Capacity</label><input value={reg.storageCapacity} onChange={e=>setR("storageCapacity",e.target.value)} placeholder="e.g. Fridge 200L, Dry 500kg"/></div>
              </div>
            </>
          )}
          <div style={{display:"flex",gap:10}}>
            {step>1 && <button className="btn btn-secondary" style={{flex:1,padding:"11px"}} onClick={()=>setStep(s=>s-1)}>← Back</button>}
            <button className="btn btn-primary" style={{flex:1,padding:"11px"}} onClick={nextStep} disabled={loading}>{loading?"Creating…":step===totalSteps?"Create Account →":"Next →"}</button>
          </div>
        </>
      )}
    </div></div>
  );
}

// ─────────────────────────────────────────────────────────────
// CHECKOUT MODAL
// ─────────────────────────────────────────────────────────────
function CheckoutModal({ cart, profile, onClose, onSuccess, onToast }) {
  const [step, setStep] = useState("summary");
  const [selectedSlots, setSelectedSlots] = useState({});
  const [payMethod, setPayMethod] = useState("upi");
  const [upiId, setUpiId] = useState("");
  const [walletAmount, setWalletAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [orderRef, setOrderRef] = useState(null);

  const walletBalance = profile.wallet_balance || 0;
  const isNonprofitVerified = profile.role === "receiver" && profile.acct_type === "Nonprofit / NGO" && profile.verified;
  const allFree = cart.every(i => i.free);

  const subtotal = cart.reduce((s, i) => s + (i.free ? 0 : (i.price || 0)), 0);
  const platformFee = allFree ? 0 : Math.round(subtotal * PLATFORM_FEE_RATE);
  const totalDue = subtotal + platformFee;
  const walletUsed = Math.min(walletBalance, walletAmount);
  const remainingDue = Math.max(0, totalDue - walletUsed);

  const generateSlots = (pickupWindow) => {
    if (!pickupWindow) return ["09:00–11:00", "11:00–13:00", "13:00–15:00"];
    return [pickupWindow, "Contact restaurant for alternative"];
  };

const handleConfirm = async () => {
  setLoading(true);
  const ref = genRef();
  console.log("Confirming order:", { cart, payMethod });
  const { error, orderId } = await confirmOrder(cart, payMethod === "wallet" ? "wallet" : payMethod);
  console.log("confirmOrder result:", { error, orderId });
  if (error) {
    console.error("Order error:", error);
    onToast("Order failed: " + (error.message || JSON.stringify(error)), "err");
    setLoading(false);
    return;
  }

    // Deduct wallet balance if used
    if (walletUsed > 0) {
      await supabase.from("profiles")
        .update({ wallet_balance: walletBalance - walletUsed })
        .eq("id", profile.id);
    }

    // Persist reference and pickup slots (requires schema migration)
    if (orderId) {
      await supabase.from("orders")
        .update({ reference: ref, pickup_slots: selectedSlots, wallet_used: walletUsed })
        .eq("id", orderId);
    }

    setOrderRef(ref);

    // Notify both parties
    await sendNotification("order_confirmed", {
      ref,
      receiverEmail: profile.email,
      restaurantNames: [...new Set(cart.map(i => i.restaurant_name))],
      items: cart.map(i => i.name),
    });

    // Auto-generate donation receipt for restaurant if free items
    if (allFree || isNonprofitVerified) {
      const fakeOrder = { id: ref, reference: ref, created_at: Date.now(), receiverName: profile.biz || profile.name, receiverType: profile.acct_type || "Organisation" };
      // Queue download for restaurant — triggered on their pickup confirmation
    }

    setStep("done");
    setLoading(false);
    setTimeout(() => { onSuccess(ref); }, 3000);
  };

  if (step === "done") return (
    <div className="modal-overlay">
      <div className="modal" style={{ textAlign: "center", paddingTop: 50 }}>
        <div style={{ fontSize: "3.5rem", marginBottom: 16 }}>🎉</div>
        <div className="modal-title">Order Confirmed!</div>
        <div className="modal-sub">Your items are reserved and awaiting pickup</div>
        <div className="ref-chip" style={{ justifyContent: "center", fontSize: "1rem", padding: "8px 20px", margin: "16px auto 0", display: "inline-flex" }}>
          REF: {orderRef}
        </div>
        <p style={{ color: "var(--muted)", fontSize: "0.8rem", marginTop: 14 }}>
          Pickup details and compliance document will be emailed to you shortly.
        </p>
        {(allFree || isNonprofitVerified) && (
          <p style={{ color: "var(--accent2)", fontSize: "0.78rem", marginTop: 8 }}>
            🧾 Donation receipt has been queued for the restaurant.
          </p>
        )}
      </div>
    </div>
  );

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ width: 640 }} onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>

        {/* Progress bar */}
        <div style={{ display: "flex", gap: 0, marginBottom: 24, borderRadius: 8, overflow: "hidden", border: "1px solid var(--border)" }}>
          {["summary", "payment", "confirm"].map((s, i) => (
            <div key={s} style={{
              flex: 1, padding: "8px 4px", textAlign: "center", fontSize: "0.75rem", fontWeight: 600,
              background: step === s ? "var(--accent)" : ["summary","payment","confirm"].indexOf(step) > i ? "rgba(0,229,160,0.15)" : "var(--surface2)",
              color: step === s ? "#000" : ["summary","payment","confirm"].indexOf(step) > i ? "var(--accent)" : "var(--muted)",
              borderRight: i < 2 ? "1px solid var(--border)" : "none",
            }}>
              {i + 1}. {s.charAt(0).toUpperCase() + s.slice(1)}
            </div>
          ))}
        </div>

        {/* STEP 1: SUMMARY */}
        {step === "summary" && (
          <>
            <div className="card-title">📦 Order Summary</div>
            <div className="co-section">
              {cart.map(i => (
                <div key={i.cartItemId} className="summary-line">
                  <span className="label">{i.emoji} {i.name} · {i.qty} {i.unit}</span>
                  <span className="value">{i.free ? <span style={{ color: "var(--accent2)" }}>Free</span> : `₹${i.price}`}</span>
                </div>
              ))}
              {!allFree && (
                <>
                  <div className="summary-line"><span className="label">Subtotal</span><span className="value">₹{subtotal}</span></div>
                  <div className="summary-line"><span className="label platform-fee">Platform fee (5%)</span><span className="value platform-fee">₹{platformFee}</span></div>
                  <div className="summary-line total-line"><span>Total</span><span style={{ color: "var(--accent)" }}>₹{totalDue}</span></div>
                </>
              )}
              {allFree && <div className="summary-line total-line"><span>Total</span><span style={{ color: "var(--accent2)" }}>Free / Donation</span></div>}
            </div>

            {/* Pickup slots */}
            <div className="co-section">
              <h3>⏰ Select Pickup Slots</h3>
              {[...new Set(cart.map(i => i.restaurant_name))].map(rName => {
                const rItems = cart.filter(i => i.restaurant_name === rName);
                const slots = generateSlots(rItems[0]?.pickup);
                return (
                  <div key={rName} style={{ marginBottom: 14 }}>
                    <div style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text)", marginBottom: 6 }}>🏪 {rName}</div>
                    <div className="slot-grid">
                      {slots.map(slot => (
                        <button key={slot} className={`slot-btn${selectedSlots[rName] === slot ? " selected" : ""}`} onClick={() => setSelectedSlots(s => ({ ...s, [rName]: slot }))}>
                          {slot}
                        </button>
                      ))}
                    </div>
                    {!selectedSlots[rName] && <p style={{ fontSize: "0.72rem", color: "var(--warning)", marginTop: 5 }}>⚠ Please select a slot</p>}
                  </div>
                );
              })}
            </div>

            {isNonprofitVerified && (
              <div className="nonprofit-bypass">
                <span style={{ fontSize: "1.5rem" }}>🏛️</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--accent)" }}>Verified Nonprofit — Payment Waived</div>
                  <div style={{ fontSize: "0.78rem", color: "var(--muted)", marginTop: 2 }}>Your organisation is verified. You'll skip straight to confirmation.</div>
                </div>
              </div>
            )}

            <div style={{ display: "flex", gap: 10 }}>
              <button className="btn btn-secondary" onClick={onClose} style={{ flex: 1 }}>Cancel</button>
              <button className="btn btn-primary" style={{ flex: 2 }} onClick={() => {
                const restaurants = [...new Set(cart.map(i => i.restaurant_name))];
                if (restaurants.some(r => !selectedSlots[r])) { onToast("Please select a pickup slot for each restaurant", "err"); return; }
                if (allFree || isNonprofitVerified) setStep("confirm"); else setStep("payment");
              }}>
                {allFree || isNonprofitVerified ? "Confirm Claim →" : "Choose Payment →"}
              </button>
            </div>
          </>
        )}

        {/* STEP 2: PAYMENT */}
        {step === "payment" && (
          <>
            <div className="card-title">💳 Payment</div>

            {/* Wallet */}
            {walletBalance > 0 && (
              <div className="co-section">
                <h3>👛 Wallet Balance — ₹{walletBalance}</h3>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: "0.82rem", color: "var(--muted)" }}>Use from wallet:</span>
                  <input type="range" min={0} max={Math.min(walletBalance, totalDue)} value={walletAmount} onChange={e => setWalletAmount(Number(e.target.value))} style={{ flex: 1 }} />
                  <span style={{ fontWeight: 700, color: "var(--accent)", minWidth: 50, textAlign: "right" }}>₹{walletAmount}</span>
                </div>
                {walletAmount > 0 && (
                  <div className="split-bar">
                    <div className="split-bar-row">
                      <span style={{ color: "var(--accent)" }}>Wallet: ₹{walletUsed}</span>
                      <span style={{ color: "var(--muted)" }}>External: ₹{remainingDue}</span>
                    </div>
                    <div className="split-visual">
                      <div className="split-fill" style={{ width: `${Math.min(100, (walletUsed / totalDue) * 100)}%` }} />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* External payment */}
            {remainingDue > 0 && (
              <div className="co-section">
                <h3>💳 Pay ₹{remainingDue} via</h3>
                {[
                  { v: "upi", l: "UPI / GPay / PhonePe", icon: "📱" },
                  { v: "card", l: "Credit / Debit Card", icon: "💳" },
                  { v: "bank", l: "Saved Bank Account", icon: "🏦" },
                  { v: "cash", l: "Cash on Pickup", icon: "💵" },
                ].map(o => (
                  <button key={o.v} className={`pay-option${payMethod === o.v ? " selected" : ""}`} onClick={() => setPayMethod(o.v)}>
                    <input type="radio" readOnly checked={payMethod === o.v} />{o.icon} {o.l}
                  </button>
                ))}
                {payMethod === "upi" && (
                  <input value={upiId} onChange={e => setUpiId(e.target.value)} placeholder="yourname@upi" style={{ marginTop: 8 }} />
                )}
                {payMethod === "bank" && profile.bank_account && (
                  <div style={{ background: "var(--surface2)", padding: "10px 14px", borderRadius: 8, fontSize: "0.82rem", marginTop: 8, color: "var(--muted)" }}>
                    🏦 {profile.bank_name} {profile.bank_account}
                  </div>
                )}
                {payMethod === "bank" && !profile.bank_account && (
                  <div className="error-msg" style={{ marginTop: 8, marginBottom: 0 }}>No bank account linked. Add one in Wallet settings.</div>
                )}
              </div>
            )}

            {/* Breakdown */}
            <div className="co-section">
              <h3>📊 Payment Breakdown</h3>
              <div className="summary-line"><span className="label">Order total</span><span className="value">₹{totalDue}</span></div>
              {walletUsed > 0 && <div className="summary-line"><span className="label" style={{ color: "var(--accent)" }}>— Wallet credit</span><span className="value" style={{ color: "var(--accent)" }}>−₹{walletUsed}</span></div>}
              <div className="summary-line total-line"><span>Due now</span><span style={{ color: remainingDue === 0 ? "var(--accent2)" : "var(--accent)" }}>{remainingDue === 0 ? "₹0 (fully covered)" : `₹${remainingDue}`}</span></div>
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button className="btn btn-secondary" onClick={() => setStep("summary")} style={{ flex: 1 }}>← Back</button>
              <button className="btn btn-primary" style={{ flex: 2 }} onClick={() => setStep("confirm")}>Review Order →</button>
            </div>
          </>
        )}

        {/* STEP 3: CONFIRM */}
        {step === "confirm" && (
          <>
            <div className="card-title">✅ Confirm Order</div>
            <div className="co-section">
              <h3>Items</h3>
              {cart.map(i => (
                <div key={i.cartItemId} className="summary-line">
                  <span className="label">{i.emoji} {i.name}</span>
                  <span className="value">{i.free ? "Free" : `₹${i.price}`}</span>
                </div>
              ))}
            </div>
            <div className="co-section">
              <h3>Pickup Schedule</h3>
              {Object.entries(selectedSlots).map(([r, slot]) => (
                <div key={r} className="summary-line">
                  <span className="label">🏪 {r}</span>
                  <span className="value" style={{ color: "var(--accent)" }}>{slot}</span>
                </div>
              ))}
            </div>
            <div className="co-section">
              <h3>Payment</h3>
              {isNonprofitVerified ? (
                <div style={{ color: "var(--accent)", fontWeight: 600 }}>✓ Waived — Verified Nonprofit</div>
              ) : allFree ? (
                <div style={{ color: "var(--accent2)", fontWeight: 600 }}>✓ Free / Donation — No payment required</div>
              ) : (
                <>
                  {walletUsed > 0 && <div className="summary-line"><span className="label">Wallet</span><span className="value">₹{walletUsed}</span></div>}
                  {remainingDue > 0 && <div className="summary-line"><span className="label">{payMethod.toUpperCase()}</span><span className="value">₹{remainingDue}</span></div>}
                  <div className="summary-line total-line"><span>Total paid</span><span style={{ color: "var(--accent)" }}>₹{totalDue}</span></div>
                </>
              )}
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button className="btn btn-secondary" onClick={() => setStep(allFree || isNonprofitVerified ? "summary" : "payment")} style={{ flex: 1 }}>← Back</button>
              <button className="btn btn-primary" style={{ flex: 2, padding: "13px" }} onClick={handleConfirm} disabled={loading}>
                {loading ? "Processing…" : allFree || isNonprofitVerified ? "✓ Confirm Claim" : "✓ Confirm & Pay"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// BROWSE PAGE
// ─────────────────────────────────────────────────────────────
function BrowsePage({ listings, onToast, cart, setCart, onShowDetail, onRefreshListings, profile }) {
  const [cat, setCat] = useState("All");
  const [storage, setStorage] = useState("All");
  const [dist, setDist] = useState("Any distance");
  const [freeOnly, setFreeOnly] = useState(false);
  const [sort, setSort] = useState("newest");
  const [search, setSearch] = useState("");
  const [adding, setAdding] = useState(null);

  const inCart = (id) => cart.some((c) => c.id === id);

  const visible = listings
    .filter(l => l.status === "active")
    .filter(l => cat === "All" || l.category === cat)
    .filter(l => storage === "All" || l.storage === storage)
    .filter(l => !freeOnly || l.free)
    .filter(l => {
      if (dist === "Any distance") return true;
      const km = distKm(l.id);
      const cap = parseFloat(dist.replace("< ", "").replace(" km", ""));
      return km < cap;
    })
    .filter(l => !search || l.name.toLowerCase().includes(search.toLowerCase()) || l.restaurant_name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sort === "price_asc") return a.price - b.price;
      if (sort === "price_desc") return b.price - a.price;
      if (sort === "expiry") return new Date(a.expiry) - new Date(b.expiry);
      return new Date(b.created_at) - new Date(a.created_at);
    });

  const handleAddToCart = async (l, e) => {
    e?.stopPropagation();
    if (l.status === "reserved") { onToast("This item is already reserved", "err"); return; }
    if (inCart(l.id)) { onToast("Already in your cart"); return; }
    setAdding(l.id);
    const { error } = await addToCart(l.id);
    if (error) { onToast("Could not reserve item — try again", "err"); setAdding(null); return; }
    await onRefreshListings();
    // Notify restaurant of reservation
    await sendNotification("item_reserved", { listingId: l.id, listingName: l.name, restaurantId: l.restaurant_id });
    onToast(`${l.name} added — reserved for 2 hours`);
    setAdding(null);
  };

  const sections = cat === "All"
    ? CATEGORIES.filter(c => c.id !== "All").map(c => ({ cat: c, items: visible.filter(l => l.category === c.id) })).filter(g => g.items.length > 0)
    : [{ cat: CATEGORIES.find(c => c.id === cat) || { icon: "📦", label: cat }, items: visible }];

  return (
    <div className="page-enter">
      <div className="browse-hero">
        <div>
          <h2>Fresh Surplus, Near You</h2>
          <p>Bengaluru · <strong style={{ color: "var(--accent)" }}>{listings.filter(l => l.status === "active").length}</strong> items available now</p>
        </div>
        <div className="search-wrap">
          <span>🔍</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search ingredients or restaurants…" />
        </div>
      </div>
      <div className="cat-scroll">
        {CATEGORIES.map(c => (
          <div key={c.id} className={`cat-card${cat === c.id ? " active" : ""}`} onClick={() => setCat(c.id)}>
            <div className="cat-icon-wrap">{c.icon}</div>
            <span className="cat-name">{c.label}</span>
          </div>
        ))}
      </div>
      <div className="filter-bar">
        <div className={`filter-pill${storage !== "All" ? " on" : ""}`}>
          <span>📦</span>
          <select value={storage} onChange={e => setStorage(e.target.value)}>
            {["All", "Refrigerated", "Frozen", "Dry", "Room Temp"].map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div className={`filter-pill${dist !== "Any distance" ? " on" : ""}`}>
          <span>📍</span>
          <select value={dist} onChange={e => setDist(e.target.value)}>
            {DIST_OPTIONS.map(d => <option key={d}>{d}</option>)}
          </select>
        </div>
        <div className="filter-pill">
          <span>↕️</span>
          <select value={sort} onChange={e => setSort(e.target.value)}>
            {SORT_OPTIONS.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
          </select>
        </div>
        <label className="toggle">
          <input type="checkbox" checked={freeOnly} onChange={e => setFreeOnly(e.target.checked)} />
          <span className="toggle-track" />
          <span className="toggle-label">Free only</span>
        </label>
        <span style={{ marginLeft: "auto", fontSize: "0.78rem", color: "var(--muted)" }}>{visible.length} result{visible.length !== 1 ? "s" : ""}</span>
      </div>
      {visible.length === 0 && <div className="empty-state"><div className="ei">🔍</div><p>No listings match your filters</p></div>}
      {sections.map(({ cat: c, items }) => (
        <div key={c.id || c.label}>
          <div className="section-head">
            <span style={{ fontSize: "1.2rem" }}>{c.icon}</span>
            <span className="section-head-title">{c.label}</span>
            <span className="section-head-count">({items.length})</span>
          </div>
          <div className="listings-grid">
            {items.map(l => (
              <div key={l.id} className={`listing-card${l.status === "reserved" ? " reserved-card" : ""}`} onClick={() => onShowDetail(l)}>
                <div className="card-img">
                  {l.emoji || "📦"}
                  {l.free && <span className="badge badge-free badge-abs">FREE</span>}
                  {expiresWithin12h(l.expiry) && <span className="badge badge-alert badge-abs" style={{ top: l.free ? 34 : 10 }}>⏰ Soon</span>}
                </div>
                <div className="card-body">
                  <div className="card-name">{l.name}</div>
                  <div className="card-sub">{l.restaurant_name} · {distKm(l.id).toFixed(1)} km away</div>
                  <div className="card-tags">
                    <span className="tag">{l.storage}</span>
                    <span className="tag">{l.category}</span>
                    <span className="tag" style={{ color: expiresWithin12h(l.expiry) ? "var(--warning)" : undefined }}>Exp {l.expiry}</span>
                  </div>
                  <div className="card-row">
                    <span className={`price-lbl${l.free ? " free" : ""}`}>{l.free ? "Free" : `₹${l.price}`}</span>
                    <span className="qty-lbl">{l.qty} {l.unit}</span>
                  </div>
                  <button className={`add-btn${inCart(l.id) ? " incart" : ""}`} onClick={e => handleAddToCart(l, e)} disabled={l.status === "reserved" || adding === l.id}>
                    {adding === l.id ? "Reserving…" : inCart(l.id) ? "✓ In Cart" : l.status === "reserved" ? "Reserved" : "+ Add to Cart"}
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
function ProductDetailModal({ listing: l, onClose, cart, onRefreshListings, onToast }) {
  const inCart = cart.some(c => c.id === l.id);
  const [loading, setLoading] = useState(false);

  const handleReserve = async () => {
    if (l.status === "reserved") return;
    if (inCart) { onToast("Already in your cart"); onClose(); return; }
    setLoading(true);
    const { error } = await addToCart(l.id);
    if (error) { onToast("Could not reserve — try again", "err"); setLoading(false); return; }
    await onRefreshListings();
    await sendNotification("item_reserved", { listingId: l.id, listingName: l.name, restaurantId: l.restaurant_id });
    onToast(`${l.name} reserved for 2 hours — proceed to checkout`);
    setLoading(false);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <div className="modal-emoji">{l.emoji || "📦"}</div>
        {expiresWithin12h(l.expiry) && (
          <div className="alert-banner" style={{ marginBottom: 14 }}>
            <span className="ab-icon">⏰</span>
            <div className="ab-body">
              <div className="ab-title">Expiring Soon</div>
              <div className="ab-msg">This item expires on {l.expiry}. Reserve now to avoid missing it.</div>
            </div>
          </div>
        )}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 4 }}>
          <div className="modal-title">{l.name}</div>
          <span className={`price-lbl${l.free ? " free" : ""}`} style={{ fontSize: "1.2rem", flexShrink: 0, marginLeft: 12 }}>{l.free ? "Free" : `₹${l.price}`}</span>
        </div>
        <div className="modal-sub">🏪 {l.restaurant_name} · 📍 {l.address} · 📏 {distKm(l.id).toFixed(1)} km away</div>
        {l.description && <div className="about-box"><div className="about-head">About this product</div>{l.description}</div>}
        <div className="detail-grid">
          {[["Category", l.category], ["Storage", l.storage], ["Quantity", `${l.qty} ${l.unit}`], ["Expiry Date", l.expiry], ["Pickup Window", l.pickup || "Contact restaurant"], ["Price", l.free ? "Free / Donation" : `₹${l.price}`], ...(l.allergens ? [["Allergens", l.allergens]] : []), ...(l.certifications ? [["Certifications", l.certifications]] : [])].map(([k, v]) => (
            <div key={k} className="detail-item"><label>{k}</label><span>{v}</span></div>
          ))}
        </div>
        <div className="info-box">
          📍 Pickup at: <span style={{ color: "var(--text)" }}>{l.address}</span><br/>
          ⏰ Window: <span style={{ color: "var(--text)" }}>{l.pickup || "Contact restaurant directly"}</span><br/>
          📏 Distance: <span style={{ color: "var(--text)" }}>{distKm(l.id).toFixed(1)} km from your location</span>
        </div>
        {l.status === "reserved" ? (
          <div className="error-msg" style={{ marginBottom: 0 }}>⏳ This item is currently reserved by another user</div>
        ) : (
          <button className="btn btn-primary" style={{ width: "100%", padding: "13px", fontSize: "0.95rem" }} onClick={handleReserve} disabled={inCart || loading}>
            {loading ? "Reserving…" : inCart ? "✓ Already in Cart" : "🛒 Reserve — locks for 2 hours"}
          </button>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// CART DRAWER
// ─────────────────────────────────────────────────────────────
function CartDrawer({ cart, profile, onRefreshCart, onRefreshListings, onClose, onToast, onCheckout }) {
  const total = cart.reduce((s, i) => s + (i.free ? 0 : (i.price || 0)), 0);
  const freeCount = cart.filter(i => i.free).length;

  const handleExpire = async (cartItemId, listingId) => {
    await removeFromCart(cartItemId, listingId);
    await onRefreshCart();
    onToast("A reservation expired and was removed", "err");
  };

  const handleRemove = async (cartItemId, listingId) => {
    await removeFromCart(cartItemId, listingId);
    await onRefreshCart();
    onToast("Item removed — listing is available again");
  };

  return (
    <>
      <div className="cart-overlay" onClick={onClose} />
      <div className="cart-drawer">
        <div className="cart-hdr">
          <h2>🛒 Cart {cart.length > 0 && <span style={{ color: "var(--accent)", marginLeft: 6 }}>({cart.length})</span>}</h2>
          <button className="modal-close" style={{ position: "static" }} onClick={onClose}>✕</button>
        </div>
        <div className="cart-body">
          {cart.length === 0 ? (
            <div className="cart-empty-state"><div className="ce-icon">🛒</div><p>Your cart is empty</p><p style={{ fontSize: "0.78rem", marginTop: 8 }}>Browse surplus and add items here</p></div>
          ) : (
            cart.map(item => (
              <div key={item.cartItemId} className="cart-item">
                <div className="ci-icon">{item.emoji || "📦"}</div>
                <div className="ci-info">
                  <div className="ci-name">{item.name}</div>
                  <div className="ci-meta">{item.restaurant_name} · {item.qty} {item.unit}</div>
                  <CartTimer expiresAt={item.expiresAt} onExpire={() => handleExpire(item.cartItemId, item.id)} />
                </div>
                <div className="ci-right">
                  <div className="ci-price">{item.free ? "Free" : `₹${item.price}`}</div>
                  <button className="rm-btn" onClick={() => handleRemove(item.cartItemId, item.id)}>✕</button>
                </div>
              </div>
            ))
          )}
        </div>
        {cart.length > 0 && (
          <div className="cart-ftr">
            {freeCount > 0 && <div style={{ fontSize: "0.78rem", color: "var(--accent2)", marginBottom: 10, fontWeight: 600 }}>🎁 {freeCount} free item{freeCount > 1 ? "s" : ""} included</div>}
            <div className="cart-total-row">
              <span className="ct-label">Subtotal</span>
              <span className="ct-val">{total === 0 ? "Free" : `₹${total}`}</span>
            </div>
            <button className="btn btn-primary" style={{ width: "100%", padding: "12px" }} onClick={onCheckout}>
              Checkout →
            </button>
          </div>
        )}
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────
// MY CLAIMS PAGE
// ─────────────────────────────────────────────────────────────
function MyClaimsPage({ profile, onToast }) {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("reserved");

  const loadClaims = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("orders")
      .select(`id, created_at, reference, pay_method, total, status, pickup_slots,
        order_items(listing_id, price, qty, unit,
          listings(id, name, emoji, category, storage, expiry, restaurant_name, address, qty, unit, pickup, free, price, restaurant_id))`)
      .eq("user_id", profile.id)
      .order("created_at", { ascending: false });

    if (error) { console.error(error); setLoading(false); return; }
    const expanded = (data || []).map(order => ({
      ...order,
      items: (order.order_items || []).map(oi => ({ ...oi.listings, price: oi.price, qty: oi.qty, unit: oi.unit })),
    }));
    setClaims(expanded);
    setLoading(false);
  }, [profile.id]);

  useEffect(() => { loadClaims(); }, [loadClaims]);

  const handleConfirmPickup = async (order) => {
    // Update order status
    await supabase.from("orders").update({ status: "completed" }).eq("id", order.id);
    // Notify both parties
    await sendNotification("pickup_confirmed", {
      orderId: order.id,
      ref: order.reference,
      receiverEmail: profile.email,
      restaurantNames: [...new Set(order.items.map(i => i.restaurant_name))],
    });
    // Auto-generate compliance doc
    generateCompliancePDF(
      { ...order, receiverName: profile.biz || profile.name, receiverType: profile.acct_type || "Organisation" },
      order.items,
      order.items[0]?.restaurant_name || "Restaurant"
    );
    await loadClaims();
    onToast("Pickup confirmed! Compliance document downloaded.");
  };

  const handleDownloadCompliance = (order) => {
    generateCompliancePDF(
      { ...order, receiverName: profile.biz || profile.name, receiverType: profile.acct_type || "Organisation" },
      order.items,
      order.items[0]?.restaurant_name || "Restaurant"
    );
    onToast("Compliance document downloaded");
  };

  const handleDownloadDonationReceipt = (order) => {
    generateDonationReceipt(
      { ...order, receiverName: profile.biz || profile.name, receiverType: profile.acct_type || "Nonprofit / NGO" },
      order.items,
      order.items[0]?.restaurant_name || "Restaurant"
    );
    onToast("Donation receipt downloaded");
  };

  const filtered = claims.filter(c => {
    if (tab === "reserved") return ["pending", "reserved", "confirmed"].includes(c.status);
    if (tab === "completed") return ["completed", "picked_up"].includes(c.status);
    return true;
  });

  const statusBadge = (s) => {
    if (["completed", "picked_up"].includes(s)) return <span className="badge badge-completed">✓ Completed</span>;
    if (["pending", "reserved", "confirmed"].includes(s)) return <span className="badge badge-reserved">⏳ Reserved</span>;
    return <span className="badge badge-expired">{s}</span>;
  };

  return (
    <div className="page-enter">
      <div className="page-header">
        <h1>My Claims</h1>
        <p>Track your reserved and claimed items</p>
      </div>

      <div className="tab-bar">
        {[["reserved", "⏳ Reserved"], ["completed", "✓ Completed"], ["all", "All"]].map(([t, l]) => (
          <button key={t} className={`tab-btn${tab === t ? " active" : ""}`} onClick={() => setTab(t)}>{l}</button>
        ))}
      </div>

      {loading && <div style={{ textAlign: "center", padding: 40, color: "var(--muted)" }}>Loading claims…</div>}
      {!loading && filtered.length === 0 && (
        <div className="empty-state"><div className="ei">📋</div><p>No {tab === "all" ? "" : tab} claims yet</p></div>
      )}

      {!loading && filtered.map(order => (
        <div key={order.id} className="claim-card">
          <div className="claim-icon">{order.items[0]?.emoji || "📦"}</div>
          <div className="claim-info">
            <div className="claim-name">
              {order.items.map(i => i.name).join(", ")}
              <span style={{ marginLeft: 10 }}>{statusBadge(order.status)}</span>
            </div>
            <div className="claim-meta">
              🏪 {order.items[0]?.restaurant_name} · 📅 {new Date(order.created_at).toLocaleDateString("en-IN")}
              {order.total > 0 && ` · ₹${order.total} paid`}
              {order.total === 0 && " · Free / Donation"}
            </div>
            {order.pickup_slots && Object.entries(order.pickup_slots).map(([r, slot]) => (
              <div key={r} style={{ fontSize: "0.75rem", color: "var(--accent)", marginTop: 3 }}>⏰ {r}: {slot}</div>
            ))}
            {order.reference && <div className="ref-chip">REF: {order.reference}</div>}
            <div style={{ marginTop: 10, display: "flex", flexWrap: "wrap", gap: 6 }}>
              {order.items.map((item, idx) => (
                <span key={idx} className="tag">{item.emoji} {item.name} · {item.qty} {item.unit}</span>
              ))}
            </div>

            <div className="claim-actions">
              {/* Confirm Pickup — for reserved orders */}
              {["pending", "reserved", "confirmed"].includes(order.status) && (
                <button className="btn btn-primary btn-sm" onClick={() => handleConfirmPickup(order)}>
                  ✓ Confirm Pickup
                </button>
              )}

              {/* Compliance doc — for completed orders */}
              {["completed", "picked_up"].includes(order.status) && (
                <button className="btn btn-secondary btn-sm" onClick={() => handleDownloadCompliance(order)}>
                  📄 Compliance Doc
                </button>
              )}

              {/* Donation receipt — nonprofits, free orders, completed */}
              {["completed", "picked_up"].includes(order.status) && order.total === 0 && profile.acct_type === "Nonprofit / NGO" && (
                <button className="btn btn-secondary btn-sm" onClick={() => handleDownloadDonationReceipt(order)}>
                  🧾 Donation Receipt
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// MY LISTINGS (Restaurant) — with expiry alerts + flagged state
// ─────────────────────────────────────────────────────────────
function MyListingsPage({ listings, profile, onToast, onRefreshListings }) {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [tab, setTab] = useState("active");
  const [showEmoji, setShowEmoji] = useState(false);
  const [saving, setSaving] = useState(false);
  const [archiveResult, setArchiveResult] = useState(null);
  const [archiving, setArchiving] = useState(false);

  const emptyForm = { name: "", category: "Produce", emoji: "🥬", qty: "", unit: "kg", storage: "Refrigerated", expiry: "", pickup: "", price: "", free: false, description: "", allergens: "", certifications: "" };
  const [form, setForm] = useState(emptyForm);
  const setF = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const mine = listings.filter(l => l.restaurant_id === profile.id);
  const filtered = mine.filter(l => {
    if (tab === "active") return l.status === "active";
    if (tab === "reserved") return l.status === "reserved";
    if (tab === "expired") return l.status === "expired";
    if (tab === "flagged") return l.flagged_unclaimed === true;
    return true;
  });
  const pendingPickups = mine.filter(l => l.status === "reserved");
  // Listings expiring within 12 hours (still active)
  const expiryAlerts = mine.filter(l => l.status === "active" && expiresWithin12h(l.expiry));
  // Flagged unclaimed listings
  const flaggedListings = mine.filter(l => l.flagged_unclaimed === true);

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.qty || !form.expiry) { onToast("Name, quantity and expiry are required", "err"); return; }
    setSaving(true);
    const payload = {
      ...form,
      price: form.free ? 0 : Number(form.price),
      qty: Number(form.qty),
      restaurant_id: profile.id,
      restaurant_name: profile.biz || profile.name,
      address: profile.address || "",
    };
    if (editing !== null) {
      const { error } = await supabase.from("listings").update(payload).eq("id", editing);
      if (error) { onToast("Update failed: " + error.message, "err"); setSaving(false); return; }
      onToast("Listing updated");
    } else {
      const { error } = await supabase.from("listings").insert({ ...payload, status: "active" });
      if (error) { onToast("Create failed: " + error.message, "err"); setSaving(false); return; }
      onToast("Listing created");
    }
    await onRefreshListings();
    setShowForm(false); setEditing(null); setForm(emptyForm); setSaving(false);
  };

  const startEdit = (l) => {
    setEditing(l.id);
    setForm({ name: l.name, category: l.category, emoji: l.emoji || "📦", qty: l.qty, unit: l.unit, storage: l.storage, expiry: l.expiry, pickup: l.pickup || "", price: l.price, free: l.free, description: l.description || "", allergens: l.allergens || "", certifications: l.certifications || "" });
    setShowForm(true); setShowEmoji(false);
  };

  const handleDelete = async (id) => {
    await supabase.from("listings").update({ status: "deleted" }).eq("id", id);
    await onRefreshListings();
    onToast("Listing deleted");
  };

  const handleConfirmPickup = async (listing) => {
    await supabase.from("listings").update({ status: "expired" }).eq("id", listing.id);
    await sendNotification("pickup_confirmed_restaurant", { listingName: listing.name, restaurantId: listing.restaurant_id });
    if (listing.free) {
      const fakeOrder = { id: genRef(), reference: genRef(), created_at: Date.now(), receiverName: "Receiver", receiverType: "Organisation" };
      generateDonationReceipt(fakeOrder, [listing], profile.biz || profile.name);
      onToast("Pickup confirmed! Donation receipt downloaded.");
    } else {
      onToast("Pickup confirmed!");
    }
    await onRefreshListings();
  };

  // Dismiss a flag (restaurant has reviewed it)
  const handleDismissFlag = async (listingId) => {
    await supabase.from("listings").update({ flagged_unclaimed: false }).eq("id", listingId);
    await onRefreshListings();
    onToast("Flag dismissed");
  };

  // Manual trigger for daily cleanup
  const handleRunArchive = async () => {
    setArchiving(true);
    const count = await runDailyArchive();
    await onRefreshListings();
    setArchiveResult(count);
    onToast(`Archived ${count} expired listing${count !== 1 ? "s" : ""}`);
    setArchiving(false);
    setTimeout(() => setArchiveResult(null), 5000);
  };

  const currentEmojis = CAT_EMOJIS[form.category] || ["📦"];

  return (
    <div className="page-enter">
      <div className="page-header ph-row">
        <div><h1>My Listings</h1><p>Manage your surplus ingredient postings</p></div>
        <button className="btn btn-primary" onClick={() => { setShowForm(true); setEditing(null); setForm(emptyForm); setShowEmoji(false); }}>+ New Listing</button>
      </div>

      {/* 12-hour expiry alerts */}
      {expiryAlerts.length > 0 && (
        <div className="alert-banner">
          <span className="ab-icon">⏰</span>
          <div className="ab-body">
            <div className="ab-title">Expiry Alert — {expiryAlerts.length} listing{expiryAlerts.length > 1 ? "s" : ""} expiring within 12 hours</div>
            <div className="ab-msg">
              {expiryAlerts.map(l => l.name).join(", ")} — act now to avoid food waste.
              Email notifications have been sent to your registered address.
            </div>
          </div>
        </div>
      )}

      {/* Flagged unclaimed listings */}
      {flaggedListings.length > 0 && (
        <div className="flagged-banner alert-banner">
          <span className="ab-icon">🚩</span>
          <div className="ab-body">
            <div className="ab-title">Auto-flagged: {flaggedListings.length} listing{flaggedListings.length > 1 ? "s" : ""} expired unclaimed</div>
            <div className="ab-msg">
              {flaggedListings.map(l => l.name).join(", ")} — these expired before pickup was confirmed. Review and dismiss if noted.
            </div>
            <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
              {flaggedListings.map(l => (
                <button key={l.id} className="btn btn-ghost btn-sm" onClick={() => handleDismissFlag(l.id)}>
                  Dismiss "{l.name}"
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Daily cleanup bar */}
      <div className="cleanup-bar">
        <p>🗂️ <strong>Daily Archive:</strong> Auto-archives expired listings older than 24 hours. Last run: today at 02:00 IST (via pg_cron).</p>
        <button className="btn btn-ghost btn-sm" onClick={handleRunArchive} disabled={archiving}>
          {archiving ? "Running…" : archiveResult !== null ? `✓ ${archiveResult} archived` : "Run Now"}
        </button>
      </div>

      {/* Pending pickups */}
      {pendingPickups.length > 0 && (
        <div className="card" style={{ borderColor: "rgba(255,200,87,0.35)" }}>
          <div className="card-title">⏳ Pickup Confirmations Pending</div>
          {pendingPickups.map(l => (
            <div key={l.id} className="pickup-item">
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>{l.name}</div>
                <div style={{ fontSize: "0.78rem", color: "var(--muted)", marginTop: 3 }}>Reserved · {l.qty} {l.unit} · Pickup: {l.pickup || "TBD"}</div>
              </div>
              <button className="btn btn-primary btn-sm" onClick={() => handleConfirmPickup(l)}>Confirm Pickup ✓</button>
            </div>
          ))}
        </div>
      )}

      {/* New/edit form */}
      {showForm && (
        <div className="card" style={{ borderColor: "var(--accent)" }}>
          <div className="card-title">{editing !== null ? "✏️ Edit Listing" : "📝 New Listing"}</div>
          <div className="form-grid">
            <div className="form-group"><label>Ingredient Name *</label><input value={form.name} onChange={e => setF("name", e.target.value)} placeholder="e.g. Heirloom Tomatoes"/></div>
            <div className="form-group"><label>Category</label><select value={form.category} onChange={e => { setF("category", e.target.value); setF("emoji", CAT_EMOJIS[e.target.value]?.[0] || "📦"); }}>{CATEGORIES.filter(c => c.id !== "All").map(c => <option key={c.id}>{c.id}</option>)}</select></div>
            <div className="form-group">
              <label>Product Icon</label>
              <button type="button" className="btn btn-ghost btn-sm" style={{ fontSize: "1.3rem", padding: "5px 12px", width: "fit-content" }} onClick={() => setShowEmoji(v => !v)}>{form.emoji} ▾</button>
              {showEmoji && <div className="emoji-picker-grid">{currentEmojis.map(em => <button key={em} type="button" className={`ep-opt${form.emoji === em ? " sel" : ""}`} onClick={() => { setF("emoji", em); setShowEmoji(false); }}>{em}</button>)}</div>}
            </div>
            <div className="form-group"><label>Quantity *</label><input type="number" min="0" value={form.qty} onChange={e => setF("qty", e.target.value)} placeholder="0"/></div>
            <div className="form-group"><label>Unit</label><select value={form.unit} onChange={e => setF("unit", e.target.value)}>{["kg","g","L","ml","packs","units","bunches","boxes","portions"].map(u => <option key={u}>{u}</option>)}</select></div>
            <div className="form-group"><label>Storage Type</label><select value={form.storage} onChange={e => setF("storage", e.target.value)}>{["Refrigerated","Frozen","Dry","Room Temp","Warm Holding"].map(s => <option key={s}>{s}</option>)}</select></div>
            <div className="form-group"><label>Expiry Date *</label><input type="date" value={form.expiry} onChange={e => setF("expiry", e.target.value)}/></div>
            <div className="form-group"><label>Pickup Window</label><input value={form.pickup} onChange={e => setF("pickup", e.target.value)} placeholder="e.g. 08:00–12:00"/></div>
            <div className="form-group">
              <label>Price (₹)</label>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <input type="number" min="0" value={form.price} disabled={form.free} onChange={e => setF("price", e.target.value)} placeholder="0"/>
                <label className="toggle" style={{ whiteSpace: "nowrap" }}>
                  <input type="checkbox" checked={form.free} onChange={e => setF("free", e.target.checked)}/>
                  <span className="toggle-track"/><span className="toggle-label">Free</span>
                </label>
              </div>
            </div>
            <div className="form-group full"><label>Description</label><textarea value={form.description} onChange={e => setF("description", e.target.value)} placeholder="Describe the item…"/></div>
            <div className="form-group"><label>Allergens</label><input value={form.allergens} onChange={e => setF("allergens", e.target.value)} placeholder="e.g. Gluten, Dairy"/></div>
            <div className="form-group"><label>Certifications</label><input value={form.certifications} onChange={e => setF("certifications", e.target.value)} placeholder="e.g. Organic, FSSAI"/></div>
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
            <button className="btn btn-primary" onClick={handleSubmit} disabled={saving}>{saving ? "Saving…" : editing !== null ? "Save Changes" : "Create Listing"}</button>
            <button className="btn btn-secondary" onClick={() => { setShowForm(false); setEditing(null); }}>Cancel</button>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: "flex", gap: 6, marginBottom: 18, flexWrap: "wrap" }}>
        {[
          ["active", "Active"],
          ["reserved", "Reserved"],
          ["expired", "Expired"],
          ["flagged", "🚩 Flagged"],
        ].map(([t, label]) => (
          <button key={t} className={`btn btn-sm ${tab === t ? "btn-primary" : "btn-ghost"}`} onClick={() => setTab(t)}>
            {label} ({t === "flagged" ? mine.filter(l => l.flagged_unclaimed).length : mine.filter(l => l.status === t).length})
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state"><div className="ei">📦</div><p>No {tab} listings</p></div>
      ) : (
        <div className="listings-mgmt-grid">
          {filtered.map(l => (
            <div key={l.id} className="mgmt-card" style={l.flagged_unclaimed ? { borderColor: "rgba(255,77,106,0.4)" } : expiresWithin12h(l.expiry) ? { borderColor: "rgba(255,200,87,0.4)" } : {}}>
              <div className="mgmt-card-img">
                {l.emoji || "📦"}
                <span className={`badge badge-${l.flagged_unclaimed ? "flagged" : expiresWithin12h(l.expiry) ? "alert" : l.status}`} style={{ position: "absolute", top: 10, right: 10 }}>
                  {l.flagged_unclaimed ? "🚩 Flagged" : expiresWithin12h(l.expiry) ? "⏰ Soon" : l.status}
                </span>
              </div>
              <div className="mgmt-card-body">
                <div className="card-name">{l.name}</div>
                <div className="card-sub" style={{ marginBottom: 6 }}>{l.category} · {l.storage}</div>
                <div className="card-tags">
                  <span className="tag">{l.qty} {l.unit}</span>
                  <span className="tag" style={{ color: expiresWithin12h(l.expiry) ? "var(--warning)" : undefined }}>Exp {l.expiry}</span>
                  <span className="tag" style={{ color: l.free ? "var(--accent2)" : "var(--accent)" }}>{l.free ? "Free" : `₹${l.price}`}</span>
                </div>
                {expiresWithin12h(l.expiry) && <p style={{ fontSize: "0.74rem", color: "var(--warning)", marginTop: 8 }}>⏰ Expiring within 12 hours — act now</p>}
                {l.flagged_unclaimed && <p style={{ fontSize: "0.74rem", color: "var(--danger)", marginTop: 8 }}>🚩 Auto-flagged: expired without pickup</p>}
                {l.status === "active" && !l.flagged_unclaimed && (
                  <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                    <button className="btn btn-secondary btn-sm" onClick={() => startEdit(l)}>Edit</button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(l.id)}>Delete</button>
                  </div>
                )}
                {l.status === "reserved" && <p style={{ fontSize: "0.75rem", color: "var(--warning)", marginTop: 10 }}>⏳ Reserved — awaiting pickup confirmation</p>}
                {l.flagged_unclaimed && (
                  <button className="btn btn-ghost btn-sm" style={{ marginTop: 10, width: "100%" }} onClick={() => handleDismissFlag(l.id)}>
                    Dismiss Flag
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// WALLET
// ─────────────────────────────────────────────────────────────
function WalletPage({ profile, onToast, onRefreshProfile }) {
  const [linking, setLinking] = useState(false);
  const [saving, setSaving] = useState(false);
  const [bf, setBf] = useState({ holder: "", account: "", confirm: "", ifsc: "", bank: "" });
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    supabase.from("orders")
      .select(`id, reference, created_at, pay_method, total, wallet_used, status, order_items(listing_id, price, qty, unit, listings(name, emoji))`)
      .order("created_at", { ascending: false }).limit(20)
      .then(({ data }) => setOrders(data || []));
  }, []);

  const handleLink = async () => {
    if (!bf.holder || !bf.account || !bf.ifsc || !bf.bank) { onToast("Fill all fields", "err"); return; }
    if (bf.account !== bf.confirm) { onToast("Account numbers do not match", "err"); return; }
    setSaving(true);
    await supabase.from("profiles").update({
      bank_linked: true, bank_name: bf.bank,
      bank_account: "•••• " + bf.account.slice(-4), bank_ifsc: bf.ifsc,
    }).eq("id", profile.id);
    await onRefreshProfile();
    setLinking(false); setBf({ holder: "", account: "", confirm: "", ifsc: "", bank: "" });
    onToast("Bank account linked"); setSaving(false);
  };

  const totalEarned = orders.reduce((s, o) => s + (o.total || 0), 0);
  const totalWalletUsed = orders.reduce((s, o) => s + (o.wallet_used || 0), 0);

  return (
    <div className="page-enter">
      <div className="page-header"><h1>Wallet & Payouts</h1><p>Manage your bank account and payout history</p></div>
      <div className="stats-row">
        <div className="stat-card"><div className="stat-val">₹{profile.wallet_balance || 0}</div><div className="stat-lbl">Wallet Balance</div></div>
        <div className="stat-card"><div className="stat-val o">₹{totalEarned.toLocaleString()}</div><div className="stat-lbl">Total Spent</div></div>
        <div className="stat-card"><div className="stat-val b">₹{totalWalletUsed.toLocaleString()}</div><div className="stat-lbl">Wallet Used</div></div>
        <div className="stat-card"><div className="stat-val">{orders.length}</div><div className="stat-lbl">Transactions</div></div>
      </div>

      <div className="card">
        <div className="card-title">🏦 Linked Bank Account</div>
        {profile.bank_linked ? (
          <div className="bank-card">
            <div>
              <div style={{ fontWeight: 700, fontSize: "0.95rem", marginBottom: 3 }}>{profile.bank_name} {profile.bank_account}</div>
              <div style={{ fontSize: "0.78rem", color: "var(--muted)" }}>IFSC: {profile.bank_ifsc} · Verified</div>
            </div>
            <span className="badge badge-active">Active</span>
          </div>
        ) : <p style={{ color: "var(--muted)", fontSize: "0.875rem", marginBottom: 14 }}>No bank account linked.</p>}
        <button className="btn btn-secondary" style={{ marginTop: 6 }} onClick={() => setLinking(v => !v)}>
          {linking ? "Cancel" : profile.bank_linked ? "+ Link Another Account" : "+ Link Bank Account"}
        </button>
        {linking && (
          <div style={{ marginTop: 16, padding: 16, background: "var(--bg)", borderRadius: 10, border: "1px solid var(--border)" }}>
            <div className="form-grid" style={{ marginBottom: 12 }}>
              <div className="form-group"><label>Account Holder Name</label><input value={bf.holder} onChange={e => setBf(f => ({ ...f, holder: e.target.value }))} placeholder="As on bank records"/></div>
              <div className="form-group"><label>Bank Name</label><input value={bf.bank} onChange={e => setBf(f => ({ ...f, bank: e.target.value }))} placeholder="HDFC, ICICI, SBI…"/></div>
              <div className="form-group"><label>Account Number</label><input value={bf.account} onChange={e => setBf(f => ({ ...f, account: e.target.value }))} type="password" placeholder="Account number"/></div>
              <div className="form-group"><label>Confirm Account Number</label><input value={bf.confirm} onChange={e => setBf(f => ({ ...f, confirm: e.target.value }))} placeholder="Re-enter"/>{bf.confirm && bf.account !== bf.confirm && <span className="field-err">Account numbers do not match</span>}</div>
              <div className="form-group"><label>IFSC Code</label><input value={bf.ifsc} onChange={e => setBf(f => ({ ...f, ifsc: e.target.value.toUpperCase() }))} placeholder="HDFC0001234"/></div>
            </div>
            <button className="btn btn-primary btn-sm" onClick={handleLink} disabled={saving}>{saving ? "Linking…" : "Verify & Link Account"}</button>
          </div>
        )}
      </div>

      <div className="card">
        <div className="card-title">📊 Transaction History</div>
        {orders.length === 0 ? <div className="empty-state" style={{ padding: "30px 0" }}><p>No transactions yet</p></div> : (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                {["Reference", "Date", "Amount", "Wallet Used", "Payment", "Status"].map(h => (
                  <th key={h} style={{ textAlign: "left", padding: "8px 10px", color: "var(--muted)", fontWeight: 700, fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.4px" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map(r => (
                <tr key={r.id} style={{ borderBottom: "1px solid var(--border)" }}>
                  <td style={{ padding: "11px 10px", fontFamily: "var(--font-head)", fontWeight: 600, color: "var(--accent3)", fontSize: "0.78rem" }}>{r.reference || r.id.slice(0, 8).toUpperCase()}</td>
                  <td style={{ padding: "11px 10px", color: "var(--muted)", fontSize: "0.81rem" }}>{new Date(r.created_at).toLocaleDateString()}</td>
                  <td style={{ padding: "11px 10px", fontWeight: 700, color: r.total === 0 ? "var(--accent2)" : "var(--accent)" }}>{r.total === 0 ? "Donation" : `₹${r.total.toLocaleString()}`}</td>
                  <td style={{ padding: "11px 10px", color: (r.wallet_used || 0) > 0 ? "var(--accent)" : "var(--muted)", fontSize: "0.81rem" }}>{(r.wallet_used || 0) > 0 ? `₹${r.wallet_used}` : "—"}</td>
                  <td style={{ padding: "11px 10px", color: "var(--muted)", fontSize: "0.81rem" }}>{r.pay_method || "—"}</td>
                  <td style={{ padding: "11px 10px" }}>
                    <span className={`badge badge-${["completed","picked_up"].includes(r.status) ? "completed" : ["pending","confirmed","reserved"].includes(r.status) ? "reserved" : "expired"}`}>
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// PROFILE PAGE
// ─────────────────────────────────────────────────────────────
function ProfilePage({ profile, onToast, onRefreshProfile }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ ...profile });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const setF = (k, v) => setForm(f => ({ ...f, [k]: v }));

  useEffect(() => { setForm({ ...profile }); }, [profile]);

  const needsDoc = profile.role === "receiver" && profile.acct_type === "Nonprofit / NGO";
  const docMissing = needsDoc && !profile.doc_uploaded;

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase.from("profiles").update({
      name: form.name, biz: form.biz, phone: form.phone, address: form.address,
      operating_hours: form.operating_hours, fssai_license: form.fssai_license,
      storage_capacity: form.storage_capacity, acct_type: form.acct_type,
    }).eq("id", profile.id);
    if (error) { onToast("Save failed: " + error.message, "err"); setSaving(false); return; }
    await onRefreshProfile();
    setEditing(false); onToast("Profile saved"); setSaving(false);
  };

  const handleDocUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const path = `${profile.id}/${file.name}`;
    const { error: ue } = await supabase.storage.from("compliance-docs").upload(path, file, { upsert: true });
    if (ue) { onToast("Upload failed: " + ue.message, "err"); setUploading(false); return; }
    const { data: { publicUrl } } = supabase.storage.from("compliance-docs").getPublicUrl(path);
    await supabase.from("profiles").update({ doc_uploaded: true, doc_url: publicUrl }).eq("id", profile.id);
    await onRefreshProfile();
    onToast("Document uploaded for verification");
    setUploading(false);
  };

  return (
    <div className="page-enter">
      <div className="page-header ph-row">
        <div><h1>Profile</h1><p>Manage your account information</p></div>
        {!editing && <button className="btn btn-secondary" onClick={() => { setForm({ ...profile }); setEditing(true); }}>✏️ Edit Profile</button>}
      </div>

      <div className="profile-hdr">
        <div className="avatar-lg">{(profile.name || "?")[0].toUpperCase()}</div>
        <div>
          <div className="pname">{form.name}</div>
          <div className="pmeta">
            <span className={`role-badge ${profile.role}`}>{profile.role}</span>
            <span className={`vtag ${profile.verified ? "verified" : "pending"}`}>{profile.verified ? "✓ Verified" : "⏳ Pending Verification"}</span>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-title">📋 Personal Information</div>
        <div className="form-grid">
          <div className="form-group"><label>Full Name</label><input value={form.name || ""} disabled={!editing} onChange={e => setF("name", e.target.value)}/></div>
          <div className="form-group"><label>{profile.role === "restaurant" ? "Restaurant Name" : "Organisation Name"}</label><input value={form.biz || ""} disabled={!editing} onChange={e => setF("biz", e.target.value)}/></div>
          <div className="form-group"><label>Phone</label><input value={form.phone || ""} disabled={!editing} onChange={e => setF("phone", e.target.value)} placeholder="+91 98765 43210"/></div>
          <div className="form-group full"><label>Address</label><input value={form.address || ""} disabled={!editing} onChange={e => setF("address", e.target.value)}/></div>
          {profile.role === "restaurant" && (
            <>
              <div className="form-group"><label>Operating Hours</label><input value={form.operating_hours || ""} disabled={!editing} onChange={e => setF("operating_hours", e.target.value)} placeholder="Mon–Sat 08:00–22:00"/></div>
              <div className="form-group"><label>FSSAI License</label><input value={form.fssai_license || ""} disabled={!editing} onChange={e => setF("fssai_license", e.target.value)} placeholder="14-digit license"/></div>
              <div className="form-group full"><label>Storage Capacity</label><input value={form.storage_capacity || ""} disabled={!editing} onChange={e => setF("storage_capacity", e.target.value)}/></div>
            </>
          )}
          {profile.role === "receiver" && (
            <div className="form-group">
              <label>Account Type</label>
              {editing
                ? <select value={form.acct_type || ""} onChange={e => setF("acct_type", e.target.value)}>{["Nonprofit / NGO","Small Business","Individual","Community Kitchen"].map(o => <option key={o}>{o}</option>)}</select>
                : <input value={form.acct_type || ""} disabled/>}
            </div>
          )}
        </div>
        {editing && (
          <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
            <button className="btn btn-primary" onClick={handleSave} disabled={saving}>{saving ? "Saving…" : "Save Changes"}</button>
            <button className="btn btn-secondary" onClick={() => { setForm({ ...profile }); setEditing(false); }}>Cancel</button>
          </div>
        )}
      </div>

      {profile.role === "receiver" && (
        <div className="card" style={docMissing ? { borderColor: "rgba(255,77,106,0.4)" } : {}}>
          <div className="card-title">📄 Compliance Documents {docMissing && <span className="badge badge-pending" style={{ marginLeft: 6 }}>Required</span>}</div>
          {docMissing && <div className="error-msg" style={{ marginBottom: 14 }}>⚠ Exemption certificate required for nonprofit payment exemption.</div>}
          {profile.doc_uploaded ? (
            <div className="success-msg">✓ Document uploaded — pending admin verification{profile.doc_url && <> · <a href={profile.doc_url} target="_blank" rel="noreferrer" style={{ color: "var(--accent)" }}>View</a></>}</div>
          ) : (
            <label className="upload-area" style={{ display: "block", cursor: uploading ? "wait" : "pointer" }}>
              <input type="file" accept=".pdf,.jpg,.jpeg,.png" style={{ display: "none" }} onChange={handleDocUpload} disabled={uploading}/>
              <div className="upload-icon">📑</div>
              <p><strong style={{ color: "var(--accent)" }}>{uploading ? "Uploading…" : "Click to upload"}</strong> or drag and drop</p>
              <p style={{ marginTop: 4, fontSize: "0.75rem" }}>PDF, JPG, PNG up to 10 MB</p>
            </label>
          )}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// DASHBOARD
// ─────────────────────────────────────────────────────────────
function Dashboard({ profile, listings, onNavigate }) {
  const mine = listings.filter(l => l.restaurant_id === profile.id);
  const expiryAlerts = mine.filter(l => l.status === "active" && expiresWithin12h(l.expiry));
  const flagged = mine.filter(l => l.flagged_unclaimed);

  return (
    <div className="page-enter">
      <div className="page-header"><h1>Welcome back, {(profile.name || "there").split(" ")[0]} 👋</h1><p>Here's your platform overview</p></div>

      {/* Restaurant expiry alerts on dashboard */}
      {profile.role === "restaurant" && expiryAlerts.length > 0 && (
        <div className="alert-banner" style={{ marginBottom: 18 }}>
          <span className="ab-icon">⏰</span>
          <div className="ab-body">
            <div className="ab-title">{expiryAlerts.length} listing{expiryAlerts.length > 1 ? "s" : ""} expiring within 12 hours</div>
            <div className="ab-msg">{expiryAlerts.map(l => l.name).join(", ")} — go to My Listings to take action.</div>
          </div>
        </div>
      )}
      {profile.role === "restaurant" && flagged.length > 0 && (
        <div className="flagged-banner alert-banner" style={{ marginBottom: 18 }}>
          <span className="ab-icon">🚩</span>
          <div className="ab-body">
            <div className="ab-title">{flagged.length} listing{flagged.length > 1 ? "s" : ""} auto-flagged for review</div>
            <div className="ab-msg">These expired without a pickup confirmation. Check My Listings → Flagged tab.</div>
          </div>
        </div>
      )}

      <div className="stats-row">
        {profile.role === "restaurant" && (
          <>
            <div className="stat-card"><div className="stat-val">{mine.filter(l => l.status === "active").length}</div><div className="stat-lbl">Active Listings</div></div>
            <div className="stat-card"><div className="stat-val o">{mine.filter(l => l.status === "reserved").length}</div><div className="stat-lbl">Reserved</div></div>
            <div className="stat-card"><div className="stat-val r">{flagged.length}</div><div className="stat-lbl">Flagged</div></div>
            <div className="stat-card"><div className="stat-val b">₹{profile.wallet_balance || 0}</div><div className="stat-lbl">Wallet</div></div>
          </>
        )}
        {profile.role === "receiver" && (
          <>
            <div className="stat-card"><div className="stat-val">{listings.filter(l => l.status === "active").length}</div><div className="stat-lbl">Items Available</div></div>
            <div className="stat-card"><div className="stat-val o">₹{profile.wallet_balance || 0}</div><div className="stat-lbl">Wallet Balance</div></div>
            <div className="stat-card"><div className="stat-val b">{profile.verified ? "✓" : "⏳"}</div><div className="stat-lbl">{profile.verified ? "Verified" : "Pending"}</div></div>
          </>
        )}
        {profile.role === "admin" && (
          <>
            <div className="stat-card"><div className="stat-val">{listings.length}</div><div className="stat-lbl">Total Listings</div></div>
            <div className="stat-card"><div className="stat-val o">{listings.filter(l => l.status === "active").length}</div><div className="stat-lbl">Active</div></div>
            <div className="stat-card"><div className="stat-val r">{listings.filter(l => l.flagged_unclaimed).length}</div><div className="stat-lbl">Flagged</div></div>
          </>
        )}
      </div>

      <div className="card">
        <div className="card-title">🌿 Platform Impact</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(148px,1fr))", gap: 16 }}>
          {[["🥗","0 kg","Food saved this month"],["🤝","0","Successful handoffs"],["🏢","0","Partner restaurants"],["📉","₹0","Value recovered"]].map(([ic,v,l]) => (
            <div key={l} style={{ textAlign: "center", padding: "18px 12px", background: "var(--bg)", borderRadius: 10, border: "1px solid var(--border)" }}>
              <div style={{ fontSize: "1.5rem", marginBottom: 6 }}>{ic}</div>
              <div style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: "1.1rem", color: "var(--accent)" }}>{v}</div>
              <div style={{ fontSize: "0.74rem", color: "var(--muted)", marginTop: 4 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {profile.role === "receiver" && listings.filter(l => l.status === "active").length > 0 && (
        <div className="card">
          <div className="card-title" style={{ marginBottom: 14 }}>🔍 Recent Listings</div>
          <div className="listings-grid">
            {listings.filter(l => l.status === "active").slice(0, 3).map(l => (
              <div key={l.id} className="listing-card" onClick={() => onNavigate("browse")}>
                <div className="card-img">{l.emoji || "📦"}</div>
                <div className="card-body">
                  <div className="card-name">{l.name}</div>
                  <div className="card-sub">{l.restaurant_name}</div>
                  <div className="card-row">
                    <span className={`price-lbl${l.free ? " free" : ""}`}>{l.free ? "Free" : `₹${l.price}`}</span>
                    <span className="qty-lbl">{l.qty} {l.unit}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => onNavigate("browse")}>Browse all items →</button>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// ADMIN PAGE — with full transaction log + expiry management
// ─────────────────────────────────────────────────────────────
function AdminPage({ listings, onToast, onRefreshListings }) {
  const [users, setUsers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [flagged, setFlagged] = useState([]);
  const [suspended, setSuspended] = useState([]);
  const [tab, setTab] = useState("users");
  const [archiving, setArchiving] = useState(false);
  const [archiveResult, setArchiveResult] = useState(null);

  useEffect(() => {
    supabase.from("profiles").select("*").then(({ data }) => setUsers(data || []));
    supabase.from("orders")
      .select(`id, reference, created_at, pay_method, total, wallet_used, status, user_id, order_items(listing_id, price, qty, unit, listings(name, emoji, restaurant_name))`)
      .order("created_at", { ascending: false }).limit(100)
      .then(({ data }) => setTransactions(data || []));
  }, []);

  const totalTransactionValue = transactions.reduce((s, t) => s + (t.total || 0), 0);
  const donationCount = transactions.filter(t => t.total === 0).length;
  const flaggedListings = listings.filter(l => l.flagged_unclaimed);

  const handleRunArchive = async () => {
    setArchiving(true);
    const count = await runDailyArchive();
    await onRefreshListings();
    setArchiveResult(count);
    onToast(`Archived ${count} expired listing${count !== 1 ? "s" : ""}`);
    setArchiving(false);
    setTimeout(() => setArchiveResult(null), 5000);
  };

  const handleRunExpiryCheck = async () => {
    await runExpiryCheck(onToast);
    await onRefreshListings();
    onToast("Expiry check complete — restaurants notified");
  };

  return (
    <div className="page-enter">
      <div className="page-header"><h1>Admin Panel</h1><p>User management, listings, and transaction audit log</p></div>

      <div className="stats-row">
        <div className="stat-card"><div className="stat-val">{users.filter(u => u.role !== "admin").length}</div><div className="stat-lbl">Total Users</div></div>
        <div className="stat-card"><div className="stat-val o">{listings.length}</div><div className="stat-lbl">All Listings</div></div>
        <div className="stat-card"><div className="stat-val b">{transactions.length}</div><div className="stat-lbl">Transactions</div></div>
        <div className="stat-card"><div className="stat-val">₹{totalTransactionValue.toLocaleString()}</div><div className="stat-lbl">Total Volume</div></div>
        <div className="stat-card"><div className="stat-val r">{flaggedListings.length}</div><div className="stat-lbl">Flagged Listings</div></div>
      </div>

      {/* System controls */}
      <div className="cleanup-bar" style={{ marginBottom: 18 }}>
        <p>🛠️ <strong>System Jobs:</strong> Run manually or set pg_cron for automation.</p>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn btn-ghost btn-sm" onClick={handleRunExpiryCheck}>⏰ Run Expiry Check</button>
          <button className="btn btn-ghost btn-sm" onClick={handleRunArchive} disabled={archiving}>
            {archiving ? "Archiving…" : archiveResult !== null ? `✓ ${archiveResult} archived` : "🗂️ Run Archive"}
          </button>
        </div>
      </div>

      <div className="tab-bar">
        {[["users","👥 Users"],["listings","📋 Listings"],["transactions","💳 Transactions"],["flagged","🚩 Flagged"]].map(([t,l]) => (
          <button key={t} className={`tab-btn${tab===t?" active":""}`} onClick={()=>setTab(t)}>{l}{t==="flagged"&&flaggedListings.length>0?` (${flaggedListings.length})`:""}</button>
        ))}
      </div>

      {/* Users */}
      {tab === "users" && (
        <div className="card">
          <div className="card-title">👥 User Management</div>
          {users.length === 0 ? <div className="empty-state" style={{ padding: "30px 0" }}><p>Loading users…</p></div> : (
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
              <thead><tr style={{ borderBottom: "1px solid var(--border)" }}>
                {["Name","Role","Status","Verified","Actions"].map(h => <th key={h} style={{ textAlign: "left", padding: "8px 10px", color: "var(--muted)", fontWeight: 700, fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.4px" }}>{h}</th>)}
              </tr></thead>
              <tbody>
                {users.filter(u => u.role !== "admin").map(u => {
                  const fl = flagged.includes(u.id), su = suspended.includes(u.id);
                  return (
                    <tr key={u.id} style={{ borderBottom: "1px solid var(--border)", opacity: su ? 0.5 : 1 }}>
                      <td style={{ padding: "11px 10px", fontWeight: 600 }}>{u.name}<div style={{ fontSize: "0.72rem", color: "var(--muted)" }}>{u.biz}</div></td>
                      <td style={{ padding: "11px 10px" }}><span className={`role-badge ${u.role}`}>{u.role}</span></td>
                      <td style={{ padding: "11px 10px" }}><span className={`badge ${su?"badge-expired":fl?"badge-reserved":"badge-active"}`}>{su?"Suspended":fl?"Flagged":"Active"}</span></td>
                      <td style={{ padding: "11px 10px" }}><span className={`vtag ${u.verified?"verified":"pending"}`}>{u.verified?"✓ Yes":"⏳ No"}</span></td>
                      <td style={{ padding: "11px 10px" }}>
                        <div style={{ display: "flex", gap: 6 }}>
                          <button className="btn btn-secondary btn-sm" onClick={() => { setFlagged(f => fl ? f.filter(x => x !== u.id) : [...f, u.id]); onToast(fl ? "Flag removed" : "User flagged"); }}>{fl ? "Unflag" : "Flag"}</button>
                          <button className="btn btn-danger btn-sm" onClick={() => { setSuspended(s => su ? s.filter(x => x !== u.id) : [...s, u.id]); onToast(su ? "User reinstated" : "User suspended"); }}>{su ? "Reinstate" : "Suspend"}</button>
                          {!u.verified && <button className="btn btn-primary btn-sm" onClick={async () => { await supabase.from("profiles").update({ verified: true }).eq("id", u.id); setUsers(us => us.map(x => x.id === u.id ? { ...x, verified: true } : x)); onToast(`${u.name} verified`); }}>Verify ✓</button>}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Listings */}
      {tab === "listings" && (
        <div className="card">
          <div className="card-title">📋 All Listings</div>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
            <thead><tr style={{ borderBottom: "1px solid var(--border)" }}>
              {["Item","Restaurant","Category","Status","Expiry","Price"].map(h => <th key={h} style={{ textAlign: "left", padding: "8px 10px", color: "var(--muted)", fontWeight: 700, fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.4px" }}>{h}</th>)}
            </tr></thead>
            <tbody>
              {listings.filter(l => !l.archived).map(l => (
                <tr key={l.id} style={{ borderBottom: "1px solid var(--border)" }}>
                  <td style={{ padding: "11px 10px", fontWeight: 600 }}>{l.emoji} {l.name}</td>
                  <td style={{ padding: "11px 10px", color: "var(--muted)", fontSize: "0.81rem" }}>{l.restaurant_name}</td>
                  <td style={{ padding: "11px 10px" }}>{l.category}</td>
                  <td style={{ padding: "11px 10px" }}>
                    <span className={`badge badge-${l.flagged_unclaimed ? "flagged" : l.status}`}>
                      {l.flagged_unclaimed ? "🚩 Flagged" : l.status}
                    </span>
                  </td>
                  <td style={{ padding: "11px 10px", color: expiresWithin12h(l.expiry) ? "var(--warning)" : isPastExpiry(l.expiry) ? "var(--danger)" : "var(--muted)", fontSize: "0.81rem" }}>
                    {l.expiry}{expiresWithin12h(l.expiry) ? " ⏰" : isPastExpiry(l.expiry) ? " ✗" : ""}
                  </td>
                  <td style={{ padding: "11px 10px", color: l.free ? "var(--accent2)" : "var(--accent)", fontWeight: 700 }}>{l.free ? "Free" : `₹${l.price}`}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Transactions */}
      {tab === "transactions" && (
        <div className="card">
          <div className="card-title">
            💳 Transaction Log
            <span style={{ fontSize: "0.78rem", color: "var(--muted)", fontWeight: 400, marginLeft: 8 }}>
              {transactions.length} records · {donationCount} donations · ₹{totalTransactionValue.toLocaleString()} total
            </span>
          </div>
          {transactions.length === 0 ? <div className="empty-state" style={{ padding: "30px 0" }}><p>No transactions yet</p></div> : (
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.82rem" }}>
              <thead><tr style={{ borderBottom: "1px solid var(--border)" }}>
                {["Reference","Date","Items","Amount","Wallet","Method","Status","Actions"].map(h => <th key={h} style={{ textAlign: "left", padding: "8px 10px", color: "var(--muted)", fontWeight: 700, fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.4px" }}>{h}</th>)}
              </tr></thead>
              <tbody>
                {transactions.map(t => {
                  const items = (t.order_items || []).map(oi => oi.listings).filter(Boolean);
                  return (
                    <tr key={t.id} style={{ borderBottom: "1px solid var(--border)" }}>
                      <td style={{ padding: "10px", fontFamily: "var(--font-head)", color: "var(--accent3)", fontSize: "0.75rem", fontWeight: 700 }}>{t.reference || t.id.slice(0,8).toUpperCase()}</td>
                      <td style={{ padding: "10px", color: "var(--muted)" }}>{new Date(t.created_at).toLocaleDateString()}<br/><span style={{ fontSize: "0.68rem" }}>{new Date(t.created_at).toLocaleTimeString()}</span></td>
                      <td style={{ padding: "10px" }}>
                        {items.slice(0,2).map((item,i) => <div key={i} style={{ fontSize: "0.75rem", color: "var(--muted)" }}>{item.emoji} {item.name}</div>)}
                        {items.length > 2 && <div style={{ fontSize: "0.68rem", color: "var(--muted)" }}>+{items.length-2} more</div>}
                        {items[0]?.restaurant_name && <div style={{ fontSize: "0.68rem", color: "var(--accent3)", marginTop: 2 }}>🏪 {items[0].restaurant_name}</div>}
                      </td>
                      <td style={{ padding: "10px", fontWeight: 700, color: t.total === 0 ? "var(--accent2)" : "var(--accent)" }}>{t.total === 0 ? "Donation" : `₹${t.total}`}</td>
                      <td style={{ padding: "10px", color: (t.wallet_used||0) > 0 ? "var(--accent)" : "var(--muted)", fontSize: "0.78rem" }}>{(t.wallet_used||0) > 0 ? `₹${t.wallet_used}` : "—"}</td>
                      <td style={{ padding: "10px", color: "var(--muted)" }}>{t.pay_method || "—"}</td>
                      <td style={{ padding: "10px" }}>
                        <span className={`badge badge-${["completed","picked_up"].includes(t.status)?"completed":["pending","confirmed","reserved"].includes(t.status)?"reserved":"expired"}`}>{t.status}</span>
                      </td>
                      <td style={{ padding: "10px" }}>
                        <button className="btn btn-ghost btn-sm" style={{ fontSize: "0.72rem" }} onClick={() => {
                          generateCompliancePDF({ ...t, receiverName: "Receiver on file", receiverType: "Organisation" }, items, items[0]?.restaurant_name || "Restaurant");
                          onToast("Compliance doc downloaded");
                        }}>📄 Doc</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Flagged listings */}
      {tab === "flagged" && (
        <div className="card">
          <div className="card-title">🚩 Flagged Listings — Auto-flagged as Expired Unclaimed</div>
          {flaggedListings.length === 0
            ? <div className="empty-state" style={{ padding: "30px 0" }}><p>No flagged listings 🎉</p></div>
            : (
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
                <thead><tr style={{ borderBottom: "1px solid var(--border)" }}>
                  {["Item","Restaurant","Expired","Category","Actions"].map(h => <th key={h} style={{ textAlign: "left", padding: "8px 10px", color: "var(--muted)", fontWeight: 700, fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.4px" }}>{h}</th>)}
                </tr></thead>
                <tbody>
                  {flaggedListings.map(l => (
                    <tr key={l.id} style={{ borderBottom: "1px solid var(--border)" }}>
                      <td style={{ padding: "11px 10px", fontWeight: 600 }}>{l.emoji} {l.name}</td>
                      <td style={{ padding: "11px 10px", color: "var(--muted)", fontSize: "0.81rem" }}>{l.restaurant_name}</td>
                      <td style={{ padding: "11px 10px", color: "var(--danger)", fontSize: "0.81rem" }}>{l.expiry}</td>
                      <td style={{ padding: "11px 10px" }}>{l.category}</td>
                      <td style={{ padding: "11px 10px" }}>
                        <button className="btn btn-secondary btn-sm" onClick={async () => {
                          await supabase.from("listings").update({ flagged_unclaimed: false }).eq("id", l.id);
                          onToast("Flag cleared");
                          // trigger re-fetch via parent
                        }}>Clear Flag</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// ROOT APP
// ─────────────────────────────────────────────────────────────
export default function App() {
  const [session, setSession] = useState(undefined);
  const [profile, setProfile] = useState(null);
  const [listings, setListings] = useState([]);
  const [cart, setCart] = useState([]);
  const [page, setPage] = useState("dashboard");
  const [toast, setToast] = useState(null);
  const [toastType, setToastType] = useState("success");
  const [cartOpen, setCartOpen] = useState(false);
  const [detailItem, setDetailItem] = useState(null);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const showToast = useCallback((msg, type = "success") => {
    setToast(null);
    requestAnimationFrame(() => { setToast(msg); setToastType(type); });
    setTimeout(() => setToast(null), 3200);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => setSession(session));
    return () => subscription.unsubscribe();
  }, []);

  const refreshProfile = useCallback(async () => {
    const p = await getMyProfile();
    setProfile(p);
    return p;
  }, []);

  const refreshListings = useCallback(async () => {
    const data = await getListings();
    setListings(data);
    return data;
  }, []);

  const refreshCart = useCallback(async () => {
    const data = await getMyCart();
    setCart(data);
    return data;
  }, []);

  useEffect(() => {
    if (session) {
      refreshProfile();
      refreshListings();
      releaseExpiredReservations();
      // Run expiry check on mount (will no-op if RPC doesn't exist yet)
      runExpiryCheck(showToast);
    } else {
      setProfile(null); setCart([]); setListings([]);
    }
  }, [session]);

  // Periodic expiry check every 30 minutes
  useEffect(() => {
    if (!session) return;
    const interval = setInterval(() => {
      runExpiryCheck(showToast);
      releaseExpiredReservations();
    }, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, [session]);

  useEffect(() => { if (profile?.role === "receiver") refreshCart(); }, [profile]);

  useEffect(() => {
    if (!session) return;
    const channel = supabase.channel("listings-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "listings" }, () => refreshListings())
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, [session, refreshListings]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setPage("dashboard"); setCart([]); setDetailItem(null); setCartOpen(false);
  };

  if (session === undefined) return <><style>{STYLE}</style><Spinner /></>;
  if (!session || !profile) return <><style>{STYLE}</style><AuthPage onLogin={() => {}} /></>;

  const restaurantNav = [
    { id: "dashboard", icon: "🏠", label: "Dashboard" },
    { id: "listings", icon: "📦", label: "My Listings", badge: listings.filter(l => l.restaurant_id === profile.id && l.flagged_unclaimed).length || undefined },
    { id: "wallet", icon: "💳", label: "Wallet & Payouts" },
    { id: "profile", icon: "👤", label: "Profile" },
  ];
  const receiverNav = [
    { id: "dashboard", icon: "🏠", label: "Dashboard" },
    { id: "browse", icon: "🛍️", label: "Browse Surplus", badge: listings.filter(l => l.status === "active").length },
    { id: "claims", icon: "📋", label: "My Claims" },
    { id: "profile", icon: "👤", label: "Profile" },
  ];
  const adminNav = [
    { id: "dashboard", icon: "🏠", label: "Dashboard" },
    { id: "admin", icon: "🛡️", label: "Admin Panel", badge: listings.filter(l => l.flagged_unclaimed).length || undefined },
    { id: "profile", icon: "👤", label: "Profile" },
  ];
  const nav = profile.role === "restaurant" ? restaurantNav : profile.role === "receiver" ? receiverNav : adminNav;

  const renderPage = () => {
    switch (page) {
      case "dashboard": return <Dashboard profile={profile} listings={listings} onNavigate={setPage} />;
      case "profile": return <ProfilePage profile={profile} onToast={showToast} onRefreshProfile={refreshProfile} />;
      case "listings": return <MyListingsPage listings={listings} profile={profile} onToast={showToast} onRefreshListings={refreshListings} />;
      case "wallet": return <WalletPage profile={profile} onToast={showToast} onRefreshProfile={refreshProfile} />;
      case "browse": return <BrowsePage listings={listings} onToast={showToast} cart={cart} setCart={setCart} onShowDetail={setDetailItem} profile={profile} onRefreshListings={async () => { await refreshListings(); await refreshCart(); }} />;
      case "claims": return <MyClaimsPage profile={profile} onToast={showToast} />;
      case "admin": return <AdminPage listings={listings} onToast={showToast} onRefreshListings={refreshListings} />;
      default: return <Dashboard profile={profile} listings={listings} onNavigate={setPage} />;
    }
  };

  return (
    <>
      <style>{STYLE}</style>
      <div className="app-wrap">
        <header className="header">
          <div className="logo" onClick={() => setPage("dashboard")}>
            <span className="logo-dot" /><span>Surplus</span><span style={{ color: "var(--text)" }}>Link</span>
          </div>
          <div className="header-right">
            {profile.role === "receiver" && (
              <button className="cart-btn" onClick={() => setCartOpen(true)}>
                🛒 Cart {cart.length > 0 && <span className="cart-count">{cart.length}</span>}
              </button>
            )}
            <span className={`role-badge ${profile.role}`}>{profile.biz || profile.name}</span>
            <div className="header-avatar" onClick={() => setPage("profile")} title="Go to profile">{(profile.name || "?")[0].toUpperCase()}</div>
            <button className="nav-btn" onClick={handleSignOut}>Sign Out</button>
          </div>
        </header>

        <div className="main">
          <nav className="sidebar">
            <div className="sidebar-section">Navigation</div>
            {nav.map(n => (
              <div key={n.id} className={`sidebar-item${page === n.id ? " active" : ""}`} onClick={() => setPage(n.id)}>
                <span className="s-icon">{n.icon}</span>{n.label}
                {n.badge > 0 && <span className="sidebar-badge">{n.badge}</span>}
              </div>
            ))}
          </nav>
          <main className="content">{renderPage()}</main>
        </div>
      </div>

{cartOpen && (
  <CartDrawer
    cart={cart}
    profile={profile}
    onRefreshCart={refreshCart}
    onRefreshListings={async () => { await refreshListings(); await refreshCart(); }}
    onClose={() => setCartOpen(false)}
    onToast={showToast}
    onCheckout={() => { setCartOpen(false); setCheckoutOpen(true); }}
  />
)}
{checkoutOpen && (
  <CheckoutModal
    cart={cart}
    profile={profile}
    onClose={() => setCheckoutOpen(false)}
    onToast={showToast}
    onSuccess={async (ref) => {
      setCheckoutOpen(false);
      await refreshListings();
      await refreshCart();
      showToast(`Order confirmed! Ref: ${ref} 🎉`);
    }}
  />
)}
      {detailItem && (
        <ProductDetailModal
          listing={detailItem}
          onClose={() => setDetailItem(null)}
          cart={cart}
          onRefreshListings={async () => { await refreshListings(); await refreshCart(); }}
          onToast={showToast}
        />
      )}
      {toast && <Toast msg={toast} type={toastType} />}
    </>
  );
}
