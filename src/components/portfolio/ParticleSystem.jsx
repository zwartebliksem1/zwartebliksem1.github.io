import { useEffect, useRef } from 'react';

const PARTICLE_COUNT = 120;
const CONNECTION_DISTANCE = 120;
const REPEL_RADIUS = 100;
const RETURN_SPEED = 0.04;
const DRIFT_RADIUS = 18;
const DRIFT_SPEED = 0.00035;

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

export default function ParticleSystem() {
  const canvasRef = useRef(/** @type {HTMLCanvasElement | null} */ (null));
  const mouse = useRef({ x: -9999, y: -9999 });
  const particles = useRef(/** @type {Particle[]} */ ([]));
  const animId = useRef(/** @type {number | null} */ (null));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const animationStart = performance.now();

    // Initialize particles
    particles.current = Array.from({ length: PARTICLE_COUNT }, () => {
      const originX = Math.random() * window.innerWidth;
      const originY = Math.random() * window.innerHeight;
      const driftPhase = Math.random() * Math.PI * 2;
      const driftRadius = DRIFT_RADIUS * (0.6 + Math.random() * 0.8);

      return {
        x: originX + Math.cos(driftPhase) * driftRadius,
        y: originY + Math.sin(driftPhase * 0.85) * driftRadius,
        originX,
        originY,
        vx: 0,
        vy: 0,
        radius: Math.random() * 1.5 + 0.5,
        driftPhase,
        driftRadius,
      };
    });

    const handleMouseMove = (/** @type {MouseEvent} */ e) => {
      mouse.current = { x: e.clientX, y: e.clientY };
    };
    const handleMouseLeave = () => {
      mouse.current = { x: -9999, y: -9999 };
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const mx = mouse.current.x;
      const my = mouse.current.y;
      const elapsed = performance.now() - animationStart;

      // Update particles
      for (const p of particles.current) {
        const driftAngle = elapsed * DRIFT_SPEED + p.driftPhase;
        const targetX = p.originX + Math.cos(driftAngle) * p.driftRadius;
        const targetY = p.originY + Math.sin(driftAngle * 0.85) * p.driftRadius;

        // Pull particles through a slow idle drift path even without interaction.
        p.vx += (targetX - p.x) * RETURN_SPEED;
        p.vy += (targetY - p.y) * RETURN_SPEED;

        // Dampen velocity
        p.vx *= 0.96;
        p.vy *= 0.96;

        p.x += p.vx;
        p.y += p.vy;

        // Clamp particles within bounds to prevent edge flicker
        p.x = Math.max(0, Math.min(canvas.width, p.x));
        p.y = Math.max(0, Math.min(canvas.height, p.y));
      }

      // Draw connections
      for (let i = 0; i < particles.current.length; i++) {
        for (let j = i + 1; j < particles.current.length; j++) {
          const a = particles.current[i];
          const b = particles.current[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < CONNECTION_DISTANCE) {
            const alpha = (1 - dist / CONNECTION_DISTANCE) * 0.35;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(46, 123, 255, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      // Draw particles
      for (const p of particles.current) {
        const dx = p.x - mx;
        const dy = p.y - my;
        const distToMouse = Math.sqrt(dx * dx + dy * dy);
        const isNearMouse = distToMouse < REPEL_RADIUS * 1.5;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = isNearMouse
          ? `rgba(0, 245, 255, ${0.6 + (1 - distToMouse / (REPEL_RADIUS * 1.5)) * 0.4})`
          : 'rgba(46, 123, 255, 0.7)';
        ctx.fill();
      }

      animId.current = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      if (animId.current !== null) {
        cancelAnimationFrame(animId.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-10"
    />
  );
}