import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { sfx } from '../hooks/useSfx';
import StatusBar from '../components/StatusBar';
import HeaderMini from '../components/HeaderMini';
import BottomNav from '../components/BottomNav';
import CreditFooter from '../components/CreditFooter';
import GroupLogo from '../components/GroupLogo';

const COUNTRY_FLAGS = ['🇺🇸', '🇬🇧', '🇯🇵', '🇩🇪', '🇫🇷', '🇨🇦', '🇦🇺', '🇰🇷'];

function tagClass(f) {
  const isCountry = COUNTRY_FLAGS.some(fl => f.includes(fl));
  const isPeriod = ['直近', '年', '期間'].some(p => f.includes(p));
  const isDamage = ['暗号化', '窃取', '脅迫', '停止', '公開'].some(d => f.includes(d));
  return 'pbt ' + (isCountry ? 'c' : isPeriod ? 'p' : isDamage ? 'd' : 's');
}

export default function ResultsScreen() {
  const navigate = useNavigate();
  const { groups, selectedFilters, currentSort, setCurrentSort, setCurrentGroup } = useApp();
  const [sort, setSort] = useState(currentSort || 'recent');

  const filtered = groups.filter(g => {
    if (selectedFilters.length === 0) return true;
    for (const f of selectedFilters) {
      if (f.includes('活動中') && g.status !== 'active') return false;
      if (f.includes('Critical') && g.status !== 'critical') return false;
      if (f.includes('摘発') && g.status !== 'inactive') return false;
      const countryMatch = COUNTRY_FLAGS.find(fl => f.includes(fl));
      if (countryMatch && Array.isArray(g.area) && g.area.length > 0) {
        const areaStr = g.area.join(' ').toLowerCase();
        const flag = countryMatch;
        const flagMap = { '🇺🇸': 'us', '🇬🇧': 'uk', '🇯🇵': 'jp', '🇩🇪': 'de', '🇫🇷': 'fr', '🇨🇦': 'ca', '🇦🇺': 'au', '🇰🇷': 'kr' };
        const code = flagMap[flag];
        if (code && !areaStr.includes(code)) return false;
      }
    }
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sort === 'victims') return b.victims - a.victims;
    if (sort === 'founded') return (b.founded || 0) - (a.founded || 0);
    if (sort === 'recent') return new Date(b.lastSeen) - new Date(a.lastSeen);
    return b.threat - a.threat;
  });

  const handleSort = (key) => {
    setSort(key);
    setCurrentSort(key);
    sfx('tap');
  };

  const handleClick = (g) => {
    sfx('tap');
    setCurrentGroup(g);
    navigate(`/card/${g.id}`);
  };

  return (
    <div className="screen active">
      <StatusBar />
      <HeaderMini page="SEARCH_RESULTS" />
      <div className="navbar">
        <div className="nbtn" onClick={() => { sfx('back'); navigate('/'); }}>
          <svg width="10" height="10" viewBox="0 0 18 18" fill="none"><path d="M2 9l7-7 7 7" stroke="#38bdf8" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/><rect x="4" y="9" width="10" height="8" rx="1.5" stroke="#38bdf8" strokeWidth="1.4"/></svg>
          <span className="nbtn-t">HOME</span>
        </div>
        <div className="nsp"></div>
        <div className="nbtn-mod" onClick={() => { sfx('tap'); navigate('/modify'); }}>
          <svg width="11" height="10" viewBox="0 0 16 14" fill="none"><line x1="1" y1="2" x2="15" y2="2" stroke="#a78bfa" strokeWidth="1.3" strokeLinecap="round"/><line x1="3" y1="7" x2="15" y2="7" stroke="#a78bfa" strokeWidth="1.3" strokeLinecap="round"/><line x1="5" y1="12" x2="15" y2="12" stroke="#a78bfa" strokeWidth="1.3" strokeLinecap="round"/></svg>
          <span className="nbtn-mod-t">FILTER</span>
        </div>
      </div>
      {selectedFilters.length > 0 && (
        <div className="query-sum">
          <div className="qs-lbl">ACTIVE_QUERY //</div>
          <div className="qs-tags">
            {selectedFilters.map((f, i) => (
              <span key={i} className={tagClass(f)}>{f}</span>
            ))}
          </div>
        </div>
      )}
      <div className="sort-bar">
        <span className="slbl">SORT:</span>
        <div className="schips">
          {[['threat', '脅威度'], ['victims', '被害数'], ['recent', '最新活動'], ['founded', '出現年']].map(([k, l]) => (
            <div key={k} className={`schip${sort === k ? ' on' : ''}`} onClick={() => handleSort(k)}>{l}</div>
          ))}
        </div>
      </div>
      <div className="res-meta-bar">
        <span className="res-cnt"><span>{sorted.length}</span> groups found</span>
        <div className="auto-badge"><div className="auto-d"></div><span className="auto-t">AUTO 5m</span></div>
      </div>
      <div className="apt-list">
        {sorted.map((g, i) => {
          const isCrit = g.status === 'critical';
          const isAct = g.status === 'active';
          const barColor = isCrit
            ? 'linear-gradient(to right,#f87171,#ef4444)'
            : isAct ? 'linear-gradient(to right,#38bdf8,#0ea5e9)'
            : 'linear-gradient(to right,#475569,#334155)';
          const rnkCls = i === 0 ? ' gold' : i === 1 ? ' silver' : i === 2 ? ' bronze' : '';
          return (
            <div
              key={g.id}
              className={`arow${isCrit ? ' crit' : ''}`}
              style={{ animationDelay: `${i * 45}ms` }}
              onClick={() => handleClick(g)}
            >
              <span className={`rnk${rnkCls}`}>{String(i + 1).padStart(2, '0')}</span>
              <div className="alogo">
                <GroupLogo groupId={g.id} groupName={g.name} size={36} imgClassName="alogo-img" fbSize={20} />
              </div>
              <div className="abody">
                <div className="atop">
                  <span className="aname">{g.name}</span>
                  {isCrit && <span className="badge bc">CRIT</span>}
                  {!isCrit && isAct && <span className="badge ba">ACT</span>}
                  {!isCrit && !isAct && <span className="badge bi">END</span>}
                </div>
                <div className="amid">
                  <span className="asec">{(g.targets || []).slice(0, 2).join('·')}</span>
                  <div className="bbar"><div className="bfill" style={{ width: g.threat + '%', background: barColor }}></div></div>
                  <span className="ascore">{g.threat}</span>
                </div>
                <div className="abtm">
                  <span className="hl">{(g.victims || 0).toLocaleString()}v</span>
                  <span>出現:{g.founded}</span>
                  <span>{g.lastSeen}</span>
                </div>
              </div>
              <span className="achev">›</span>
            </div>
          );
        })}
      </div>
      <BottomNav />
      <CreditFooter />
    </div>
  );
}
