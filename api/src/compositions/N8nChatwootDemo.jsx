import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Sequence,
  random,
} from 'remotion';
import {fonts} from '../fonts.js';

// ============================================
// WORKFLOW NODE COMPONENT (n8n-style)
// ============================================
const WorkflowNode = ({x, y, label, icon, color, delay, frame, scale = 1}) => {
  const f = Math.max(0, frame - delay);
  const opacity = interpolate(f, [0, 12], [0, 1], {
    extrapolateRight: 'clamp',
    extrapolateLeft: 'clamp',
  });
  const nodeScale = interpolate(f, [0, 12], [0.5, 1], {
    extrapolateRight: 'clamp',
    extrapolateLeft: 'clamp',
  });
  const glowPulse = interpolate(
    Math.sin((f / 30) * Math.PI * 2),
    [-1, 1],
    [0.3, 0.8],
  );

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: `translate(-50%, -50%) scale(${nodeScale * scale})`,
        opacity,
      }}
    >
      {/* Glow ring */}
      <div
        style={{
          position: 'absolute',
          inset: -12,
          borderRadius: 28,
          background: `${color}${Math.floor(glowPulse * 40)
            .toString(16)
            .padStart(2, '0')}`,
          filter: 'blur(15px)',
        }}
      />
      {/* Node body */}
      <div
        style={{
          width: 130,
          height: 130,
          borderRadius: 24,
          background: `linear-gradient(145deg, ${color}22, ${color}11)`,
          border: `2px solid ${color}88`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backdropFilter: 'blur(10px)',
          position: 'relative',
        }}
      >
        <div style={{fontSize: 44, marginBottom: 6}}>{icon}</div>
        <div
          style={{
            fontSize: 16,
            fontWeight: 700,
            color: '#ffffff',
            fontFamily: fonts.inter,
            textAlign: 'center',
            lineHeight: 1.1,
            padding: '0 8px',
          }}
        >
          {label}
        </div>
      </div>
    </div>
  );
};

// ============================================
// ANIMATED CONNECTION LINE
// ============================================
const ConnectionLine = ({x1, y1, x2, y2, color, delay, frame}) => {
  const f = Math.max(0, frame - delay);
  const progress = interpolate(f, [0, 20], [0, 1], {
    extrapolateRight: 'clamp',
    extrapolateLeft: 'clamp',
  });
  const opacity = interpolate(f, [0, 8], [0, 1], {
    extrapolateRight: 'clamp',
    extrapolateLeft: 'clamp',
  });

  // Calculate midpoint for curve
  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2 - 30;

  const pathD = `M ${x1} ${y1} Q ${midX} ${midY} ${x2} ${y2}`;
  const pathLength = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2) * 1.2;

  // Data flow particle
  const particlePos = interpolate((f % 40) / 40, [0, 1], [0, 1]);

  return (
    <svg
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        opacity,
      }}
    >
      {/* Main line */}
      <path
        d={pathD}
        fill="none"
        stroke={`${color}66`}
        strokeWidth={3}
        strokeDasharray={pathLength}
        strokeDashoffset={pathLength * (1 - progress)}
        strokeLinecap="round"
      />
      {/* Glow line */}
      <path
        d={pathD}
        fill="none"
        stroke={`${color}22`}
        strokeWidth={8}
        strokeDasharray={pathLength}
        strokeDashoffset={pathLength * (1 - progress)}
        strokeLinecap="round"
      />
      {/* Data flow particle */}
      {progress >= 1 && (
        <circle r={5} fill={color} filter={`drop-shadow(0 0 6px ${color})`}>
          <animateMotion
            dur="1.3s"
            repeatCount="indefinite"
            path={pathD}
            keyPoints={`${particlePos};${particlePos}`}
            keyTimes="0;1"
          />
        </circle>
      )}
    </svg>
  );
};

// ============================================
// CHAT BUBBLE (Chatwoot-style)
// ============================================
const ChatBubble = ({text, isAgent, delay, frame, agentName}) => {
  const f = Math.max(0, frame - delay);
  const opacity = interpolate(f, [0, 10], [0, 1], {
    extrapolateRight: 'clamp',
    extrapolateLeft: 'clamp',
  });
  const slideY = interpolate(f, [0, 10], [20, 0], {
    extrapolateRight: 'clamp',
    extrapolateLeft: 'clamp',
  });

  // Typing animation for agent messages
  const charsToShow = isAgent
    ? Math.min(text.length, Math.floor(interpolate(f, [10, 10 + text.length * 0.8], [0, text.length], {
        extrapolateRight: 'clamp',
        extrapolateLeft: 'clamp',
      })))
    : text.length;

  const displayText = text.substring(0, charsToShow);
  const showCursor = isAgent && charsToShow < text.length && f > 10;

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${slideY}px)`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: isAgent ? 'flex-start' : 'flex-end',
        marginBottom: 14,
        width: '100%',
      }}
    >
      {isAgent && agentName && (
        <div
          style={{
            fontSize: 13,
            color: '#8b5cf6',
            fontFamily: fonts.inter,
            fontWeight: 600,
            marginBottom: 4,
            marginLeft: 12,
          }}
        >
          {agentName}
        </div>
      )}
      <div
        style={{
          maxWidth: '80%',
          padding: '14px 20px',
          borderRadius: isAgent ? '4px 18px 18px 18px' : '18px 18px 4px 18px',
          background: isAgent
            ? 'linear-gradient(135deg, #1e1e3a, #2a2a4a)'
            : 'linear-gradient(135deg, #1F93FF, #1478d4)',
          border: isAgent ? '1px solid #8b5cf633' : 'none',
          fontSize: 18,
          color: '#ffffff',
          fontFamily: fonts.inter,
          lineHeight: 1.5,
        }}
      >
        {displayText}
        {showCursor && (
          <span style={{opacity: Math.sin(f * 0.5) > 0 ? 1 : 0, color: '#8b5cf6'}}>|</span>
        )}
      </div>
    </div>
  );
};

// ============================================
// FLOATING PARTICLES (background effect)
// ============================================
const FloatingParticles = ({count = 40, color = '#ffffff', frame}) => {
  const particles = React.useMemo(() => {
    return Array.from({length: count}).map((_, i) => ({
      x: random(`fp-x-${i}`) * 1080,
      y: random(`fp-y-${i}`) * 1920,
      size: 1 + random(`fp-s-${i}`) * 2.5,
      speed: 0.3 + random(`fp-sp-${i}`) * 0.7,
      opacity: 0.1 + random(`fp-o-${i}`) * 0.3,
    }));
  }, [count]);

  return (
    <>
      {particles.map((p, i) => {
        const y = (p.y - frame * p.speed + 1920) % 1920;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: p.x,
              top: y,
              width: p.size,
              height: p.size,
              borderRadius: '50%',
              backgroundColor: color,
              opacity: p.opacity,
            }}
          />
        );
      })}
    </>
  );
};

// ============================================
// GRID BACKGROUND
// ============================================
const GridBackground = ({frame, opacity = 0.06}) => {
  const gridOffset = interpolate(frame, [0, 300], [0, 40], {
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        opacity,
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
        transform: `translateY(${gridOffset}px)`,
      }}
    />
  );
};

// ============================================
// STATUS BADGE
// ============================================
const StatusBadge = ({text, color, delay, frame, x, y}) => {
  const f = Math.max(0, frame - delay);
  const opacity = interpolate(f, [0, 10], [0, 1], {
    extrapolateRight: 'clamp',
    extrapolateLeft: 'clamp',
  });
  const scale = interpolate(f, [0, 10], [0.8, 1], {
    extrapolateRight: 'clamp',
    extrapolateLeft: 'clamp',
  });

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: `translate(-50%, -50%) scale(${scale})`,
        opacity,
        background: `${color}22`,
        border: `1px solid ${color}66`,
        borderRadius: 20,
        padding: '8px 18px',
        fontSize: 14,
        fontWeight: 600,
        color,
        fontFamily: fonts.inter,
        whiteSpace: 'nowrap',
        display: 'flex',
        alignItems: 'center',
        gap: 6,
      }}
    >
      <div
        style={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          backgroundColor: color,
          boxShadow: `0 0 8px ${color}`,
        }}
      />
      {text}
    </div>
  );
};

// ============================================
// MAIN COMPOSITION
// ============================================
export const N8nChatwootDemo = ({
  accentColor = '#ff6d5a',
  chatwootColor = '#1F93FF',
  aiColor = '#8b5cf6',
  n8nColor = '#ff6d5a',
}) => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();

  // ---- GLOBAL ANIMATIONS ----
  const globalOpacity = interpolate(frame, [0, 15, 280, 300], [0, 1, 1, 0], {
    extrapolateRight: 'clamp',
    extrapolateLeft: 'clamp',
  });

  // ---- SCENE 1: TITLE INTRO (0-80) ----
  const titleOpacity = interpolate(frame, [5, 25, 65, 80], [0, 1, 1, 0], {
    extrapolateRight: 'clamp',
    extrapolateLeft: 'clamp',
  });
  const titleScale = interpolate(frame, [5, 25], [0.85, 1], {
    extrapolateRight: 'clamp',
    extrapolateLeft: 'clamp',
  });
  const titleBlur = interpolate(frame, [65, 80], [0, 6], {
    extrapolateRight: 'clamp',
    extrapolateLeft: 'clamp',
  });
  const subtitleY = interpolate(frame, [18, 35], [30, 0], {
    extrapolateRight: 'clamp',
    extrapolateLeft: 'clamp',
  });
  const subtitleOpacity = interpolate(frame, [18, 35, 65, 80], [0, 1, 1, 0], {
    extrapolateRight: 'clamp',
    extrapolateLeft: 'clamp',
  });

  // ---- SCENE 2: WORKFLOW (70-185) ----
  const workflowOpacity = interpolate(frame, [70, 85, 170, 185], [0, 1, 1, 0], {
    extrapolateRight: 'clamp',
    extrapolateLeft: 'clamp',
  });
  const workflowScale = interpolate(frame, [70, 85], [0.9, 1], {
    extrapolateRight: 'clamp',
    extrapolateLeft: 'clamp',
  });

  // ---- SCENE 3: CHAT DEMO (175-260) ----
  const chatOpacity = interpolate(frame, [175, 190, 248, 260], [0, 1, 1, 0], {
    extrapolateRight: 'clamp',
    extrapolateLeft: 'clamp',
  });

  // ---- SCENE 4: CLOSING (250-300) ----
  const closingOpacity = interpolate(frame, [250, 268, 285, 300], [0, 1, 1, 0], {
    extrapolateRight: 'clamp',
    extrapolateLeft: 'clamp',
  });
  const closingScale = interpolate(frame, [250, 268], [0.9, 1], {
    extrapolateRight: 'clamp',
    extrapolateLeft: 'clamp',
  });

  // Workflow nodes configuration
  const nodes = [
    {x: 230, y: 750, label: 'Webhook', icon: '🔗', color: n8nColor, delay: 85},
    {x: 540, y: 620, label: 'Chatwoot', icon: '💬', color: chatwootColor, delay: 95},
    {x: 850, y: 750, label: 'AI Agent', icon: '🤖', color: aiColor, delay: 105},
    {x: 540, y: 900, label: 'Response', icon: '✅', color: '#00ff88', delay: 115},
  ];

  // Connection lines
  const connections = [
    {x1: 295, y1: 750, x2: 475, y2: 620, color: n8nColor, delay: 100},
    {x1: 605, y1: 620, x2: 785, y2: 750, color: chatwootColor, delay: 110},
    {x1: 785, y1: 750, x2: 605, y2: 900, color: aiColor, delay: 120},
    {x1: 475, y1: 620, x2: 475, y2: 900, color: chatwootColor, delay: 125},
  ];

  return (
    <AbsoluteFill style={{backgroundColor: '#08080f', opacity: globalOpacity}}>
      {/* Background grid */}
      <GridBackground frame={frame} opacity={0.04} />

      {/* Floating particles */}
      <FloatingParticles count={35} color="#ffffff" frame={frame} />

      {/* ======== SCENE 1: TITLE ======== */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: titleOpacity,
          transform: `scale(${titleScale})`,
          filter: `blur(${titleBlur}px)`,
        }}
      >
        {/* n8n badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            marginBottom: 30,
          }}
        >
          <div
            style={{
              width: 60,
              height: 60,
              borderRadius: 16,
              background: `linear-gradient(135deg, ${n8nColor}, #ff8a65)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 28,
              fontWeight: 900,
              color: '#fff',
              fontFamily: fonts.spaceGrotesk,
              boxShadow: `0 0 30px ${n8nColor}44`,
            }}
          >
            n8n
          </div>
          <div
            style={{
              fontSize: 40,
              color: '#ffffff44',
              fontWeight: 300,
            }}
          >
            ×
          </div>
          <div
            style={{
              width: 60,
              height: 60,
              borderRadius: 16,
              background: `linear-gradient(135deg, ${chatwootColor}, #4dabff)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 30,
            }}
          >
            💬
          </div>
          <div
            style={{
              fontSize: 40,
              color: '#ffffff44',
              fontWeight: 300,
            }}
          >
            ×
          </div>
          <div
            style={{
              width: 60,
              height: 60,
              borderRadius: 16,
              background: `linear-gradient(135deg, ${aiColor}, #a78bfa)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 30,
            }}
          >
            🤖
          </div>
        </div>

        {/* Main title */}
        <h1
          style={{
            fontSize: 82,
            fontWeight: 900,
            color: '#ffffff',
            fontFamily: fonts.syne,
            letterSpacing: -2,
            textAlign: 'center',
            margin: 0,
            lineHeight: 1.1,
            textShadow: `0 0 60px ${n8nColor}33`,
          }}
        >
          n8n + Chatwoot
        </h1>

        {/* Accent line */}
        <div
          style={{
            width: interpolate(frame, [20, 40], [0, 500], {
              extrapolateRight: 'clamp',
              extrapolateLeft: 'clamp',
            }),
            height: 4,
            background: `linear-gradient(90deg, ${n8nColor}, ${chatwootColor}, ${aiColor})`,
            borderRadius: 2,
            marginTop: 20,
            marginBottom: 20,
          }}
        />

        {/* Subtitle */}
        <div
          style={{
            opacity: subtitleOpacity,
            transform: `translateY(${subtitleY}px)`,
          }}
        >
          <p
            style={{
              fontSize: 38,
              color: aiColor,
              fontFamily: fonts.spaceGrotesk,
              fontWeight: 600,
              margin: 0,
              textAlign: 'center',
              textShadow: `0 0 30px ${aiColor}44`,
            }}
          >
            AI-Powered Agents
          </p>
          <p
            style={{
              fontSize: 24,
              color: '#ffffff66',
              fontFamily: fonts.inter,
              fontWeight: 400,
              margin: '12px 0 0 0',
              textAlign: 'center',
            }}
          >
            Automated Customer Support
          </p>
        </div>
      </div>

      {/* ======== SCENE 2: WORKFLOW ======== */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: workflowOpacity,
          transform: `scale(${workflowScale})`,
        }}
      >
        {/* Scene title */}
        <div
          style={{
            position: 'absolute',
            top: 140,
            width: '100%',
            textAlign: 'center',
          }}
        >
          <h2
            style={{
              fontSize: 48,
              fontWeight: 800,
              color: '#ffffff',
              fontFamily: fonts.montserrat,
              margin: 0,
              letterSpacing: -1,
            }}
          >
            Workflow Automation
          </h2>
          <p
            style={{
              fontSize: 22,
              color: n8nColor,
              fontFamily: fonts.inter,
              marginTop: 10,
              fontWeight: 500,
            }}
          >
            n8n orchestrates the entire flow
          </p>
        </div>

        {/* Workflow nodes */}
        <div
          style={{
            position: 'absolute',
            top: 280,
            left: 0,
            right: 0,
            height: 600,
          }}
        >
          {/* Connection lines (rendered first, behind nodes) */}
          {connections.map((conn, i) => (
            <ConnectionLine
              key={`conn-${i}`}
              x1={conn.x1}
              y1={conn.y1 - 280}
              x2={conn.x2}
              y2={conn.y2 - 280}
              color={conn.color}
              delay={conn.delay - 70}
              frame={frame - 70}
            />
          ))}
          {/* Nodes */}
          {nodes.map((node, i) => (
            <WorkflowNode
              key={`node-${i}`}
              x={node.x}
              y={node.y - 280}
              label={node.label}
              icon={node.icon}
              color={node.color}
              delay={node.delay - 70}
              frame={frame - 70}
            />
          ))}
        </div>

        {/* Status badges */}
        <StatusBadge
          text="Trigger Received"
          color={n8nColor}
          delay={100}
          frame={frame}
          x={240}
          y={1100}
        />
        <StatusBadge
          text="Processing Message"
          color={chatwootColor}
          delay={110}
          frame={frame}
          x={540}
          y={1160}
        />
        <StatusBadge
          text="AI Generating Response"
          color={aiColor}
          delay={120}
          frame={frame}
          x={800}
          y={1100}
        />
        <StatusBadge
          text="Reply Sent"
          color="#00ff88"
          delay={130}
          frame={frame}
          x={540}
          y={1230}
        />

        {/* Flow description */}
        <div
          style={{
            position: 'absolute',
            bottom: 180,
            left: 0,
            right: 0,
            textAlign: 'center',
            opacity: interpolate(frame, [130, 145, 170, 185], [0, 1, 1, 0], {
              extrapolateRight: 'clamp',
              extrapolateLeft: 'clamp',
            }),
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 12,
              background: '#ffffff08',
              borderRadius: 16,
              padding: '16px 30px',
              border: '1px solid #ffffff11',
            }}
          >
            <span style={{fontSize: 26}}>⚡</span>
            <span
              style={{
                fontSize: 20,
                color: '#ffffffcc',
                fontFamily: fonts.inter,
                fontWeight: 500,
              }}
            >
              Real-time webhook processing
            </span>
          </div>
        </div>
      </div>

      {/* ======== SCENE 3: CHAT DEMO ======== */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          opacity: chatOpacity,
          padding: '0 60px',
        }}
      >
        {/* Chat header */}
        <div
          style={{
            width: '100%',
            marginTop: 120,
            marginBottom: 30,
            textAlign: 'center',
          }}
        >
          <h2
            style={{
              fontSize: 44,
              fontWeight: 800,
              color: '#ffffff',
              fontFamily: fonts.montserrat,
              margin: 0,
            }}
          >
            Live Chat + AI
          </h2>
          <p
            style={{
              fontSize: 20,
              color: chatwootColor,
              fontFamily: fonts.inter,
              marginTop: 8,
            }}
          >
            Chatwoot with AI-powered responses
          </p>
        </div>

        {/* Chat window */}
        <div
          style={{
            width: '100%',
            maxWidth: 900,
            background: '#0d0d1a',
            borderRadius: 24,
            border: '1px solid #ffffff11',
            padding: 30,
            flex: 1,
            maxHeight: 1200,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {/* Chat window header bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              marginBottom: 24,
              paddingBottom: 18,
              borderBottom: '1px solid #ffffff11',
            }}
          >
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 12,
                background: `linear-gradient(135deg, ${chatwootColor}, #4dabff)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 22,
              }}
            >
              💬
            </div>
            <div>
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: '#ffffff',
                  fontFamily: fonts.inter,
                }}
              >
                Chatwoot Support
              </div>
              <div
                style={{
                  fontSize: 13,
                  color: '#00ff88',
                  fontFamily: fonts.inter,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                }}
              >
                <div
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: '50%',
                    backgroundColor: '#00ff88',
                  }}
                />
                AI Agent Online
              </div>
            </div>
          </div>

          {/* Chat messages */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              flex: 1,
            }}
          >
            <ChatBubble
              text="Hola, necesito ayuda con la integración de mi API"
              isAgent={false}
              delay={190}
              frame={frame}
            />
            <ChatBubble
              text="¡Hola! Soy un agente de IA. Puedo ayudarte con la integración de tu API. ¿Qué endpoint estás intentando configurar?"
              isAgent={true}
              delay={210}
              frame={frame}
              agentName="🤖 AI Agent"
            />
            <ChatBubble
              text="El webhook de pagos no está respondiendo"
              isAgent={false}
              delay={235}
              frame={frame}
            />
            <ChatBubble
              text="Revisando los logs del webhook... He detectado que el endpoint necesita autenticación Bearer. Te envío la configuración correcta."
              isAgent={true}
              delay={245}
              frame={frame}
              agentName="🤖 AI Agent"
            />
          </div>

          {/* Typing indicator */}
          {frame > 245 && frame < 260 && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                marginTop: 12,
                opacity: interpolate(
                  Math.sin(frame * 0.3),
                  [-1, 1],
                  [0.4, 1],
                ),
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: aiColor,
                  opacity: Math.sin(frame * 0.4) > 0 ? 1 : 0.3,
                }}
              />
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: aiColor,
                  opacity: Math.sin(frame * 0.4 + 1) > 0 ? 1 : 0.3,
                }}
              />
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: aiColor,
                  opacity: Math.sin(frame * 0.4 + 2) > 0 ? 1 : 0.3,
                }}
              />
              <span
                style={{
                  fontSize: 13,
                  color: '#ffffff44',
                  fontFamily: fonts.inter,
                  marginLeft: 6,
                }}
              >
                AI is analyzing...
              </span>
            </div>
          )}
        </div>

        {/* Bottom info */}
        <div
          style={{
            display: 'flex',
            gap: 20,
            marginTop: 30,
            marginBottom: 100,
            opacity: interpolate(frame, [220, 235], [0, 1], {
              extrapolateRight: 'clamp',
              extrapolateLeft: 'clamp',
            }),
          }}
        >
          {[
            {icon: '⚡', text: 'Real-time', color: n8nColor},
            {icon: '🧠', text: 'AI-Powered', color: aiColor},
            {icon: '🔄', text: 'Auto-reply', color: '#00ff88'},
          ].map((badge, i) => (
            <div
              key={i}
              style={{
                background: `${badge.color}11`,
                border: `1px solid ${badge.color}33`,
                borderRadius: 12,
                padding: '10px 18px',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                fontSize: 15,
                color: badge.color,
                fontFamily: fonts.inter,
                fontWeight: 600,
              }}
            >
              {badge.icon} {badge.text}
            </div>
          ))}
        </div>
      </div>

      {/* ======== SCENE 4: CLOSING ======== */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: closingOpacity,
          transform: `scale(${closingScale})`,
        }}
      >
        {/* Closing title */}
        <h1
          style={{
            fontSize: 68,
            fontWeight: 900,
            color: '#ffffff',
            fontFamily: fonts.syne,
            letterSpacing: -2,
            textAlign: 'center',
            margin: 0,
            lineHeight: 1.15,
          }}
        >
          Automate Your{'\n'}
          <span
            style={{
              background: `linear-gradient(90deg, ${n8nColor}, ${chatwootColor}, ${aiColor})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Customer Support
          </span>
        </h1>

        {/* Tech stack badges */}
        <div
          style={{
            display: 'flex',
            gap: 16,
            marginTop: 50,
          }}
        >
          {[
            {name: 'n8n', color: n8nColor, icon: '⚡'},
            {name: 'Chatwoot', color: chatwootColor, icon: '💬'},
            {name: 'AI Agents', color: aiColor, icon: '🤖'},
          ].map((tech, i) => (
            <div
              key={i}
              style={{
                background: `${tech.color}15`,
                border: `2px solid ${tech.color}44`,
                borderRadius: 18,
                padding: '16px 28px',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                opacity: interpolate(frame, [258 + i * 5, 268 + i * 5], [0, 1], {
                  extrapolateRight: 'clamp',
                  extrapolateLeft: 'clamp',
                }),
                transform: `translateY(${interpolate(
                  frame,
                  [258 + i * 5, 268 + i * 5],
                  [15, 0],
                  {
                    extrapolateRight: 'clamp',
                    extrapolateLeft: 'clamp',
                  },
                )}px)`,
              }}
            >
              <span style={{fontSize: 26}}>{tech.icon}</span>
              <span
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  color: tech.color,
                  fontFamily: fonts.spaceGrotesk,
                }}
              >
                {tech.name}
              </span>
            </div>
          ))}
        </div>

        {/* Powered by */}
        <p
          style={{
            fontSize: 20,
            color: '#ffffff44',
            fontFamily: fonts.inter,
            marginTop: 40,
            fontWeight: 400,
            opacity: interpolate(frame, [275, 285], [0, 1], {
              extrapolateRight: 'clamp',
              extrapolateLeft: 'clamp',
            }),
          }}
        >
          Powered by AI Automation
        </p>
      </div>

      {/* ======== GLOBAL: Vignette overlay ======== */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse at center, transparent 50%, #08080fcc 100%)',
          pointerEvents: 'none',
        }}
      />
    </AbsoluteFill>
  );
};
