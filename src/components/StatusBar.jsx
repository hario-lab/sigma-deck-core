import { useState, useEffect } from 'react';

export default function StatusBar() {
  const [time, setTime] = useState('');

  useEffect(() => {
    const update = () => {
      const d = new Date();
      setTime(d.getHours() + ':' + String(d.getMinutes()).padStart(2, '0'));
    };
    update();
    const t = setInterval(update, 10000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="sbar">
      <span className="sbar-t">{time}</span>
      <div className="sbar-r">
        <svg width="14" height="10" viewBox="0 0 16 12" fill="none">
          <rect x="0" y="6" width="2.5" height="6" rx=".6" fill="rgba(125,211,252,.5)"/>
          <rect x="3.5" y="4" width="2.5" height="8" rx=".6" fill="rgba(125,211,252,.5)"/>
          <rect x="7" y="2" width="2.5" height="10" rx=".6" fill="rgba(125,211,252,.5)"/>
          <rect x="10.5" y="0" width="2.5" height="12" rx=".6" fill="rgba(125,211,252,.3)"/>
        </svg>
        <svg width="20" height="10" viewBox="0 0 24 12" fill="none">
          <rect x=".5" y=".5" width="20" height="11" rx="2.5" stroke="rgba(125,211,252,.42)" strokeWidth="1"/>
          <rect x="21" y="3.5" width="2.5" height="5" rx="1" fill="rgba(125,211,252,.38)"/>
          <rect x="2" y="2" width="14" height="8" rx="1.5" fill="rgba(125,211,252,.5)"/>
        </svg>
      </div>
    </div>
  );
}
