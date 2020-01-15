const config = {
    endpoint: API_ENDPOINT,
    assetEndpoint: ASSET_ENDPOINT
}

export default config;

export const api = (path) => {
    return config.endpoint + path;
}

export const data = (path) => {
    return config.assetEndpoint + path;
}