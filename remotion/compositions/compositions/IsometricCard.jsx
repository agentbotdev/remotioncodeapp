import React from 'react';
import {AbsoluteFill, useCurrentFrame, interpolate, random} from 'remotion';
import {fonts} from '../fonts.js';

export const IsometricCard = ({
  title = 'PREMIUM',
  subtitle = 'Next Level Design',
  accentColor = '#6c5ce7',
  rotationIntensity = 0.5,
}) => {
  const frame = useCurrentFrame();

  // Entry: scale + rotation reveal (frames 0-30)
  const entryProgress = interpolate(frame, [0, 30], [0, 1], {
    extrapolateRight: 'clamp',
    extrapolateLeft: 'clamp',
  });

  const entryScale = interpolate(entryProgress, [0, 1], [0.6, 1]);
  const entryOpacity = interpolate(entryProgress, [0, 1], [0, 1]);

  // Continuous subtle rotation (frames 30-60)
  const rotateY = interpolate(
    frame,
    [0, 30, 60, 90],
    [-25 * rotationIntensity, -15 * rotationIntensity, -10 * rotationIntensity, -20 * rotationIntensity],
    {extrapolateRight: 'clamp', extrapolateLeft: 'clamp'}
  );
  const rotateX = interpolate(
    frame,
    [0, 30, 60, 90],
    [25 * rotationIntensity, 20 * rotationIntensity, 15 * rotationIntensity, 25 * rotationIntensity],
    {extrapolateRight: 'clamp', extrapolateLeft: 'clamp'}
  );

  // Exit blur (frames 70-90)
  const exitBlur = interpolate(frame, [70, 90], [0, 12], {
    extrapolateRight: 'clamp',
    extrapolateLeft: 'clamp',
  });
  const exitOpacity = interpolate(frame, [70, 90], [1, 0], {
    extrapolateRight: 'clamp',
    extrapolateLeft: 'clamp',
  });

  // Glow pulse
  const glowIntensity = interpolate(
    Math.sin(frame * 0.08),
    [-1, 1],
    [15, 35]
  );

  // Floating particles around the card
  const particles = Array.from({length: 15}).map((_, i) => {
    const angle = (i / 15) * Math.PI * 2 + frame * 0.015;
    const radius = 280 + Math.sin(frame * 0.04 + i) * 40;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius * 0.5; // squashed for perspective
    const size = 2 + random(`iso-p-${i}`) * 3;
    const particleOpacity = 0.2 + Math.sin(frame * 0.06 + i * 0.8) * 0.15;
    return (
      <div
        key={i}
        style={{
          position: 'absolute',
          left: `calc(50% + ${x}px)`,
          top: `calc(50% + ${y}px)`,
          width: size,
          height: size,
          borderRadius: '50%',
          backgroundColor: accentColor,
          opacity: particleOpacity * entryProgress,
          filter: 'blur(1px)',
        }}
      />
    );
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#0a0a0a',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {/* Ambient glow behind card */}
      <div
        style={{
          position: 'absolute',
          width: 500,
          height: 500,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${accentColor}22 0%, transparent 70%)`,
          filter: 'blur(60px)',
          opacity: entryProgress,
        }}
      />

      {/* Floating particles */}
      {particles}

      {/* Card container */}
      <div
        style={{
          transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${entryScale})`,
          opacity: entryOpacity * exitOpacity,
          filter: `blur(${exitBlur}px)`,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Card */}
        <div
          style={{
            width: 550,
            height: 700,
            borderRadius: 24,
            background: `linear-gradient(145deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)`,
            border: `1px solid ${accentColor}44`,
            boxShadow: `
              0 ${glowIntensity}px ${glowIntensity * 2}px rgba(0,0,0,0.6),
              0 0 ${glowIntensity}px ${accentColor}33,
              inset 0 1px 0 rgba(255,255,255,0.08)
            `,
            padding: 50,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Top accent line */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 3,
              background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`,
              opacity: 0.8,
            }}
          />

          {/* Glass reflection */}
          <div
            style={{
              position: 'absolute',
              top: -100,
              left: -50,
              width: 300,
              height: 600,
              background: 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 50%)',
              transform: `rotate(25deg) translateX(${frame * 0.5}px)`,
              pointerEvents: 'none',
            }}
          />

          {/* Content */}
          <div>
            {/* Icon placeholder - geometric shape */}
            <div
              style={{
                width: 60,
                height: 60,
                borderRadius: 16,
                background: `linear-gradient(135deg, ${accentColor}, ${accentColor}88)`,
                marginBottom: 40,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                boxShadow: `0 0 20px ${accentColor}44`,
              }}
            >
              <div
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 6,
                  border: '2px solid rgba(255,255,255,0.8)',
                  transform: 'rotate(45deg)',
                }}
              />
            </div>

            <h1
              style={{
                fontSize: 72,
                fontWeight: 900,
                color: '#ffffff',
                fontFamily: fonts.spaceGrotesk,
                letterSpacing: -2,
                margin: 0,
                lineHeight: 1,
              }}
            >
              {title}
            </h1>

            <p
              style={{
                fontSize: 28,
                color: '#888899',
                fontFamily: fonts.inter,
                marginTop: 16,
                fontWeight: 300,
              }}
            >
              {subtitle}
            </p>
          </div>

          {/* Bottom section */}
          <div>
            {/* Stats bar */}
            <div style={{display: 'flex', gap: 30, marginBottom: 30}}>
              {['98%', '4.9', '12K'].map((stat, i) => {
                const statDelay = 35 + i * 8;
                const statOpacity = interpolate(frame, [statDelay, statDelay + 10], [0, 1], {
                  extrapolateRight: 'clamp',
                  extrapolateLeft: 'clamp',
                });
                return (
                  <div key={i} style={{opacity: statOpacity}}>
                    <div style={{fontSize: 32, fontWeight: 900, color: accentColor, fontFamily: 'Arial Black, sans-serif'}}>
                      {stat}
                    </div>
                    <div style={{fontSize: 14, color: '#555566', fontFamily: 'Arial, sans-serif', marginTop: 4}}>
                      {['Success', 'Rating', 'Users'][i]}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* CTA button */}
            <div
              style={{
                padding: '18px 40px',
                background: `linear-gradient(135deg, ${accentColor}, ${accentColor}cc)`,
                borderRadius: 12,
                textAlign: 'center',
                fontSize: 22,
                fontWeight: 700,
                color: '#ffffff',
                fontFamily: fonts.inter,
                boxShadow: `0 4px 20px ${accentColor}44`,
              }}
            >
              GET STARTED
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
