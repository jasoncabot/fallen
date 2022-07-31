const esbuild = require('esbuild');
const path = require('path');

console.log('[esbuild] start');

esbuild.build({
    entryPoints: [path.join(__dirname, "src", "index.ts")],
    outfile: path.join(__dirname, "dist", "shared.js"),
    bundle: true,
    minify: true,
    platform: 'node',
    sourcemap: true,
    target: 'esnext',
    watch: process.argv[2] === '--watch',
    loader: {
        ".bin": "binary"
    }
}).catch((err) => {
    console.warn(err);
    process.exitCode = 1
}
);
console.log('[esbuild] finish');

// This is a custom transform used by jest
module.exports = {
    process(content, filename, config, opts) {
        // use esbuild to generate the 'binary' data
        // see: https://github.com/evanw/esbuild/issues/2424
        const code = esbuild.buildSync({
            entryPoints: [filename],
            platform: 'node',
            sourcemap: true,
            loader: {
                ".bin": "binary"
            },
            write: false
        }).outputFiles[0].text;
        return { code };
    }
}
