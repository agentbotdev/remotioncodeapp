import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  random,
} from 'remotion';
import {fonts} from '../fonts.js';

// ═══════════════════════════════════════════════════════════════
// PALETTE - Dan Koe epic neon aesthetic
// ═══════════════════════════════════════════════════════════════
const P = {
  bgDeep: '#000000',
  bgDark: '#0a0a14',
  blue: '#00D9FF',
  orange: '#FF6B35',
  purple: '#B24BF3',
  green: '#00FF41',
  pink: '#FF1493',
  yellow: '#FFD700',
  white: '#FFFFFF',
  gray: '#888888',
  dimGray: '#444444',
};

const clamp = (opts) => ({extrapolateRight: 'clamp', extrapolateLeft: 'clamp', ...opts});

// ═══════════════════════════════════════════════════════════════
// 3D PERSPECTIVE GRID (breathing)
// ═══════════════════════════════════════════════════════════════
const PerspectiveGrid = ({frame, color = P.blue, rotation = 0}) => {
  const pulse = 0.04 + Math.sin(frame * 0.04) * 0.025;
  return (
    <div style={{
      position: 'absolute', inset: 0,
      perspective: '1000px', perspectiveOrigin: '50% 30%',
      overflow: 'hidden',
    }}>
      <div style={{
        width: '250%', height: '250%',
        position: 'absolute', left: '-75%', top: '45%',
        transform: `rotateX(65deg) rotateZ(${rotation}deg)`,
        backgroundImage: `
          linear-gradient(${color}${Math.round(pulse * 255).toString(16).padStart(2, '0')} 1px, transparent 1px),
          linear-gradient(90deg, ${color}${Math.round(pulse * 255).toString(16).padStart(2, '0')} 1px, transparent 1px)
        `,
        backgroundSize: '70px 70px',
        opacity: 0.5,
      }}/>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// FLOATING PARTICLES
// ═══════════════════════════════════════════════════════════════
const Particles = ({count = 50, frame, colors = [P.blue, P.purple, P.orange]}) => {
  const pts = React.useMemo(() =>
    Array.from({length: count}).map((_, i) => ({
      x: random(`ep-x-${i}`) * 1080,
      y: random(`ep-y-${i}`) * 1920,
      size: 1 + random(`ep-s-${i}`) * 3,
      speed: 0.2 + random(`ep-sp-${i}`) * 0.8,
      opacity: 0.08 + random(`ep-o-${i}`) * 0.25,
      color: colors[Math.floor(random(`ep-c-${i}`) * colors.length)],
    })), [count, colors]);

  return <>
    {pts.map((p, i) => {
      const y = (p.y - frame * p.speed * 1.5 + 1920) % 1920;
      return <div key={i} style={{
        position: 'absolute', left: p.x, top: y,
        width: p.size, height: p.size, borderRadius: '50%',
        backgroundColor: p.color, opacity: p.opacity,
        boxShadow: `0 0 ${p.size * 3}px ${p.color}`,
      }}/>;
    })}
  </>;
};

// ═══════════════════════════════════════════════════════════════
// GLASS CARD
// ═══════════════════════════════════════════════════════════════
const GlassCard = ({children, color = P.blue, style = {}, glowIntensity = 0.15}) => (
  <div style={{
    background: `${color}08`,
    backdropFilter: 'blur(20px) saturate(180%)',
    border: `1px solid ${color}4d`,
    borderRadius: 20,
    boxShadow: `0 8px 32px ${color}${Math.round(glowIntensity * 255).toString(16).padStart(2, '0')}, inset 0 1px 0 rgba(255,255,255,0.08)`,
    position: 'relative',
    overflow: 'hidden',
    ...style,
  }}>
    {/* Glass diagonal shine */}
    <div style={{
      position: 'absolute', inset: 0, borderRadius: 20, pointerEvents: 'none',
      background: 'linear-gradient(135deg, rgba(255,255,255,0.07) 0%, transparent 50%, rgba(0,0,0,0.05) 100%)',
    }}/>
    <div style={{position: 'relative', zIndex: 1}}>{children}</div>
  </div>
);

// ═══════════════════════════════════════════════════════════════
// DATA FLOW LINE (SVG particles traveling along path)
// ═══════════════════════════════════════════════════════════════
const DataFlow = ({x1, y1, x2, y2, color, frame, delay = 0, particleCount = 5, curveOffset = -40}) => {
  const f = Math.max(0, frame - delay);
  const drawProgress = interpolate(f, [0, 25], [0, 1], clamp());
  const opacity = interpolate(f, [0, 10], [0, 1], clamp());

  const midX = (x1 + x2) / 2 + curveOffset * 0.5;
  const midY = (y1 + y2) / 2 + curveOffset;
  const pathD = `M ${x1} ${y1} Q ${midX} ${midY} ${x2} ${y2}`;
  const pathLen = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2) * 1.3;

  return (
    <svg style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', opacity}}>
      {/* Base line */}
      <path d={pathD} fill="none" stroke={`${color}33`} strokeWidth={2}
        strokeDasharray={pathLen} strokeDashoffset={pathLen * (1 - drawProgress)} strokeLinecap="round"/>
      {/* Glow line */}
      <path d={pathD} fill="none" stroke={`${color}18`} strokeWidth={8}
        strokeDasharray={pathLen} strokeDashoffset={pathLen * (1 - drawProgress)} strokeLinecap="round"/>
      {/* Particles */}
      {drawProgress >= 1 && Array.from({length: particleCount}).map((_, i) => {
        const t = ((f * 0.015 + i / particleCount) % 1);
        const px = x1 + (x2 - x1) * t + curveOffset * 0.5 * 4 * t * (1 - t);
        const py = y1 + (y2 - y1) * t + curveOffset * 4 * t * (1 - t);
        const po = Math.sin(t * Math.PI);
        return <circle key={i} cx={px} cy={py} r={3.5} fill={color} opacity={po * 0.9}
          filter={`drop-shadow(0 0 6px ${color})`}/>;
      })}
    </svg>
  );
};

// ═══════════════════════════════════════════════════════════════
// WORKFLOW NODE (n8n style)
// ═══════════════════════════════════════════════════════════════
const WfNode = ({x, y, icon, label, color, frame, delay, size = 56}) => {
  const f = Math.max(0, frame - delay);
  const scale = interpolate(f, [0, 8, 14], [0, 1.15, 1], clamp());
  const opacity = interpolate(f, [0, 8], [0, 1], clamp());
  const glowPulse = 0.3 + Math.sin(f * 0.12) * 0.2;

  return (
    <div style={{
      position: 'absolute', left: x, top: y,
      transform: `translate(-50%,-50%) scale(${scale})`, opacity,
    }}>
      <div style={{
        position: 'absolute', inset: -8, borderRadius: 18,
        background: `${color}${Math.round(glowPulse * 30).toString(16).padStart(2, '0')}`,
        filter: 'blur(12px)',
      }}/>
      <div style={{
        width: size, height: size, borderRadius: 16,
        background: `linear-gradient(145deg, ${color}33, ${color}18)`,
        border: `2px solid ${color}88`,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        position: 'relative',
      }}>
        <span style={{fontSize: size * 0.42}}>{icon}</span>
      </div>
      <div style={{
        textAlign: 'center', marginTop: 6,
        fontSize: 11, fontWeight: 700, color: P.white,
        fontFamily: fonts.dmSans, whiteSpace: 'nowrap',
        textShadow: `0 0 10px ${color}66`,
      }}>{label}</div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// LEAD CARD (CRM)
// ═══════════════════════════════════════════════════════════════
const LeadCard = ({name, email, company, status, score, frame, delay, x, y}) => {
  const f = Math.max(0, frame - delay);
  const opacity = interpolate(f, [0, 15], [0, 1], clamp());
  const slideY = interpolate(f, [0, 15], [40, 0], clamp());
  const statusColor = status === 'NUEVO' ? P.green : status === 'ACTIVO' ? P.blue : P.orange;

  return (
    <div style={{
      position: 'absolute', left: x, top: y,
      transform: `translate(-50%,-50%) translateY(${slideY}px)`, opacity,
    }}>
      <GlassCard color={P.blue} style={{width: 210, padding: '14px 16px'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8}}>
          <div style={{
            width: 28, height: 28, borderRadius: '50%',
            background: `linear-gradient(135deg, ${P.blue}, ${P.purple})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 13,
          }}>👤</div>
          <div style={{fontSize: 13, fontWeight: 700, color: P.white, fontFamily: fonts.plusJakarta}}>{name}</div>
        </div>
        <div style={{fontSize: 10, color: P.gray, fontFamily: fonts.dmSans, marginBottom: 3}}>📧 {email}</div>
        <div style={{fontSize: 10, color: P.gray, fontFamily: fonts.dmSans, marginBottom: 8}}>🏢 {company}</div>
        <div style={{height: 1, background: `${P.blue}22`, marginBottom: 8}}/>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 4}}>
            <div style={{width: 6, height: 6, borderRadius: '50%', backgroundColor: statusColor, boxShadow: `0 0 6px ${statusColor}`}}/>
            <span style={{fontSize: 10, fontWeight: 600, color: statusColor, fontFamily: fonts.outfit}}>{status}</span>
          </div>
          <span style={{fontSize: 10, color: P.blue, fontWeight: 700, fontFamily: fonts.outfit}}>Score: {score}</span>
        </div>
      </GlassCard>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// CHAT BUBBLE (Chatwoot)
// ═══════════════════════════════════════════════════════════════
const ChatBubble = ({text, isAgent, agentName, frame, delay}) => {
  const f = Math.max(0, frame - delay);
  const opacity = interpolate(f, [0, 8], [0, 1], clamp());
  const slideX = interpolate(f, [0, 8], [isAgent ? -20 : 20, 0], clamp());
  const charsToShow = isAgent
    ? Math.min(text.length, Math.floor(interpolate(f, [8, 8 + text.length * 0.6], [0, text.length], clamp())))
    : text.length;
  const displayText = text.substring(0, charsToShow);
  const showCursor = isAgent && charsToShow < text.length && f > 8;

  return (
    <div style={{
      opacity, transform: `translateX(${slideX}px)`,
      display: 'flex', flexDirection: 'column',
      alignItems: isAgent ? 'flex-start' : 'flex-end',
      marginBottom: 8, width: '100%',
    }}>
      {isAgent && agentName && (
        <div style={{fontSize: 9, color: P.purple, fontFamily: fonts.dmSans, fontWeight: 600, marginBottom: 2, marginLeft: 8}}>
          {agentName}
        </div>
      )}
      <div style={{
        maxWidth: '82%', padding: '9px 13px',
        borderRadius: isAgent ? '3px 14px 14px 14px' : '14px 14px 3px 14px',
        background: isAgent ? 'linear-gradient(135deg, #1a1a36, #222248)' : `linear-gradient(135deg, ${P.blue}, #0099cc)`,
        border: isAgent ? `1px solid ${P.purple}33` : 'none',
        fontSize: 12, color: P.white, fontFamily: fonts.dmSans, lineHeight: 1.45,
      }}>
        {displayText}{showCursor && <span style={{opacity: Math.sin(f * 0.5) > 0 ? 1 : 0, color: P.purple}}>|</span>}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// HUMAN SILHOUETTE with neon outline
// ═══════════════════════════════════════════════════════════════
const Silhouette = ({x, color, frame, delay}) => {
  const f = Math.max(0, frame - delay);
  const opacity = interpolate(f, [0, 20], [0, 1], clamp());
  const slideY = interpolate(f, [0, 20], [30, 0], clamp());
  const glowPulse = 0.6 + Math.sin(f * 0.08) * 0.3;

  return (
    <div style={{
      position: 'absolute', left: x, bottom: 80,
      transform: `translateX(-50%) translateY(${slideY}px)`, opacity,
    }}>
      <svg width="100" height="180" viewBox="0 0 100 180">
        {/* Head */}
        <circle cx="50" cy="25" r="18" fill="#050508" stroke={color} strokeWidth="2.5" opacity={glowPulse}/>
        <circle cx="50" cy="25" r="18" fill="none" stroke={color} strokeWidth="1" opacity="0.4" filter="url(#silGlow)"/>
        {/* Body */}
        <path d="M50 43 L50 100" stroke={color} strokeWidth="3" strokeLinecap="round" opacity={glowPulse}/>
        {/* Arms crossed */}
        <path d="M50 60 L28 78 M50 60 L72 78 M28 78 L50 72 M72 78 L50 72" stroke={color} strokeWidth="2.5" strokeLinecap="round" opacity={glowPulse}/>
        {/* Legs */}
        <path d="M50 100 L32 170 M50 100 L68 170" stroke={color} strokeWidth="3" strokeLinecap="round" opacity={glowPulse}/>
        {/* Glow filter */}
        <defs>
          <filter id="silGlow"><feGaussianBlur stdDeviation="3" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>
      </svg>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// METRIC PANEL (floating 3D)
// ═══════════════════════════════════════════════════════════════
const MetricPanel = ({title, value, x, y, color = P.blue, frame, delay}) => {
  const f = Math.max(0, frame - delay);
  const opacity = interpolate(f, [0, 15], [0, 1], clamp());
  const rotY = Math.sin(f * 0.02) * 5;

  return (
    <div style={{
      position: 'absolute', left: x, top: y,
      transform: `translate(-50%,-50%) perspective(600px) rotateY(${rotY}deg)`,
      opacity,
    }}>
      <GlassCard color={color} style={{padding: '14px 22px', minWidth: 180}}>
        <div style={{fontSize: 10, color: P.gray, letterSpacing: '0.15em', fontFamily: fonts.outfit, fontWeight: 600, marginBottom: 4}}>
          {title}
        </div>
        <div style={{fontSize: 36, fontWeight: 400, color, fontFamily: fonts.bebasNeue,
          letterSpacing: '0.05em', textShadow: `0 0 20px ${color}88`}}>
          {value}
        </div>
      </GlassCard>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// AI THINKING STEP
// ═══════════════════════════════════════════════════════════════
const ThinkingStep = ({label, icon, color, frame, delay, y}) => {
  const f = Math.max(0, frame - delay);
  const opacity = interpolate(f, [0, 12], [0, 1], clamp());
  const scaleX = interpolate(f, [0, 12], [0.3, 1], clamp());
  const barProgress = interpolate(f, [12, 25], [0, 1], clamp());
  const checkOpacity = interpolate(f, [25, 30], [0, 1], clamp());

  return (
    <div style={{
      position: 'absolute', left: '50%', top: y,
      transform: `translate(-50%,-50%) scaleX(${scaleX})`, opacity,
      width: 320,
    }}>
      <GlassCard color={color} style={{padding: '12px 18px'}}>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
            <span style={{fontSize: 18}}>{icon}</span>
            <span style={{fontSize: 15, fontWeight: 700, color: P.white, fontFamily: fonts.outfit}}>{label}</span>
          </div>
          <span style={{fontSize: 16, opacity: checkOpacity}}>✓</span>
        </div>
        <div style={{marginTop: 8, height: 3, borderRadius: 2, background: `${color}22`, overflow: 'hidden'}}>
          <div style={{width: `${barProgress * 100}%`, height: '100%', borderRadius: 2,
            background: `linear-gradient(90deg, ${color}, ${color}cc)`,
            boxShadow: `0 0 10px ${color}66`,
          }}/>
        </div>
      </GlassCard>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// MAIN COMPOSITION: N8nChatwootEpic
// ═══════════════════════════════════════════════════════════════
export const N8nChatwootEpic = () => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();

  // ── GLOBAL ──
  const globalFade = interpolate(frame, [0, 20, 880, 900], [0, 1, 1, 0], clamp());

  // ── SCENE OPACITIES ──
  const s1 = interpolate(frame, [0, 15, 155, 180], [0, 1, 1, 0], clamp());
  const s2 = interpolate(frame, [170, 195, 395, 420], [0, 1, 1, 0], clamp());
  const s3 = interpolate(frame, [410, 435, 575, 600], [0, 1, 1, 0], clamp());
  const s4 = interpolate(frame, [590, 615, 755, 780], [0, 1, 1, 0], clamp());
  const s5 = interpolate(frame, [770, 795, 880, 900], [0, 1, 1, 0], clamp());

  // Grid rotation evolves across scenes
  const gridRotation = interpolate(frame, [0, 180, 420, 600, 780, 900], [0, 5, 15, 10, 20, 25], clamp());

  // ═══════════════════════════════════════════════════════════
  // SCENE 1: CRM GENESIS (0-180)
  // ═══════════════════════════════════════════════════════════
  const portalScale = interpolate(frame, [10, 50], [0, 1], clamp());
  const portalGlow = 0.3 + Math.sin(frame * 0.06) * 0.15;
  const portalRotation = frame * 0.3;

  // CRM title
  const crmTitleOpacity = interpolate(frame, [60, 85, 155, 175], [0, 1, 1, 0], clamp());

  // Concentric waves
  const waves = [0, 1, 2].map(i => {
    const waveFrame = Math.max(0, frame - 30 - i * 20);
    const waveScale = interpolate(waveFrame, [0, 50], [0.5, 2.5], clamp());
    const waveOp = interpolate(waveFrame, [0, 50], [0.4, 0], clamp());
    return {scale: waveScale, opacity: waveOp};
  });

  // ═══════════════════════════════════════════════════════════
  // SCENE 2: N8N WORKFLOW (180-420)
  // ═══════════════════════════════════════════════════════════
  // Workflow nodes - positions relative to workflow container
  const wfNodes = [
    {x: 270, y: 80, icon: '🔗', label: 'Webhook', color: P.purple, delay: 200},
    {x: 270, y: 210, icon: '🧠', label: 'AI Agent', color: P.blue, delay: 220},
    {x: 130, y: 340, icon: '📊', label: 'CRM Update', color: P.orange, delay: 260},
    {x: 410, y: 340, icon: '😊', label: 'Sentiment', color: P.green, delay: 270},
    {x: 270, y: 460, icon: '🔀', label: 'Router', color: P.yellow, delay: 300},
    {x: 130, y: 580, icon: '💬', label: 'Chatwoot', color: P.pink, delay: 330},
    {x: 410, y: 580, icon: '📧', label: 'Email', color: P.orange, delay: 340},
  ];

  // Connections between nodes
  const wfConns = [
    {x1: 270, y1: 110, x2: 270, y2: 185, color: P.purple, delay: 215, curve: 0},
    {x1: 270, y1: 240, x2: 155, y2: 315, color: P.blue, delay: 250, curve: -20},
    {x1: 270, y1: 240, x2: 385, y2: 315, color: P.blue, delay: 255, curve: 20},
    {x1: 155, y1: 370, x2: 270, y2: 435, color: P.orange, delay: 290, curve: 20},
    {x1: 385, y1: 370, x2: 270, y2: 435, color: P.green, delay: 295, curve: -20},
    {x1: 270, y1: 490, x2: 155, y2: 555, color: P.yellow, delay: 325, curve: -15},
    {x1: 270, y1: 490, x2: 385, y2: 555, color: P.yellow, delay: 330, curve: 15},
  ];

  // Scene 2 label
  const s2Label = interpolate(frame, [350, 370, 395, 420], [0, 1, 1, 0], clamp());

  // ═══════════════════════════════════════════════════════════
  // SCENE 3: AI AGENT (420-600)
  // ═══════════════════════════════════════════════════════════
  const aiSphereScale = interpolate(frame, [430, 455], [0, 1], clamp());
  const aiSpherePulse = 1 + Math.sin(frame * 0.1) * 0.06;

  // Orbiting particles around AI sphere
  const aiOrbitParticles = React.useMemo(() =>
    Array.from({length: 8}).map((_, i) => ({
      angle: (i / 8) * Math.PI * 2,
      radius: 90 + random(`aio-r-${i}`) * 30,
      speed: 0.03 + random(`aio-s-${i}`) * 0.02,
      size: 3 + random(`aio-sz-${i}`) * 3,
    })), []);

  // AI result card
  const aiResultOpacity = interpolate(frame, [550, 570], [0, 1], clamp());

  // ═══════════════════════════════════════════════════════════
  // SCENE 4: CHATWOOT (600-780)
  // ═══════════════════════════════════════════════════════════
  const chatWindowOpacity = interpolate(frame, [610, 635], [0, 1], clamp());

  // ═══════════════════════════════════════════════════════════
  // SCENE 5: ECOSYSTEM (780-900)
  // ═══════════════════════════════════════════════════════════
  const finalTextDelay = [830, 845, 860];
  const finalTexts = ['AUTOMATE', 'SCALE', 'DOMINATE'];
  const finalColors = [P.blue, P.orange, P.green];
  const flashOpacity = interpolate(frame, [888, 893, 900], [0, 0.6, 0], clamp());

  return (
    <AbsoluteFill style={{backgroundColor: P.bgDeep, opacity: globalFade}}>
      {/* ── BACKGROUND: 3D Grid ── */}
      <PerspectiveGrid frame={frame} rotation={gridRotation}/>

      {/* ── BACKGROUND: Particles ── */}
      <Particles count={45} frame={frame}/>

      {/* ── Radial ambient glow ── */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse at 50% 40%, rgba(0,217,255,0.04) 0%, transparent 60%)',
      }}/>

      {/* ══════════════════════════════════════════════════════ */}
      {/* SCENE 1: CRM GENESIS                                  */}
      {/* ══════════════════════════════════════════════════════ */}
      <div style={{position: 'absolute', inset: 0, opacity: s1}}>
        {/* Concentric waves */}
        {waves.map((w, i) => (
          <div key={i} style={{
            position: 'absolute', left: '50%', top: '42%',
            width: 300, height: 300, borderRadius: '50%',
            transform: `translate(-50%,-50%) scale(${w.scale})`,
            border: `2px solid ${P.blue}`,
            opacity: w.opacity,
          }}/>
        ))}

        {/* CRM Portal */}
        <div style={{
          position: 'absolute', left: '50%', top: '42%',
          transform: `translate(-50%,-50%) scale(${portalScale}) rotate(${portalRotation}deg)`,
        }}>
          {/* Portal glow */}
          <div style={{
            position: 'absolute', inset: -40, borderRadius: '50%',
            background: `radial-gradient(circle, ${P.blue}${Math.round(portalGlow * 50).toString(16).padStart(2, '0')} 0%, transparent 70%)`,
            filter: 'blur(20px)',
          }}/>
          {/* Portal circle */}
          <div style={{
            width: 260, height: 260, borderRadius: '50%',
            background: `radial-gradient(circle, ${P.blue}12 0%, transparent 70%)`,
            border: `3px solid ${P.blue}80`,
            boxShadow: `0 0 60px ${P.blue}44, inset 0 0 40px ${P.blue}11`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            overflow: 'hidden',
          }}>
            {/* Mini CRM dashboard inside */}
            <div style={{width: 180, padding: 12}}>
              {/* Search bar */}
              <div style={{height: 14, borderRadius: 7, background: `${P.blue}18`, marginBottom: 10, border: `1px solid ${P.blue}22`}}/>
              {/* Contact rows */}
              {[0, 1, 2, 3].map(i => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 6, marginBottom: 7,
                  opacity: interpolate(frame, [25 + i * 8, 35 + i * 8], [0, 1], clamp()),
                }}>
                  <div style={{
                    width: 16, height: 16, borderRadius: '50%',
                    background: [P.blue, P.purple, P.orange, P.green][i],
                    opacity: 0.6,
                  }}/>
                  <div style={{flex: 1}}>
                    <div style={{height: 5, borderRadius: 3, background: `${P.white}18`, marginBottom: 3, width: `${60 + random(`cr-${i}`) * 40}%`}}/>
                    <div style={{height: 3, borderRadius: 2, background: `${P.white}0d`, width: `${40 + random(`cr2-${i}`) * 30}%`}}/>
                  </div>
                  <div style={{
                    width: 7, height: 7, borderRadius: '50%',
                    background: [P.green, P.orange, P.green, P.blue][i],
                  }}/>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CRM Title */}
        <div style={{
          position: 'absolute', top: 140, width: '100%', textAlign: 'center',
          opacity: crmTitleOpacity,
        }}>
          <h1 style={{
            fontSize: 130, fontWeight: 400, letterSpacing: '0.4em',
            fontFamily: fonts.bebasNeue, margin: 0, lineHeight: 1,
            background: `linear-gradient(180deg, ${P.white} 0%, ${P.blue} 100%)`,
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            textShadow: 'none', filter: `drop-shadow(0 0 30px ${P.blue}44)`,
          }}>CRM</h1>
        </div>

        {/* Lead Cards */}
        <LeadCard name="Juan Pérez" email="juan@email.com" company="TechCorp" status="NUEVO" score="87" frame={frame} delay={70} x={200} y={1150}/>
        <LeadCard name="María García" email="maria@startup.io" company="StartupXYZ" status="ACTIVO" score="92" frame={frame} delay={85} x={540} y={1300}/>
        <LeadCard name="Carlos López" email="carlos@agency.co" company="Agency Pro" status="LEAD" score="74" frame={frame} delay={100} x={880} y={1150}/>

        {/* Subtitle */}
        <div style={{
          position: 'absolute', bottom: 200, width: '100%', textAlign: 'center',
          opacity: interpolate(frame, [110, 130, 155, 175], [0, 1, 1, 0], clamp()),
        }}>
          <p style={{fontSize: 24, color: P.gray, fontFamily: fonts.playfair, fontWeight: 400, fontStyle: 'italic', margin: 0}}>
            El cerebro de tu negocio
          </p>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════ */}
      {/* SCENE 2: N8N WORKFLOW                                 */}
      {/* ══════════════════════════════════════════════════════ */}
      <div style={{position: 'absolute', inset: 0, opacity: s2}}>
        {/* Scene title */}
        <div style={{
          position: 'absolute', top: 110, width: '100%', textAlign: 'center',
          opacity: interpolate(frame, [190, 210], [0, 1], clamp()),
        }}>
          <h2 style={{fontSize: 72, fontWeight: 400, color: P.white, fontFamily: fonts.bebasNeue, margin: 0, letterSpacing: '0.15em'}}>
            WORKFLOW
          </h2>
          <p style={{fontSize: 18, color: P.orange, fontFamily: fonts.outfit, marginTop: 8, fontWeight: 500}}>
            n8n orquesta el flujo completo
          </p>
        </div>

        {/* Workflow canvas */}
        <div style={{
          position: 'absolute', left: '50%', top: 230,
          transform: 'translateX(-50%)',
          width: 540, height: 660,
        }}>
          {/* Canvas background */}
          <GlassCard color={P.orange} style={{
            width: '100%', height: '100%', padding: 0,
          }} glowIntensity={0.08}>
            {/* Title bar */}
            <div style={{
              padding: '10px 16px',
              borderBottom: `1px solid ${P.orange}22`,
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <div style={{width: 8, height: 8, borderRadius: '50%', background: P.orange}}/>
              <span style={{fontSize: 12, color: P.orange, fontWeight: 700, fontFamily: fonts.dmSans}}>n8n workflow</span>
            </div>
            {/* Canvas dots */}
            <div style={{position: 'absolute', inset: 0, top: 36, overflow: 'hidden'}}>
              <svg width="100%" height="100%" style={{opacity: 0.15}}>
                {Array.from({length: 12}).map((_, row) =>
                  Array.from({length: 8}).map((_, col) => (
                    <circle key={`${row}-${col}`} cx={35 + col * 68} cy={35 + row * 55} r={1.5} fill={P.orange}/>
                  ))
                )}
              </svg>
            </div>
          </GlassCard>

          {/* Connections (behind nodes) */}
          {wfConns.map((c, i) => (
            <DataFlow key={`wc-${i}`}
              x1={c.x1} y1={c.y1 + 36} x2={c.x2} y2={c.y2 + 36}
              color={c.color} frame={frame} delay={c.delay}
              particleCount={4} curveOffset={c.curve}
            />
          ))}

          {/* Nodes */}
          {wfNodes.map((n, i) => (
            <WfNode key={`wn-${i}`}
              x={n.x} y={n.y + 36}
              icon={n.icon} label={n.label} color={n.color}
              frame={frame} delay={n.delay}
            />
          ))}
        </div>

        {/* Status badges */}
        <div style={{
          position: 'absolute', bottom: 220, width: '100%',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
          opacity: s2Label,
        }}>
          {[
            {icon: '⚡', text: 'Trigger recibido', color: P.purple},
            {icon: '🧠', text: 'AI procesando consulta', color: P.blue},
            {icon: '📊', text: 'CRM actualizado', color: P.orange},
            {icon: '💬', text: 'Respuesta enviada', color: P.green},
          ].map((b, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: `${b.color}11`, border: `1px solid ${b.color}33`,
              borderRadius: 12, padding: '8px 18px',
              opacity: interpolate(frame, [355 + i * 8, 365 + i * 8], [0, 1], clamp()),
            }}>
              <span style={{fontSize: 14}}>{b.icon}</span>
              <span style={{fontSize: 13, color: b.color, fontFamily: fonts.outfit, fontWeight: 600}}>{b.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════ */}
      {/* SCENE 3: AI AGENT                                     */}
      {/* ══════════════════════════════════════════════════════ */}
      <div style={{position: 'absolute', inset: 0, opacity: s3}}>
        {/* Spotlight overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(circle at 50% 35%, transparent 15%, rgba(0,0,0,0.7) 60%)',
        }}/>

        {/* Title */}
        <div style={{
          position: 'absolute', top: 120, width: '100%', textAlign: 'center',
          opacity: interpolate(frame, [430, 450], [0, 1], clamp()),
        }}>
          <h2 style={{fontSize: 68, fontWeight: 400, color: P.white, fontFamily: fonts.bebasNeue, margin: 0, letterSpacing: '0.15em'}}>
            AI AGENT
          </h2>
          <p style={{fontSize: 16, color: P.blue, fontFamily: fonts.outfit, marginTop: 6}}>
            Procesamiento inteligente
          </p>
        </div>

        {/* AI Sphere */}
        <div style={{
          position: 'absolute', left: '50%', top: '30%',
          transform: `translate(-50%,-50%) scale(${aiSphereScale * aiSpherePulse})`,
        }}>
          {/* Outer glow */}
          <div style={{
            position: 'absolute', inset: -50, borderRadius: '50%',
            background: `radial-gradient(circle, ${P.blue}22 0%, transparent 70%)`,
            filter: 'blur(25px)',
          }}/>
          {/* Sphere */}
          <div style={{
            width: 140, height: 140, borderRadius: '50%',
            background: `radial-gradient(circle at 35% 35%, ${P.blue}66 0%, ${P.blue}22 50%, ${P.purple}11 100%)`,
            border: `2px solid ${P.blue}66`,
            boxShadow: `0 0 50px ${P.blue}44, 0 0 100px ${P.blue}22`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{fontSize: 48}}>🧠</span>
          </div>

          {/* Orbiting particles */}
          {aiOrbitParticles.map((p, i) => {
            const angle = p.angle + frame * p.speed;
            const px = Math.cos(angle) * p.radius + 70;
            const py = Math.sin(angle) * p.radius + 70;
            return <div key={i} style={{
              position: 'absolute', left: px, top: py,
              width: p.size, height: p.size, borderRadius: '50%',
              background: P.blue, opacity: 0.7,
              boxShadow: `0 0 8px ${P.blue}`,
              transform: 'translate(-50%,-50%)',
            }}/>;
          })}
        </div>

        {/* Thinking steps */}
        <ThinkingStep label="ANALIZAR" icon="🔍" color={P.blue} frame={frame} delay={470} y={620}/>
        <ThinkingStep label="CONTEXTO CRM" icon="📊" color={P.orange} frame={frame} delay={495} y={710}/>
        <ThinkingStep label="DECISIÓN" icon="⚡" color={P.purple} frame={frame} delay={520} y={800}/>

        {/* Result card */}
        <div style={{
          position: 'absolute', left: '50%', top: 920,
          transform: 'translate(-50%,-50%)',
          opacity: aiResultOpacity,
        }}>
          <GlassCard color={P.green} style={{padding: '18px 24px', width: 340}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10}}>
              <span style={{fontSize: 20}}>✅</span>
              <span style={{fontSize: 16, fontWeight: 800, color: P.green, fontFamily: fonts.plusJakarta}}>Respuesta Generada</span>
            </div>
            {[
              {label: 'Sentimiento', value: 'Positivo 😊', color: P.green},
              {label: 'Confianza', value: '94%', color: P.blue},
              {label: 'Canal', value: 'Chatwoot', color: P.pink},
            ].map((r, i) => (
              <div key={i} style={{display: 'flex', justifyContent: 'space-between', marginBottom: 5}}>
                <span style={{fontSize: 12, color: P.gray, fontFamily: fonts.dmSans}}>{r.label}</span>
                <span style={{fontSize: 12, color: r.color, fontWeight: 700, fontFamily: fonts.outfit}}>{r.value}</span>
              </div>
            ))}
          </GlassCard>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════ */}
      {/* SCENE 4: CHATWOOT DELIVERY                            */}
      {/* ══════════════════════════════════════════════════════ */}
      <div style={{position: 'absolute', inset: 0, opacity: s4}}>
        {/* Title */}
        <div style={{
          position: 'absolute', top: 100, width: '100%', textAlign: 'center',
          opacity: interpolate(frame, [610, 630], [0, 1], clamp()),
        }}>
          <h2 style={{fontSize: 68, fontWeight: 400, color: P.white, fontFamily: fonts.bebasNeue, margin: 0, letterSpacing: '0.15em'}}>
            CHATWOOT
          </h2>
          <p style={{fontSize: 16, color: P.pink, fontFamily: fonts.outfit, marginTop: 6}}>
            Mensajería inteligente en tiempo real
          </p>
        </div>

        {/* Chat window */}
        <div style={{
          position: 'absolute', left: '50%', top: 220,
          transform: 'translateX(-50%)',
          width: 480, opacity: chatWindowOpacity,
        }}>
          <GlassCard color={P.pink} style={{padding: 0, overflow: 'hidden'}} glowIntensity={0.12}>
            {/* Header */}
            <div style={{
              padding: '14px 18px',
              borderBottom: `1px solid ${P.pink}22`,
              display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: `linear-gradient(135deg, ${P.pink}, ${P.purple})`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 18,
              }}>💬</div>
              <div>
                <div style={{fontSize: 14, fontWeight: 700, color: P.white, fontFamily: fonts.plusJakarta}}>Chatwoot</div>
                <div style={{display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: P.green, fontFamily: fonts.dmSans}}>
                  <div style={{width: 6, height: 6, borderRadius: '50%', background: P.green}}/>
                  AI Agent Online
                </div>
              </div>
              <div style={{marginLeft: 'auto', display: 'flex', gap: 6}}>
                {[P.green, P.yellow, P.pink].map((c, i) => (
                  <div key={i} style={{width: 10, height: 10, borderRadius: '50%', background: `${c}66`}}/>
                ))}
              </div>
            </div>

            {/* Conversation list */}
            <div style={{padding: '10px 14px', borderBottom: `1px solid ${P.pink}11`}}>
              <div style={{fontSize: 10, color: P.gray, fontFamily: fonts.outfit, fontWeight: 600, letterSpacing: '0.1em', marginBottom: 8}}>
                CONVERSACIONES
              </div>
              {[
                {name: 'Juan Pérez', msg: 'Necesito ayuda con la API', time: '2 min', online: true},
                {name: 'María García', msg: 'Consulta sobre precios', time: '5 min', online: true},
                {name: 'Carlos López', msg: 'Reporte de bug', time: '12 min', online: false},
              ].map((conv, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '8px 10px', borderRadius: 10, marginBottom: 4,
                  background: i === 0 ? `${P.blue}11` : 'transparent',
                  border: i === 0 ? `1px solid ${P.blue}22` : '1px solid transparent',
                  opacity: interpolate(frame, [630 + i * 10, 640 + i * 10], [0, 1], clamp()),
                }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%', position: 'relative',
                    background: `linear-gradient(135deg, ${[P.blue, P.purple, P.orange][i]}, ${[P.purple, P.pink, P.yellow][i]})`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12,
                  }}>
                    👤
                    {conv.online && <div style={{
                      position: 'absolute', bottom: -1, right: -1,
                      width: 8, height: 8, borderRadius: '50%', background: P.green,
                      border: '2px solid #0d0d1a',
                    }}/>}
                  </div>
                  <div style={{flex: 1}}>
                    <div style={{fontSize: 11, fontWeight: 700, color: P.white, fontFamily: fonts.plusJakarta}}>{conv.name}</div>
                    <div style={{fontSize: 9, color: P.gray, fontFamily: fonts.dmSans}}>{conv.msg}</div>
                  </div>
                  <div style={{fontSize: 8, color: P.dimGray, fontFamily: fonts.dmSans}}>{conv.time}</div>
                </div>
              ))}
            </div>

            {/* Active chat */}
            <div style={{padding: '12px 14px', minHeight: 420}}>
              <div style={{fontSize: 9, color: P.dimGray, fontFamily: fonts.dmSans, textAlign: 'center', marginBottom: 10}}>
                Hoy
              </div>
              <ChatBubble text="Hola, necesito ayuda con la integración de mi API" isAgent={false} frame={frame} delay={660}/>
              <ChatBubble text="¡Hola Juan! Soy un agente de IA. Puedo ayudarte con tu API. ¿Qué endpoint necesitas configurar?" isAgent={true} agentName="🤖 AI Agent" frame={frame} delay={680}/>
              <ChatBubble text="El webhook de pagos no responde" isAgent={false} frame={frame} delay={710}/>
              <ChatBubble text="He revisado los logs. El endpoint necesita autenticación Bearer. Te envío la config correcta." isAgent={true} agentName="🤖 AI Agent" frame={frame} delay={725}/>
              <ChatBubble text="Problema resuelto. Ticket cerrado ✓" isAgent={true} agentName="🤖 AI Agent" frame={frame} delay={750}/>
            </div>
          </GlassCard>
        </div>

        {/* Connection line from top */}
        <DataFlow x1={540} y1={80} x2={540} y2={210} color={P.pink} frame={frame} delay={620} particleCount={6} curveOffset={0}/>

        {/* Bottom badges */}
        <div style={{
          position: 'absolute', bottom: 120, width: '100%',
          display: 'flex', justifyContent: 'center', gap: 14,
          opacity: interpolate(frame, [720, 740], [0, 1], clamp()),
        }}>
          {[
            {icon: '⚡', text: 'Tiempo real', color: P.blue},
            {icon: '🧠', text: 'AI-Powered', color: P.purple},
            {icon: '✓✓', text: 'Auto-reply', color: P.green},
          ].map((b, i) => (
            <div key={i} style={{
              background: `${b.color}11`, border: `1px solid ${b.color}33`,
              borderRadius: 10, padding: '7px 14px',
              display: 'flex', alignItems: 'center', gap: 6,
              fontSize: 11, color: b.color, fontFamily: fonts.outfit, fontWeight: 600,
            }}>{b.icon} {b.text}</div>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════ */}
      {/* SCENE 5: FULL ECOSYSTEM                               */}
      {/* ══════════════════════════════════════════════════════ */}
      <div style={{position: 'absolute', inset: 0, opacity: s5}}>
        {/* Mini ecosystem diagram */}
        <div style={{
          position: 'absolute', left: '50%', top: '25%',
          transform: 'translate(-50%,-50%)',
          width: 500, height: 300,
          opacity: interpolate(frame, [785, 810], [0, 1], clamp()),
        }}>
          {/* CRM node */}
          <div style={{position: 'absolute', left: '50%', top: 0, transform: 'translateX(-50%)'}}>
            <GlassCard color={P.blue} style={{padding: '10px 24px'}}>
              <span style={{fontSize: 14, fontWeight: 800, color: P.blue, fontFamily: fonts.plusJakarta}}>📊 CRM</span>
            </GlassCard>
          </div>
          {/* n8n node */}
          <div style={{position: 'absolute', left: '50%', top: '40%', transform: 'translateX(-50%)'}}>
            <GlassCard color={P.orange} style={{padding: '10px 24px'}}>
              <span style={{fontSize: 14, fontWeight: 800, color: P.orange, fontFamily: fonts.plusJakarta}}>⚡ n8n</span>
            </GlassCard>
          </div>
          {/* Chatwoot */}
          <div style={{position: 'absolute', left: '20%', bottom: 0, transform: 'translateX(-50%)'}}>
            <GlassCard color={P.pink} style={{padding: '10px 20px'}}>
              <span style={{fontSize: 13, fontWeight: 800, color: P.pink, fontFamily: fonts.plusJakarta}}>💬 Chatwoot</span>
            </GlassCard>
          </div>
          {/* AI */}
          <div style={{position: 'absolute', left: '80%', bottom: 0, transform: 'translateX(-50%)'}}>
            <GlassCard color={P.purple} style={{padding: '10px 20px'}}>
              <span style={{fontSize: 13, fontWeight: 800, color: P.purple, fontFamily: fonts.plusJakarta}}>🧠 AI Agent</span>
            </GlassCard>
          </div>

          {/* Connections */}
          <DataFlow x1={250} y1={50} x2={250} y2={110} color={P.blue} frame={frame} delay={795} particleCount={3} curveOffset={0}/>
          <DataFlow x1={200} y1={160} x2={120} y2={240} color={P.orange} frame={frame} delay={800} particleCount={3} curveOffset={-15}/>
          <DataFlow x1={300} y1={160} x2={380} y2={240} color={P.orange} frame={frame} delay={805} particleCount={3} curveOffset={15}/>
        </div>

        {/* Metric panels */}
        <MetricPanel title="CONVERSACIONES HOY" value="1,247" x={200} y={850} color={P.blue} frame={frame} delay={810}/>
        <MetricPanel title="AUTOMATIZADAS" value="94%" x={880} y={900} color={P.green} frame={frame} delay={818}/>
        <MetricPanel title="TIEMPO RESPUESTA" value="8.2s" x={200} y={1050} color={P.orange} frame={frame} delay={826}/>
        <MetricPanel title="SATISFACCIÓN" value="97%" x={880} y={1100} color={P.purple} frame={frame} delay={834}/>

        {/* Silhouettes */}
        <Silhouette x={270} color={P.blue} frame={frame} delay={815}/>
        <Silhouette x={540} color={P.orange} frame={frame} delay={822}/>
        <Silhouette x={810} color={P.green} frame={frame} delay={829}/>

        {/* Final texts */}
        {finalTexts.map((text, i) => {
          const fDelay = finalTextDelay[i];
          const tOp = interpolate(frame, [fDelay, fDelay + 12], [0, 1], clamp());
          const tY = interpolate(frame, [fDelay, fDelay + 12], [20, 0], clamp());
          return (
            <div key={i} style={{
              position: 'absolute',
              left: '50%', top: 1340 + i * 80,
              transform: `translate(-50%,-50%) translateY(${tY}px)`,
              opacity: tOp,
            }}>
              <h1 style={{
                fontSize: 84, fontWeight: 400, color: finalColors[i],
                fontFamily: fonts.bebasNeue, margin: 0, letterSpacing: '0.25em',
                textShadow: `0 0 40px ${finalColors[i]}66, 0 0 80px ${finalColors[i]}33`,
              }}>{text}</h1>
            </div>
          );
        })}

        {/* Final flash */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: P.white, opacity: flashOpacity,
        }}/>
      </div>

      {/* ── VIGNETTE ── */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,0.7) 100%)',
      }}/>
    </AbsoluteFill>
  );
};
