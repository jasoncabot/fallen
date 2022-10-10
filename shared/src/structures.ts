import { UnitType } from "./units";

export type StructureCategory = "WALL" | "HTUR" | "HAIR" | "HBAR" | "HBAY" | "HDEF" | "HENY" | "HFAC" | "HLAB" | "HMIN" | "HRAD" | "HSHP" | "HSIL" |
    "ATUR" | "AAIR" | "ABAR" | "ABAY" | "ADEF" | "AENY" | "AFAC" | "ALAB" | "AMIN" | "ARAD" | "ASHP" | "ASIL";
    export type StructureType = "WALL" | "TOWER" | "AIRPORT" | "BARRACKS" | "STARPORT" | "ANTIMISSILE" | "ENERGY" | "FACTORY" | "LAB" | "MINING" | "SCANNER" | "DROPSHIP" | "MISSILE";
type Alliance = "HUMAN" | "ALIEN" | "NEUTRAL";
type Placement = "B-WALL" | "B-WALL-OR-ROAD" | "B-ROAD" | "ANYWHERE";
type StructureTiles = "structure-build" | "structure-infra" | "structure-human" | "structure-human-dropship" | "structure-alien" | "structure-alien-dropship";

interface StructureKind {
    category: StructureCategory
    type: StructureType
    name: string
    constructable: boolean
    owner: Alliance[]
}

export interface Displayable<TilsetName> {
    width?: number
    height?: number
    tiles: TilsetName,
    offset: number
}
interface StructureAction {
}
interface StructureProduction {
    category: string // TODO: not right
    value: number // todo: not right
}
interface BuildData {
    cost: number
    placement: Placement
}
export interface EncyclopediaEntry<EntryType> {
    description: string
    short: string
    next?: EntryType
    prev?: EntryType
}
export interface StructureValue {
    kind: StructureKind
    display: Displayable<StructureTiles>
    action?: StructureAction
    production: StructureProduction
    energyUsage: number
    hp: number
    build: BuildData
    encyclopedia: EncyclopediaEntry<StructureCategory>
}

const data: Record<StructureCategory, StructureValue> = {
    "WALL": {
        "kind": {
            "category": "WALL",
            "type": "WALL",
            "name": "Wall",
            "constructable": true,
            "owner": ["HUMAN", "ALIEN", "NEUTRAL"]
        },
        "display": {
            "width": 1,
            "height": 1,
            "tiles": "structure-infra",
            "offset": 32
        },
        "production": {
            "category": "NONE",
            "value": 0
        },
        "energyUsage": 0,
        "hp": 20,
        "build": {
            "cost": 10,
            "placement": "B-WALL-OR-ROAD"
        },
        "encyclopedia": {
            "description": "Protects from ranged fire",
            "short": "Passive defence capacity"
        }
    },

    "HTUR": {
        "kind": {
            "category": "HTUR",
            "type": "TOWER",
            "name": "Fusion Tower",
            "constructable": true,
            "owner": ["HUMAN", "NEUTRAL"]
        },
        "display": {
            "width": 1,
            "height": 1,
            "tiles": "structure-human",
            "offset": 66
        },
        "action": {
            "TACTICAL": "FIRE"
        },
        "production": {
            "category": "NONE",
            "value": 0
        },
        "energyUsage": 25,
        "hp": 50,
        "build": {
            "cost": 100,
            "placement": "B-WALL"
        },
        "encyclopedia": {
            "description": "Attacks with a ranged attack",
            "short": "Automatic active defense",
            "next": "HAIR"
        }
    },
    "HAIR": {
        "kind": {
            "category": "HAIR",
            "type": "AIRPORT",
            "name": "Gravport",
            "constructable": true,
            "owner": ["HUMAN", "NEUTRAL"]
        },
        "display": {
            "width": 3,
            "height": 4,
            "tiles": "structure-human",
            "offset": 0
        },
        "production": {
            "category": "HOVER",
            "value": 12
        },
        "energyUsage": 50,
        "hp": 250,
        "build": {
            "cost": 300,
            "placement": "B-ROAD"
        },
        "encyclopedia": {
            "description": "Allows construction of hover units.",
            "short": "Production capacity: Hover units",
            "next": "HBAR",
            "prev": "HTUR"
        }
    },
    "HBAR": {
        "kind": {
            "category": "HBAR",
            "type": "BARRACKS",
            "name": "Barrack",
            "constructable": true,
            "owner": ["HUMAN", "NEUTRAL"]
        },
        "display": {
            "width": 2,
            "height": 2,
            "tiles": "structure-human",
            "offset": 12
        },
        "production": {
            "category": "TROOP",
            "value": 8
        },
        "energyUsage": 5,
        "hp": 150,
        "build": {
            "cost": 200,
            "placement": "B-ROAD"
        },
        "encyclopedia": {
            "description": "Allows construction of squad units.",
            "short": "Production capacity: Squad units",
            "next": "HBAY",
            "prev": "HAIR"
        }
    },
    "HBAY": {
        "kind": {
            "category": "HBAY",
            "type": "STARPORT",
            "name": "Shipyard",
            "constructable": false,
            "owner": ["HUMAN", "NEUTRAL"]
        },
        "display": {
            "width": 3,
            "height": 4,
            "tiles": "structure-human",
            "offset": 16
        },
        "action": {
            "STRATEGIC": "BUILD_DROPSHIP"
        },
        "production": {
            "category": "DROPSHIP",
            "value": 1
        },
        "energyUsage": 50,
        "hp": 20000,
        "build": {
            "cost": 300,
            "placement": "B-ROAD"
        },
        "encyclopedia": {
            "description": "The only building that allows construction of dropships",
            "short": "Short description",
            "next": "HDEF",
            "prev": "HBAR"
        }
    },
    "HDEF": {
        "kind": {
            "category": "HDEF",
            "type": "ANTIMISSILE",
            "name": "Anti-Missile",
            "constructable": true,
            "owner": ["HUMAN", "NEUTRAL"]
        },
        "display": {
            "width": 2,
            "height": 2,
            "tiles": "structure-human",
            "offset": 28
        },
        "production": {
            "category": "NONE",
            "value": 0
        },
        "energyUsage": 50,
        "hp": 200,
        "build": {
            "cost": 400,
            "placement": "B-ROAD"
        },
        "encyclopedia": {
            "description": "Defense against incoming missiles.",
            "short": "Defense power: Antimissile",
            "next": "HENY",
            "prev": "HBAY"
        }
    },
    "HENY": {
        "kind": {
            "category": "HENY",
            "type": "ENERGY",
            "name": "Power Plant",
            "constructable": true,
            "owner": ["HUMAN", "NEUTRAL"]
        },
        "display": {
            "width": 2,
            "height": 2,
            "tiles": "structure-human",
            "offset": 32
        },
        "production": {
            "category": "ENERGY",
            "value": 100
        },
        "energyUsage": 0,
        "hp": 100,
        "build": {
            "cost": 50,
            "placement": "B-ROAD"
        },
        "encyclopedia": {
            "description": "Produces energy to maintain buildings.",
            "short": "Energy production: 100 EP",
            "next": "HFAC",
            "prev": "HDEF"
        }
    },
    "HFAC": {
        "kind": {
            "category": "HFAC",
            "type": "FACTORY",
            "name": "Factory",
            "constructable": true,
            "owner": ["HUMAN", "NEUTRAL"]
        },
        "display": {
            "width": 3,
            "height": 3,
            "tiles": "structure-human",
            "offset": 36
        },
        "production": {
            "category": "FACTORY",
            "value": 12
        },
        "energyUsage": 50,
        "hp": 250,
        "build": {
            "cost": 300,
            "placement": "B-ROAD"
        },
        "encyclopedia": {
            "description": "Allows construction of ground units.",
            "short": "Production capacity: Ground units",
            "next": "HLAB",
            "prev": "HENY"
        }
    },
    "HLAB": {
        "kind": {
            "category": "HLAB",
            "type": "LAB",
            "name": "Laboratory",
            "constructable": true,
            "owner": ["HUMAN", "NEUTRAL"]
        },
        "display": {
            "width": 2,
            "height": 2,
            "tiles": "structure-human",
            "offset": 45
        },
        "production": {
            "category": "RESEARCH",
            "value": 100
        },
        "energyUsage": 10,
        "hp": 50,
        "build": {
            "cost": 400,
            "placement": "B-ROAD"
        },
        "encyclopedia": {
            "description": "Produces research points to improve the Tech Level in six Research Fields.",
            "short": "Research Production: 100 RP",
            "next": "HMIN",
            "prev": "HFAC"
        }
    },
    "HMIN": {
        "kind": {
            "category": "HMIN",
            "type": "MINING",
            "name": "Mining Facility",
            "constructable": true,
            "owner": ["HUMAN", "NEUTRAL"]
        },
        "display": {
            "width": 3,
            "height": 3,
            "tiles": "structure-human",
            "offset": 49
        },
        "production": {
            "category": "CREDITS",
            "value": 100
        },
        "energyUsage": 10,
        "hp": 250,
        "build": {
            "cost": 100,
            "placement": "B-ROAD"
        },
        "encyclopedia": {
            "description": "Produces credits income to build units and structures.",
            "short": "Credits production: 100 Credits",
            "next": "HRAD",
            "prev": "HLAB"
        }
    },
    "HRAD": {
        "kind": {
            "category": "HRAD",
            "type": "SCANNER",
            "name": "Radar",
            "constructable": true,
            "owner": ["HUMAN", "NEUTRAL"]
        },
        "display": {
            "width": 2,
            "height": 2,
            "tiles": "structure-human",
            "offset": 58
        },
        "production": {
            "category": "NONE",
            "value": 0
        },
        "energyUsage": 30,
        "hp": 30,
        "build": {
            "cost": 200,
            "placement": "B-ROAD"
        },
        "encyclopedia": {
            "description": "Gives information on adjacent provinces, improves Nuclear attack and defense.",
            "short": "Capacity: Scanning adjacent provinces",
            "next": "HSHP",
            "prev": "HMIN"
        }
    },
    "HSHP": {
        "kind": {
            "category": "HSHP",
            "type": "DROPSHIP",
            "name": "Dropship",
            "constructable": false,
            "owner": ["HUMAN"]
        },
        "display": {
            "width": 3,
            "height": 3,
            "tiles": "structure-human-dropship",
            "offset": 0
        },
        "action": {
            "STRATEGIC": "LAUNCH",
            "TACTICAL": "LAUNCH"
        },
        "production": {
            "category": "NONE",
            "value": 8
        },
        "energyUsage": 0,
        "hp": 75,
        "build": {
            "cost": 600,
            "placement": "ANYWHERE"
        },
        "encyclopedia": {
            "description": "Dropships transport units from one province to another.",
            "short": "",
            "next": "HSIL",
            "prev": "HRAD"
        }
    },
    "HSIL": {
        "kind": {
            "category": "HSIL",
            "name": "Nuclear Silo",
            "type": "MISSILE",
            "constructable": true,
            "owner": ["HUMAN", "NEUTRAL"]
        },
        "display": {
            "width": 2,
            "height": 2,
            "tiles": "structure-human",
            "offset": 62
        },
        "action": {
            "STRATEGIC": "MISSILE",
            "TACTICAL": null
        },
        "production": {
            "category": "NONE",
            "value": 0
        },
        "energyUsage": 50,
        "hp": 200,
        "build": {
            "cost": 800,
            "placement": "B-ROAD"
        },
        "encyclopedia": {
            "description": "Allows construction of nuclear missiles.",
            "short": "Long-range attack",
            "prev": "HSHP"
        }
    },
    "ATUR": {
        "kind": {
            "category": "ATUR",
            "type": "TOWER",
            "name": "Fusion Tower",
            "constructable": true,
            "owner": ["ALIEN"]
        },
        "display": {
            "width": 1,
            "height": 1,
            "tiles": "structure-alien",
            "offset": 66
        },
        "action": {
            "TACTICAL": "FIRE"
        },
        "production": {
            "category": "NONE",
            "value": 0
        },
        "energyUsage": 25,
        "hp": 40,
        "build": {
            "cost": 75,
            "placement": "B-WALL"
        },
        "encyclopedia": {
            "description": "Attacks with a ranged attack",
            "short": "Automatic active defense",
            "next": "AAIR"
        }
    },
    "AAIR": {
        "kind": {
            "category": "AAIR",
            "type": "AIRPORT",
            "name": "Hover Pads",
            "constructable": true,
            "owner": ["ALIEN"]
        },
        "display": {
            "width": 3,
            "height": 4,
            "tiles": "structure-alien",
            "offset": 0
        },
        "production": {
            "category": "HOVER",
            "value": 12
        },
        "energyUsage": 50,
        "hp": 200,
        "build": {
            "cost": 225,
            "placement": "B-ROAD"
        },
        "encyclopedia": {
            "description": "Allows construction of hover units.",
            "short": "Production capacity: Hover units",
            "next": "ABAR",
            "prev": "ATUR"
        }
    },
    "ABAR": {
        "kind": {
            "category": "ABAR",
            "type": "BARRACKS",
            "name": "Nest Center",
            "constructable": true,
            "owner": ["ALIEN"]
        },
        "display": {
            "width": 2,
            "height": 2,
            "tiles": "structure-alien",
            "offset": 12
        },
        "production": {
            "category": "TROOP",
            "value": 8
        },
        "energyUsage": 5,
        "hp": 110,
        "build": {
            "cost": 150,
            "placement": "B-ROAD"
        },
        "encyclopedia": {
            "description": "Allows construction of squad units.",
            "short": "Production capacity: Squad units",
            "next": "ABAY",
            "prev": "AAIR"
        }
    },
    "ABAY": {
        "kind": {
            "category": "ABAY",
            "type": "STARPORT",
            "name": "Landing Site",
            "constructable": false,
            "owner": ["ALIEN"]
        },
        "display": {
            "width": 3,
            "height": 4,
            "tiles": "structure-alien",
            "offset": 16
        },
        "action": {
            "STRATEGIC": "BUILD_DROPSHIP"
        },
        "production": {
            "category": "DROPSHIP",
            "value": 1
        },
        "energyUsage": 50,
        "hp": 20000,
        "build": {
            "cost": 225,
            "placement": "B-ROAD"
        },
        "encyclopedia": {
            "description": "The only building that allows construction of dropships",
            "short": "Short description",
            "next": "ADEF",
            "prev": "ABAR"
        }
    },
    "ADEF": {
        "kind": {
            "category": "ADEF",
            "type": "ANTIMISSILE",
            "name": "Anti-Missile",
            "constructable": true,
            "owner": ["ALIEN"]
        },
        "display": {
            "width": 2,
            "height": 2,
            "tiles": "structure-alien",
            "offset": 28
        },
        "production": {
            "category": "NONE",
            "value": 0
        },
        "energyUsage": 50,
        "hp": 150,
        "build": {
            "cost": 300,
            "placement": "B-ROAD"
        },
        "encyclopedia": {
            "description": "Defense against incoming missiles.",
            "short": "Defense power: Antimissile",
            "next": "AENY",
            "prev": "ABAY"
        }
    },
    "AENY": {
        "kind": {
            "category": "AENY",
            "type": "ENERGY",
            "name": "Energy Center",
            "constructable": true,
            "owner": ["ALIEN"]
        },
        "display": {
            "width": 2,
            "height": 2,
            "tiles": "structure-alien",
            "offset": 32
        },
        "production": {
            "category": "ENERGY",
            "value": 100
        },
        "energyUsage": 0,
        "hp": 75,
        "build": {
            "cost": 40,
            "placement": "B-ROAD"
        },
        "encyclopedia": {
            "description": "Produces energy to maintain buildings.",
            "short": "Energy production: 100 EP",
            "next": "AFAC",
            "prev": "ADEF"
        }
    },
    "AFAC": {
        "kind": {
            "category": "AFAC",
            "type": "FACTORY",
            "name": "Production Center",
            "constructable": true,
            "owner": ["ALIEN"]
        },
        "display": {
            "width": 3,
            "height": 3,
            "tiles": "structure-alien",
            "offset": 36
        },
        "production": {
            "category": "FACTORY",
            "value": 12
        },
        "energyUsage": 50,
        "hp": 200,
        "build": {
            "cost": 225,
            "placement": "B-ROAD"
        },
        "encyclopedia": {
            "description": "Allows construction of ground units.",
            "short": "Production capacity: Ground units",
            "next": "ALAB",
            "prev": "AENY"
        }
    },
    "ALAB": {
        "kind": {
            "category": "ALAB",
            "type": "LAB",
            "name": "Research Center",
            "constructable": true,
            "owner": ["ALIEN"]
        },
        "display": {
            "width": 2,
            "height": 2,
            "tiles": "structure-alien",
            "offset": 45
        },
        "production": {
            "category": "RESEARCH",
            "value": 100
        },
        "energyUsage": 10,
        "hp": 40,
        "build": {
            "cost": 300,
            "placement": "B-ROAD"
        },
        "encyclopedia": {
            "description": "Produces research points to improve the Tech Level in six Research Fields.",
            "short": "Research Production: 100 RP",
            "next": "AMIN",
            "prev": "AFAC"
        }
    },
    "AMIN": {
        "kind": {
            "category": "AMIN",
            "type": "MINING",
            "name": "Refinery",
            "constructable": true,
            "owner": ["ALIEN"]
        },
        "display": {
            "width": 3,
            "height": 3,
            "tiles": "structure-alien",
            "offset": 49
        },
        "production": {
            "category": "CREDITS",
            "value": 100
        },
        "energyUsage": 10,
        "hp": 200,
        "build": {
            "cost": 75,
            "placement": "B-ROAD"
        },
        "encyclopedia": {
            "description": "Produces credits income to build units and structures.",
            "short": "Credits production: 100 Credits",
            "next": "ARAD",
            "prev": "ALAB"
        }
    },
    "ARAD": {
        "kind": {
            "category": "ARAD",
            "type": "SCANNER",
            "name": "Scanning Device",
            "constructable": true,
            "owner": ["ALIEN"]
        },
        "display": {
            "width": 2,
            "height": 2,
            "tiles": "structure-alien",
            "offset": 58
        },
        "production": {
            "category": "NONE",
            "value": 0
        },
        "energyUsage": 30,
        "hp": 25,
        "build": {
            "cost": 150,
            "placement": "B-ROAD"
        },
        "encyclopedia": {
            "description": "Gives information on adjacent provinces, improves Nuclear attack and defense.",
            "short": "Capacity: Scanning adjacent provinces",
            "next": "ASHP",
            "prev": "AMIN"
        }
    },
    "ASHP": {
        "kind": {
            "category": "ASHP",
            "type": "DROPSHIP",
            "name": "Dropship",
            "constructable": false,
            "owner": ["ALIEN"]
        },
        "display": {
            "width": 3,
            "height": 3,
            "tiles": "structure-alien-dropship",
            "offset": 0
        },
        "action": {
            "STRATEGIC": "LAUNCH",
            "TACTICAL": "LAUNCH"
        },
        "production": {
            "category": "NONE",
            "value": 8
        },
        "energyUsage": 0,
        "hp": 75,
        "build": {
            "cost": 800,
            "placement": "ANYWHERE"
        },
        "encyclopedia": {
            "description": "Dropships transport units from one province to another.",
            "short": "",
            "next": "ASIL",
            "prev": "ARAD"
        }
    },
    "ASIL": {
        "kind": {
            "category": "ASIL",
            "name": "Nuclear Launcher",
            "type": "MISSILE",
            "constructable": true,
            "owner": ["ALIEN"]
        },
        "display": {
            "width": 2,
            "height": 2,
            "tiles": "structure-alien",
            "offset": 62
        },
        "action": {
            "STRATEGIC": "MISSILE",
            "TACTICAL": null
        },
        "production": {
            "category": "NONE",
            "value": 0
        },
        "energyUsage": 50,
        "hp": 150,
        "build": {
            "cost": 600,
            "placement": "B-ROAD"
        },
        "encyclopedia": {
            "description": "Allows construction of nuclear missiles.",
            "short": "Long-range attack",
            "prev": "ASHP"
        }
    }
};

export { data as StructureData }
