import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { sfx } from '../hooks/useSfx';
import StatusBar from '../components/StatusBar';
import HeaderMini from '../components/HeaderMini';
import BottomNav from '../components/BottomNav';
import CreditFooter from '../components/CreditFooter';

const COUNTRIES = [
  { code: 'US', label: '🇺🇸 US' }, { code: 'UK', label: '🇬🇧 UK' },
  { code: 'JP', label: '🇯🇵 JP' }, { code: 'DE', label: '🇩🇪 DE' },
  { code: 'FR', label: '🇫🇷 FR' }, { code: 'CA', label: '🇨🇦 CA' },
  { code: 'AU', label: '🇦🇺 AU' }, { code: 'KR', label: '🇰🇷 KR' },
];
const SECTORS = [
  '💰 金融', '🏥 医療', '🏛 行政', '🏭 製造', '🎓 教育', '⚡ エネルギー', '💻 IT'
];
const PERIODS = ['直近30日', '直近3ヶ月', '2026年', '2025年', '全期間'];
const DAMAGES = ['🔐 データ暗号化', '📤 データ窃取', '⚠️ 二重脅迫', '🚫 業務停止', '📢 情報公開済'];
const STATUSES = ['🟢 活動中', '🔴 Critical', '⬜ 摘発・消滅'];

function FilterChip({ label, checked, onToggle }) {
  return (
    <div className={`fchk${checked ? ' on' : ''}`} onClick={() => { sfx('check'); onToggle(); }}>
      <div className="cbox"><span className="cbox-check">✓</span></div>
      <span className="clbl">{label}</span>
    </div>
  );
}

export default function FilterScreen() {
  const navigate = useNavigate();
  const { execSearch } = useApp();
  const [countries, setCountries] = useState(new Set());
  const [sectors, setSectors] = useState(new Set());
  const [period, setPeriod] = useState('直近30日');
  const [damages, setDamages] = useState(new Set());
  const [statuses, setStatuses] = useState(new Set());

  const toggleSet = (set, setter, val) => {
    const next = new Set(set);
    next.has(val) ? next.delete(val) : next.add(val);
    setter(next);
  };

  const totalChecked = countries.size + sectors.size + damages.size + statuses.size;

  const handleExec = () => {
    const filters = [
      ...Array.from(countries).map(c => COUNTRIES.find(x => x.code === c)?.label || c),
      ...Array.from(sectors),
      period,
      ...Array.from(damages),
      ...Array.from(statuses),
    ];
    execSearch(filters);
    sfx('execute');
    navigate('/results');
  };

  const handleReset = () => {
    setCountries(new Set()); setSectors(new Set());
    setPeriod('直近30日'); setDamages(new Set()); setStatuses(new Set());
    sfx('tap');
  };

  return (
    <div className="screen active">
      <StatusBar />
      <HeaderMini page="FILTER_SEARCH" />
      <div className="navbar">
        <div className="nbtn" onClick={() => { sfx('back'); navigate('/'); }}>
          <svg width="10" height="10" viewBox="0 0 18 18" fill="none"><path d="M2 9l7-7 7 7" stroke="#38bdf8" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/><rect x="4" y="9" width="10" height="8" rx="1.5" stroke="#38bdf8" strokeWidth="1.4"/></svg>
          <span className="nbtn-t">HOME</span>
        </div>
        <div className="nsp"></div>
        <div className="nbtn-rst" onClick={handleReset}><span className="nbtn-rst-t">RESET_ALL</span></div>
      </div>
      <div className="scroll-body">
        <div className="fw">
          <div>
            <div className="fsec-t">VICTIM_COUNTRY<div className="fsec-line"></div></div>
            <div className="fchips">
              {COUNTRIES.map(c => (
                <FilterChip key={c.code} label={c.label} checked={countries.has(c.code)} onToggle={() => toggleSet(countries, setCountries, c.code)} />
              ))}
            </div>
          </div>
          <div>
            <div className="fsec-t">TARGET_SECTOR<div className="fsec-line"></div></div>
            <div className="fchips">
              {SECTORS.map(s => (
                <FilterChip key={s} label={s} checked={sectors.has(s)} onToggle={() => toggleSet(sectors, setSectors, s)} />
              ))}
            </div>
          </div>
          <div>
            <div className="fsec-t">ACTIVITY_PERIOD<div className="fsec-line"></div></div>
            <div className="prow">
              {PERIODS.map(p => (
                <div key={p} className={`pbtn${period === p ? ' on' : ''}`} onClick={() => { sfx('tap'); setPeriod(p); }}>{p}</div>
              ))}
            </div>
          </div>
          <div>
            <div className="fsec-t">DAMAGE_TYPE<div className="fsec-line"></div></div>
            <div className="fchips">
              {DAMAGES.map(d => (
                <FilterChip key={d} label={d} checked={damages.has(d)} onToggle={() => toggleSet(damages, setDamages, d)} />
              ))}
            </div>
          </div>
          <div>
            <div className="fsec-t">GROUP_STATUS<div className="fsec-line"></div></div>
            <div className="fchips">
              {STATUSES.map(s => (
                <FilterChip key={s} label={s} checked={statuses.has(s)} onToggle={() => toggleSet(statuses, setStatuses, s)} />
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="go-wrap">
        <div className="go-btn" onClick={handleExec}>
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><circle cx="6.5" cy="6.5" r="4.5" stroke="#38bdf8" strokeWidth="1.3"/><line x1="10" y1="10" x2="14" y2="14" stroke="#38bdf8" strokeWidth="1.3" strokeLinecap="round"/></svg>
          EXECUTE_SEARCH <span className="gbadge">{totalChecked}</span>
        </div>
      </div>
      <BottomNav />
      <CreditFooter />
    </div>
  );
}
