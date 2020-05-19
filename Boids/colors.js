"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SquareColors = exports.BirdColor = void 0;
const types_1 = require("./Terrain/types");
exports.BirdColor = '#242124';
exports.SquareColors = {
    [types_1.SquareType.DEEP_WATER]: '#006B99',
    [types_1.SquareType.SHORE_WATER]: '#008ECC',
    [types_1.SquareType.SAND]: '#e5d8c1',
    [types_1.SquareType.SWAMP]: '#555c45',
    [types_1.SquareType.GRASSLAND]: '#bbcba0',
    [types_1.SquareType.RAIN_FOREST]: '#92b29f',
    [types_1.SquareType.MOUNTAIN]: '#AAAAAA',
    [types_1.SquareType.SNOW_PEAK]: '#FFFFFF',
};
