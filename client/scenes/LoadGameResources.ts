import { ProvinceKey, PlayerGameProjection } from '../../shared/index';
import { Scene } from 'phaser';
import * as api from '../models/API';
import { InGameView } from './StrategicOverview';

export default class LoadGameResources extends Scene {
    gameId: string | undefined;
    province?: ProvinceKey;
    view?: InGameView;

    constructor() {
        super({
            key: 'LoadGameResources'
        });
    }

    init(data: {gameId: string, province?: ProvinceKey, view?: InGameView }) {
        this.gameId = data.gameId;
        this.province = data.province;
        this.view = data.view || 'overview';
        console.log('🔄 LoadGameResources: init -', { gameId: this.gameId, province: this.province, view: this.view });
        
        // Also try to extract gameId from URL as fallback for hot reload
        if (!this.gameId) {
            const match = window.location.pathname.match(/\/games\/([^/]+)/);
            if (match) {
                this.gameId = match[1];
                console.log('🔄 LoadGameResources: Extracted gameId from URL:', this.gameId);
            }
        }
    }

    preload() {
        if (!this.gameId) {
            console.error('❌ LoadGameResources: No gameId available in preload');
            return;
        }

        console.log('📦 LoadGameResources: preload - loading game data for', this.gameId);
        
        // Add listener for load completion
        this.load.on('complete', () => {
            console.log('✓ LoadGameResources: Loader complete');
        });

        this.load.on('loaderror', (fileObject: any) => {
            console.error('❌ LoadGameResources: Loader error:', fileObject.key, fileObject.url, fileObject.error);
        });
    }

    create() {
        console.log('🎮 LoadGameResources: create');
        
        if (!this.gameId) {
            console.error('❌ LoadGameResources: No gameId in create');
            this.add.text(320, 240, 'ERROR: Missing game ID', {
                fontSize: '24px',
                color: '#ff0000',
                align: 'center'
            }).setOrigin(0.5, 0.5);
            return;
        }

        const cacheKey = `game-${this.gameId}`;
        let data = this.cache.json.get(cacheKey);
        
        if (!data) {
            console.warn(`⚠️ LoadGameResources: Game data not in cache (${cacheKey}), fetching now...`);
            
            // Fetch data synchronously if not cached
            api.get<PlayerGameProjection>(`/games/${this.gameId}`)
                .then((gameData: PlayerGameProjection) => {
                    console.log('✓ LoadGameResources: Received game data:', gameData.id);
                    this.cache.json.add(cacheKey, gameData);
                    
                    const sceneData = { gameId: this.gameId, province: this.province, view: this.view };
                    if (!this.province) {
                        console.log('➜ LoadGameResources: Starting StrategicOverview');
                        this.scene.start('StrategicOverview', sceneData);
                    } else {
                        console.log('➜ LoadGameResources: Starting ProvinceStrategic');
                        this.scene.start('ProvinceStrategic', sceneData);
                    }
                })
                .catch(err => {
                    console.error('❌ LoadGameResources: Failed to fetch game data:', err);
                    this.add.text(320, 240, `ERROR: Failed to load game\n${err.message}`, {
                        fontSize: '18px',
                        color: '#ff0000',
                        align: 'center'
                    }).setOrigin(0.5, 0.5);
                });
            
            // Show loading state
            this.add.text(320, 240, 'Loading game...', {
                fontSize: '24px',
                color: '#ffffff',
                align: 'center'
            }).setOrigin(0.5, 0.5);
            return;
        }
        
        console.log('✓ LoadGameResources: Game data found in cache:', data.id);

        const sceneData = { gameId: this.gameId, province: this.province, view: this.view };

        // if we don't have a specific province to view
        if (!this.province) {
            // must be an overview
            console.log('➜ LoadGameResources: Starting StrategicOverview');
            this.scene.start('StrategicOverview', sceneData);
        } else {
            // otherwise it's most likely the strategic view
            console.log('➜ LoadGameResources: Starting ProvinceStrategic');
            this.scene.start('ProvinceStrategic', sceneData);
        }
    }
}
