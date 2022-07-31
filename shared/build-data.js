const esbuild = require('esbuild');
const path = require('path');

console.log('[esbuild] start');

esbuild.build({
    entryPoints: [path.join(__dirname, "src", "generate.ts")],
    outfile: path.join(__dirname, "dist", "generate.js"),
    bundle: true,
    minify: true,
    platform: 'node',
    sourcemap: true,
    target: 'esnext',
    watch: false,
}).catch((err) => {
    console.warn(err);
    process.exitCode = 1
}
);
console.log('[esbuild] finish');
