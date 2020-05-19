export declare enum SquareType {
    DEEP_WATER = 0,
    SHORE_WATER = 1,
    SAND = 2,
    SWAMP = 3,
    GRASSLAND = 4,
    RAIN_FOREST = 5,
    MOUNTAIN = 6,
    SNOW_PEAK = 7
}
export declare const LANDABLE_SQUARE_TYPES: SquareType[];
export declare type TerrainDefinition = {
    min: number;
    max: number;
};
export declare type TerrainDefinitions = {
    height: TerrainDefinition;
    humidity: TerrainDefinition;
    moisture: TerrainDefinition;
};
//# sourceMappingURL=types.d.ts.map