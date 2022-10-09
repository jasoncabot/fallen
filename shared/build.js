const esbuild = require('esbuild');
const path = require('path');
const fs = require('fs');

console.log('[esbuild] start');

[
    { ext: "cjs", format: "cjs" },
    { ext: "mjs", format: "esm" }
].forEach(({ ext, format }) => {
    esbuild.build({
        entryPoints: [path.join(__dirname, "src", "index.ts")],
        outfile: path.join(__dirname, "dist", "shared." + ext),
        bundle: true,
        minify: true,
        sourcemap: true,
        target: 'esnext',
        format: format,
        watch: process.argv[2] === '--watch',
        loader: {
            ".bin": "binary"
        }
    }).catch((err) => {
        console.warn(err);
        process.exitCode = 1
    });
});

// This is a hack to explicitly define the module name of the shared module
// It's ugly and there's likely a better way to do it - but bleurgh
const typeDefPath = path.join(__dirname, "dist", "shared.d.ts");
fs.readFile(typeDefPath, 'utf8', (err, data) => {
    if (err) return console.log(err);
    const result = data.replace(/declare module "index"/g, 'declare module "@fallen/shared"');
    fs.writeFile(typeDefPath, result, 'utf8', function (err) {
        if (err) return console.log(err);
    });
});

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
