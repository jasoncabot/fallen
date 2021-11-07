import { Side } from "./index.interface";

const opposite = (side: string) => { return side === Side.Human ? Side.Alien : Side.Human };

export { opposite };