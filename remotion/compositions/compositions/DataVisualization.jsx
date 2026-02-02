import React from 'react';
import {AbsoluteFill, useCurrentFrame, interpolate} from 'remotion';
import {fonts} from '../fonts.js';

export const DataVisualization = ({
  data = [
    {x: 0, y: 20},
    {x: 1, y: 45},
    {x: 2, y: 35},
    {x: 3, y: 65},
    {x: 4, y: 55},
    {x: 5, y: 80},
    {x: 6, y: 70},
    {x: 7, y: 95},
  ],
  color = '#00ff88',
  showGrid = true,
  title = 'GROWTH',
  subtitle = '+240% this quarter',
}) => {
  const frame = useCurrentFrame();

  // Chart dimensions
  const chartX = 100;
  const chartY = 600;
  const chartWidth = 880;
  const chartHeight = 700;

  // Normalize data
  const maxY = Math.max(...data.map((d) => d.y));
  const points = data.map((d, i) => ({
    px: chartX + (i / (data.length - 1)) * chartWidth,
    py: chartY + chartHeight - (d.y / maxY) * chartHeight,
  }));

  // Draw progress (animate the line drawing)
  const drawProgress = interpolate(frame, [15, 55], [0, 1], {
    extrapolateRight: 'clamp',
    extrapolateLeft: 'clamp',
  });

  // Build SVG path
  const pathPoints = points.map((p, i) => (i === 0 ? `M ${p.px} ${p.py}` : `L ${p.px} ${p.py}`)).join(' ');

  // Build area path (for gradient fill under the line)
  const areaPath = `${pathPoints} L ${points[points.length - 1].px} ${chartY + chartHeight} L ${points[0].px} ${chartY + chartHeight} Z`;

  // Calculate path length approximation for stroke-dasharray
  let pathLength = 0;
  for (let i = 1; i < points.length; i++) {
    const dx = points[i].px - points[i - 1].px;
    const dy = points[i].py - points[i - 1].py;
    pathLength += Math.sqrt(dx * dx + dy * dy);
  }

  // Grid fade in
  const gridOpacity = interpolate(frame, [0, 15], [0, 0.15], {
    extrapolateRight: 'clamp',
    extrapolateLeft: 'clamp',
  });

  // Title animation
  const titleOpacity = interpolate(frame, [5, 20], [0, 1], {
    extrapolateRight: 'clamp',
    extrapolateLeft: 'clamp',
  });
  const titleY = interpolate(frame, [5, 20], [30, 0], {
    extrapolateRight: 'clamp',
    extrapolateLeft: 'clamp',
  });

  // Area fill fade in
  const areaOpacity = interpolate(frame, [40, 60], [0, 0.15], {
    extrapolateRight: 'clamp',
    extrapolateLeft: 'clamp',
  });

  // Exit
  const exitOpacity = interpolate(frame, [100, 120], [1, 0], {
    extrapolateRight: 'clamp',
    extrapolateLeft: 'clamp',
  });

  // Value counter
  const counterValue = Math.floor(
    interpolate(frame, [20, 60], [0, data[data.length - 1].y], {
      extrapolateRight: 'clamp',
      extrapolateLeft: 'clamp',
    })
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#0a0a0f',
        padding: 60,
        opacity: exitOpacity,
      }}
    >
      {/* Title section */}
      <div
        style={{
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
          marginBottom: 20,
        }}
      >
        <h1
          style={{
            fontSize: 90,
            fontWeight: 900,
            color: '#ffffff',
            fontFamily: fonts.montserrat,
            letterSpacing: -3,
            margin: 0,
          }}
        >
          {title}
        </h1>
        <p
          style={{
            fontSize: 34,
            color,
            fontFamily: fonts.inter,
            marginTop: 10,
            fontWeight: 600,
          }}
        >
          {subtitle}
        </p>
      </div>

      {/* Chart */}
      <svg
        width={1080}
        height={chartHeight + 200}
        viewBox={`0 0 1080 ${chartHeight + 200}`}
        style={{position: 'absolute', top: 450, left: 0}}
      >
        {/* Grid lines */}
        {showGrid &&
          Array.from({length: 6}).map((_, i) => {
            const y = chartY + (i / 5) * chartHeight;
            return (
              <line
                key={`grid-h-${i}`}
                x1={chartX}
                y1={y}
                x2={chartX + chartWidth}
                y2={y}
                stroke="#ffffff"
                strokeOpacity={gridOpacity}
                strokeWidth={1}
              />
            );
          })}
        {showGrid &&
          data.map((_, i) => {
            const x = chartX + (i / (data.length - 1)) * chartWidth;
            return (
              <line
                key={`grid-v-${i}`}
                x1={x}
                y1={chartY}
                x2={x}
                y2={chartY + chartHeight}
                stroke="#ffffff"
                strokeOpacity={gridOpacity * 0.5}
                strokeWidth={1}
              />
            );
          })}

        {/* Gradient fill under line */}
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.3} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
          <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={color} stopOpacity={0.6} />
            <stop offset="100%" stopColor={color} stopOpacity={1} />
          </linearGradient>
        </defs>

        <path
          d={areaPath}
          fill="url(#areaGrad)"
          opacity={areaOpacity}
        />

        {/* Main line */}
        <path
          d={pathPoints}
          fill="none"
          stroke="url(#lineGrad)"
          strokeWidth={4}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={pathLength}
          strokeDashoffset={pathLength * (1 - drawProgress)}
        />

        {/* Data points */}
        {points.map((p, i) => {
          const pointDelay = 15 + (i / (points.length - 1)) * 40;
          const pointOpacity = interpolate(frame, [pointDelay, pointDelay + 8], [0, 1], {
            extrapolateRight: 'clamp',
            extrapolateLeft: 'clamp',
          });
          const pointScale = interpolate(frame, [pointDelay, pointDelay + 8], [0, 1], {
            extrapolateRight: 'clamp',
            extrapolateLeft: 'clamp',
          });

          return (
            <g key={i} opacity={pointOpacity}>
              {/* Glow */}
              <circle
                cx={p.px}
                cy={p.py}
                r={12 * pointScale}
                fill={color}
                opacity={0.2}
              />
              {/* Core */}
              <circle
                cx={p.px}
                cy={p.py}
                r={5 * pointScale}
                fill={color}
              />
              {/* White center */}
              <circle
                cx={p.px}
                cy={p.py}
                r={2 * pointScale}
                fill="#ffffff"
              />
            </g>
          );
        })}
      </svg>

      {/* Big number */}
      <div
        style={{
          position: 'absolute',
          right: 80,
          top: 200,
          textAlign: 'right',
          opacity: titleOpacity,
        }}
      >
        <div
          style={{
            fontSize: 140,
            fontWeight: 900,
            color,
            fontFamily: fonts.montserrat,
            lineHeight: 1,
            textShadow: `0 0 40px ${color}44`,
          }}
        >
          {counterValue}
        </div>
        <div
          style={{
            fontSize: 24,
            color: '#555566',
            fontFamily: fonts.inter,
            marginTop: 5,
          }}
        >
          CURRENT VALUE
        </div>
      </div>
    </AbsoluteFill>
  );
};
