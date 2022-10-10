const registerScenePath = (_scene: Phaser.Scene, path: string) => {
    if (window.location.pathname !== path) {
        window.history.pushState({}, 'Fallen Haven', path);
    }
};

export { registerScenePath };
