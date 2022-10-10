import { Scene } from 'phaser';

export default class PreloadScene extends Scene {
  constructor() {
    super({ key: 'PreloadScene' });
  }

  init() {
    console.log('🎬 PreloadScene: init');
  }

  preload() {
    console.log('🔄 PreloadScene: preload');
    
    // Show loading indicator
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    
    const graphics = this.add.graphics();
    graphics.fillStyle(0x222222, 1);
    graphics.fillRect(0, 0, width, height);
    
    const text = this.add.text(width / 2, height / 2, 'Loading...', {
      fontSize: '24px',
      color: '#ffffff'
    });
    text.setOrigin(0.5, 0.5);
    text.setDepth(100);
    console.log('✓ PreloadScene: Loading text displayed');
  }

  create() {
    console.log('🎮 PreloadScene: create - resolving initial route');

    const match = window.location.pathname.match(/^\/games\/([^/]+)$/);
    if (match) {
      const gameId = match[1];
      console.log('⏭️ PreloadScene: Starting LoadGameResources for deep link', gameId);
      this.scene.start('LoadGameResources', {
        gameId,
        province: undefined,
        view: 'overview'
      });
      return;
    }

    // Small delay to ensure loading text is visible
    this.time.delayedCall(500, () => {
      console.log('⏭️ PreloadScene: Starting MainMenu');
      this.scene.start('MainMenu');
    });
  }
}
