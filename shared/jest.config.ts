import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
    preset: "ts-jest",
    globals: {
        "ts-jest": {
            tsconfig: "test/tsconfig.json"
        }
    },
    transform: {
        '^.+\\.bin?$': '<rootDir>/build',
        "\\.[jt]sx?$": ["esbuild-jest", {
            sourcemap: true,
            target: "esnext"
        }]
    },
    moduleNameMapper: {
        "^(\\.{1,2}/.*)\\.js$": "$1",
    },
    testEnvironmentOptions: {
        scriptPath: "dist/shared.js",
    }
};
export default config;
