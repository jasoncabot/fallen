import Phaser from 'phaser';
import React, { useEffect, useRef, useState } from 'react';
import CreateGame from '../scenes/CreateGame';
import Encyclopedia from '../scenes/Encyclopedia';
import Launch from '../scenes/Launch';
import ListGames from '../scenes/ListGames';
import LoadGameResources from '../scenes/LoadGameResources';
import MainMenu from '../scenes/MainMenu';
import NewGame from '../scenes/NewGame';
import PreloadScene from '../scenes/PreloadScene';
import ProvinceStrategic from '../scenes/ProvinceStrategic';
import StrategicOverview from '../scenes/StrategicOverview';

function ensureRuntimeScenes(game: Phaser.Game) {
  const manager = game.scene as Phaser.Scenes.SceneManager & { keys?: Record<string, Phaser.Scene> };
  const hasScene = (key: string) => Boolean(manager.keys?.[key]);

  if (!hasScene('ProvinceStrategic')) {
    manager.add('ProvinceStrategic', ProvinceStrategic, false);
  }

  if (!hasScene('Launch')) {
    manager.add('Launch', Launch, false);
  }
}

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  antialiasGL: false,
  pixelArt: false,
  backgroundColor: '#000000',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    parent: 'game-content',
    width: 640,
    height: 480,
    expandParent: true
  },
  render: {
    pixelArt: false,
    antialias: true,
    clearBeforeRender: true
  },
  scene: [
    PreloadScene,
    MainMenu,
    Encyclopedia,
    NewGame,
    ListGames,
    CreateGame,
    LoadGameResources,
    StrategicOverview,
    ProvinceStrategic,
    Launch
  ],
  dom: { createContainer: true },
  callbacks: {
    postBoot: (game: Phaser.Game) => {
      ensureRuntimeScenes(game);
      console.log('✓ Phaser postBoot: Game initialized', {
        isBooted: game.isBooted,
        canvas: game.canvas?.width + 'x' + game.canvas?.height,
        scenes: game.scene.getScenes(true).map((s: any) => s.key)
      });
    }
  }
};

// Global reference to prevent multiple game instances
let globalGame: Phaser.Game | null = null;

export default function GameContainer() {
  const gameRef = useRef<Phaser.Game | null>(null);
  const [status, setStatus] = useState<string>('Loading...');

  useEffect(() => {
    console.log('🎮 GameContainer: useEffect running, window.location:', window.location.pathname);

    // Reuse existing game instance if possible (helps with hot reload)
    if (globalGame && globalGame.isRunning) {
      console.log('♻️ GameContainer: Reusing existing Phaser game instance');
      gameRef.current = globalGame;
      ensureRuntimeScenes(gameRef.current);

      // Always route via PreloadScene so direct links and normal boot share one code path.
      gameRef.current.scene.start('PreloadScene');
      
      setStatus('Ready');
      return;
    }

    console.log('🎮 GameContainer: Initializing new Phaser game');

    try {
      const parentEl = document.getElementById('game-content');
      if (!parentEl) {
        throw new Error('Parent element #game-content not found');
      }

      parentEl.style.width = '100%';
      parentEl.style.height = '100%';
      parentEl.style.position = 'relative';
      parentEl.style.overflow = 'hidden';
      parentEl.style.display = 'flex';

      console.log('✓ Parent container ready');

      globalGame = new Phaser.Game(config);
      gameRef.current = globalGame;
      console.log('✓ Phaser.Game instance created');

      setTimeout(() => {
        if (gameRef.current?.isBooted) {
          const scenes = gameRef.current.scene.getScenes();
          const activeScene = scenes.length > 0 ? (scenes[0] as any).key : null;
          console.log('✓ Active scene:', activeScene);
          setStatus('Ready');
        }
      }, 500);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error('❌ Phaser initialization failed:', message, err);
      setStatus(`Failed: ${message}`);
    }

    // Cleanup on unmount
    return () => {
      console.log('🧹 GameContainer unmounting (NOT destroying game to preserve state)');
      // Don't destroy on unmount - we want to preserve the game during hot reload
    };
  }, []);

  return (
    <>
      <div 
        id="game-content" 
        className="w-full h-full bg-black"
        style={{ 
          width: '100%', 
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0
        }}
      />
      {status !== 'Ready' && (
        <div className="fixed top-4 left-4 bg-red-900 text-white px-4 py-2 rounded text-sm z-50 font-mono">
          {status}
        </div>
      )}
    </>
  );
}
