const registerScenePath = (_scene, path) => {
    if (location.pathname !== path) {
        history.pushState({}, 'Fallen Haven', path);
    }
};

export { registerScenePath };