import { SquareType, TerrainDefinitions } from "./types";

export const SQUARE_SIZE = 4;

export const SQUARE_TERRAIN_DEFINITIONS: Map<
    SquareType, 
    TerrainDefinitions
> = new Map([
    [
        SquareType.DEEP_WATER, 
        {
            height: {
                min: 0,
                max: 0.2,
            },
            moisture: {
                min: 0,
                max: 1,
            },
            humidity: {
                min: 0,
                max: 1,
            }
        }
    ],

    [
        SquareType.SNOW, 
        {
            height: {
                min: 0.8,
                max: 1,
            },
            moisture: {
                min: 0.5,
                max: 1,
            },
            humidity: {
                min: 0,
                max: 1,
            }
        }
    ],
    [
        SquareType.TUNDRA, 
        {
            height: {
                min: 0.8,
                max: 1,
            },
            moisture: {
                min: 0.3,
                max: 0.5,
            },
            humidity: {
                min: 0,
                max: 1,
            }
        }
    ],
    [
        SquareType.BARE, 
        {
            height: {
                min: 0.8,
                max: 1,
            },
            moisture: {
                min: 0.15,
                max: 0.3,
            },
            humidity: {
                min: 0,
                max: 1,
            }
        }
    ],
    [
        SquareType.SCORCHED, 
        {
            height: {
                min: 0.8,
                max: 1,
            },
            moisture: {
                min: 0,
                max: 0.15,
            },
            humidity: {
                min: 0,
                max: 1,
            }
        }
    ],
    
    [
        SquareType.TAIGA, 
        {
            height: {
                min: 0.6,
                max: 0.8,
            },
            moisture: {
                min: 0.7,
                max: 1,
            },
            humidity: {
                min: 0,
                max: 1,
            }
        }
    ],
    [
        SquareType.SHRUBLAND, 
        {
            height: {
                min: 0.6,
                max: 0.8,
            },
            moisture: {
                min: 0.4,
                max: 0.7,
            },
            humidity: {
                min: 0,
                max: 1,
            }
        }
    ],
    [
        SquareType.TEMPERATE_DESERT, 
        {
            height: {
                min: 0.6,
                max: 0.8,
            },
            moisture: {
                min: 0,
                max: 0.4,
            },
            humidity: {
                min: 0,
                max: 1,
            }
        }
    ],
    [
        SquareType.TEMPERATE_RAIN_FOREST, 
        {
            height: {
                min: 0.4,
                max: 0.6,
            },
            moisture: {
                min: 0.8,
                max: 1,
            },
            humidity: {
                min: 0,
                max: 1,
            }
        }
    ],
    [
        SquareType.TEMPERATE_DECIDUOUS_FOREST, 
        {
            height: {
                min: 0.4,
                max: 0.6,
            },
            moisture: {
                min: 0.5,
                max: 0.8,
            },
            humidity: {
                min: 0,
                max: 1,
            }
        }
    ],
    [
        SquareType.GRASSLAND, 
        {
            height: {
                min: 0.4,
                max: 0.6,
            },
            moisture: {
                min: 0,
                max: 0.3,
            },
            humidity: {
                min: 0,
                max: 1,
            }
        }
    ],
    // [
    //     SquareType.TEMPERATE_DESERT, 
    //     {
    //         height: {
    //             min: 0.4,
    //             max: 0.6,
    //         },
    //         moisture: {
    //             min: 0,
    //             max: 0.3,
    //         },
    //         humidity: {
    //             min: 0,
    //             max: 1,
    //         }
    //     }
    // ],

    [
        SquareType.TROPICAL_RAIN_FOREST, 
        {
            height: {
                min: 0.2,
                max: 0.4,
            },
            moisture: {
                min: 0.7,
                max: 1,
            },
            humidity: {
                min: 0,
                max: 1,
            }
        }
    ],
    [
        SquareType.TROPICAL_SEASONAL_FOREST, 
        {
            height: {
                min: 0.2,
                max: 0.4,
            },
            moisture: {
                min: 0.4,
                max: 0.7,
            },
            humidity: {
                min: 0,
                max: 1,
            }
        }
    ],
    [
        SquareType.SUBTROPICAL_DESERT, 
        {
            height: {
                min: 0.2,
                max: 0.4,
            },
            moisture: {
                min: 0,
                max: 0.4,
            },
            humidity: {
                min: 0,
                max: 1,
            }
        }
    ],
]);