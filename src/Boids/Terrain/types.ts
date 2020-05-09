export enum SquareType {
    DEEP_WATER,
    SHORE_WATER,

    SAND,
    SWAMP,

    GRASSLAND,
    RAIN_FOREST,

    MOUNTAIN,
    SNOW_PEAK,
};

export type TerrainDefinition = {
    min: number,
    max: number,
};

export type TerrainDefinitions = {
    height: TerrainDefinition,
    humidity: TerrainDefinition,
    moisture: TerrainDefinition,
};