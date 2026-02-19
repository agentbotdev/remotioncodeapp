import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
} from 'remotion';
import {fonts} from '../fonts.js';

// ═══════════════════════════════════════════════════════════════
// PALETTE - Premium dark aesthetic
// ═══════════════════════════════════════════════════════════════
const P = {
  bgDeep: '#0a0a0f',
  bgCard: '#12121a',
  blue: '#00D9FF',
  orange: '#FF6B35',
  purple: '#B24BF3',
  green: '#00FF88',
  gold: '#FFD700',
  white: '#FFFFFF',
  gray: '#888888',
  dimGray: '#444444',
};

const clamp = (opts) => ({extrapolateRight: 'clamp', extrapolateLeft: 'clamp', ...opts});

// ═══════════════════════════════════════════════════════════════
// HANDWRITING TEXT COMPONENT
// Simulates handwriting with character-by-character reveal + cursor
// ═══════════════════════════════════════════════════════════════
const HandwritingText = ({text, startFrame, charsPerFrame = 0.8, color = P.white, fontSize = 32, lineHeight = 1.5, maxWidth = 900}) => {
  const frame = useCurrentFrame();
  const f = Math.max(0, frame - startFrame);

  const totalChars = text.length;
  const charsToShow = Math.min(totalChars, Math.floor(f * charsPerFrame));
  const displayText = text.substring(0, charsToShow);
  const isWriting = charsToShow < totalChars && f > 0;
  const cursorBlink = Math.sin(f * 0.4) > 0;

  // Slight hand wobble effect
  const wobbleX = Math.sin(f * 0.3) * 0.5;
  const wobbleY = Math.cos(f * 0.25) * 0.3;

  return (
    <div style={{
      position: 'relative',
      maxWidth,
      transform: `translate(${wobbleX}px, ${wobbleY}px)`,
    }}>
      <p style={{
        fontSize,
        fontFamily: fonts.playfair,
        fontWeight: 400,
        fontStyle: 'italic',
        color,
        lineHeight,
        margin: 0,
        textShadow: `0 0 20px ${color}33`,
      }}>
        {displayText}
        {isWriting && cursorBlink && (
          <span style={{
            display: 'inline-block',
            width: 3,
            height: fontSize * 0.8,
            backgroundColor: P.gold,
            marginLeft: 2,
            boxShadow: `0 0 10px ${P.gold}`,
            verticalAlign: 'middle',
          }}/>
        )}
      </p>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// PEN / PENCIL ICON (animated)
// ═══════════════════════════════════════════════════════════════
const AnimatedPen = ({x, y, frame, active, color = P.gold}) => {
  const wobbleAngle = active ? Math.sin(frame * 0.5) * 8 : 0;
  const opacity = interpolate(frame, [0, 10], [0, 1], clamp());

  return (
    <div style={{
      position: 'absolute',
      left: x,
      top: y,
      transform: `rotate(${-45 + wobbleAngle}deg)`,
      opacity,
      transformOrigin: 'bottom right',
    }}>
      <svg width="60" height="60" viewBox="0 0 60 60">
        {/* Pen body */}
        <rect x="20" y="5" width="12" height="40" rx="2" fill={color} opacity="0.9"/>
        {/* Pen tip */}
        <polygon points="26,45 20,55 32,55" fill="#333"/>
        <polygon points="26,55 24,60 28,60" fill={P.white}/>
        {/* Shine */}
        <rect x="22" y="8" width="3" height="30" rx="1" fill={P.white} opacity="0.3"/>
        {/* Glow when active */}
        {active && (
          <circle cx="26" cy="58" r="4" fill={P.gold} opacity="0.6">
            <animate attributeName="r" values="3;6;3" dur="0.3s" repeatCount="indefinite"/>
          </circle>
        )}
      </svg>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// NOTEBOOK LINES (whiteboard/paper effect)
// ═══════════════════════════════════════════════════════════════
const NotebookLines = ({lineCount = 8, color = P.dimGray, spacing = 52}) => (
  <div style={{position: 'absolute', inset: 0, overflow: 'hidden', opacity: 0.3}}>
    {Array.from({length: lineCount}).map((_, i) => (
      <div key={i} style={{
        position: 'absolute',
        left: 60,
        right: 60,
        top: 80 + i * spacing,
        height: 1,
        background: `linear-gradient(90deg, transparent 0%, ${color} 5%, ${color} 95%, transparent 100%)`,
      }}/>
    ))}
  </div>
);

// ═══════════════════════════════════════════════════════════════
// GLASS CARD
// ═══════════════════════════════════════════════════════════════
const GlassCard = ({children, color = P.blue, style = {}}) => (
  <div style={{
    background: `${color}08`,
    backdropFilter: 'blur(40px) saturate(180%)',
    border: `1px solid ${color}33`,
    borderRadius: 24,
    boxShadow: `0 20px 60px ${color}15, inset 0 1px 0 rgba(255,255,255,0.06)`,
    position: 'relative',
    overflow: 'hidden',
    ...style,
  }}>
    <div style={{
      position: 'absolute', inset: 0, borderRadius: 24, pointerEvents: 'none',
      background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 50%, rgba(0,0,0,0.05) 100%)',
    }}/>
    <div style={{position: 'relative', zIndex: 1}}>{children}</div>
  </div>
);

// ═══════════════════════════════════════════════════════════════
// TOOL ICONS (for leverage visualization)
// ═══════════════════════════════════════════════════════════════
const ToolIcon = ({type, x, y, frame, delay, color}) => {
  const f = Math.max(0, frame - delay);
  const scale = interpolate(f, [0, 15], [0, 1], {...clamp(), easing: Easing.out(Easing.back(1.5))});
  const opacity = interpolate(f, [0, 10], [0, 1], clamp());
  const float = Math.sin(f * 0.08 + delay) * 5;

  const icons = {
    gear: (
      <svg width="50" height="50" viewBox="0 0 50 50">
        <circle cx="25" cy="25" r="8" fill="none" stroke={color} strokeWidth="3"/>
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
          <rect key={i} x="23" y="5" width="4" height="8" rx="2" fill={color}
            transform={`rotate(${angle} 25 25)`}/>
        ))}
      </svg>
    ),
    chart: (
      <svg width="50" height="50" viewBox="0 0 50 50">
        <rect x="8" y="30" width="8" height="15" rx="2" fill={color} opacity="0.6"/>
        <rect x="21" y="20" width="8" height="25" rx="2" fill={color} opacity="0.8"/>
        <rect x="34" y="10" width="8" height="35" rx="2" fill={color}/>
      </svg>
    ),
    rocket: (
      <svg width="50" height="50" viewBox="0 0 50 50">
        <ellipse cx="25" cy="20" rx="8" ry="15" fill={color}/>
        <polygon points="17,30 25,45 33,30" fill={color} opacity="0.7"/>
        <circle cx="25" cy="18" r="4" fill={P.bgDeep}/>
      </svg>
    ),
    money: (
      <svg width="50" height="50" viewBox="0 0 50 50">
        <circle cx="25" cy="25" r="18" fill="none" stroke={color} strokeWidth="3"/>
        <text x="25" y="32" textAnchor="middle" fill={color} fontSize="20" fontWeight="bold">$</text>
      </svg>
    ),
  };

  return (
    <div style={{
      position: 'absolute',
      left: x,
      top: y,
      transform: `translate(-50%, -50%) scale(${scale}) translateY(${float}px)`,
      opacity,
    }}>
      <div style={{
        padding: 15,
        borderRadius: 16,
        background: `${color}15`,
        border: `1px solid ${color}33`,
        boxShadow: `0 10px 30px ${color}22`,
      }}>
        {icons[type]}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// PARETO CHART (80/20 visualization)
// ═══════════════════════════════════════════════════════════════
const ParetoChart = ({frame, delay}) => {
  const f = Math.max(0, frame - delay);
  const opacity = interpolate(f, [0, 20], [0, 1], clamp());
  const barGrow = interpolate(f, [10, 40], [0, 1], clamp());
  const labelOpacity = interpolate(f, [35, 50], [0, 1], clamp());
  const highlightPulse = 0.8 + Math.sin(f * 0.1) * 0.2;

  return (
    <div style={{
      position: 'absolute',
      left: '50%',
      top: '50%',
      transform: 'translate(-50%, -50%)',
      opacity,
    }}>
      <GlassCard color={P.green} style={{padding: '30px 40px', width: 380}}>
        <div style={{
          fontSize: 16,
          fontWeight: 700,
          color: P.white,
          fontFamily: fonts.plusJakarta,
          marginBottom: 20,
          textAlign: 'center',
        }}>
          LEY DE PARETO
        </div>

        {/* Chart container */}
        <div style={{display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 20, height: 180}}>
          {/* 80% bar (low value) */}
          <div style={{textAlign: 'center'}}>
            <div style={{
              width: 100,
              height: 50 * barGrow,
              background: `linear-gradient(180deg, ${P.gray}44 0%, ${P.gray}22 100%)`,
              borderRadius: '8px 8px 0 0',
              border: `1px solid ${P.gray}33`,
            }}/>
            <div style={{
              marginTop: 10,
              fontSize: 24,
              fontWeight: 700,
              color: P.gray,
              fontFamily: fonts.bebasNeue,
              opacity: labelOpacity,
            }}>80%</div>
            <div style={{
              fontSize: 11,
              color: P.dimGray,
              fontFamily: fonts.dmSans,
              opacity: labelOpacity,
            }}>ESFUERZO</div>
          </div>

          {/* 20% bar (high value) - highlighted */}
          <div style={{textAlign: 'center'}}>
            <div style={{
              width: 100,
              height: 160 * barGrow,
              background: `linear-gradient(180deg, ${P.green} 0%, ${P.blue} 100%)`,
              borderRadius: '8px 8px 0 0',
              boxShadow: `0 0 30px ${P.green}44`,
              opacity: highlightPulse,
            }}/>
            <div style={{
              marginTop: 10,
              fontSize: 32,
              fontWeight: 700,
              color: P.green,
              fontFamily: fonts.bebasNeue,
              opacity: labelOpacity,
              textShadow: `0 0 20px ${P.green}66`,
            }}>20%</div>
            <div style={{
              fontSize: 11,
              color: P.green,
              fontFamily: fonts.dmSans,
              fontWeight: 600,
              opacity: labelOpacity,
            }}>RESULTADOS</div>
          </div>
        </div>

        {/* Arrow indicator */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: 20,
          opacity: labelOpacity,
        }}>
          <div style={{
            padding: '8px 20px',
            background: `${P.gold}22`,
            borderRadius: 20,
            border: `1px solid ${P.gold}44`,
          }}>
            <span style={{
              fontSize: 13,
              fontWeight: 700,
              color: P.gold,
              fontFamily: fonts.outfit,
            }}>
              ENFOCATE EN EL 20% 🎯
            </span>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// AI EXPLOSION / 2000% GROWTH
// ═══════════════════════════════════════════════════════════════
const AIExplosion = ({frame, delay}) => {
  const f = Math.max(0, frame - delay);
  const opacity = interpolate(f, [0, 20], [0, 1], clamp());
  const brainScale = interpolate(f, [0, 25], [0, 1], {...clamp(), easing: Easing.out(Easing.back(1.5))});
  const percentGrow = interpolate(f, [20, 50], [0, 2000], clamp());
  const explosionScale = interpolate(f, [15, 40], [0.5, 1.5], clamp());
  const glowPulse = 0.6 + Math.sin(f * 0.15) * 0.4;

  // Particle rays
  const rays = Array.from({length: 12}).map((_, i) => ({
    angle: (i / 12) * 360,
    length: interpolate(f, [20 + i * 2, 50 + i * 2], [0, 80 + i * 10], clamp()),
  }));

  return (
    <div style={{
      position: 'absolute',
      left: '50%',
      top: '50%',
      transform: 'translate(-50%, -50%)',
      opacity,
    }}>
      {/* Explosion rays */}
      <svg width="500" height="500" style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: `translate(-50%, -50%) scale(${explosionScale})`,
      }}>
        {rays.map((ray, i) => (
          <line
            key={i}
            x1="250"
            y1="250"
            x2={250 + Math.cos(ray.angle * Math.PI / 180) * ray.length}
            y2={250 + Math.sin(ray.angle * Math.PI / 180) * ray.length}
            stroke={[P.blue, P.purple, P.gold][i % 3]}
            strokeWidth="3"
            strokeLinecap="round"
            opacity={0.6}
          />
        ))}
      </svg>

      {/* Central brain */}
      <div style={{
        position: 'relative',
        transform: `scale(${brainScale})`,
      }}>
        {/* Glow */}
        <div style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          width: 200,
          height: 200,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${P.purple}${Math.round(glowPulse * 60).toString(16).padStart(2, '0')} 0%, transparent 70%)`,
          filter: 'blur(20px)',
        }}/>

        {/* Brain icon */}
        <div style={{
          width: 120,
          height: 120,
          borderRadius: '50%',
          background: `linear-gradient(135deg, ${P.purple} 0%, ${P.blue} 100%)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: `0 0 60px ${P.purple}66`,
          border: `3px solid ${P.white}22`,
        }}>
          <svg width="60" height="60" viewBox="0 0 60 60">
            {/* Brain shape */}
            <ellipse cx="22" cy="28" rx="15" ry="20" fill={P.white} opacity="0.9"/>
            <ellipse cx="38" cy="28" rx="15" ry="20" fill={P.white} opacity="0.9"/>
            <ellipse cx="30" cy="22" rx="8" ry="10" fill={P.white}/>
            {/* Circuit lines */}
            <circle cx="18" cy="25" r="3" fill={P.purple}/>
            <circle cx="42" cy="25" r="3" fill={P.blue}/>
            <circle cx="30" cy="35" r="3" fill={P.gold}/>
            <line x1="18" y1="25" x2="30" y2="35" stroke={P.purple} strokeWidth="1.5"/>
            <line x1="42" y1="25" x2="30" y2="35" stroke={P.blue} strokeWidth="1.5"/>
          </svg>
        </div>
      </div>

      {/* 2000% text */}
      <div style={{
        position: 'absolute',
        left: '50%',
        top: 180,
        transform: 'translateX(-50%)',
        textAlign: 'center',
      }}>
        <div style={{
          fontSize: 72,
          fontWeight: 400,
          color: P.gold,
          fontFamily: fonts.bebasNeue,
          letterSpacing: '0.05em',
          textShadow: `0 0 40px ${P.gold}88, 0 0 80px ${P.gold}44`,
        }}>
          {Math.round(percentGrow)}%
        </div>
        <div style={{
          fontSize: 18,
          color: P.white,
          fontFamily: fonts.outfit,
          fontWeight: 600,
          marginTop: -5,
          opacity: interpolate(f, [40, 55], [0, 1], clamp()),
        }}>
          MÁS PRODUCTIVIDAD
        </div>
      </div>

      {/* AI badge */}
      <div style={{
        position: 'absolute',
        left: '50%',
        top: 280,
        transform: 'translateX(-50%)',
        opacity: interpolate(f, [50, 65], [0, 1], clamp()),
      }}>
        <GlassCard color={P.purple} style={{padding: '12px 28px'}}>
          <span style={{
            fontSize: 16,
            fontWeight: 800,
            color: P.purple,
            fontFamily: fonts.plusJakarta,
            letterSpacing: '0.1em',
          }}>
            INTELIGENCIA ARTIFICIAL
          </span>
        </GlassCard>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// FLOATING PARTICLES (background)
// ═══════════════════════════════════════════════════════════════
const FloatingParticles = ({count = 30, frame}) => {
  const particles = React.useMemo(() =>
    Array.from({length: count}).map((_, i) => ({
      x: (i * 37) % 100,
      y: (i * 53) % 100,
      size: 2 + (i % 3),
      speed: 0.3 + (i % 5) * 0.1,
      color: [P.blue, P.purple, P.gold][i % 3],
    })), [count]);

  return (
    <>
      {particles.map((p, i) => {
        const y = (p.y + frame * p.speed * 0.1) % 110 - 5;
        return (
          <div key={i} style={{
            position: 'absolute',
            left: `${p.x}%`,
            top: `${y}%`,
            width: p.size,
            height: p.size,
            borderRadius: '50%',
            backgroundColor: p.color,
            opacity: 0.3,
            boxShadow: `0 0 ${p.size * 3}px ${p.color}`,
          }}/>
        );
      })}
    </>
  );
};

// ═══════════════════════════════════════════════════════════════
// MAIN COMPOSITION
// ═══════════════════════════════════════════════════════════════
export const HandwritingPareto = () => {
  const frame = useCurrentFrame();
  const {width, height, fps} = useVideoConfig();

  // 15 seconds = 450 frames at 30fps
  const globalFade = interpolate(frame, [0, 15, 435, 450], [0, 1, 1, 0], clamp());

  // Script segments with timing
  const segments = [
    {
      text: "La mejor forma de hacer tu negocio más rentable es apalancarte de herramientas que te ahorren trabajo y te maximicen tus ganancias",
      start: 0,
      visualStart: 20,
      visualType: 'tools',
    },
    {
      text: "Enfocarte en ese 20% que realmente te hace ganar más dinero, conocido como la Ley de Pareto",
      start: 150,
      visualStart: 170,
      visualType: 'pareto',
    },
    {
      text: "Hoy en día con Inteligencia Artificial podés explotarla a un 2000%",
      start: 290,
      visualStart: 310,
      visualType: 'ai',
    },
  ];

  // Determine current segment
  const currentSegment = segments.findIndex((s, i) => {
    const nextStart = segments[i + 1]?.start || 450;
    return frame >= s.start && frame < nextStart;
  });

  // Visual scene opacities
  const toolsOpacity = interpolate(frame, [20, 40, 140, 160], [0, 1, 1, 0], clamp());
  const paretoOpacity = interpolate(frame, [160, 180, 280, 300], [0, 1, 1, 0], clamp());
  const aiOpacity = interpolate(frame, [300, 320, 430, 450], [0, 1, 1, 0], clamp());

  return (
    <AbsoluteFill style={{backgroundColor: P.bgDeep, opacity: globalFade}}>
      {/* Background particles */}
      <FloatingParticles count={35} frame={frame}/>

      {/* Gradient overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse at 50% 30%, rgba(178,75,243,0.08) 0%, transparent 60%)',
      }}/>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* TOP SECTION: HANDWRITING AREA                             */}
      {/* ══════════════════════════════════════════════════════════ */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '42%',
        borderBottom: `1px solid ${P.dimGray}33`,
      }}>
        {/* Notebook paper effect */}
        <NotebookLines lineCount={6} spacing={58}/>

        {/* Left margin line */}
        <div style={{
          position: 'absolute',
          left: 50,
          top: 60,
          bottom: 30,
          width: 2,
          background: `linear-gradient(180deg, ${P.gold}44 0%, ${P.gold}22 100%)`,
        }}/>

        {/* Pen icon */}
        <AnimatedPen
          x={920}
          y={40}
          frame={frame}
          active={currentSegment >= 0}
          color={P.gold}
        />

        {/* Text area */}
        <div style={{
          position: 'absolute',
          top: 80,
          left: 80,
          right: 80,
        }}>
          {/* Segment 1 */}
          {frame >= segments[0].start && (
            <div style={{
              opacity: interpolate(frame, [segments[0].start, segments[0].start + 10, 145, 155], [0, 1, 1, 0], clamp()),
              marginBottom: 20,
            }}>
              <HandwritingText
                text={segments[0].text}
                startFrame={segments[0].start}
                charsPerFrame={0.9}
                fontSize={30}
                color={P.white}
                maxWidth={900}
              />
            </div>
          )}

          {/* Segment 2 */}
          {frame >= segments[1].start && (
            <div style={{
              opacity: interpolate(frame, [segments[1].start, segments[1].start + 10, 285, 295], [0, 1, 1, 0], clamp()),
              marginBottom: 20,
            }}>
              <HandwritingText
                text={segments[1].text}
                startFrame={segments[1].start}
                charsPerFrame={0.85}
                fontSize={30}
                color={P.white}
                maxWidth={900}
              />
            </div>
          )}

          {/* Segment 3 */}
          {frame >= segments[2].start && (
            <div style={{
              opacity: interpolate(frame, [segments[2].start, segments[2].start + 10, 440, 450], [0, 1, 1, 0], clamp()),
            }}>
              <HandwritingText
                text={segments[2].text}
                startFrame={segments[2].start}
                charsPerFrame={0.75}
                fontSize={32}
                color={P.gold}
                maxWidth={900}
              />
            </div>
          )}
        </div>

        {/* Section label */}
        <div style={{
          position: 'absolute',
          bottom: 15,
          left: '50%',
          transform: 'translateX(-50%)',
          opacity: 0.4,
        }}>
          <span style={{
            fontSize: 11,
            color: P.gray,
            fontFamily: fonts.outfit,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
          }}>
            ✍️ notas
          </span>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* BOTTOM SECTION: VISUALIZATIONS                            */}
      {/* ══════════════════════════════════════════════════════════ */}
      <div style={{
        position: 'absolute',
        top: '42%',
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden',
      }}>
        {/* Subtle gradient */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.3) 100%)',
        }}/>

        {/* SCENE 1: Tools & Leverage */}
        <div style={{
          position: 'absolute',
          inset: 0,
          opacity: toolsOpacity,
        }}>
          {/* Title */}
          <div style={{
            position: 'absolute',
            top: 30,
            width: '100%',
            textAlign: 'center',
          }}>
            <h2 style={{
              fontSize: 36,
              fontWeight: 400,
              color: P.white,
              fontFamily: fonts.bebasNeue,
              letterSpacing: '0.15em',
              margin: 0,
            }}>
              HERRAMIENTAS DE APALANCAMIENTO
            </h2>
          </div>

          {/* Tool icons in a grid */}
          <ToolIcon type="gear" x={200} y={350} frame={frame} delay={30} color={P.blue}/>
          <ToolIcon type="chart" x={400} y={280} frame={frame} delay={45} color={P.green}/>
          <ToolIcon type="rocket" x={600} y={380} frame={frame} delay={60} color={P.purple}/>
          <ToolIcon type="money" x={800} y={300} frame={frame} delay={75} color={P.gold}/>

          {/* Connection lines */}
          <svg style={{position: 'absolute', inset: 0, pointerEvents: 'none'}}>
            {[
              {x1: 230, y1: 350, x2: 370, y2: 280, color: P.blue, delay: 50},
              {x1: 430, y1: 280, x2: 570, y2: 380, color: P.green, delay: 65},
              {x1: 630, y1: 380, x2: 770, y2: 300, color: P.purple, delay: 80},
            ].map((line, i) => {
              const f = Math.max(0, frame - line.delay);
              const progress = interpolate(f, [0, 20], [0, 1], clamp());
              return (
                <line key={i}
                  x1={line.x1} y1={line.y1}
                  x2={line.x1 + (line.x2 - line.x1) * progress}
                  y2={line.y1 + (line.y2 - line.y1) * progress}
                  stroke={line.color}
                  strokeWidth="2"
                  strokeDasharray="5,5"
                  opacity="0.5"
                />
              );
            })}
          </svg>

          {/* Bottom text */}
          <div style={{
            position: 'absolute',
            bottom: 80,
            width: '100%',
            textAlign: 'center',
            opacity: interpolate(frame, [100, 120], [0, 1], clamp()),
          }}>
            <p style={{
              fontSize: 20,
              color: P.gold,
              fontFamily: fonts.outfit,
              fontWeight: 600,
              margin: 0,
            }}>
              Maximiza ganancias • Minimiza esfuerzo
            </p>
          </div>
        </div>

        {/* SCENE 2: Pareto Chart */}
        <div style={{
          position: 'absolute',
          inset: 0,
          opacity: paretoOpacity,
        }}>
          <ParetoChart frame={frame} delay={170}/>
        </div>

        {/* SCENE 3: AI Explosion */}
        <div style={{
          position: 'absolute',
          inset: 0,
          opacity: aiOpacity,
        }}>
          <AIExplosion frame={frame} delay={310}/>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* VIGNETTE                                                  */}
      {/* ══════════════════════════════════════════════════════════ */}
      <div style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.6) 100%)',
      }}/>
    </AbsoluteFill>
  );
};
