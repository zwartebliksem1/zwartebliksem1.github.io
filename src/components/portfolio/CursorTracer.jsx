import { useEffect, useRef } from 'react';

export default function CursorTracer() {
  const canvasRef = useRef(null);
  const mouse = useRef({ x: 0, y: 0 });
  const trails = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const handleMove = (e) => {
      mouse.current = { x: e.clientX, y: e.clientY };
      trails.current.push({ x: e.clientX, y: e.clientY, life: 1 });
      if (trails.current.length > 50) trails.current.shift();
    };
    window.addEventListener('mousemove', handleMove);

    let animId;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      for (let i = 1; i < trails.current.length; i++) {
        const t = trails.current[i];
        const prev = trails.current[i - 1];
        t.life -= 0.015;
        if (t.life <= 0) continue;

        ctx.beginPath();
        ctx.moveTo(prev.x, prev.y);
        ctx.lineTo(t.x, t.y);
        ctx.strokeStyle = `rgba(46, 123, 255, ${t.life * 0.4})`;
        ctx.lineWidth = t.life * 2;
        ctx.stroke();
      }

      trails.current = trails.current.filter(t => t.life > 0);

      // Cursor glow
      const gradient = ctx.createRadialGradient(
        mouse.current.x, mouse.current.y, 0,
        mouse.current.x, mouse.current.y, 80
      );
      gradient.addColorStop(0, 'rgba(0, 245, 255, 0.08)');
      gradient.addColorStop(1, 'rgba(0, 245, 255, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(mouse.current.x - 80, mouse.current.y - 80, 160, 160);

      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50"
      style={{ mixBlendMode: 'screen' }}
    />
  );
}