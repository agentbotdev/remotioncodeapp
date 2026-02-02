import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  Sequence,
} from 'remotion';
import {TextReveal} from './TextReveal.jsx';
import {SceneTransition} from './SceneTransition.jsx';
import {fonts} from '../fonts.js';

const Scene = ({children, backgroundColor = '#0a0a0a', exitFrame}) => {
  const frame = useCurrentFrame();

  // Exit blur + fade if exitFrame is provided
  let blur = 0;
  let exitOpacity = 1;
  if (exitFrame !== undefined) {
    blur = interpolate(frame, [exitFrame, exitFrame + 15], [0, 8], {
      extrapolateRight: 'clamp',
      extrapolateLeft: 'clamp',
    });
    exitOpacity = interpolate(frame, [exitFrame, exitFrame + 15], [1, 0], {
      extrapolateRight: 'clamp',
      extrapolateLeft: 'clamp',
    });
  }

  return (
    <AbsoluteFill
      style={{
        backgroundColor,
        justifyContent: 'center',
        alignItems: 'center',
        filter: `blur(${blur}px)`,
        opacity: exitOpacity,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

const AccentLine = ({color = '#00ff88', delay = 0, width = 600, thickness = 4}) => {
  const frame = useCurrentFrame();
  const f = Math.max(0, frame - delay);

  const lineWidth = interpolate(f, [0, 20], [0, width], {
    extrapolateRight: 'clamp',
    extrapolateLeft: 'clamp',
  });

  return (
    <div
      style={{
        width: lineWidth,
        height: thickness,
        backgroundColor: color,
        borderRadius: thickness / 2,
        marginTop: 25,
      }}
    />
  );
};

export const CinematicVideo = ({scenes, accentColor = '#00ff88'}) => {
  const frameDurations = scenes.map((s) => s.durationFrames || 60);

  // Build sequence offsets
  const offsets = [];
  let total = 0;
  for (const d of frameDurations) {
    offsets.push(total);
    total += d;
  }

  return (
    <AbsoluteFill style={{backgroundColor: '#0a0a0a'}}>
      {scenes.map((scene, i) => {
        const duration = frameDurations[i];
        const exitFrame = duration - 18;

        return (
          <Sequence
            key={i}
            from={offsets[i]}
            durationInFrames={duration}
          >
            <Scene exitFrame={exitFrame}>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <TextReveal
                  text={scene.text}
                  fontSize={scene.fontSize || 90}
                  style={scene.animation || 'scale'}
                  color={scene.textColor || '#ffffff'}
                  delay={5}
                />
                {scene.showLine !== false && (
                  <AccentLine
                    color={scene.lineColor || accentColor}
                    delay={20}
                    width={scene.lineWidth || 500}
                    thickness={scene.lineThickness || 4}
                  />
                )}
                {scene.subtitle && (
                  <p
                    style={{
                      color: scene.subtitleColor || '#888888',
                      fontSize: scene.subtitleSize || 36,
                      fontFamily: fonts.inter,
                      fontWeight: 400,
                      marginTop: 40,
                      textAlign: 'center',
                      padding: '0 80px',
                      opacity: 0.8,
                    }}
                  >
                    {scene.subtitle}
                  </p>
                )}
              </div>
            </Scene>

            {/* Flash transition between scenes */}
            {i < scenes.length - 1 && (
              <Sequence from={duration - 8} durationInFrames={8}>
                <SceneTransition type="flash" color={accentColor} durationFrames={8} />
              </Sequence>
            )}
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
