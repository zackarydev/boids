import FastSimplexNoise from 'fast-simplex-noise';

import { IGame } from '../../Game';
import Terrain, { ITerrain } from '..';
import { RandomNumberGeneratorFunction, HexType, BiomeType } from '../../types';
import Hex from '../../Hex';
import { HEX_WIDTH, HEX_OBTUSE_WIDTH, HEX_HEIGHT } from '../../constants';

type TerrainHeightType = {
    min: number;
    max: number;
};

export interface IProceduralTerrain extends ITerrain {}

export default class ProceduralTerrain extends Terrain implements IProceduralTerrain {
    readonly BIOME_VALUES: Map<BiomeType, TerrainHeightType> = new Map([
        [
            // TODO: Add all bioms.
            BiomeType.OCEAN,
            {
                min: 0,
                max: 1,
            },
        ],
        // [
        //     BiomeType.FLATLANDS,
        //     {
        //         min: 0.33,
        //         max: 0.66
        //     }
        // ],
        // [
        //     BiomeType.MOUNTAINOUS,
        //     {
        //         min: 0.66,
        //         max: 1
        //     }
        // ]
    ]);

    readonly HEX_TERRAIN_HEIGHTS: Map<BiomeType, Map<HexType, TerrainHeightType>> = new Map([
        [
            // todo: add all biomes
            BiomeType.OCEAN,
            new Map([
                [
                    HexType.OCEAN,
                    {
                        min: 0,
                        max: 0.175,
                    },
                ],
                [
                    HexType.WATER,
                    {
                        min: 0.175,
                        max: 0.25,
                    },
                ],
                [
                    HexType.SAND,
                    {
                        min: 0.25,
                        max: 0.35,
                    },
                ],
                [
                    HexType.GRASS,
                    {
                        min: 0.35,
                        max: 0.7,
                    },
                ],
                [
                    HexType.MOUNTAIN,
                    {
                        min: 0.7,
                        max: 0.85,
                    },
                ],
                [
                    HexType.MOUNTAIN_PEAK,
                    {
                        min: 0.85,
                        max: 1,
                    },
                ],
            ]),
        ],
        // [
        //     // todo: add all biomes
        //     BiomeType.OCEAN,
        //     new Map([
        //         [
        //             HexType.OCEAN,
        //             {
        //                 min: 0,
        //                 max: 0.4,
        //             }
        //         ],
        //         [
        //             HexType.WATER,
        //             {
        //                 min: 0.4,
        //                 max: 0.7,
        //             }
        //         ],
        //         [
        //             HexType.SAND,
        //             {
        //                 min: 0.7,
        //                 max: 1,
        //             }
        //         ],
        //     ])
        // ],
        [
            BiomeType.FLATLANDS,
            new Map([
                [
                    HexType.SAND,
                    {
                        min: 0,
                        max: 0.2,
                    },
                ],
                [
                    HexType.GRASS,
                    {
                        min: 0.2,
                        max: 0.6,
                    },
                ],
                [
                    HexType.MOUNTAIN,
                    {
                        min: 0.6,
                        max: 1,
                    },
                ],
            ]),
        ],
        [
            BiomeType.MOUNTAINOUS,
            new Map([
                [
                    HexType.MOUNTAIN,
                    {
                        min: 0,
                        max: 0.6,
                    },
                ],
                [
                    HexType.MOUNTAIN_PEAK,
                    {
                        min: 0.6,
                        max: 1,
                    },
                ],
            ]),
        ],
    ]);

    seeder: RandomNumberGeneratorFunction;
    biomeNoise: FastSimplexNoise;
    heightNoise: FastSimplexNoise;

    biomeOptions: object;
    heightOptions: object;

    constructor(game: IGame, seeder?: RandomNumberGeneratorFunction) {
        super(game);

        this.seeder = seeder || Math.random;
        //TODO: Biome seeder.

        this.biomeOptions = {
            amplitude: 1,
            frequency: 0.005,
            max: 1,
            min: 0,
            octaves: 4,
            persistence: 1,
            random: Math.random,
        };

        // TODO: add biomes
        // this.heightOptions = {
        //     amplitude: 1,
        //     frequency: 0.001,
        //     max: 1,
        //     min: 0,
        //     octaves: 8,
        //     persistence: 0.5,
        //     random: this.seeder,
        // };
        this.heightOptions = {
            amplitude: 1,
            frequency: 0.0425,
            max: 1,
            min: 0,
            octaves: 8,
            persistence: 0.125,
            random: this.seeder,
        };

        this.biomeNoise = new FastSimplexNoise(this.biomeOptions);

        this.heightNoise = new FastSimplexNoise(this.heightOptions);

        this.initHexes();
    }

    // @ts-ignore
    setValues(biomeOptions, heightOptions) {
        this.biomeNoise = new FastSimplexNoise(biomeOptions);

        this.heightNoise = new FastSimplexNoise(heightOptions);

        this.initHexes();
    }

    updateScale(scale: number) {
        const oldWidth = this.hexGridWidth;
        const oldHeight = this.hexGridHeight;

        this.hexGridWidth =
            Math.floor(this.layer.width / (HEX_WIDTH * this.game.scale - HEX_OBTUSE_WIDTH * this.game.scale)) + 1;
        this.hexGridHeight = Math.floor(this.layer.height / (HEX_HEIGHT * this.game.scale)) + 1;

        for (let i = 0; i < this.flatHexes.length; i++) {
            this.flatHexes[i].updateScale(scale);
        }

        const addCols = this.hexGridWidth - oldWidth;
        const addRows = this.hexGridHeight - oldHeight;

        let currentHexType = HexType.WATER;
        let currentBiome = 0;
        let currentHeight = 0;

        const flatHexes = this.flatHexes;

        if (addCols > 0) {
            for (let col = oldWidth; col < this.hexGridWidth; col++) {
                let rowHexes = this.hexes[col];
                if (!rowHexes) {
                    rowHexes = [];
                    this.hexes.push(rowHexes);
                }

                for (let row = -1; row < oldHeight; row++) {
                    currentBiome = this.biomeNoise.scaled2D(col, row);
                    currentHeight = this.heightNoise.scaled2D(col, row);

                    currentHexType = this.getTerrainForHeight(currentBiome, currentHeight);

                    const hex = new Hex(this, col, row, currentHexType);
                    rowHexes.push(hex);
                    flatHexes.push(hex);
                }
            }
        }

        if (addRows > 0) {
            for (let col = -1; col < this.hexGridWidth; col++) {
                let rowHexes = this.hexes[col];
                if (!rowHexes) {
                    rowHexes = [];
                    this.hexes.push(rowHexes);
                }

                for (let row = oldHeight; row < this.hexGridHeight; row++) {
                    currentBiome = this.biomeNoise.scaled2D(col, row);
                    currentHeight = this.heightNoise.scaled2D(col, row);

                    currentHexType = this.getTerrainForHeight(currentBiome, currentHeight);

                    const hex = new Hex(this, col, row, currentHexType);
                    rowHexes.push(hex);
                    flatHexes.push(hex);
                }
            }
        }

        this.updateRender();
    }

    initHexes() {
        let currentHexType = HexType.WATER;
        let currentBiome = 0;
        let currentHeight = 0;

        const flatHexes = [];
        const hexes = [];
        for (let col = -1; col < this.hexGridWidth; col++) {
            const rowHexes = [];
            for (let row = -1; row < this.hexGridHeight; row++) {
                currentBiome = this.biomeNoise.scaled2D(col, row);
                currentHeight = this.heightNoise.scaled2D(col, row);

                currentHexType = this.getTerrainForHeight(currentBiome, currentHeight);

                const hex = new Hex(this, col, row, currentHexType);
                rowHexes.push(hex);
                flatHexes.push(hex);
            }
            hexes.push(rowHexes);
        }

        this.setHexes(hexes, flatHexes);
    }

    getTerrainForHeight(biome: number, height: number): HexType {
        let biomeType = null;
        this.BIOME_VALUES.forEach((heights: TerrainHeightType, type: BiomeType) => {
            if (biome >= heights.min && biome <= heights.max) {
                biomeType = type;
            }
        });
        if (biomeType === null) {
            throw new Error(`Biome val is out of bounds. Received ${biome}`);
        }

        const biomeHeights = this.HEX_TERRAIN_HEIGHTS.get(biomeType);
        if (!biomeHeights) {
            throw new Error(`Biome ${biomeType} is not a biome in terrain heights.`);
        }

        let foundType = null;
        biomeHeights.forEach((heights: TerrainHeightType, type: HexType) => {
            if (height >= heights.min && height <= heights.max) {
                foundType = type;
            }
        });
        if (foundType === null) {
            throw new Error(`Height is out of bounds. Received ${height}`);
        }
        return foundType;
    }
}
