import { useEffect, useRef } from 'react';

/**
 * @typedef {Object} Particle
 * @property {number} x
 * @property {number} y
 * @property {number} originX
 * @property {number} originY
 * @property {number} vx
 * @property {number} vy
 * @property {number} radius
 * @property {number} driftPhase
 * @property {number} driftRadius
 */

const PARTICLE_COUNT = 120;
const CONNECTION_DISTANCE = 120;
const REPEL_RADIUS = 100;
const RETURN_SPEED = 0.04;
const DRIFT_RADIUS = 18;
const DRIFT_SPEED = 0.00035;

export default function ParticleSystem() {
  const canvasRef = useRef(/** @type {HTMLCanvasElement | null} */ (null));
  const mouse = useRef(/** @type {{ x: number, y: number }} */ ({ x: -9999, y: -9999 }));
  const particles = useRef(/** @type {Particle[]} */ ([]));
  const animId = useRef(/** @type {number | null} */ (null));
  
  // THE FIX: Track internal time and last frame timestamp
  const internalTime = useRef(0);
  const lastTimestamp = useRef(0);
  const isFocused = useRef(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    // Event listeners to freeze/unfreeze
    const handleFocus = () => {
      isFocused.current = true;
      lastTimestamp.current = performance.now(); // Reset the anchor point
      draw(performance.now()); 
    };
    const handleBlur = () => {
      isFocused.current = false;
      if (animId.current !== null) cancelAnimationFrame(animId.current);
    };

    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);

    // Initialize particles
    particles.current = Array.from({ length: PARTICLE_COUNT }, () => {
      const originX = Math.random() * window.innerWidth;
      const originY = Math.random() * window.innerHeight;
      const driftPhase = Math.random() * Math.PI * 2;
      const driftRadius = DRIFT_RADIUS * (0.6 + Math.random() * 0.8);

      return {
        x: originX + Math.cos(driftPhase) * driftRadius,
        y: originY + Math.sin(driftPhase * 0.85) * driftRadius,
        originX, originY, vx: 0, vy: 0,
        radius: Math.random() * 1.5 + 0.5,
        driftPhase, driftRadius,
      };
    });

    /** @param {number} now */
    const draw = (now) => {
      // 1. HARD STOP: If not focused, stop the loop entirely.
      if (!isFocused.current) return;

      // 2. TIME CALCULATION: Instead of absolute time, use delta
      if (!lastTimestamp.current) lastTimestamp.current = now;
      const deltaTime = now - lastTimestamp.current;
      lastTimestamp.current = now;
      
      // Increment internal clock only when focused
      internalTime.current += deltaTime;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const mx = mouse.current.x;
      const my = mouse.current.y;

      for (const p of particles.current) {
        // Use internalTime instead of performance.now()
        const driftAngle = internalTime.current * DRIFT_SPEED + p.driftPhase;
        const targetX = p.originX + Math.cos(driftAngle) * p.driftRadius;
        const targetY = p.originY + Math.sin(driftAngle * 0.85) * p.driftRadius;

        p.vx += (targetX - p.x) * RETURN_SPEED;
        p.vy += (targetY - p.y) * RETURN_SPEED;
        p.vx *= 0.96;
        p.vy *= 0.96;
        p.x += p.vx;
        p.y += p.vy;
      }

      // --- Drawing Logic (Same as before) ---
      for (let i = 0; i < particles.current.length; i++) {
        for (let j = i + 1; j < particles.current.length; j++) {
          const a = particles.current[i];
          const b = particles.current[j];
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < CONNECTION_DISTANCE) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(46, 123, 255, ${(1 - dist / CONNECTION_DISTANCE) * 0.35})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      for (const p of particles.current) {
        const distToMouse = Math.hypot(p.x - mx, p.y - my);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = distToMouse < REPEL_RADIUS * 1.5 ? '#00f5ff' : 'rgba(46, 123, 255, 0.7)';
        ctx.fill();
      }

      animId.current = requestAnimationFrame(draw);
    };

    // Initialize the loop
    lastTimestamp.current = performance.now();
    animId.current = requestAnimationFrame(draw);

    /** @param {MouseEvent} e */
    const handleMouseMove = (e) => { mouse.current = { x: e.clientX, y: e.clientY }; };
    const handleMouseLeave = () => { mouse.current = { x: -9999, y: -9999 }; };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      if (animId.current !== null) cancelAnimationFrame(animId.current);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-10" />;
}