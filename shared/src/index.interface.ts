type Side = 'HUMAN' | 'ALIEN' | 'NEUTRAL';

type TurnKind = "STRATEGIC" | "TACTICAL";

type SideType = 'AI' | 'Player';

interface Technology {
    "energy-efficiency": number
    armour: number
    speed: number
    "weapon-damage": number
    "rate-of-fire": number
    rocketry: number
}

interface SideDetails {
    globalReserve: number
    name: string
    type: SideType
    owner: Side
    difficulty: number
    technology: Technology
}

interface ProvinceOverview {
    owner: Side
    name: string
    capital?: Side
}

type TerrainType = 'desert' | 'forest' | 'rocky';

interface ProvinceDetails {
    x: number
    y: number
    iconX: number
    iconY: number
    width: number
    height: number
    name: string
    type: TerrainType
    energy: number
    credits: number
    research: number
    touching: ProvinceID[]
    mission?: MissionOverview
    walls: Placeable[]
    roads: Placeable[]
    units: Record<UnitID, UnitDetails>
    structures: Record<StructureID, StructureDetails>
}

interface Placeable {
    x: number
    y: number
}

interface UnitDetails {
    kind: UnitType
    position?: Placeable
    experience: number
    hp: number
    owner: Side
    facing: number
}

interface StructureDetails {
    hp: number
    kind: StructureType // TODO: strongly type these
    units: UnitDetails[]
    position: Placeable
    owner: Side
}

type UnitType = "LTTANK" | "TANK" | "SQUAD" | "LONGRANGE" | "TROOP" | "UNIQUE1" | "LTGRAV" | "HEAVYGRAV" | "LONGRANGEHOVER";
type StructureType = "WALL" | "TOWER" | "AIRPORT" | "BARRACKS" | "STARPORT" | "ANTIMISSILE" | "ENERGY" | "FACTORY" | "LAB" | "MINING" | "SCANNER" | "DROPSHIP" | "MISSILE";

type UserID = string;
type GameID = string;
type ProvinceID = string;
type UnitID = string;
type StructureID = string;

interface GameDetails {
    id: GameID,
    defaultProvince: ProvinceID
    turn: {
        seed: number
        number: number
        action: number
        kind: TurnKind
        owner: Side
    }
    sides: Record<UserID, SideDetails>
    provinces: Record<ProvinceID, ProvinceDetails>
}

interface GameRow {
    id: GameID
    name: string
    date: Date
    kind: TurnKind
    owner: Side
    number: number
}

interface MissionOverview {
    description: string
    objective: string
    reward: string
}

export {
    GameDetails,
    GameID,
    GameRow,
    Placeable,
    ProvinceDetails,
    ProvinceID,
    ProvinceOverview,
    Side,
    SideDetails,
    SideType,
    StructureDetails,
    StructureID,
    StructureType,
    Technology,
    TerrainType,
    TurnKind,
    UnitDetails,
    UnitID,
    UnitType,
    UserID,
};
