import React from 'react';
import {AbsoluteFill, useCurrentFrame, interpolate} from 'remotion';

export const SceneTransition = ({
  type = 'fade', // 'fade' | 'wipe' | 'flash'
  color = '#ffffff',
  durationFrames = 10,
}) => {
  const frame = useCurrentFrame();

  if (type === 'flash') {
    const opacity = interpolate(
      frame,
      [0, durationFrames * 0.3, durationFrames],
      [0, 1, 0],
      {extrapolateRight: 'clamp', extrapolateLeft: 'clamp'}
    );
    return (
      <AbsoluteFill
        style={{
          backgroundColor: color,
          opacity,
          zIndex: 10,
        }}
      />
    );
  }

  if (type === 'wipe') {
    const width = interpolate(frame, [0, durationFrames], [0, 100], {
      extrapolateRight: 'clamp',
      extrapolateLeft: 'clamp',
    });
    return (
      <AbsoluteFill
        style={{
          backgroundColor: color,
          width: `${width}%`,
          zIndex: 10,
        }}
      />
    );
  }

  // Default: fade
  const opacity = interpolate(
    frame,
    [0, durationFrames * 0.5, durationFrames],
    [0, 1, 0],
    {extrapolateRight: 'clamp', extrapolateLeft: 'clamp'}
  );
  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#0a0a0a',
        opacity,
        zIndex: 10,
      }}
    />
  );
};
