"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LANDABLE_SQUARE_TYPES = exports.SquareType = void 0;
var SquareType;
(function (SquareType) {
    SquareType[SquareType["DEEP_WATER"] = 0] = "DEEP_WATER";
    SquareType[SquareType["SHORE_WATER"] = 1] = "SHORE_WATER";
    SquareType[SquareType["SAND"] = 2] = "SAND";
    SquareType[SquareType["SWAMP"] = 3] = "SWAMP";
    SquareType[SquareType["GRASSLAND"] = 4] = "GRASSLAND";
    SquareType[SquareType["RAIN_FOREST"] = 5] = "RAIN_FOREST";
    SquareType[SquareType["MOUNTAIN"] = 6] = "MOUNTAIN";
    SquareType[SquareType["SNOW_PEAK"] = 7] = "SNOW_PEAK";
})(SquareType = exports.SquareType || (exports.SquareType = {}));
;
exports.LANDABLE_SQUARE_TYPES = [
    SquareType.SAND,
    SquareType.SWAMP,
    SquareType.GRASSLAND,
    SquareType.RAIN_FOREST,
    SquareType.MOUNTAIN,
    SquareType.SNOW_PEAK,
];
