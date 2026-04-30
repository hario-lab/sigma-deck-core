import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { sfx } from '../hooks/useSfx';
import StatusBar from '../components/StatusBar';
import HeaderFull from '../components/HeaderFull';
import BottomNav from '../components/BottomNav';
import CreditFooter from '../components/CreditFooter';
import GroupLogo from '../components/GroupLogo';

function countUp(target, delay, setter) {
  setTimeout(() => {
    let val = 0;
    const t = setInterval(() => {
      val += target / 900 * 16;
      if (val >= target) { val = target; clearInterval(t); }
      setter(Math.round(val));
    }, 16);
  }, delay);
}

export default function HomeScreen() {
  const navigate = useNavigate();
  const { groups, recentVictims, setCurrentGroup } = useApp();
  const [kpi1, setKpi1] = useState(0);
  const [kpi2, setKpi2] = useState(0);
  const [kpi3, setKpi3] = useState(0);
  const [kpi4, setKpi4] = useState(0);
  const [kdShown, setKdShown] = useState(false);

  useEffect(() => {
    const activeGroups = groups.filter(g => g.status === 'active' || g.status === 'critical').length;
    const victimsPerMonth = Math.round(groups.reduce((s, g) => s + (g.victims || 0), 0) / Math.max(groups.length, 1) * 2);
    const countries = 89;
    const dismantled = groups.filter(g => g.status === 'inactive').length;

    countUp(activeGroups || 47, 200, setKpi1);
    countUp(victimsPerMonth || 614, 300, setKpi2);
    countUp(countries, 400, setKpi3);
    countUp(dismantled || 23, 500, setKpi4);
    setTimeout(() => setKdShown(true), 1100);
  }, []);

  const critGroups = groups.filter(g => g.status === 'critical').slice(0, 3);

  const handleVictimClick = (v) => {
    sfx('tap');
    navigate('/victim', { state: { victim: v, from: '/' } });
  };

  const handleGroupClick = (id) => {
    sfx('tap');
    const g = groups.find(x => x.id === id);
    if (g) setCurrentGroup(g);
    navigate(`/card/${id}`);
  };

  return (
    <div className="screen active">
      <StatusBar />
      <HeaderFull />
      <div className="scroll-body">
        <div className="kpi-row">
          <div className="kpi">
            <div className="kpi-val red">{kpi1}</div>
            <div className="kpi-lbl">Active</div>
            {kdShown && <div className="kpi-delta">▲ +3 this month</div>}
          </div>
          <div className="kpi">
            <div className="kpi-val amber">{kpi2}</div>
            <div className="kpi-lbl">Victims/mo</div>
            {kdShown && <div className="kpi-delta">▲ +12% vs last</div>}
          </div>
          <div className="kpi">
            <div className="kpi-val">{kpi3}</div>
            <div className="kpi-lbl">Countries</div>
            {kdShown && <div className="kpi-delta">▲ +5 new</div>}
          </div>
          <div className="kpi">
            <div className="kpi-val green">{kpi4}</div>
            <div className="kpi-lbl">Dismantled</div>
          </div>
        </div>

        <hr className="sec-divider" />
        <div className="sec-hdr">
          <div className="sec-title">
            <div className="sec-bar" style={{ background: '#f87171' }}></div>
            Critical Threats
          </div>
          <span className="sec-more" onClick={() => { sfx('tap'); navigate('/results'); }}>すべて見る →</span>
        </div>
        <div className="crit-row">
          {critGroups.map(g => (
            <div key={g.id} className="ccard" onClick={() => handleGroupClick(g.id)}>
              <div className="cc-top">
                <div className="cc-logo">
                  <GroupLogo groupId={g.id} groupName={g.name} size={26} imgClassName="cc-logo-img" fbSize={16} />
                </div>
                <div className="cc-text">
                  <div className="cc-name">{g.name}</div>
                  <div className="cc-type">{g.type}</div>
                </div>
              </div>
              <div className="threat-bar-bg">
                <div className="threat-bar" style={{ width: g.threat + '%' }}></div>
              </div>
              <div className="cc-stats">
                <div className="cc-stat">Victims <span>{(g.victims || 0).toLocaleString()}</span></div>
                <div className="cc-stat">Score <span>{g.threat}</span></div>
              </div>
            </div>
          ))}
        </div>

        <hr className="sec-divider" />
        <div className="sec-hdr">
          <div className="sec-title">
            <div className="sec-bar" style={{ background: '#38bdf8' }}></div>
            Latest Victims
          </div>
          <span className="sec-more" onClick={() => { sfx('tap'); navigate('/filter'); }}>検索する →</span>
        </div>
        <div className="vfeed">
          {recentVictims.map((v, i) => (
            <div
              key={i}
              className="vfi"
              style={{ animationDelay: `${i * 80}ms` }}
              onClick={() => handleVictimClick(v)}
            >
              <div className="vfi-ico">{v.ico}</div>
              <div className="vfi-info">
                <div className="vfi-name">{v.name}</div>
                <div className="vfi-meta">{v.meta}</div>
              </div>
              <div className="vfi-right">
                <div className="vfi-group">{v.group}</div>
                <div className="vfi-date">{v.date}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <BottomNav />
      <CreditFooter />
    </div>
  );
}
