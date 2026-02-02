import React from 'react';
import {AbsoluteFill, useCurrentFrame, interpolate, random} from 'remotion';
import {fonts} from '../fonts.js';

const BentoCell = ({
  children,
  delay,
  frame,
  gradient,
  gridColumn,
  gridRow,
}) => {
  const cellOpacity = interpolate(frame, [delay, delay + 15], [0, 1], {
    extrapolateRight: 'clamp',
    extrapolateLeft: 'clamp',
  });
  const cellScale = interpolate(frame, [delay, delay + 15], [0.9, 1], {
    extrapolateRight: 'clamp',
    extrapolateLeft: 'clamp',
  });

  return (
    <div
      style={{
        gridColumn,
        gridRow,
        background: gradient,
        borderRadius: 24,
        padding: 35,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        opacity: cellOpacity,
        transform: `scale(${cellScale})`,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Subtle noise overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0,0,0,0.15)',
          borderRadius: 24,
          pointerEvents: 'none',
        }}
      />
      <div style={{position: 'relative', zIndex: 1}}>{children}</div>
    </div>
  );
};

export const BentoGrid = ({
  title = 'FEATURES',
  items = [
    {label: 'Analytics', value: '10x faster', icon: 'chart'},
    {label: 'Security', value: 'Enterprise', icon: 'shield'},
    {label: 'Scale', value: 'Unlimited', icon: 'rocket'},
    {label: 'AI Powered', value: 'GPT-4 Built In', icon: 'brain'},
    {label: 'Global CDN', value: '99.99% Uptime', icon: 'globe'},
  ],
}) => {
  const frame = useCurrentFrame();

  // Title entry
  const titleOpacity = interpolate(frame, [0, 18], [0, 1], {
    extrapolateRight: 'clamp',
    extrapolateLeft: 'clamp',
  });
  const titleY = interpolate(frame, [0, 18], [40, 0], {
    extrapolateRight: 'clamp',
    extrapolateLeft: 'clamp',
  });

  // Exit
  const exitOpacity = interpolate(frame, [110, 130], [1, 0], {
    extrapolateRight: 'clamp',
    extrapolateLeft: 'clamp',
  });

  const gradients = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
    'linear-gradient(135deg, #0f3460 0%, #16213e 100%)',
    'linear-gradient(135deg, #f093fb22 0%, #f5576c22 100%)',
    'linear-gradient(135deg, #43e97b22 0%, #38f9d722 100%)',
  ];

  const gridConfigs = [
    {gridColumn: 'span 2', gridRow: 'span 1'},
    {gridColumn: 'span 1', gridRow: 'span 1'},
    {gridColumn: 'span 1', gridRow: 'span 1'},
    {gridColumn: 'span 2', gridRow: 'span 1'},
  ];

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#08080f',
        padding: 50,
        opacity: exitOpacity,
      }}
    >
      {/* Title */}
      <div
        style={{
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
          marginBottom: 40,
        }}
      >
        <h1
          style={{
            fontSize: 80,
            fontWeight: 900,
            color: '#ffffff',
            fontFamily: fonts.montserrat,
            letterSpacing: -3,
            margin: 0,
          }}
        >
          {title}
        </h1>
      </div>

      {/* Bento grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gridAutoRows: 'minmax(280px, auto)',
          gap: 18,
          flex: 1,
        }}
      >
        {items.slice(0, 4).map((item, i) => (
          <BentoCell
            key={i}
            delay={10 + i * 8}
            frame={frame}
            gradient={gradients[i]}
            gridColumn={gridConfigs[i].gridColumn}
            gridRow={gridConfigs[i].gridRow}
          >
            <div
              style={{
                fontSize: 18,
                color: 'rgba(255,255,255,0.5)',
                fontFamily: fonts.inter,
                textTransform: 'uppercase',
                letterSpacing: 3,
                marginBottom: 8,
              }}
            >
              {item.label}
            </div>
            <div
              style={{
                fontSize: 36,
                fontWeight: 700,
                color: '#ffffff',
                fontFamily: fonts.spaceGrotesk,
              }}
            >
              {item.value}
            </div>
          </BentoCell>
        ))}
      </div>

      {/* Bottom bar - 5th item as a full-width bar */}
      {items[4] && (
        <div
          style={{
            marginTop: 18,
            background: gradients[4],
            borderRadius: 24,
            padding: '28px 35px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            opacity: interpolate(frame, [50, 65], [0, 1], {
              extrapolateRight: 'clamp',
              extrapolateLeft: 'clamp',
            }),
          }}
        >
          <div
            style={{
              fontSize: 18,
              color: 'rgba(255,255,255,0.5)',
              fontFamily: fonts.inter,
              textTransform: 'uppercase',
              letterSpacing: 3,
            }}
          >
            {items[4].label}
          </div>
          <div
            style={{
              fontSize: 30,
              fontWeight: 700,
              color: '#ffffff',
              fontFamily: fonts.spaceGrotesk,
            }}
          >
            {items[4].value}
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};
