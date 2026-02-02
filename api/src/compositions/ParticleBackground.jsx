import React, {useRef, useEffect} from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig, random} from 'remotion';

export const ParticleBackground = ({
  particleCount = 80,
  color = '#00ff88',
  connectionDistance = 120,
  speed = 1,
  showContent = true,
  title = 'CONNECTED',
  subtitle = 'Everything is linked',
}) => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const canvasRef = useRef(null);

  // Generate deterministic particle positions based on frame
  const particles = React.useMemo(() => {
    return Array.from({length: particleCount}).map((_, i) => {
      const baseX = random(`px-${i}`) * width;
      const baseY = random(`py-${i}`) * height;
      const vx = (random(`pvx-${i}`) - 0.5) * 2 * speed;
      const vy = (random(`pvy-${i}`) - 0.5) * 2 * speed;
      const size = 1.5 + random(`ps-${i}`) * 3;
      return {baseX, baseY, vx, vy, size};
    });
  }, [particleCount, width, height, speed]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, width, height);

    // Calculate positions for current frame
    const positions = particles.map((p) => {
      const x = (p.baseX + p.vx * frame + width) % width;
      const y = (p.baseY + p.vy * frame + height) % height;
      return {x, y, size: p.size};
    });

    // Draw connections first (behind particles)
    ctx.lineWidth = 0.5;
    for (let i = 0; i < positions.length; i++) {
      for (let j = i + 1; j < positions.length; j++) {
        const dx = positions[i].x - positions[j].x;
        const dy = positions[i].y - positions[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < connectionDistance) {
          const opacity = (1 - dist / connectionDistance) * 0.3;
          ctx.strokeStyle = `${color}${Math.floor(opacity * 255).toString(16).padStart(2, '0')}`;
          ctx.beginPath();
          ctx.moveTo(positions[i].x, positions[i].y);
          ctx.lineTo(positions[j].x, positions[j].y);
          ctx.stroke();
        }
      }
    }

    // Draw particles
    positions.forEach((p) => {
      // Glow
      const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 4);
      gradient.addColorStop(0, `${color}44`);
      gradient.addColorStop(1, 'transparent');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * 4, 0, Math.PI * 2);
      ctx.fill();

      // Core
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    });
  }, [frame, particles, width, height, color, connectionDistance]);

  // Text fade in
  const textOpacity = React.useMemo(() => {
    const fadeIn = Math.min(1, Math.max(0, (frame - 15) / 15));
    const fadeOut = Math.min(1, Math.max(0, (90 - frame) / 15));
    return fadeIn * fadeOut;
  }, [frame]);

  return (
    <AbsoluteFill style={{backgroundColor: '#050510'}}>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        style={{position: 'absolute', top: 0, left: 0}}
      />

      {showContent && (
        <AbsoluteFill
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            opacity: textOpacity,
          }}
        >
          <h1
            style={{
              fontSize: 100,
              fontWeight: 900,
              color: '#ffffff',
              fontFamily: 'Arial Black, sans-serif',
              letterSpacing: -3,
              textAlign: 'center',
              textShadow: `0 0 40px ${color}44, 0 0 80px ${color}22`,
              margin: 0,
            }}
          >
            {title}
          </h1>
          <p
            style={{
              fontSize: 32,
              color: `${color}aa`,
              fontFamily: 'Arial, sans-serif',
              marginTop: 20,
              fontWeight: 300,
            }}
          >
            {subtitle}
          </p>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
