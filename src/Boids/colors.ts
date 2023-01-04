import { SquareType } from './Terrain/types';

export const BirdColor = '#242124';

export const SquareColors = {
    [SquareType.DEEP_WATER]: '#006B99',
    [SquareType.SHORE_WATER]: '#008ECC',

    [SquareType.SAND]: '#e5d8c1',
    [SquareType.SWAMP]: '#555c45',

    [SquareType.GRASSLAND]: '#bbcba0',
    [SquareType.RAIN_FOREST]: '#92b29f',

    [SquareType.MOUNTAIN]: '#AAAAAA',
    [SquareType.SNOW_PEAK]: '#FFFFFF',
};
