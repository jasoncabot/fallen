import Phaser from 'phaser';
import React, { useEffect } from 'react';
import CreateGame from '../scenes/CreateGame';
import Encyclopedia from '../scenes/Encyclopedia';
import ListGames from '../scenes/ListGames';
import LoadGameResources from '../scenes/LoadGameResources';
import MainMenu from '../scenes/MainMenu';
import NewGame from '../scenes/NewGame';
import PreloadScene from '../scenes/PreloadScene';


const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    antialiasGL: true,
    pixelArt: false,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        parent: 'game-content',
        width: 640,
        height: 480
    },
    scene: [
        PreloadScene,
        MainMenu,
        Encyclopedia,
        NewGame,
        ListGames,
        CreateGame,
        LoadGameResources
    ],
    dom: {
        createContainer: true
    }
};

const GameContainer = (props: any) => {
    useEffect(() => {
        // In StrictMode this gets called twice - have a better method for initialising phaser here
        if (window.game) return;
        window.game = new Phaser.Game(config);
    });

    return (
        <div id='game-content' className='bg-black' />
    );
}

export default GameContainer;
