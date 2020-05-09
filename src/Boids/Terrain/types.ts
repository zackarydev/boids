export enum BiomeType {
    OCEAN,
    FLATLANDS,
};

export enum SquareType {
    WATER,
    SAND,
    GRASS,
};

export type TerrainHeightDefinition = {
    min: number,
    max: number,
};