import React from 'react';
import {AbsoluteFill, useCurrentFrame, interpolate, random} from 'remotion';
import {fonts} from '../fonts.js';

const Layer = ({children, depth, blur, frame, direction = 'right'}) => {
  const speed = depth * 0.8;
  const dirMultiplier = direction === 'right' ? 1 : -1;
  const translateX = frame * speed * dirMultiplier;
  const translateY = Math.sin(frame * 0.02 * depth) * 10;

  return (
    <AbsoluteFill
      style={{
        transform: `translateX(${translateX}px) translateY(${translateY}px)`,
        filter: `blur(${blur}px)`,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

// Abstract shapes for background layers
const FloatingShape = ({x, y, size, color, rotation, opacity}) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      width: size,
      height: size,
      borderRadius: size * 0.2,
      backgroundColor: color,
      opacity,
      transform: `rotate(${rotation}deg)`,
    }}
  />
);

const GridLines = ({color, opacity, frame}) => {
  const lines = [];
  // Horizontal lines
  for (let i = 0; i < 20; i++) {
    lines.push(
      <div
        key={`h-${i}`}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: i * 100 + (frame * 0.3) % 100,
          height: 1,
          backgroundColor: color,
          opacity: opacity * 0.3,
        }}
      />
    );
  }
  // Vertical lines
  for (let i = 0; i < 12; i++) {
    lines.push(
      <div
        key={`v-${i}`}
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: i * 100 + (frame * 0.2) % 100,
          width: 1,
          backgroundColor: color,
          opacity: opacity * 0.3,
        }}
      />
    );
  }
  return <>{lines}</>;
};

export const LayeredComposition = ({
  title = 'DEPTH',
  subtitle = 'Layers of meaning',
  accentColor = '#ff6b6b',
  backgroundShapes = true,
}) => {
  const frame = useCurrentFrame();

  // Master fade in/out
  const fadeIn = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: 'clamp',
    extrapolateLeft: 'clamp',
  });
  const fadeOut = interpolate(frame, [110, 130], [1, 0], {
    extrapolateRight: 'clamp',
    extrapolateLeft: 'clamp',
  });
  const masterOpacity = fadeIn * fadeOut;

  // Text entry
  const textScale = interpolate(frame, [10, 35], [0.85, 1], {
    extrapolateRight: 'clamp',
    extrapolateLeft: 'clamp',
  });
  const textOpacity = interpolate(frame, [10, 30], [0, 1], {
    extrapolateRight: 'clamp',
    extrapolateLeft: 'clamp',
  });

  // Generate background shapes
  const shapes = React.useMemo(() => {
    return Array.from({length: 12}).map((_, i) => ({
      x: random(`lx-${i}`) * 1080,
      y: random(`ly-${i}`) * 1920,
      size: 30 + random(`ls-${i}`) * 120,
      color: i % 2 === 0 ? accentColor : '#ffffff',
      baseRotation: random(`lr-${i}`) * 360,
      layer: Math.floor(random(`ll-${i}`) * 3),
    }));
  }, [accentColor]);

  return (
    <AbsoluteFill style={{backgroundColor: '#08080f', opacity: masterOpacity}}>
      {/* Layer 0: Deep background - grid + large blurred shapes */}
      <Layer depth={0.2} blur={8} frame={frame} direction="left">
        <GridLines color={accentColor} opacity={0.15} frame={frame} />
        {backgroundShapes &&
          shapes
            .filter((s) => s.layer === 0)
            .map((s, i) => (
              <FloatingShape
                key={`bg-${i}`}
                x={s.x}
                y={s.y}
                size={s.size * 2}
                color={s.color}
                rotation={s.baseRotation + frame * 0.3}
                opacity={0.04}
              />
            ))}
      </Layer>

      {/* Layer 1: Mid-ground - medium shapes, less blur */}
      <Layer depth={0.5} blur={3} frame={frame} direction="right">
        {backgroundShapes &&
          shapes
            .filter((s) => s.layer === 1)
            .map((s, i) => (
              <FloatingShape
                key={`mg-${i}`}
                x={s.x}
                y={s.y}
                size={s.size}
                color={s.color}
                rotation={s.baseRotation + frame * 0.5}
                opacity={0.06}
              />
            ))}
      </Layer>

      {/* Layer 2: Foreground content - sharp, no blur */}
      <Layer depth={0} blur={0} frame={frame}>
        <AbsoluteFill
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            opacity: textOpacity,
            transform: `scale(${textScale})`,
          }}
        >
          <h1
            style={{
              fontSize: 130,
              fontWeight: 900,
              color: '#ffffff',
              fontFamily: fonts.syne,
              letterSpacing: -5,
              lineHeight: 1,
              margin: 0,
              textAlign: 'center',
              textShadow: `0 0 60px ${accentColor}33`,
            }}
          >
            {title}
          </h1>
          <p
            style={{
              fontSize: 30,
              color: '#666677',
              fontFamily: fonts.inter,
              marginTop: 25,
              fontWeight: 300,
              letterSpacing: 8,
              textTransform: 'uppercase',
            }}
          >
            {subtitle}
          </p>
        </AbsoluteFill>
      </Layer>

      {/* Layer 3: Foreground particles - small, sharp */}
      <Layer depth={1.2} blur={0} frame={frame} direction="left">
        {backgroundShapes &&
          shapes
            .filter((s) => s.layer === 2)
            .map((s, i) => (
              <FloatingShape
                key={`fg-${i}`}
                x={s.x}
                y={s.y}
                size={s.size * 0.3}
                color={s.color}
                rotation={s.baseRotation + frame * 0.8}
                opacity={0.12}
              />
            ))}
      </Layer>

      {/* Vignette */}
      <AbsoluteFill
        style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.6) 100%)',
          pointerEvents: 'none',
        }}
      />
    </AbsoluteFill>
  );
};
