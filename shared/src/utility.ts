import { Side } from "./index.interface";

const opposite = (side: string) => { return side === 'HUMAN' ? 'ALIEN' : 'HUMAN' };

export { opposite };