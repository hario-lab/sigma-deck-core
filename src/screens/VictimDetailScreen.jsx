import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { sfx } from '../hooks/useSfx';
import { getFallbackIco } from '../data/groups';
import StatusBar from '../components/StatusBar';
import HeaderMini from '../components/HeaderMini';
import CreditFooter from '../components/CreditFooter';

export default function VictimDetailScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { groups, setCurrentGroup } = useApp();
  const victim = location.state?.victim || {};
  const from = location.state?.from || '/';

  const groupId = victim.groupId || null;

  const handleGroupClick = () => {
    if (!groupId) return;
    sfx('tap');
    console.log('groupId渡す値:', groupId);
    console.log('GROUPSのid一覧:', groups.map(g => g.id));
    const g = groups.find(x => x.id === groupId);
    if (g) setCurrentGroup(g);
    navigate(`/card/${groupId}`);
  };

  const groupIco = groupId ? getFallbackIco(groupId, null, 'active') : '⛓️';

  return (
    <div className="screen active">
      <StatusBar />
      <HeaderMini page="VICTIM_DETAIL" />
      <div className="navbar">
        <div className="nbtn" onClick={() => { sfx('back'); navigate(from); }}>
          <svg width="8" height="12" viewBox="0 0 8 14" fill="none"><path d="M7 1L1 7l6 6" stroke="#38bdf8" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
          <span className="nbtn-t">BACK</span>
        </div>
        <div className="nbtn" onClick={() => { sfx('back'); navigate('/'); }}>
          <svg width="10" height="10" viewBox="0 0 18 18" fill="none"><path d="M2 9l7-7 7 7" stroke="#38bdf8" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/><rect x="4" y="9" width="10" height="8" rx="1.5" stroke="#38bdf8" strokeWidth="1.4"/></svg>
          <span className="nbtn-t">HOME</span>
        </div>
      </div>
      <div className="scroll-body">
        <div className="vd-hero">
          <div className="vd-top">
            <div className="vd-ico-big">{victim.ico || '🏢'}</div>
            <div>
              <div className="vd-company">{victim.name || victim.co || '—'}</div>
              <div className="vd-country">{victim.meta || victim.loc || victim.country || '—'}</div>
            </div>
          </div>
        </div>
        <div className="vd-divider"></div>
        <div className="vd-meta-grid">
          <div className="vd-meta-cell"><div className="vd-meta-lbl">ATTACK DATE</div><div className="vd-meta-val">{victim.date || '—'}</div></div>
          <div className="vd-meta-cell"><div className="vd-meta-lbl">STATUS</div><div className="vd-meta-val">{victim.status || '—'}</div></div>
          <div className="vd-meta-cell"><div className="vd-meta-lbl">DAMAGE TYPE</div><div className="vd-meta-val">{victim.damage || 'データ暗号化・窃取'}</div></div>
          <div className="vd-meta-cell"><div className="vd-meta-lbl">DATA SIZE</div><div className="vd-meta-val">{victim.size || '—'}</div></div>
        </div>
        <div className="vd-divider" style={{ marginTop: 8 }}></div>
        <div className="vd-section">
          <div className="vd-sec-lbl">INCIDENT SUMMARY</div>
          <div className="vd-desc">{victim.desc || '詳細情報はransomware.liveで確認できます。'}</div>
        </div>
        <div className="vd-divider"></div>
        <div className="vd-section" style={{ paddingBottom: 4 }}><div className="vd-sec-lbl">THREAT ACTOR</div></div>
        <div
          className="vd-group-btn"
          onClick={handleGroupClick}
          style={{ opacity: groupId ? 1 : 0.4, pointerEvents: groupId ? 'auto' : 'none' }}
        >
          <div className="vd-group-ico">{groupIco}</div>
          <div>
            <div className="vd-group-name">{victim.group || '—'}</div>
            <div className="vd-group-sub">タップしてグループカードを表示</div>
          </div>
          <div className="vd-group-arr">›</div>
        </div>
      </div>
      <CreditFooter />
    </div>
  );
}
