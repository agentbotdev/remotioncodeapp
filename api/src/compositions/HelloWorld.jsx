import React from 'react';
import {AbsoluteFill, useCurrentFrame, interpolate} from 'remotion';

export const HelloWorld = ({text}) => {
  const frame = useCurrentFrame();

  // Scale from 0.5 to 1 over the first 30 frames
  const scale = interpolate(frame, [0, 30], [0.5, 1], {
    extrapolateRight: 'clamp',
  });

  // Fade in over the first 20 frames
  const opacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#0a0a0a',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <h1
        style={{
          fontSize: 100,
          fontWeight: 900,
          color: '#ffffff',
          transform: `scale(${scale})`,
          opacity,
          textAlign: 'center',
          fontFamily: 'Arial Black, sans-serif',
        }}
      >
        {text}
      </h1>
    </AbsoluteFill>
  );
};
