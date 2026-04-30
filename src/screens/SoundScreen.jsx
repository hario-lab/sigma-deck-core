import { useApp } from '../context/AppContext';
import { sfx } from '../hooks/useSfx';
import { useNavigate } from 'react-router-dom';
import StatusBar from '../components/StatusBar';
import HeaderMini from '../components/HeaderMini';
import BottomNav from '../components/BottomNav';
import CreditFooter from '../components/CreditFooter';

const THEMES = [
  { id: 'digital',    ico: '📟', name: 'DIGITAL',    desc: 'デジタル合成音。高周波のsquare波とsine波を組み合わせたサイバー風サウンド。' },
  { id: 'mechanical', ico: '⌨️', name: 'MECHANICAL', desc: 'メカニカルキーボード風。ノイズ混じりのクリック音で端末操作感を演出。' },
  { id: 'dark',       ico: '💀', name: 'DARK',       desc: '低音の不気味なトーン。重く沈んだ音でダークな世界観を強調する。' },
  { id: 'ghost',      ico: '👁', name: 'GHOST',      desc: '高音域の怪奇的なトーン。フェードアウトが長く、残響が漂うような効果音。' },
  { id: 'glitch',     ico: '⛓️', name: 'GLITCH',     desc: 'グリッチ・ノイズ音。ランダム周波数が歪んで鳴る、壊れたシステム風サウンド。' },
  { id: 'silent',     ico: '🔇', name: 'SILENT',     desc: 'サウンドなし。静寂モード。' },
];

export default function SoundScreen() {
  const navigate = useNavigate();
  const { soundTheme, changeSoundTheme } = useApp();

  const handleSelect = (id) => {
    changeSoundTheme(id);
    setTimeout(() => sfx('execute', id), 50);
  };

  return (
    <div className="screen active">
      <StatusBar />
      <HeaderMini page="SOUND_CONFIG" />
      <div className="navbar">
        <div className="nbtn" onClick={() => { sfx('back'); navigate('/'); }}>
          <svg width="10" height="10" viewBox="0 0 18 18" fill="none"><path d="M2 9l7-7 7 7" stroke="#38bdf8" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/><rect x="4" y="9" width="10" height="8" rx="1.5" stroke="#38bdf8" strokeWidth="1.4"/></svg>
          <span className="nbtn-t">HOME</span>
        </div>
      </div>
      <div className="scroll-body">
        <div className="sound-wrap">
          {THEMES.map(t => (
            <div
              key={t.id}
              className={`sound-theme${soundTheme === t.id ? ' selected' : ''}`}
              onClick={() => handleSelect(t.id)}
            >
              <div className="sound-theme-ico">{t.ico}</div>
              <div className="sound-theme-info">
                <div className="sound-theme-name">{t.name}</div>
                <div className="sound-theme-desc">{t.desc}</div>
              </div>
              <div className="sound-sel">
                <div className="sound-sel-dot"></div>
              </div>
            </div>
          ))}
          <div className="sound-test-note">// 選択すると即座にテスト音が再生されます //</div>
        </div>
      </div>
      <BottomNav />
      <CreditFooter />
    </div>
  );
}
