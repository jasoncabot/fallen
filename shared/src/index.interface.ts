enum Side {
    Human = 'HUMAN',
    Alien = 'ALIEN',
    Neutral = 'NEUTRAL',
}

enum TurnKind {
    Strategic = "STRATEGIC",
    Tactical = "TACTICAL"
}

enum SideType {
    AI = 'AI',
    Human = 'Player'
}

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

enum TerrainType {
    Desert = 'desert',
    Forest = 'forest',
    Rocky = 'rocky'
}

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
    kind: string // TODO: strongly type these
    position?: Placeable
    experience: number
    hp: number
    owner: Side
    facing: number
}

interface StructureDetails {
    hp: number
    kind: string // TODO: strongly type these
    units: UnitDetails[]
    position: Placeable
    owner: Side
}

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
    Technology,
    TerrainType,
    TurnKind,
    UnitDetails,
    UnitID,
    UserID,
};
