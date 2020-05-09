export enum SquareType {
    DEEP_WATER,
    WATER,
    SHORE_WATER,
    LAKE_WATER,

    SNOW,
    TUNDRA,
    BARE,
    SCORCHED,

    TAIGA,
    SHRUBLAND,
    TEMPERATE_DESERT,

    TEMPERATE_RAIN_FOREST,
    TEMPERATE_DECIDUOUS_FOREST,
    GRASSLAND,
    
    TROPICAL_RAIN_FOREST,
    TROPICAL_SEASONAL_FOREST,
    SUBTROPICAL_DESERT,
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