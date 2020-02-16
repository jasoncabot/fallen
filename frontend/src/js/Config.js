const config = {
    endpoint: process.env.API_ENDPOINT,
    assetEndpoint: process.env.ASSET_ENDPOINT
}

export default config;

export const data = (path) => {
    return config.assetEndpoint + path;
}