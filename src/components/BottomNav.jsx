import { useNavigate, useLocation } from 'react-router-dom';
import { sfx } from '../hooks/useSfx';

const TABS = [
  { ico: '🏠', lbl: 'HOME', path: '/' },
  { ico: '🔍', lbl: 'SEARCH', path: '/filter' },
  { ico: '📋', lbl: 'GROUPS', path: '/results' },
  { ico: '🔊', lbl: 'SOUND', path: '/sound' },
];

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const getActive = (path) => {
    if (path === '/') return location.pathname === '/';
    if (path === '/filter') return location.pathname === '/filter' || location.pathname === '/modify';
    if (path === '/results') return location.pathname === '/results' || location.pathname.startsWith('/card');
    if (path === '/sound') return location.pathname === '/sound';
    return false;
  };

  return (
    <div className="bottom-nav">
      {TABS.map(tab => (
        <div
          key={tab.path}
          className={`bnav-item${getActive(tab.path) ? ' active' : ''}`}
          onClick={() => { sfx('tap'); navigate(tab.path); }}
        >
          <div className="bnav-ico">{tab.ico}</div>
          <div className="bnav-lbl">{tab.lbl}</div>
        </div>
      ))}
    </div>
  );
}
