module.exports = {
    "ASQD": {
        "kind": {
            "category": "ASQD",
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
            "next": "ASNI",
            "prev": null
        }
    },
    "ASNI": {
        "kind": {
            "category": "ASNI",
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
            "next": "ALTK",
            "prev": "ASQD"
        }
    },
    "ALTK": {
        "kind": {
            "category": "ALTK",
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
            "next": "APLA",
            "prev": "ASNI"
        }
    },
    "APLA": {
        "kind": {
            "category": "APLA",
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
            "next": "AGRV",
            "prev": "ALTK"
        }
    },
    "AGRV": {
        "kind": {
            "category": "AGRV",
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
            "next": "AFLY",
            "prev": "APLA"
        }
    },
    "AFLY": {
        "kind": {
            "category": "AFLY",
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
            "next": "AMDT",
            "prev": "AGRV"
        }
    },
    "AMDT": {
        "kind": {
            "category": "AMDT",
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
            "next": "ASUP",
            "prev": "AFLY"
        }
    },
    "ASUP": {
        "kind": {
            "category": "ASUP",
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
            "next": "AMEG",
            "prev": "AMDT"
        }
    },
    "AMEG": {
        "kind": {
            "category": "AMEG",
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
            "next": null,
            "prev": "ASUP"
        }
    }
}
