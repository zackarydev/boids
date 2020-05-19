"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SQUARE_TERRAIN_DEFINITIONS = exports.SQUARE_FOODS = exports.SQUARE_SIZE = exports.TERRAIN_UPDATE_RATE = void 0;
const types_1 = require("./types");
exports.TERRAIN_UPDATE_RATE = 5000;
exports.SQUARE_SIZE = 6;
exports.SQUARE_FOODS = new Map([
    [
        types_1.SquareType.DEEP_WATER, 0
    ],
    [
        types_1.SquareType.SHORE_WATER, 0
    ],
    [
        types_1.SquareType.SWAMP, 250
    ],
    [
        types_1.SquareType.SAND, 50
    ],
    [
        types_1.SquareType.GRASSLAND, 250
    ],
    [
        types_1.SquareType.RAIN_FOREST, 1000
    ],
    [
        types_1.SquareType.MOUNTAIN, 50
    ],
    [
        types_1.SquareType.SNOW_PEAK, 0
    ]
]);
exports.SQUARE_TERRAIN_DEFINITIONS = new Map([
    [
        types_1.SquareType.DEEP_WATER,
        {
            height: {
                min: 0,
                max: 0.35,
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
        types_1.SquareType.SHORE_WATER,
        {
            height: {
                min: 0.35,
                max: 0.45,
            },
            moisture: {
                min: 0,
                max: 0.7,
            },
            humidity: {
                min: 0,
                max: 1,
            }
        }
    ],
    [
        types_1.SquareType.SWAMP,
        {
            height: {
                min: 0.35,
                max: 0.45,
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
        types_1.SquareType.SAND,
        {
            height: {
                min: 0.45,
                max: 0.7,
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
        types_1.SquareType.GRASSLAND,
        {
            height: {
                min: 0.45,
                max: 0.7,
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
        types_1.SquareType.RAIN_FOREST,
        {
            height: {
                min: 0.45,
                max: 0.7,
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
        types_1.SquareType.MOUNTAIN,
        {
            height: {
                min: 0.7,
                max: 0.8,
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
        types_1.SquareType.SNOW_PEAK,
        {
            height: {
                min: 0.8,
                max: 1,
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
]);
