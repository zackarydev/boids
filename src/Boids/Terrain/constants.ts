import { BiomeType, SquareType, TerrainHeightDefinition } from "./types";

export const SQUARE_SIZE = 6;

export const SQUARE_TERRAIN_HEIGHTS: Map<BiomeType, Map<SquareType, TerrainHeightDefinition>> = new Map([
    [
        BiomeType.OCEAN,
        new Map([
            [
                SquareType.WATER, 
                {
                    min: 0,
                    max: 0.4,
                }
            ],
            [
                SquareType.SAND, 
                {
                    min: 0.4,
                    max: 0.5,
                }
            ],
            [
                SquareType.GRASS, 
                {
                    min: 0.5,
                    max: 1,
                }
            ],
        ])
    ],
]);