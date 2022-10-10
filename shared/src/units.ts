import { Displayable, EncyclopediaEntry } from "./structures";

export type UnitType = "SQUAD" |
    "TROOP" |
    "LTTANK" |
    "LONGRANGE" |
    "UNIQUE1" |
    "TANK" |
    "LTGRAV" |
    "HEAVYGRAV" |
    "LONGRANGEHOVER";

export type UnitCategory = "HSQU" | "HRAN" | "HATV" | "HART" | "HBUG" | "HTNK" | "HSPE" | "HGRV" | "HGUN" | "ASQD" | "ASNI" | "ALTK" | "APLA" | "AGRV" | "AFLY" | "AMDT" | "ASUP" | "AMEG" | "NGRV" | "NATV" | "NTNK" | "NROC";

type Movement = "GROUND" | "HOVER";

export interface WeaponData {
    name: "PLASMA LAUNCHER" | "EXPLOSIVE MINE"
    range: number
    damage: {
        contact: number
        close: number
        far: number
    }
    precision: number
    percentActionPoints: number

}

export interface UnitValue {
    kind: {
        category: UnitCategory
        type: UnitType
        name: string
    }
    upkeep: number
    cost: number
    hp: number
    actionPoints: number
    movement: Movement
    display: Displayable<"unit-neutral" | "unit-human" | "unit-alien">
    weapons: {
        light: WeaponData
        heavy: WeaponData
    }
    encyclopedia: EncyclopediaEntry<UnitCategory>
}


const data: Record<UnitCategory, UnitValue> = {
    "NATV": {
        "kind": {
            "category": "NATV",
            "type": "LTTANK",
            "name": "Strike Car"
        },
        "upkeep": 5,
        "cost": 100,
        "hp": 20,
        "actionPoints": 140,
        "movement": "GROUND",
        "display": {
            "tiles": "unit-neutral",
            "offset": 0
        },
        "weapons": {
            "light": {
                "name": "PLASMA LAUNCHER",
                "range": 4,
                "damage": {
                    "contact": 15,
                    "close": 4,
                    "far": 0
                },
                "precision": 1,
                "percentActionPoints": 35
            },
            "heavy": {
                "name": "EXPLOSIVE MINE",
                "range": 4,
                "damage": {
                    "contact": 15,
                    "close": 4,
                    "far": 0
                },
                "precision": 1,
                "percentActionPoints": 35
            }
        },
        "encyclopedia": {
            description: "",
            short: "",
            "next": "NTNK"
        }
    },
    "NTNK": {
        "kind": {
            "category": "NTNK",
            "type": "TANK",
            "name": "Tank"
        },
        "upkeep": 10,
        "cost": 200,
        "hp": 50,
        "actionPoints": 100,
        "movement": "GROUND",
        "display": {
            "tiles": "unit-neutral",
            "offset": 16
        },
        "weapons": {
            "light": {
                "name": "PLASMA LAUNCHER",
                "range": 4,
                "damage": {
                    "contact": 15,
                    "close": 4,
                    "far": 0
                },
                "precision": 1,
                "percentActionPoints": 35
            },
            "heavy": {
                "name": "EXPLOSIVE MINE",
                "range": 4,
                "damage": {
                    "contact": 15,
                    "close": 4,
                    "far": 0
                },
                "precision": 1,
                "percentActionPoints": 35
            }
        },
        "encyclopedia": {
            description: "",
            short: "",
            "next": "NGRV",
            "prev": "NATV"
        }
    },
    "NGRV": {
        "kind": {
            "category": "NGRV",
            "type": "SQUAD",
            "name": "Grav Bike"
        },
        "upkeep": 10,
        "cost": 200,
        "hp": 20,
        "actionPoints": 180,
        "movement": "HOVER",
        "display": {
            "tiles": "unit-neutral",
            "offset": 24
        },
        "weapons": {
            "light": {
                "name": "PLASMA LAUNCHER",
                "range": 4,
                "damage": {
                    "contact": 15,
                    "close": 4,
                    "far": 0
                },
                "precision": 1,
                "percentActionPoints": 35
            },
            "heavy": {
                "name": "EXPLOSIVE MINE",
                "range": 4,
                "damage": {
                    "contact": 15,
                    "close": 4,
                    "far": 0
                },
                "precision": 1,
                "percentActionPoints": 35
            }
        },
        "encyclopedia": {
            description: "",
            short: "",
            "next": "NROC",
            "prev": "NTNK"
        }
    },
    "NROC": {
        "kind": {
            "category": "NROC",
            "type": "LONGRANGE",
            "name": "Launcher"
        },
        "upkeep": 15,
        "cost": 600,
        "hp": 20,
        "actionPoints": 80,
        "movement": "GROUND",
        "display": {
            "tiles": "unit-neutral",
            "offset": 8
        },
        "weapons": {
            "light": {
                "name": "PLASMA LAUNCHER",
                "range": 4,
                "damage": {
                    "contact": 15,
                    "close": 4,
                    "far": 0
                },
                "precision": 1,
                "percentActionPoints": 35
            },
            "heavy": {
                "name": "EXPLOSIVE MINE",
                "range": 4,
                "damage": {
                    "contact": 15,
                    "close": 4,
                    "far": 0
                },
                "precision": 1,
                "percentActionPoints": 35
            }
        },
        "encyclopedia": {
            description: "",
            short: "",
            "prev": "NGRV"
        }
    },
    "HSQU": {
        "kind": {
            "category": "HSQU",
            "type": "SQUAD",
            "name": "Squad"
        },
        "upkeep": 1,
        "cost": 20,
        "hp": 10,
        "actionPoints": 70,
        "movement": "GROUND",
        "display": {
            "tiles": "unit-human",
            "offset": 32
        },
        "weapons": {
            "light": {
                "name": "PLASMA LAUNCHER",
                "range": 4,
                "damage": {
                    "contact": 15,
                    "close": 4,
                    "far": 0
                },
                "precision": 1,
                "percentActionPoints": 35
            },
            "heavy": {
                "name": "EXPLOSIVE MINE",
                "range": 4,
                "damage": {
                    "contact": 15,
                    "close": 4,
                    "far": 0
                },
                "precision": 1,
                "percentActionPoints": 35
            }
        },
        "encyclopedia": {
            description: "",
            short: "",
            "next": "HRAN",
        }
    },
    "HRAN": {
        "kind": {
            "category": "HRAN",
            "type": "TROOP",
            "name": "Ranger"
        },
        "upkeep": 2,
        "cost": 40,
        "hp": 15,
        "actionPoints": 80,
        "movement": "GROUND",
        "display": {
            "tiles": "unit-human",
            "offset": 72
        },
        "weapons": {
            "light": {
                "name": "PLASMA LAUNCHER",
                "range": 4,
                "damage": {
                    "contact": 15,
                    "close": 4,
                    "far": 0
                },
                "precision": 1,
                "percentActionPoints": 35
            },
            "heavy": {
                "name": "EXPLOSIVE MINE",
                "range": 4,
                "damage": {
                    "contact": 15,
                    "close": 4,
                    "far": 0
                },
                "precision": 1,
                "percentActionPoints": 35
            }
        },
        "encyclopedia": {
            description: "",
            short: "",
            "next": "HATV",
            "prev": "HSQU"
        }
    },
    "HATV": {
        "kind": {
            "category": "HATV",
            "type": "LTTANK",
            "name": "L.A.V"
        },
        "upkeep": 20,
        "cost": 100,
        "hp": 20,
        "actionPoints": 140,
        "movement": "GROUND",
        "display": {
            "tiles": "unit-human",
            "offset": 8
        },
        "weapons": {
            "light": {
                "name": "PLASMA LAUNCHER",
                "range": 4,
                "damage": {
                    "contact": 15,
                    "close": 4,
                    "far": 0
                },
                "precision": 1,
                "percentActionPoints": 35
            },
            "heavy": {
                "name": "EXPLOSIVE MINE",
                "range": 4,
                "damage": {
                    "contact": 15,
                    "close": 4,
                    "far": 0
                },
                "precision": 1,
                "percentActionPoints": 35
            }
        },
        "encyclopedia": {
            description: "",
            short: "",
            "next": "HART",
            "prev": "HRAN"
        }
    },
    "HART": {
        "kind": {
            "category": "HART",
            "type": "LONGRANGE",
            "name": "Artillery",
        },
        "upkeep": 30,
        "cost": 600,
        "hp": 20,
        "actionPoints": 60,
        "movement": "GROUND",
        "display": {
            "tiles": "unit-human",
            "offset": 0
        },
        "weapons": {
            "light": {
                "name": "PLASMA LAUNCHER",
                "range": 4,
                "damage": {
                    "contact": 15,
                    "close": 4,
                    "far": 0
                },
                "precision": 1,
                "percentActionPoints": 35
            },
            "heavy": {
                "name": "EXPLOSIVE MINE",
                "range": 4,
                "damage": {
                    "contact": 15,
                    "close": 4,
                    "far": 0
                },
                "precision": 1,
                "percentActionPoints": 35
            }
        },
        "encyclopedia": {
            description: "",
            short: "",
            "next": "HBUG",
            "prev": "HATV"
        }
    },
    "HBUG": {
        "kind": {
            "category": "HBUG",
            "type": "UNIQUE1",
            "name": "Buggy"
        },
        "upkeep": 5,
        "cost": 100,
        "hp": 15,
        "actionPoints": 300,
        "movement": "GROUND",
        "display": {
            "tiles": "unit-human",
            "offset": 48
        },
        "weapons": {
            "light": {
                "name": "PLASMA LAUNCHER",
                "range": 4,
                "damage": {
                    "contact": 15,
                    "close": 4,
                    "far": 0
                },
                "precision": 1,
                "percentActionPoints": 35
            },
            "heavy": {
                "name": "EXPLOSIVE MINE",
                "range": 4,
                "damage": {
                    "contact": 15,
                    "close": 4,
                    "far": 0
                },
                "precision": 1,
                "percentActionPoints": 35
            }
        },
        "encyclopedia": {
            description: "",
            short: "",
            "next": "HTNK",
            "prev": "HART"
        }
    },
    "HTNK": {
        "kind": {
            "category": "HTNK",
            "type": "TANK",
            "name": "Tank"
        },
        "upkeep": 10,
        "cost": 200,
        "hp": 65,
        "actionPoints": 100,
        "movement": "GROUND",
        "display": {
            "tiles": "unit-human",
            "offset": 40
        },
        "weapons": {
            "light": {
                "name": "PLASMA LAUNCHER",
                "range": 4,
                "damage": {
                    "contact": 15,
                    "close": 4,
                    "far": 0
                },
                "precision": 1,
                "percentActionPoints": 35
            },
            "heavy": {
                "name": "EXPLOSIVE MINE",
                "range": 4,
                "damage": {
                    "contact": 15,
                    "close": 4,
                    "far": 0
                },
                "precision": 1,
                "percentActionPoints": 35
            }
        },
        "encyclopedia": {
            description: "",
            short: "",
            "next": "HSPE",
            "prev": "HBUG"
        }
    },
    "HSPE": {
        "kind": {
            "category": "HSPE",
            "type": "LTGRAV",
            "name": "Speeder"
        },
        "upkeep": 10,
        "cost": 200,
        "hp": 20,
        "actionPoints": 180,
        "movement": "HOVER",
        "display": {
            "tiles": "unit-human",
            "offset": 16
        },
        "weapons": {
            "light": {
                "name": "PLASMA LAUNCHER",
                "range": 4,
                "damage": {
                    "contact": 15,
                    "close": 4,
                    "far": 0
                },
                "precision": 1,
                "percentActionPoints": 35
            },
            "heavy": {
                "name": "EXPLOSIVE MINE",
                "range": 4,
                "damage": {
                    "contact": 15,
                    "close": 4,
                    "far": 0
                },
                "precision": 1,
                "percentActionPoints": 35
            }
        },
        "encyclopedia": {
            description: "",
            short: "",
            "next": "HGRV",
            "prev": "HTNK"
        }
    },
    "HGRV": {
        "kind": {
            "category": "HGRV",
            "type": "HEAVYGRAV",
            "name": "Grav Tank"
        },
        "upkeep": 10,
        "cost": 200,
        "hp": 55,
        "actionPoints": 140,
        "movement": "HOVER",
        "display": {
            "tiles": "unit-human",
            "offset": 24
        },
        "weapons": {
            "light": {
                "name": "PLASMA LAUNCHER",
                "range": 4,
                "damage": {
                    "contact": 15,
                    "close": 4,
                    "far": 0
                },
                "precision": 1,
                "percentActionPoints": 35
            },
            "heavy": {
                "name": "EXPLOSIVE MINE",
                "range": 4,
                "damage": {
                    "contact": 15,
                    "close": 4,
                    "far": 0
                },
                "precision": 1,
                "percentActionPoints": 35
            }
        },
        "encyclopedia": {
            description: "",
            short: "",
            "next": "HGUN",
            "prev": "HSPE"
        }
    },
    "HGUN": {
        "kind": {
            "category": "HGUN",
            "type": "LONGRANGEHOVER",
            "name": "GunShip"
        },
        "upkeep": 50,
        "cost": 900,
        "hp": 75,
        "actionPoints": 120,
        "movement": "HOVER",
        "display": {
            "tiles": "unit-human",
            "offset": 64
        },
        "weapons": {
            "light": {
                "name": "PLASMA LAUNCHER",
                "range": 4,
                "damage": {
                    "contact": 15,
                    "close": 4,
                    "far": 0
                },
                "precision": 1,
                "percentActionPoints": 35
            },
            "heavy": {
                "name": "EXPLOSIVE MINE",
                "range": 4,
                "damage": {
                    "contact": 15,
                    "close": 4,
                    "far": 0
                },
                "precision": 1,
                "percentActionPoints": 35
            }
        },
        "encyclopedia": {
            description: "",
            short: "",
            "prev": "HGRV"
        }
    },
    "ASQD": {
        "kind": {
            "category": "ASQD",
            "type": "SQUAD",
            "name": "Trooper"
        },
        "upkeep": 2,
        "cost": 30,
        "hp": 15,
        "actionPoints": 50,
        "movement": "GROUND",
        "display": {
            "tiles": "unit-alien",
            "offset": 40
        },
        "weapons": {
            "light": {
                "name": "PLASMA LAUNCHER",
                "range": 4,
                "damage": {
                    "contact": 15,
                    "close": 4,
                    "far": 0
                },
                "precision": 1,
                "percentActionPoints": 35
            },
            "heavy": {
                "name": "EXPLOSIVE MINE",
                "range": 4,
                "damage": {
                    "contact": 15,
                    "close": 4,
                    "far": 0
                },
                "precision": 1,
                "percentActionPoints": 35
            }
        },
        "encyclopedia": {
            description: "",
            short: "",
            "next": "ASNI",
        }
    },
    "ASNI": {
        "kind": {
            "category": "ASNI",
            "type": "TROOP",
            "name": "Sniper"
        },
        "upkeep": 3,
        "cost": 60,
        "hp": 20,
        "actionPoints": 70,
        "movement": "GROUND",
        "display": {
            "tiles": "unit-alien",
            "offset": 72
        },
        "weapons": {
            "light": {
                "name": "PLASMA LAUNCHER",
                "range": 4,
                "damage": {
                    "contact": 15,
                    "close": 4,
                    "far": 0
                },
                "precision": 1,
                "percentActionPoints": 35
            },
            "heavy": {
                "name": "EXPLOSIVE MINE",
                "range": 4,
                "damage": {
                    "contact": 15,
                    "close": 4,
                    "far": 0
                },
                "precision": 1,
                "percentActionPoints": 35
            }
        },
        "encyclopedia": {
            description: "",
            short: "",
            "next": "ALTK",
            "prev": "ASQD"
        }
    },
    "ALTK": {
        "kind": {
            "category": "ALTK",
            "type": "LTTANK",
            "name": "Light Tank"
        },
        "upkeep": 10,
        "cost": 150,
        "hp": 30,
        "actionPoints": 100,
        "movement": "GROUND",
        "display": {
            "tiles": "unit-alien",
            "offset": 8
        },
        "weapons": {
            "light": {
                "name": "PLASMA LAUNCHER",
                "range": 4,
                "damage": {
                    "contact": 15,
                    "close": 4,
                    "far": 0
                },
                "precision": 1,
                "percentActionPoints": 35
            },
            "heavy": {
                "name": "EXPLOSIVE MINE",
                "range": 4,
                "damage": {
                    "contact": 15,
                    "close": 4,
                    "far": 0
                },
                "precision": 1,
                "percentActionPoints": 35
            }
        },
        "encyclopedia": {
            description: "",
            short: "",
            "next": "APLA",
            "prev": "ASNI"
        }
    },
    "APLA": {
        "kind": {
            "category": "APLA",
            "type": "LONGRANGE",
            "name": "Artillery"
        },
        "upkeep": 25,
        "cost": 500,
        "hp": 30,
        "actionPoints": 50,
        "movement": "GROUND",
        "display": {
            "tiles": "unit-alien",
            "offset": 32
        },
        "weapons": {
            "light": {
                "name": "PLASMA LAUNCHER",
                "range": 4,
                "damage": {
                    "contact": 15,
                    "close": 4,
                    "far": 0
                },
                "precision": 1,
                "percentActionPoints": 35
            },
            "heavy": {
                "name": "EXPLOSIVE MINE",
                "range": 4,
                "damage": {
                    "contact": 15,
                    "close": 4,
                    "far": 0
                },
                "precision": 1,
                "percentActionPoints": 35
            }
        },
        "encyclopedia": {
            description: "",
            short: "",
            "next": "AGRV",
            "prev": "ALTK"
        }
    },
    "AGRV": {
        "kind": {
            "category": "AGRV",
            "type": "HEAVYGRAV",
            "name": "Hover Tank"
        },
        "upkeep": 15,
        "cost": 300,
        "hp": 60,
        "actionPoints": 100,
        "movement": "HOVER",
        "display": {
            "tiles": "unit-alien",
            "offset": 48
        },
        "weapons": {
            "light": {
                "name": "PLASMA LAUNCHER",
                "range": 4,
                "damage": {
                    "contact": 15,
                    "close": 4,
                    "far": 0
                },
                "precision": 1,
                "percentActionPoints": 35
            },
            "heavy": {
                "name": "EXPLOSIVE MINE",
                "range": 4,
                "damage": {
                    "contact": 15,
                    "close": 4,
                    "far": 0
                },
                "precision": 1,
                "percentActionPoints": 35
            }
        },
        "encyclopedia": {
            description: "",
            short: "",
            "next": "AFLY",
            "prev": "APLA"
        }
    },
    "AFLY": {
        "kind": {
            "category": "AFLY",
            "type": "LTGRAV",
            "name": "Flyer"
        },
        "upkeep": 15,
        "cost": 300,
        "hp": 30,
        "actionPoints": 140,
        "movement": "HOVER",
        "display": {
            "tiles": "unit-alien",
            "offset": 0
        },
        "weapons": {
            "light": {
                "name": "PLASMA LAUNCHER",
                "range": 4,
                "damage": {
                    "contact": 15,
                    "close": 4,
                    "far": 0
                },
                "precision": 1,
                "percentActionPoints": 35
            },
            "heavy": {
                "name": "EXPLOSIVE MINE",
                "range": 4,
                "damage": {
                    "contact": 15,
                    "close": 4,
                    "far": 0
                },
                "precision": 1,
                "percentActionPoints": 35
            }
        },
        "encyclopedia": {
            description: "",
            short: "",
            "next": "AMDT",
            "prev": "AGRV"
        }
    },
    "AMDT": {
        "kind": {
            "category": "AMDT",
            "type": "TANK",
            "name": "Tank"
        },
        "upkeep": 15,
        "cost": 300,
        "hp": 75,
        "actionPoints": 70,
        "movement": "GROUND",
        "display": {
            "tiles": "unit-alien",
            "offset": 16
        },
        "weapons": {
            "light": {
                "name": "PLASMA LAUNCHER",
                "range": 4,
                "damage": {
                    "contact": 15,
                    "close": 4,
                    "far": 0
                },
                "precision": 1,
                "percentActionPoints": 35
            },
            "heavy": {
                "name": "EXPLOSIVE MINE",
                "range": 4,
                "damage": {
                    "contact": 15,
                    "close": 4,
                    "far": 0
                },
                "precision": 1,
                "percentActionPoints": 35
            }
        },
        "encyclopedia": {
            description: "",
            short: "",
            "next": "ASUP",
            "prev": "AFLY"
        }
    },
    "ASUP": {
        "kind": {
            "category": "ASUP",
            "type": "LONGRANGEHOVER",
            "name": "S.H.O.G"
        },
        "upkeep": 30,
        "cost": 600,
        "hp": 75,
        "actionPoints": 100,
        "movement": "HOVER",
        "display": {
            "tiles": "unit-alien",
            "offset": 64
        },
        "weapons": {
            "light": {
                "name": "PLASMA LAUNCHER",
                "range": 4,
                "damage": {
                    "contact": 15,
                    "close": 4,
                    "far": 0
                },
                "precision": 1,
                "percentActionPoints": 35
            },
            "heavy": {
                "name": "EXPLOSIVE MINE",
                "range": 4,
                "damage": {
                    "contact": 15,
                    "close": 4,
                    "far": 0
                },
                "precision": 1,
                "percentActionPoints": 35
            }
        },
        "encyclopedia": {
            description: "",
            short: "",
            "next": "AMEG",
            "prev": "AMDT"
        }
    },
    "AMEG": {
        "kind": {
            "category": "AMEG",
            "type": "UNIQUE1",
            "name": "Mega Tank"
        },
        "upkeep": 30,
        "cost": 600,
        "hp": 90,
        "actionPoints": 70,
        "movement": "GROUND",
        "display": {
            "tiles": "unit-alien",
            "offset": 24
        },
        "weapons": {
            "light": {
                "name": "PLASMA LAUNCHER",
                "range": 4,
                "damage": {
                    "contact": 15,
                    "close": 4,
                    "far": 0
                },
                "precision": 1,
                "percentActionPoints": 35
            },
            "heavy": {
                "name": "EXPLOSIVE MINE",
                "range": 4,
                "damage": {
                    "contact": 15,
                    "close": 4,
                    "far": 0
                },
                "precision": 1,
                "percentActionPoints": 35
            }
        },
        "encyclopedia": {
            description: "",
            short: "",
            "prev": "ASUP"
        }
    }
}

export { data as UnitData };
