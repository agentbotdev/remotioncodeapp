import React from 'react';
import {AbsoluteFill, useCurrentFrame, interpolate} from 'remotion';
import {fonts} from '../fonts.js';

export const NeonGlowText = ({
  text = 'NEON',
  color = '#00ff88',
  subtitle = 'glow in the dark',
  flickerEnabled = true,
}) => {
  const frame = useCurrentFrame();

  // Entry animation
  const entryScale = interpolate(frame, [0, 20], [0.9, 1], {
    extrapolateRight: 'clamp',
    extrapolateLeft: 'clamp',
  });
  const entryOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: 'clamp',
    extrapolateLeft: 'clamp',
  });

  // Neon flicker effect (subtle random intensity)
  const flickerBase = flickerEnabled
    ? 0.85 + Math.sin(frame * 0.7) * 0.05 + Math.sin(frame * 1.3) * 0.05 + Math.sin(frame * 3.7) * 0.03
    : 1;

  // Glow pulse (slower, broader)
  const glowPulse = interpolate(
    Math.sin(frame * 0.06),
    [-1, 1],
    [30, 55]
  );

  // Scanline moving down
  const scanlineY = (frame * 8) % 1920;

  // Subtitle fade
  const subtitleOpacity = interpolate(frame, [25, 40], [0, 0.6], {
    extrapolateRight: 'clamp',
    extrapolateLeft: 'clamp',
  });

  // Exit
  const exitOpacity = interpolate(frame, [75, 90], [1, 0], {
    extrapolateRight: 'clamp',
    extrapolateLeft: 'clamp',
  });

  // Power-on flash at the start
  const powerFlash = interpolate(frame, [8, 12, 16], [0, 0.4, 0], {
    extrapolateRight: 'clamp',
    extrapolateLeft: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#050510',
        justifyContent: 'center',
        alignItems: 'center',
        opacity: exitOpacity,
      }}
    >
      {/* Ambient glow on background */}
      <div
        style={{
          position: 'absolute',
          width: 700,
          height: 400,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${color}18 0%, transparent 70%)`,
          filter: 'blur(40px)',
          opacity: flickerBase,
        }}
      />

      {/* Power-on flash overlay */}
      <AbsoluteFill
        style={{
          backgroundColor: color,
          opacity: powerFlash,
          mixBlendMode: 'screen',
        }}
      />

      {/* Scanline */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: scanlineY,
          height: 2,
          background: `linear-gradient(90deg, transparent, ${color}15, transparent)`,
          pointerEvents: 'none',
        }}
      />

      {/* Main neon text */}
      <div
        style={{
          transform: `scale(${entryScale})`,
          opacity: entryOpacity * flickerBase,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <h1
          style={{
            fontSize: 140,
            fontWeight: 800,
            fontFamily: fonts.syne,
            color: color,
            textShadow: `
              0 0 ${glowPulse * 0.3}px ${color},
              0 0 ${glowPulse * 0.6}px ${color},
              0 0 ${glowPulse}px ${color},
              0 0 ${glowPulse * 1.5}px ${color}88,
              0 0 ${glowPulse * 2.5}px ${color}44
            `,
            letterSpacing: 12,
            margin: 0,
            textAlign: 'center',
            padding: '0 40px',
          }}
        >
          {text}
        </h1>

        {/* Reflection underneath */}
        <h1
          style={{
            fontSize: 140,
            fontWeight: 800,
            fontFamily: fonts.syne,
            color: color,
            textShadow: `0 0 ${glowPulse * 0.5}px ${color}`,
            letterSpacing: 12,
            margin: 0,
            textAlign: 'center',
            padding: '0 40px',
            transform: 'scaleY(-0.3) translateY(-80px)',
            opacity: 0.15,
            filter: 'blur(3px)',
            maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, transparent 100%)',
          }}
        >
          {text}
        </h1>

        {/* Subtitle */}
        <p
          style={{
            fontSize: 28,
            fontFamily: fonts.inter,
            color: 'rgba(255,255,255,0.4)',
            marginTop: 20,
            letterSpacing: 6,
            textTransform: 'uppercase',
            opacity: subtitleOpacity,
          }}
        >
          {subtitle}
        </p>
      </div>

      {/* CRT-style vignette */}
      <AbsoluteFill
        style={{
          background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.5) 100%)',
          pointerEvents: 'none',
        }}
      />
    </AbsoluteFill>
  );
};
