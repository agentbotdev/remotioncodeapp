import React from 'react';
import {Composition} from 'remotion';
import {HelloWorld} from './compositions/HelloWorld.jsx';
import {KineticTitle} from './compositions/KineticTitle.jsx';
import {CinematicVideo} from './compositions/CinematicVideo.jsx';
import {WalkingMan} from './compositions/WalkingMan.jsx';
import {IsometricCard} from './compositions/IsometricCard.jsx';
import {ParticleBackground} from './compositions/ParticleBackground.jsx';
import {GradientText} from './compositions/GradientText.jsx';
import {LayeredComposition} from './compositions/LayeredComposition.jsx';
import {DataVisualization} from './compositions/DataVisualization.jsx';
import {GlassmorphismCard} from './compositions/GlassmorphismCard.jsx';
import {NeonGlowText} from './compositions/NeonGlowText.jsx';
import {BentoGrid} from './compositions/BentoGrid.jsx';
import {N8nChatwootDemo} from './compositions/N8nChatwootDemo.jsx';
import {N8nChatwootEpic} from './compositions/N8nChatwootEpic.jsx';

const defaultScript = [
  {
    text: 'STOP SCROLLING',
    animation: 'scale',
    fontSize: 110,
    durationFrames: 50,
    lineColor: '#ff3366',
  },
  {
    text: 'THE REASON\nYOU ARE BROKE',
    animation: 'slide-up',
    fontSize: 95,
    durationFrames: 65,
    subtitle: 'is not what you think',
  },
  {
    text: 'YOU TRADE\nTIME FOR MONEY',
    animation: 'scale',
    fontSize: 85,
    durationFrames: 60,
  },
  {
    text: 'BUILD A SYSTEM',
    animation: 'typewriter',
    fontSize: 100,
    durationFrames: 70,
    lineColor: '#00ff88',
  },
  {
    text: 'THAT WORKS\nWHILE YOU SLEEP',
    animation: 'slide-up',
    fontSize: 90,
    durationFrames: 65,
    subtitle: '@yourbrand',
    subtitleColor: '#00ff88',
  },
];

const totalFrames = defaultScript.reduce((sum, s) => sum + (s.durationFrames || 60), 0);

export const RemotionRoot = () => {
  return (
    <>
      <Composition
        id="HelloWorld"
        component={HelloWorld}
        durationInFrames={90}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          text: 'MOTION GRAPHICS',
        }}
      />
      <Composition
        id="KineticTitle"
        component={KineticTitle}
        durationInFrames={90}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          text: 'FOCUS ON WHAT MATTERS',
          accentColor: '#00ff88',
          fontSize: 100,
          lineThickness: 4,
        }}
      />
      <Composition
        id="CinematicVideo"
        component={CinematicVideo}
        durationInFrames={totalFrames}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          scenes: defaultScript,
          accentColor: '#00ff88',
        }}
      />
      <Composition
        id="WalkingMan"
        component={WalkingMan}
        durationInFrames={240}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="IsometricCard"
        component={IsometricCard}
        durationInFrames={90}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          title: 'PREMIUM',
          subtitle: 'Next Level Design',
          accentColor: '#6c5ce7',
          rotationIntensity: 0.5,
        }}
      />
      <Composition
        id="ParticleNetwork"
        component={ParticleBackground}
        durationInFrames={90}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          particleCount: 80,
          color: '#00ff88',
          connectionDistance: 120,
          speed: 1,
          title: 'CONNECTED',
          subtitle: 'Everything is linked',
        }}
      />
      <Composition
        id="GradientText"
        component={GradientText}
        durationInFrames={90}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          text: 'LIMITLESS',
          gradientColors: ['#ff6b6b', '#feca57', '#48dbfb'],
          glowIntensity: 1,
          fontSize: 120,
          revealStyle: 'clip',
        }}
      />
      <Composition
        id="ParallaxLayers"
        component={LayeredComposition}
        durationInFrames={130}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          title: 'DEPTH',
          subtitle: 'Layers of meaning',
          accentColor: '#ff6b6b',
          backgroundShapes: true,
        }}
      />
      <Composition
        id="DataViz"
        component={DataVisualization}
        durationInFrames={120}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          data: [
            {x: 0, y: 20},
            {x: 1, y: 45},
            {x: 2, y: 35},
            {x: 3, y: 65},
            {x: 4, y: 55},
            {x: 5, y: 80},
            {x: 6, y: 70},
            {x: 7, y: 95},
          ],
          color: '#00ff88',
          showGrid: true,
          title: 'GROWTH',
          subtitle: '+240% this quarter',
        }}
      />
      <Composition
        id="GlassCard"
        component={GlassmorphismCard}
        durationInFrames={130}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          title: 'CLARITY',
          subtitle: 'See through the noise',
          accentColor: '#a78bfa',
        }}
      />
      <Composition
        id="NeonText"
        component={NeonGlowText}
        durationInFrames={90}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          text: 'NEON',
          color: '#00ff88',
          subtitle: 'glow in the dark',
          flickerEnabled: true,
        }}
      />
      <Composition
        id="BentoGrid"
        component={BentoGrid}
        durationInFrames={130}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          title: 'FEATURES',
        }}
      />
      <Composition
        id="N8nChatwootDemo"
        component={N8nChatwootDemo}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          accentColor: '#ff6d5a',
          chatwootColor: '#1F93FF',
          aiColor: '#8b5cf6',
          n8nColor: '#ff6d5a',
        }}
      />
      <Composition
        id="N8nChatwootEpic"
        component={N8nChatwootEpic}
        durationInFrames={900}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{}}
      />
    </>
  );
};
