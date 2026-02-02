import React from 'react';
import {AbsoluteFill, useCurrentFrame, interpolate} from 'remotion';
import {fonts} from '../fonts.js';

export const KineticTitle = ({
  text,
  accentColor = '#00ff88',
  fontSize = 100,
  lineThickness = 4,
}) => {
  const frame = useCurrentFrame();

  // Entry: scale 0.8 -> 1.0 over frames 0-20
  const scale = interpolate(frame, [0, 20], [0.8, 1], {
    extrapolateRight: 'clamp',
    extrapolateLeft: 'clamp',
  });

  // Entry: fade in over frames 0-20
  const opacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: 'clamp',
    extrapolateLeft: 'clamp',
  });

  // Accent line grows from frames 25-45
  const lineWidth = interpolate(frame, [25, 45], [0, 600], {
    extrapolateRight: 'clamp',
    extrapolateLeft: 'clamp',
  });

  // Exit: blur increases from frames 70-90
  const blur = interpolate(frame, [70, 90], [0, 10], {
    extrapolateRight: 'clamp',
    extrapolateLeft: 'clamp',
  });

  // Exit: fade out from frames 70-90
  const exitOpacity = interpolate(frame, [70, 90], [1, 0], {
    extrapolateRight: 'clamp',
    extrapolateLeft: 'clamp',
  });

  // Combined opacity (entry + exit)
  const combinedOpacity = opacity * exitOpacity;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#0a0a0a',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          transform: `scale(${scale})`,
          opacity: combinedOpacity,
          filter: `blur(${blur}px)`,
        }}
      >
        <h1
          style={{
            fontSize,
            fontWeight: 900,
            color: '#ffffff',
            textAlign: 'center',
            fontFamily: fonts.montserrat,
            letterSpacing: -3,
            lineHeight: 1.1,
            margin: 0,
            padding: '0 60px',
          }}
        >
          {text}
        </h1>

        {/* Accent line */}
        <div
          style={{
            width: lineWidth,
            height: lineThickness,
            backgroundColor: accentColor,
            marginTop: 30,
            borderRadius: lineThickness / 2,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
