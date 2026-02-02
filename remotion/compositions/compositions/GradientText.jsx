import React from 'react';
import {AbsoluteFill, useCurrentFrame, interpolate} from 'remotion';
import {fonts} from '../fonts.js';

export const GradientText = ({
  text = 'LIMITLESS',
  gradientColors = ['#ff6b6b', '#feca57', '#48dbfb'],
  glowIntensity = 1,
  fontSize = 120,
  revealStyle = 'clip', // 'clip' | 'typewriter' | 'blur'
}) => {
  const frame = useCurrentFrame();

  // Animated gradient position (shifts over time)
  const gradientShift = frame * 3;

  // Reveal animation (frames 0-30)
  const revealProgress = interpolate(frame, [0, 30], [0, 1], {
    extrapolateRight: 'clamp',
    extrapolateLeft: 'clamp',
  });

  // Exit (frames 70-90)
  const exitOpacity = interpolate(frame, [70, 90], [1, 0], {
    extrapolateRight: 'clamp',
    extrapolateLeft: 'clamp',
  });
  const exitScale = interpolate(frame, [70, 90], [1, 1.1], {
    extrapolateRight: 'clamp',
    extrapolateLeft: 'clamp',
  });

  // Glow pulse
  const glowPulse = interpolate(
    Math.sin(frame * 0.1),
    [-1, 1],
    [20 * glowIntensity, 50 * glowIntensity]
  );

  // Build gradient string
  const gradientStr = gradientColors
    .map((c, i) => {
      const pos = (i / (gradientColors.length - 1)) * 100 + gradientShift;
      return `${c} ${pos}%`;
    })
    .join(', ');

  // Reveal clip or blur
  let revealStyle_css = {};
  if (revealStyle === 'clip') {
    revealStyle_css = {
      clipPath: `inset(0 ${(1 - revealProgress) * 100}% 0 0)`,
    };
  } else if (revealStyle === 'blur') {
    const revealBlur = interpolate(revealProgress, [0, 1], [20, 0]);
    revealStyle_css = {
      filter: `blur(${revealBlur}px)`,
      opacity: revealProgress,
    };
  }

  // Typewriter for typewriter style
  const charsToShow =
    revealStyle === 'typewriter'
      ? Math.floor(revealProgress * text.length)
      : text.length;

  const displayText = revealStyle === 'typewriter' ? text.slice(0, charsToShow) : text;

  // Underline animation
  const underlineWidth = interpolate(frame, [20, 40], [0, 100], {
    extrapolateRight: 'clamp',
    extrapolateLeft: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#0a0a0a',
        justifyContent: 'center',
        alignItems: 'center',
        opacity: exitOpacity,
        transform: `scale(${exitScale})`,
      }}
    >
      {/* Background ambient glow */}
      <div
        style={{
          position: 'absolute',
          width: 600,
          height: 300,
          background: `linear-gradient(135deg, ${gradientColors[0]}15, ${gradientColors[gradientColors.length - 1]}15)`,
          filter: 'blur(80px)',
          borderRadius: '50%',
        }}
      />

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          ...revealStyle_css,
        }}
      >
        {/* Main gradient text */}
        <h1
          style={{
            fontSize,
            fontWeight: 900,
            fontFamily: fonts.syne,
            letterSpacing: -4,
            lineHeight: 1,
            margin: 0,
            textAlign: 'center',
            padding: '0 40px',
            background: `linear-gradient(90deg, ${gradientStr})`,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            backgroundSize: '200% 100%',
            filter: `drop-shadow(0 0 ${glowPulse}px ${gradientColors[0]}66)`,
          }}
        >
          {displayText}
          {revealStyle === 'typewriter' && charsToShow < text.length && (
            <span
              style={{
                color: gradientColors[0],
                opacity: frame % 8 < 4 ? 1 : 0,
              }}
            >
              |
            </span>
          )}
        </h1>

        {/* Animated underline with gradient */}
        <div
          style={{
            width: `${underlineWidth}%`,
            maxWidth: 500,
            height: 3,
            background: `linear-gradient(90deg, ${gradientColors.join(', ')})`,
            marginTop: 30,
            borderRadius: 2,
            opacity: 0.8,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
