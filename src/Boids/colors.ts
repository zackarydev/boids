import { SquareType } from "./Terrain/types";

export const BirdColor = '#242124';

export const SquareColors = {
    [SquareType.DEEP_WATER]: '#006B99',
    [SquareType.WATER]: '#008ECC',
    [SquareType.SHORE_WATER]: '#008ECC',
    [SquareType.LAKE_WATER]: '#008ECC',

    [SquareType.SNOW]: '#FFFFFF',
    [SquareType.TUNDRA]: '#d8d8b4',
    [SquareType.BARE]: '#b3b2b3', 
    [SquareType.SCORCHED]: '#8e8e8e', 

    [SquareType.TAIGA]: '#c5ceb3',
    [SquareType.SHRUBLAND]: '#bcc5b3',
    [SquareType.TEMPERATE_DESERT]: '#e0e5c4',
    
    [SquareType.TEMPERATE_RAIN_FOREST]: '#9abc9f',
    [SquareType.TEMPERATE_DECIDUOUS_FOREST]: '#abc2a0',
    [SquareType.GRASSLAND]: '#bbcba0',

    [SquareType.TROPICAL_RAIN_FOREST]: '#92b29f',
    [SquareType.TROPICAL_SEASONAL_FOREST]: '#a0c59b',
    [SquareType.SUBTROPICAL_DESERT]: '#e5d8c1',
};