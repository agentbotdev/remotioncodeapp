import React from 'react';
import {AbsoluteFill, useCurrentFrame, interpolate, random} from 'remotion';
import {fonts} from '../fonts.js';

export const GlassmorphismCard = ({
  title = 'CLARITY',
  subtitle = 'See through the noise',
  accentColor = '#a78bfa',
  stats = ['10K+', '99.9%', '24/7'],
  statLabels = ['Users', 'Uptime', 'Support'],
}) => {
  const frame = useCurrentFrame();

  // Card entry
  const cardY = interpolate(frame, [0, 25], [120, 0], {
    extrapolateRight: 'clamp',
    extrapolateLeft: 'clamp',
  });
  const cardOpacity = interpolate(frame, [0, 25], [0, 1], {
    extrapolateRight: 'clamp',
    extrapolateLeft: 'clamp',
  });

  // Exit
  const exitOpacity = interpolate(frame, [110, 130], [1, 0], {
    extrapolateRight: 'clamp',
    extrapolateLeft: 'clamp',
  });
  const exitBlur = interpolate(frame, [110, 130], [0, 10], {
    extrapolateRight: 'clamp',
    extrapolateLeft: 'clamp',
  });

  // Floating orbs (background blobs for the glass effect)
  const orbs = [
    {x: 300, y: 700, size: 350, color: accentColor, speed: 0.015},
    {x: 750, y: 1100, size: 280, color: '#ff6b6b', speed: 0.02},
    {x: 500, y: 1400, size: 300, color: '#48dbfb', speed: 0.012},
  ];

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#0a0a12',
        opacity: exitOpacity,
        filter: `blur(${exitBlur}px)`,
      }}
    >
      {/* Animated background orbs */}
      {orbs.map((orb, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: orb.x + Math.sin(frame * orb.speed + i * 2) * 80,
            top: orb.y + Math.cos(frame * orb.speed + i) * 60,
            width: orb.size,
            height: orb.size,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${orb.color}40 0%, transparent 70%)`,
            filter: 'blur(60px)',
          }}
        />
      ))}

      {/* Glass card */}
      <AbsoluteFill
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          opacity: cardOpacity,
          transform: `translateY(${cardY}px)`,
        }}
      >
        <div
          style={{
            width: 650,
            padding: 60,
            background: 'rgba(255, 255, 255, 0.04)',
            borderRadius: 28,
            border: '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255,255,255,0.06)',
          }}
        >
          {/* Accent dot */}
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              backgroundColor: accentColor,
              boxShadow: `0 0 15px ${accentColor}88`,
              marginBottom: 35,
            }}
          />

          {/* Title */}
          <h2
            style={{
              fontSize: 70,
              fontWeight: 800,
              fontFamily: fonts.syne,
              color: '#ffffff',
              margin: 0,
              letterSpacing: -2,
              lineHeight: 1,
            }}
          >
            {title}
          </h2>

          {/* Subtitle */}
          <p
            style={{
              fontSize: 26,
              fontFamily: fonts.inter,
              color: 'rgba(255, 255, 255, 0.5)',
              marginTop: 16,
              fontWeight: 400,
              lineHeight: 1.4,
            }}
          >
            {subtitle}
          </p>

          {/* Divider */}
          <div
            style={{
              width: '100%',
              height: 1,
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
              margin: '35px 0',
            }}
          />

          {/* Stats row */}
          <div style={{display: 'flex', justifyContent: 'space-between'}}>
            {stats.map((stat, i) => {
              const statDelay = 30 + i * 10;
              const statOpacity = interpolate(frame, [statDelay, statDelay + 12], [0, 1], {
                extrapolateRight: 'clamp',
                extrapolateLeft: 'clamp',
              });
              const statY = interpolate(frame, [statDelay, statDelay + 12], [20, 0], {
                extrapolateRight: 'clamp',
                extrapolateLeft: 'clamp',
              });
              return (
                <div
                  key={i}
                  style={{
                    opacity: statOpacity,
                    transform: `translateY(${statY}px)`,
                    textAlign: 'center',
                    flex: 1,
                  }}
                >
                  <div
                    style={{
                      fontSize: 36,
                      fontWeight: 700,
                      color: accentColor,
                      fontFamily: fonts.spaceGrotesk,
                    }}
                  >
                    {stat}
                  </div>
                  <div
                    style={{
                      fontSize: 16,
                      color: 'rgba(255,255,255,0.35)',
                      fontFamily: fonts.inter,
                      marginTop: 6,
                      textTransform: 'uppercase',
                      letterSpacing: 2,
                    }}
                  >
                    {statLabels[i]}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
