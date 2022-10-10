/// <reference types="react-scripts" />

declare namespace NodeJS {
    interface ProcessEnv {
        NODE_ENV: 'development' | 'production' | 'test';
        PUBLIC_URL: string;
        REACT_APP_API_ENDPOINT: string;
        REACT_APP_ASSET_ENDPOINT: string;
        REACT_APP_WS_ENDPOINT: string;
    }
}

interface Window {
    game: Phaser.Game | undefined
}

declare module '*.png' {
    const src: string;
    export default src;
}
