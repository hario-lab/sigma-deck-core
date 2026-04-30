import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { sfx } from '../hooks/useSfx';
import { calcThreatLevel, getFallbackIco, FALLBACK_GROUPS } from '../data/groups';
import StatusBar from '../components/StatusBar';
import HeaderMini from '../components/HeaderMini';
import CreditFooter from '../components/CreditFooter';

const ALL_SECTORS = [
  ['💰', 'Finance'], ['🏥', 'Health'], ['🏛', 'Gov'],
  ['🏭', 'Mfg'], ['🎓', 'Edu'], ['⚡', 'Energy']
];

function drawRadar(canvas, data) {
  if (!canvas || !data) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  const cx = W / 2, cy = H / 2 + 6, R = Math.min(W, H) * .36;
  const labels = ['攻撃力', '持続性', '技術力', '拡散力', '隠密性'], n = labels.length;
  ctx.clearRect(0, 0, W, H);
  for (let ring = 1; ring <= 4; ring++) {
    ctx.beginPath();
    for (let i = 0; i < n; i++) {
      const a = (Math.PI * 2 * i / n) - Math.PI / 2, r2 = R * ring / 4;
      i === 0 ? ctx.moveTo(cx + r2 * Math.cos(a), cy + r2 * Math.sin(a)) : ctx.lineTo(cx + r2 * Math.cos(a), cy + r2 * Math.sin(a));
    }
    ctx.closePath(); ctx.strokeStyle = 'rgba(255,100,160,0.15)'; ctx.lineWidth = .7; ctx.stroke();
  }
  for (let i = 0; i < n; i++) {
    const a = (Math.PI * 2 * i / n) - Math.PI / 2;
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + R * Math.cos(a), cy + R * Math.sin(a));
    ctx.strokeStyle = 'rgba(255,100,160,0.18)'; ctx.lineWidth = .7; ctx.stroke();
  }
  ctx.beginPath();
  for (let i = 0; i < n; i++) {
    const a = (Math.PI * 2 * i / n) - Math.PI / 2, r2 = R * data[i];
    i === 0 ? ctx.moveTo(cx + r2 * Math.cos(a), cy + r2 * Math.sin(a)) : ctx.lineTo(cx + r2 * Math.cos(a), cy + r2 * Math.sin(a));
  }
  ctx.closePath(); ctx.fillStyle = 'rgba(255,80,150,0.18)'; ctx.fill();
  ctx.strokeStyle = 'rgba(255,100,180,0.9)'; ctx.lineWidth = 1.8; ctx.stroke();
  for (let i = 0; i < n; i++) {
    const a = (Math.PI * 2 * i / n) - Math.PI / 2, r2 = R * data[i];
    ctx.beginPath(); ctx.arc(cx + r2 * Math.cos(a), cy + r2 * Math.sin(a), 3.5, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,120,200,0.95)'; ctx.shadowBlur = 6; ctx.shadowColor = 'rgba(255,80,160,0.6)';
    ctx.fill(); ctx.shadowBlur = 0;
  }
  ctx.fillStyle = 'rgba(255,160,210,0.8)'; ctx.font = '9px "Courier New",monospace';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  for (let i = 0; i < n; i++) {
    const a = (Math.PI * 2 * i / n) - Math.PI / 2, lr = R + 16;
    ctx.fillText(labels[i], cx + lr * Math.cos(a), cy + lr * Math.sin(a));
  }
}

function drawLine(canvas, data) {
  if (!canvas || !data) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  const pad = { l: 6, r: 6, t: 6, b: 14 };
  const iw = W - pad.l - pad.r, ih = H - pad.t - pad.b;
  const maxV = Math.max(...data);
  ctx.clearRect(0, 0, W, H);
  for (let i = 0; i <= 3; i++) {
    const y = pad.t + ih - (ih * i / 3);
    ctx.beginPath(); ctx.moveTo(pad.l, y); ctx.lineTo(W - pad.r, y);
    ctx.strokeStyle = 'rgba(56,189,248,0.07)'; ctx.lineWidth = .5; ctx.stroke();
  }
  const px = i => pad.l + i * iw / (data.length - 1);
  const py = v => pad.t + ih - (v / maxV) * ih;
  const grad = ctx.createLinearGradient(0, pad.t, 0, pad.t + ih);
  grad.addColorStop(0, 'rgba(56,189,248,0.2)'); grad.addColorStop(1, 'rgba(56,189,248,0.01)');
  ctx.beginPath(); ctx.moveTo(px(0), pad.t + ih);
  data.forEach((v, i) => ctx.lineTo(px(i), py(v)));
  ctx.lineTo(px(data.length - 1), pad.t + ih); ctx.closePath();
  ctx.fillStyle = grad; ctx.fill();
  ctx.beginPath();
  data.forEach((v, i) => i === 0 ? ctx.moveTo(px(i), py(v)) : ctx.lineTo(px(i), py(v)));
  ctx.strokeStyle = 'rgba(56,189,248,0.85)'; ctx.lineWidth = 1.6; ctx.lineJoin = 'round'; ctx.stroke();
  data.forEach((v, i) => {
    ctx.beginPath(); ctx.arc(px(i), py(v), 2, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(56,189,248,0.9)'; ctx.fill();
  });
  const months = ['J','F','M','A','M','J','J','A','S','O','N','D'];
  ctx.fillStyle = 'rgba(125,211,252,0.42)'; ctx.font = '7px "Courier New",monospace';
  ctx.textAlign = 'center'; ctx.textBaseline = 'top';
  months.forEach((m, i) => ctx.fillText(m, px(i), H - pad.b + 3));
}

export default function CardDetailScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { groups, selectedFilters, FALLBACK_VICTIMS, setCurrentGroup } = useApp();
  const [flipped, setFlipped] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [activeVictim, setActiveVictim] = useState(null);
  const [logoLoaded, setLogoLoaded] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const radarRef = useRef(null);
  const lineRef = useRef(null);

  console.log('受け取ったid:', id);
  console.log('findの結果:', groups.find(g => g.id === id));

  const group =
    groups.find(g => g.id === id) ||
    FALLBACK_GROUPS.find(g => g.id === id) ||
    null;

  useEffect(() => {
    setFlipped(false);
    setShowDetail(false);
    setActiveVictim(null);
    setLogoLoaded(false);
    setLogoError(false);
    if (group) setCurrentGroup(group);
  }, [id]);

  useEffect(() => {
    if (group) {
      setTimeout(() => {
        drawRadar(radarRef.current, group.radarData);
        drawLine(lineRef.current, group.attackData);
      }, 150);
    }
  }, [group, flipped]);

  if (!group) return (
    <div className="screen active">
      <StatusBar />
      <HeaderMini page="CARD_DETAIL" />
      <div className="scroll-body" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ color: 'rgba(125,211,252,.4)', fontSize: 12 }}>Group not found</span>
      </div>
    </div>
  );

  const lv = calcThreatLevel(group);
  const lvCls = `lv${lv}`;

  const selectedCountries = [];
  const FLAGS = ['🇺🇸','🇬🇧','🇯🇵','🇩🇪','🇫🇷','🇨🇦','🇦🇺','🇰🇷'];
  const CODES = ['US','UK','JP','DE','FR','CA','AU','KR'];
  selectedFilters.forEach(f => {
    FLAGS.forEach((fl, fi) => { if (f.includes(fl)) selectedCountries.push(CODES[fi]); });
  });

  const victims = [...FALLBACK_VICTIMS].sort((a, b) => {
    if (!selectedCountries.length) return 0;
    const aM = selectedCountries.includes(a.country), bM = selectedCountries.includes(b.country);
    return (bM ? 1 : 0) - (aM ? 1 : 0);
  });

  const handleFlip = () => { sfx('flip'); setFlipped(f => !f); };

  const handleVictimClick = (v, i) => {
    setActiveVictim(i);
    setShowDetail(true);
    sfx('tap');
  };

  const handleBackDetail = (e) => {
    e.stopPropagation();
    setShowDetail(false);
    setActiveVictim(null);
    sfx('tap');
  };

  const handleShare = () => {
    sfx('tap');
    const txt = `Σ DECK-CORE: ${group.name}\nVictims: ${group.victims} | Threat: ${group.threat}/100\nPowered by ransomware.live`;
    if (navigator.share) navigator.share({ title: 'Σ DECK-CORE', text: txt, url: location.href });
    else { try { navigator.clipboard.writeText(txt); alert('クリップボードにコピーしました'); } catch { alert(txt); } }
  };

  const activeV = activeVictim !== null ? victims[activeVictim] : null;
  const profileUrl = `https://www.ransomware.live/group/${encodeURIComponent(group.id)}`;
  const fallbackIco = getFallbackIco(group.id, group.lastSeen, group.status);
  const logoUrl = `https://images.ransomware.live/logos/${encodeURIComponent(group.id)}.png`;

  return (
    <div className="screen active">
      <StatusBar />
      <HeaderMini page="CARD_DETAIL" />
      <div className="navbar">
        <div className="nbtn" onClick={() => { sfx('back'); navigate('/'); }}>
          <svg width="10" height="10" viewBox="0 0 18 18" fill="none"><path d="M2 9l7-7 7 7" stroke="#38bdf8" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/><rect x="4" y="9" width="10" height="8" rx="1.5" stroke="#38bdf8" strokeWidth="1.4"/></svg>
          <span className="nbtn-t">HOME</span>
        </div>
        <div className="nbtn" onClick={() => { sfx('back'); navigate('/results'); }}>
          <svg width="8" height="12" viewBox="0 0 8 14" fill="none"><path d="M7 1L1 7l6 6" stroke="#38bdf8" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
          <span className="nbtn-t">RESULTS</span>
        </div>
        <div className="nsp"></div>
        <div className="share-btn" onClick={handleShare}>
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><circle cx="13" cy="3" r="2" stroke="#a78bfa" strokeWidth="1.2"/><circle cx="13" cy="13" r="2" stroke="#a78bfa" strokeWidth="1.2"/><circle cx="3" cy="8" r="2" stroke="#a78bfa" strokeWidth="1.2"/><line x1="5" y1="7" x2="11" y2="4" stroke="#a78bfa" strokeWidth="1.2" strokeLinecap="round"/><line x1="5" y1="9" x2="11" y2="12" stroke="#a78bfa" strokeWidth="1.2" strokeLinecap="round"/></svg>
          <span className="share-t">SHARE</span>
        </div>
      </div>

      <div className="card-scene">
        <div className="scene" onClick={handleFlip}>
          <div className={`card3d${flipped ? ' flipped' : ''}`}>
            {/* FRONT */}
            <div className={`face face-front ${lvCls}`}>
              <div className="card-shine"></div>
              <div className="f-hdr">
                <div className={`rarity ${lvCls}`}>
                  {[1,2,3,4,5].map(i => (
                    <div key={i} className={`rstar${i > lv ? ' dim' : ''}`}></div>
                  ))}
                </div>
                <span className="gtype">{group.type} · {group.subtype}</span>
                <div className="flip-hint">↻ flip</div>
              </div>

              <div className="art-panel">
                <div className={`panel-logo${showDetail ? ' hidden' : ''}`}>
                  {!logoError && (
                    <img
                      src={logoUrl}
                      alt={group.name}
                      className="logo-img-big"
                      style={{ display: logoLoaded ? 'block' : 'none' }}
                      onLoad={() => setLogoLoaded(true)}
                      onError={() => setLogoError(true)}
                    />
                  )}
                  {(logoError || !logoLoaded) && (
                    <div className="logo-fallback-wrap">
                      <span className="logo-fallback-ico">{fallbackIco}</span>
                      <span className="logo-name">{group.name}</span>
                    </div>
                  )}
                </div>
                <div className={`panel-detail${showDetail ? ' visible' : ''}`}>
                  <span className="pd-back" onClick={handleBackDetail}>← BACK</span>
                  {activeV && (
                    <>
                      <div className="pd-row">
                        <div className="pd-ico">{activeV.ico}</div>
                        <div><div className="pd-co">{activeV.co}</div><div className="pd-loc">{activeV.loc}</div></div>
                      </div>
                      <hr className="pd-hr" />
                      <div className="pd-date">📅 {activeV.date}</div>
                      <div className="pd-desc">{activeV.desc}</div>
                    </>
                  )}
                </div>
              </div>

              <div style={{ padding: '7px 12px 3px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
                <div className="f-name" style={{ padding: 0 }}>{group.name}</div>
                <a
                  href={profileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={e => e.stopPropagation()}
                  style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(167,139,250,.12)', border: '1px solid rgba(167,139,250,.35)', borderRadius: 7, padding: '4px 9px', flexShrink: 0, cursor: 'pointer' }}
                >
                  <svg width="10" height="10" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="5" r="3" stroke="#c4b5fd" strokeWidth="1.3"/><path d="M1 13c0-2.8 2.7-5 6-5s6 2.2 6 5" stroke="#c4b5fd" strokeWidth="1.3" strokeLinecap="round"/></svg>
                  <span style={{ fontSize: 9, color: '#c4b5fd', fontWeight: 600, letterSpacing: '.04em' }}>Profile</span>
                </a>
              </div>
              <div className="f-sub">Ransomware Group · 出現 {group.founded}</div>
              <div className="stats-row">
                <div className="stat-pill"><span className="stat-val">{(group.victims || 0).toLocaleString()}</span><span className="stat-lbl">Victims</span></div>
                <div className="stat-pill"><span className="stat-val">{(2026 - (group.founded || 2020))}y+</span><span className="stat-lbl">Active</span></div>
                <div className="stat-pill"><span className="stat-val">{group.ransom || '—'}</span><span className="stat-lbl">Ransom</span></div>
              </div>
              <div className="tgt-sec">
                <div className="sec-lbl-s">PRIMARY_TARGETS</div>
                <div className="tgt-row">
                  {ALL_SECTORS.map(([ico, name]) => {
                    const on = (group.sectors || []).includes(ico);
                    return (
                      <div key={ico} className="ticon">
                        <div className={`ticon-box${on ? ' on' : ''}`}>{ico}</div>
                        <span className={`ticon-txt${on ? '' : ' dim'}`}>{name}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="victim-sec">
                <div className="v-hdr">
                  <span className="v-title">RECENT_VICTIMS</span>
                  <span className="v-cnt">{(group.victims || 0).toLocaleString()} total</span>
                </div>
                {selectedCountries.length > 0 && (
                  <div style={{ fontSize: 8, color: 'rgba(56,189,248,.45)', letterSpacing: '.05em', padding: '2px 0 3px', textAlign: 'center' }}>
                    🎯 {selectedCountries.join('・')} の企業を優先表示中
                  </div>
                )}
                <div className="v-list">
                  {victims.map((v, i) => {
                    const isMatch = selectedCountries.length && selectedCountries.includes(v.country);
                    return (
                      <div
                        key={i}
                        className={`vi${activeVictim === i ? ' act' : ''}`}
                        onClick={e => { e.stopPropagation(); handleVictimClick(v, i); }}
                      >
                        <div className="vi-ico">{v.ico}</div>
                        <div className="vi-info">
                          <div className="vi-name" style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            {v.co}
                            {isMatch && (
                              <span style={{ fontSize: 7, background: 'rgba(56,189,248,.2)', border: '1px solid rgba(56,189,248,.4)', borderRadius: 4, padding: '1px 5px', color: '#7dd3fc', flexShrink: 0, marginLeft: 2 }}>🎯</span>
                            )}
                          </div>
                          <div className="vi-meta">{v.loc}</div>
                        </div>
                        <div className="vi-date">{v.date.slice(5)}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="threat-tag" style={{ flexShrink: 0 }}>
                <div className="t-dot"></div>
                <span>{group.status.toUpperCase()} · {group.status !== 'inactive' ? 'ACTIVE' : 'DEFUNCT'}</span>
              </div>
              <div className="f-footer">
                <span><span className="s-dot"></span>{group.status.charAt(0).toUpperCase() + group.status.slice(1)}</span>
                <span>Last: {group.lastSeen}</span>
              </div>
            </div>

            {/* BACK */}
            <div className={`face face-back ${lvCls}`}>
              <div className="b-hdr">
                <div><div className="b-name">{group.name}</div><div className="b-sublbl">Threat Intelligence</div></div>
                <div className="b-onion">{group.onion}</div>
              </div>
              <div className="chart-wrap">
                <canvas ref={radarRef} width="190" height="160"></canvas>
              </div>
              <hr className="b-div" />
              <div className="area-row">
                <span className="a-lbl">ACTIVITY_AREA</span>
                <div className="a-chips">
                  {(group.area || []).map((a, i) => (
                    <span key={i} className="a-chip">{a}</span>
                  ))}
                </div>
              </div>
              <hr className="b-div" />
              <div className="graph-sec">
                <div className="g-lbl">ATTACK_VOLUME (monthly)</div>
                <canvas ref={lineRef} width="330" height="62"></canvas>
              </div>
              <hr className="b-div" />
              <div className="tools-sec">
                <div className="tools-hdr">
                  <span className="tools-lbl">ARSENAL</span>
                  <div className="tools-line"></div>
                </div>
                <div className="tools-grid">
                  {(group.tools || []).map((t, i) => (
                    <div key={i} className="tool">
                      <div className="tool-ico">{t.ico}</div>
                      <div>
                        <div className="tool-name">{t.n}</div>
                        <div className="tool-cat">{t.c}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ flex: 1 }}></div>
              <div className="b-footer">
                <span>ransomware.live</span>
                <span>ID: {group.id.toUpperCase()}-001</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flip-bar">// TAP CARD TO FLIP //</div>
      <CreditFooter />
    </div>
  );
}
