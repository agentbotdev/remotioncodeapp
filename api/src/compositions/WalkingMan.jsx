import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, random } from 'remotion';

// Rain particle component
const RainDrop = ({ id, frame }) => {
  const speed = 15 + random(`rain-speed-${id}`) * 10;
  const delay = random(`rain-delay-${id}`) * 100;
  const x = random(`rain-x-${id}`) * 1080;
  const y = ((frame * speed + delay) % 2200) - 200;

  const length = 20 + random(`rain-len-${id}`) * 20;

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: 1,
        height: length,
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
        boxShadow: '0 0 4px rgba(255, 255, 255, 0.2)',
      }}
    />
  );
};

// Smoke particle component
const SmokeParticle = ({ id, frame, originX, originY, color = '#aaaaaa' }) => {
  // Each particle has its own lifecycle based on id
  const cycleLength = 40;
  const offset = Math.floor(random(`smoke-offset-${id}`) * cycleLength);
  const localFrame = (frame + offset) % cycleLength;

  const opacity = interpolate(localFrame, [0, 8, 30, 40], [0, 0.5, 0.15, 0], {
    extrapolateRight: 'clamp',
    extrapolateLeft: 'clamp',
  });

  const rise = interpolate(localFrame, [0, 40], [0, -120], {
    extrapolateRight: 'clamp',
    extrapolateLeft: 'clamp',
  });

  const drift = interpolate(
    localFrame,
    [0, 40],
    [0, (random(`smoke-drift-${id}`) - 0.4) * 60],
    { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' }
  );

  const size = 6 + random(`smoke-size-${id}`) * 14;
  const scale = interpolate(localFrame, [0, 40], [0.5, 2.5], {
    extrapolateRight: 'clamp',
    extrapolateLeft: 'clamp',
  });

  return (
    <div
      style={{
        position: 'absolute',
        left: originX + drift,
        top: originY + rise,
        width: size,
        height: size,
        borderRadius: '50%',
        backgroundColor: color,
        opacity,
        transform: `scale(${scale})`,
        filter: 'blur(4px)',
      }}
    />
  );
};

// Film grain overlay
const FilmGrain = ({ frame }) => {
  const grainOpacity = 0.06 + random(`grain-${frame % 4}`) * 0.04;
  return (
    <AbsoluteFill
      style={{
        background: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
        opacity: grainOpacity,
        mixBlendMode: 'overlay',
        zIndex: 10,
        pointerEvents: 'none',
      }}
    />
  );
};

export const WalkingMan = ({
  manColor = '#111111',
  smokeColor = '#aaaaaa',
  showRain = true,
  gridColor = '#1a1a1a',
  accentColor = '#00ff88'
}) => {
  const frame = useCurrentFrame();

  // Slow camera drift forward
  const cameraZoom = interpolate(frame, [0, 240], [1, 1.08], {
    extrapolateRight: 'clamp',
    extrapolateLeft: 'clamp',
  });

  // Man walks forward slowly (gets slightly larger + lower)
  const manScale = interpolate(frame, [0, 240], [0.85, 1.15], {
    extrapolateRight: 'clamp',
    extrapolateLeft: 'clamp',
  });

  const manY = interpolate(frame, [0, 240], [-40, 30], {
    extrapolateRight: 'clamp',
    extrapolateLeft: 'clamp',
  });

  // Walking bob (subtle vertical oscillation)
  const walkBob = Math.sin(frame * 0.25) * 3;

  // Arm swing
  const armSwing = Math.sin(frame * 0.25) * 6;

  // Leg movement
  const leftLegAngle = Math.sin(frame * 0.25) * 12;
  const rightLegAngle = Math.sin(frame * 0.25 + Math.PI) * 12;

  // Subtle shoulder sway
  const shoulderSway = Math.sin(frame * 0.25) * 1.5;

  // Ambient light pulse
  const ambientPulse = interpolate(
    Math.sin(frame * 0.03),
    [-1, 1],
    [0.02, 0.06],
  );

  // Fade in at start, fade out at end
  const fadeIn = interpolate(frame, [0, 30], [0, 1], {
    extrapolateRight: 'clamp',
    extrapolateLeft: 'clamp',
  });
  const fadeOut = interpolate(frame, [210, 240], [1, 0], {
    extrapolateRight: 'clamp',
    extrapolateLeft: 'clamp',
  });
  const masterOpacity = fadeIn * fadeOut;

  // Path perspective lines
  const pathWidth = interpolate(frame, [0, 240], [320, 380], {
    extrapolateRight: 'clamp',
    extrapolateLeft: 'clamp',
  });

  return (
    <AbsoluteFill style={{ backgroundColor: '#050505', opacity: masterOpacity }}>
      {/* Subtle vignette */}
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.7) 100%)',
          zIndex: 5,
          pointerEvents: 'none',
        }}
      />

      {/* Scene container with camera zoom */}
      <AbsoluteFill
        style={{
          transform: `scale(${cameraZoom})`,
          transformOrigin: '50% 55%',
        }}
      >
        {/* Gray path / corridor floor */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 0,
            height: 0,
            borderLeft: `${pathWidth * 0.7}px solid transparent`,
            borderRight: `${pathWidth * 0.7}px solid transparent`,
            borderBottom: `900px solid ${gridColor}`,
          }}
        />

        {/* Path center line (subtle) */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 2,
            height: 600,
            background:
              `linear-gradient(to top, ${accentColor}33 0%, transparent 100%)`,
            opacity: 0.3,
          }}
        />

        {/* Path edge lines */}
        {[-1, 1].map((side) => (
          <div
            key={side}
            style={{
              position: 'absolute',
              bottom: 0,
              left: '50%',
              width: 1,
              height: 900,
              background:
                `linear-gradient(to top, ${accentColor}44 0%, transparent 70%)`,
              opacity: 0.4,
              transform: `translateX(-50%) rotate(${side * 18}deg)`,
              transformOrigin: 'bottom center',
            }}
          />
        ))}

        {/* Ground texture marks */}
        {Array.from({ length: 8 }).map((_, i) => {
          const baseY = 1920 - 200 - i * 100;
          const perspectiveScale = interpolate(i, [0, 7], [1, 0.3], {
            extrapolateRight: 'clamp',
            extrapolateLeft: 'clamp',
          });
          return (
            <div
              key={`mark-${i}`}
              style={{
                position: 'absolute',
                top: baseY,
                left: '50%',
                transform: `translateX(-50%) scaleX(${perspectiveScale})`,
                width: pathWidth * 0.5,
                height: 1,
                backgroundColor: gridColor,
                opacity: 0.3 * perspectiveScale,
              }}
            />
          );
        })}

        {/* The man - silhouette from behind */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: `${680 + manY + walkBob}px`,
            transform: `translateX(-50%) scale(${manScale})`,
            transformOrigin: 'center bottom',
          }}
        >
          {/* Body group */}
          <div
            style={{
              position: 'relative',
              width: 120,
              height: 300,
              transform: `translateX(${shoulderSway}px)`,
            }}
          >
            {/* Head */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 40,
                height: 45,
                borderRadius: '50% 50% 45% 45%',
                backgroundColor: manColor,
                filter: 'brightness(0.8)',
              }}
            />

            {/* Neck */}
            <div
              style={{
                position: 'absolute',
                top: 40,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 16,
                height: 12,
                backgroundColor: manColor,
              }}
            />

            {/* Torso */}
            <div
              style={{
                position: 'absolute',
                top: 48,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 75,
                height: 110,
                backgroundColor: manColor,
                borderRadius: '8px 8px 2px 2px',
                filter: 'brightness(0.9)',
              }}
            />

            {/* Jacket/coat detail - slightly lighter edges */}
            <div
              style={{
                position: 'absolute',
                top: 50,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 80,
                height: 105,
                border: `1px solid ${accentColor}22`,
                borderRadius: '8px 8px 2px 2px',
                opacity: 0.5,
              }}
            />

            {/* Collar */}
            <div
              style={{
                position: 'absolute',
                top: 44,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 50,
                height: 14,
                backgroundColor: manColor,
                filter: 'brightness(1.1)',
                borderRadius: '3px',
              }}
            />

            {/* Left arm */}
            <div
              style={{
                position: 'absolute',
                top: 55,
                left: 8,
                width: 22,
                height: 95,
                backgroundColor: manColor,
                borderRadius: '6px',
                transform: `rotate(${-armSwing - 3}deg)`,
                transformOrigin: 'top center',
              }}
            />

            {/* Right arm (holding cigarette, more forward) */}
            <div
              style={{
                position: 'absolute',
                top: 55,
                right: 8,
                width: 22,
                height: 85,
                backgroundColor: manColor,
                borderRadius: '6px',
                transform: `rotate(${armSwing + 3}deg)`,
                transformOrigin: 'top center',
              }}
            >
              {/* Hand area */}
              <div
                style={{
                  position: 'absolute',
                  bottom: -5,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 14,
                  height: 14,
                  borderRadius: '50%',
                  backgroundColor: manColor,
                }}
              />
              {/* Cigarette */}
              <div
                style={{
                  position: 'absolute',
                  bottom: -2,
                  left: '50%',
                  transform: 'translateX(-30%) rotate(-15deg)',
                  width: 3,
                  height: 18,
                  backgroundColor: '#ccbbaa',
                  borderRadius: 1,
                }}
              />
              {/* Cigarette ember */}
              <div
                style={{
                  position: 'absolute',
                  bottom: -4,
                  left: '50%',
                  transform: 'translateX(-10%) rotate(-15deg)',
                  width: 3,
                  height: 3,
                  borderRadius: '50%',
                  backgroundColor: '#ff6633',
                  boxShadow: '0 0 6px 2px rgba(255,100,30,0.5)',
                  opacity: 0.7 + Math.sin(frame * 0.3) * 0.3,
                }}
              />
            </div>

            {/* Pants / lower body */}
            <div
              style={{
                position: 'absolute',
                top: 155,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 70,
                height: 30,
                backgroundColor: manColor,
                filter: 'brightness(0.85)',
              }}
            />

            {/* Left leg */}
            <div
              style={{
                position: 'absolute',
                top: 180,
                left: 22,
                width: 28,
                height: 110,
                backgroundColor: manColor,
                filter: 'brightness(0.9)',
                borderRadius: '4px',
                transform: `rotate(${leftLegAngle}deg)`,
                transformOrigin: 'top center',
              }}
            >
              {/* Shoe */}
              <div
                style={{
                  position: 'absolute',
                  bottom: -4,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 30,
                  height: 10,
                  backgroundColor: '#0a0a0a',
                  borderRadius: '3px 3px 4px 4px',
                }}
              />
            </div>

            {/* Right leg */}
            <div
              style={{
                position: 'absolute',
                top: 180,
                right: 22,
                width: 28,
                height: 110,
                backgroundColor: manColor,
                filter: 'brightness(0.9)',
                borderRadius: '4px',
                transform: `rotate(${rightLegAngle}deg)`,
                transformOrigin: 'top center',
              }}
            >
              {/* Shoe */}
              <div
                style={{
                  position: 'absolute',
                  bottom: -4,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 30,
                  height: 10,
                  backgroundColor: '#0a0a0a',
                  borderRadius: '3px 3px 4px 4px',
                }}
              />
            </div>
          </div>

          {/* Smoke particles - origin near right hand/cigarette */}
          <div style={{ position: 'absolute', top: 180, right: 5 }}>
            {Array.from({ length: 12 }).map((_, i) => (
              <SmokeParticle
                key={i}
                id={i}
                frame={frame}
                originX={random(`sp-x-${i}`) * 10 - 5}
                originY={0}
                color={smokeColor}
              />
            ))}
          </div>
        </div>

        {/* Rain particles */}
        {showRain && Array.from({ length: 150 }).map((_, i) => (
          <RainDrop key={i} id={i} frame={frame} />
        ))}

        {/* Atmospheric fog at the bottom */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 300,
            background:
              'linear-gradient(to top, rgba(15,15,15,0.8) 0%, transparent 100%)',
            opacity: 0.6,
          }}
        />

        {/* Distant ambient glow (like distant lights) */}
        <div
          style={{
            position: 'absolute',
            top: 600,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 200,
            height: 200,
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(80,80,90,0.12) 0%, transparent 70%)',
            opacity: ambientPulse * 10,
            filter: 'blur(30px)',
          }}
        />
      </AbsoluteFill>

      {/* Film grain */}
      <FilmGrain frame={frame} />
    </AbsoluteFill>
  );
};
