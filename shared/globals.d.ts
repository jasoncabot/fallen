declare module '*.bin' {
    const content: Uint8Array;
    export default content;
}

declare module '*.png' { const url: string; export default url; }
declare module '*.jpg' { const url: string; export default url; }
declare module '*.WAV' { const url: string; export default url; }
declare module '*.wav' { const url: string; export default url; }
