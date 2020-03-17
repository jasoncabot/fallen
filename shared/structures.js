module.exports = {
    "WALL": {
        "kind": {
            "category": "WALL",
            "type": "WALL",
            "name": "Wall",
            "starship": false
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
        "storage": {
            "category": "",
            "size": 0
        },
        "build": {
            "cost": 10,
            "placement": "B-WALL-OR-ROAD"
        },
        "encyclopedia": {
            "description": "This is a longer description",
            "short": "Passive defence capacity",
            "next": "",
            "prev": ""
        }
    },
    "ATUR": {
        "kind": {
            "category": "ATUR",
            "type": "TOWER",
            "name": "Fusion Tower",
            "starship": false
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
            "description": "This is a longer description",
            "short": "Automatic active defense",
            "next": "AAIR",
            "prev": ""
        }
    },
    "AAIR": {
        "kind": {
            "category": "AAIR",
            "type": "AIRPORT",
            "name": "Hover Pads",
            "starship": false
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
            "starship": false
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
            "starship": false
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
            "starship": false
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
            "starship": false
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
            "starship": false
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
            "starship": false
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
            "starship": false
        },
        "display": {
            "width": 3,
            "height": 3,
            "tiles": "structure-alien",
            "offset": 49
        },
        "production": {
            "category": "CASH",
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
            "starship": false,
            "scanner": true
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
            "name": "Dropship",
            "starship": true
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
            "description": "This is a longer description",
            "short": "Short description",
            "next": "ASIL",
            "prev": "ARAD"
        }
    },
    "ASIL": {
        "kind": {
            "category": "ASIL",
            "name": "Nuclear Launcher",
            "starship": false
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
            "next": "",
            "prev": "ASHP"
        }
    }
};
