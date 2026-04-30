import { useEffect, useRef } from 'react';

export default function BackgroundCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const cv = canvasRef.current;
    const phone = cv.parentElement;
    const ctx = cv.getContext('2d');
    let ns = [], ls = [], W, H, rafId, intervalId;

    function resize() {
      W = cv.width = phone.offsetWidth;
      H = cv.height = phone.offsetHeight;
    }
    function makeNodes() {
      ns = [];
      for (let i = 0; i < 20; i++)
        ns.push({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .1, vy: (Math.random() - .5) * .1, r: Math.random() * .7 + .25, p: Math.random() * Math.PI * 2 });
    }
    function spawnLine() {
      if (ns.length < 2) return;
      const a = Math.random() * ns.length | 0;
      let b = Math.random() * ns.length | 0;
      if (a === b) return;
      const crit = Math.random() < .2;
      ls.push({ a, b, t: 0, s: .005 + Math.random() * .004, col: crit ? 'rgba(251,191,36,' : 'rgba(56,189,248,', done: false });
    }
    function draw() {
      ctx.clearRect(0, 0, W, H);
      const now = Date.now() * .001;
      ns.forEach(n => {
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > W) n.vx *= -1;
        if (n.y < 0 || n.y > H) n.vy *= -1;
        ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(56,189,248,' + (0.08 + .05 * Math.sin(now + n.p)) + ')';
        ctx.fill();
      });
      for (let i = 0; i < ns.length; i++)
        for (let j = i + 1; j < ns.length; j++) {
          const dx = ns[i].x - ns[j].x, dy = ns[i].y - ns[j].y, d = Math.sqrt(dx * dx + dy * dy);
          if (d < 68) {
            ctx.beginPath(); ctx.moveTo(ns[i].x, ns[i].y); ctx.lineTo(ns[j].x, ns[j].y);
            ctx.strokeStyle = 'rgba(56,189,248,' + (0.013 * (1 - d / 68)) + ')';
            ctx.lineWidth = .4; ctx.stroke();
          }
        }
      ls = ls.filter(l => {
        if (l.done) return false;
        l.t += l.s;
        if (l.t >= 1) { l.done = true; return false; }
        const a = ns[l.a], b = ns[l.b], cx2 = (a.x + b.x) / 2, cy2 = (a.y + b.y) / 2 - 18, p = l.t;
        const ex = (1 - p) * (1 - p) * a.x + 2 * (1 - p) * p * cx2 + p * p * b.x;
        const ey = (1 - p) * (1 - p) * a.y + 2 * (1 - p) * p * cy2 + p * p * b.y;
        const f = p < .1 ? p * 10 : p > .85 ? (1 - p) / .15 : 1;
        ctx.beginPath(); ctx.arc(ex, ey, 1.4, 0, Math.PI * 2);
        ctx.fillStyle = l.col + (f * .45) + ')';
        ctx.shadowBlur = 5; ctx.shadowColor = l.col + '0.3)';
        ctx.fill(); ctx.shadowBlur = 0;
        return true;
      });
      rafId = requestAnimationFrame(draw);
    }
    resize(); makeNodes(); draw();
    intervalId = setInterval(spawnLine, 750);
    window.addEventListener('resize', () => { resize(); makeNodes(); });
    return () => {
      cancelAnimationFrame(rafId);
      clearInterval(intervalId);
    };
  }, []);

  return <canvas ref={canvasRef} id="bgCanvas" />;
}
