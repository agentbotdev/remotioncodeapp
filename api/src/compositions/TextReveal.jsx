import React from 'react';
import {useCurrentFrame, interpolate} from 'remotion';
import {fonts} from '../fonts.js';

export const TextReveal = ({
  text,
  color = '#ffffff',
  fontSize = 90,
  delay = 0,
  style = 'scale', // 'scale' | 'slide-up' | 'typewriter'
}) => {
  const frame = useCurrentFrame();
  const f = Math.max(0, frame - delay);

  if (style === 'slide-up') {
    const opacity = interpolate(f, [0, 15], [0, 1], {
      extrapolateRight: 'clamp',
      extrapolateLeft: 'clamp',
    });
    const y = interpolate(f, [0, 15], [80, 0], {
      extrapolateRight: 'clamp',
      extrapolateLeft: 'clamp',
    });
    return (
      <h1
        style={{
          fontSize,
          fontWeight: 900,
          color,
          fontFamily: fonts.montserrat,
          letterSpacing: -3,
          lineHeight: 1.1,
          margin: 0,
          textAlign: 'center',
          padding: '0 60px',
          opacity,
          transform: `translateY(${y}px)`,
        }}
      >
        {text}
      </h1>
    );
  }

  if (style === 'typewriter') {
    const charsToShow = Math.floor(
      interpolate(f, [0, text.length * 2], [0, text.length], {
        extrapolateRight: 'clamp',
        extrapolateLeft: 'clamp',
      })
    );
    const opacity = interpolate(f, [0, 5], [0, 1], {
      extrapolateRight: 'clamp',
      extrapolateLeft: 'clamp',
    });
    return (
      <h1
        style={{
          fontSize,
          fontWeight: 900,
          color,
          fontFamily: fonts.montserrat,
          letterSpacing: -3,
          lineHeight: 1.1,
          margin: 0,
          textAlign: 'center',
          padding: '0 60px',
          opacity,
        }}
      >
        {text.slice(0, charsToShow)}
        <span style={{opacity: f % 10 < 5 ? 1 : 0, color}}>|</span>
      </h1>
    );
  }

  // Default: scale
  const scale = interpolate(f, [0, 18], [0.7, 1], {
    extrapolateRight: 'clamp',
    extrapolateLeft: 'clamp',
  });
  const opacity = interpolate(f, [0, 18], [0, 1], {
    extrapolateRight: 'clamp',
    extrapolateLeft: 'clamp',
  });
  return (
    <h1
      style={{
        fontSize,
        fontWeight: 900,
        color,
        fontFamily: 'Arial Black, sans-serif',
        letterSpacing: -3,
        lineHeight: 1.1,
        margin: 0,
        textAlign: 'center',
        padding: '0 60px',
        opacity,
        transform: `scale(${scale})`,
      }}
    >
      {text}
    </h1>
  );
};
