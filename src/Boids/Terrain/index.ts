import { RenderingLayer, LayerType, IRenderingLayer } from "@zacktherrien/typescript-render-engine";
import { LayerIndex } from "../constants";

import FastSimplexNoise from '../../../node_modules/fast-simplex-noise/src';

import Square, { ISquare } from "./Square";
import { BiomeType, TerrainHeightDefinition, SquareType } from "./types";
import { SQUARE_TERRAIN_HEIGHTS, SQUARE_SIZE } from "./constants";

export interface  ITerrain { 
    layer: IRenderingLayer;
}

export default class Terrain implements ITerrain {

    layer: IRenderingLayer;

    squares: Array<Array<ISquare>>;

    noise: FastSimplexNoise;

    constructor() {
        this.layer = new RenderingLayer(LayerIndex.BACKGROUND, LayerType.STATIC);

        this.noise = new FastSimplexNoise({ 
            frequency: 0.01, 
            max: 1, 
            min: 0, 
            octaves: 8 
        });

        this.squares = [];

        this.initSquares();
    }

    initSquares() {
        const screenWidth = this.layer.getWidth();
        const screenHeight = this.layer.getHeight();
        const amountOfSquaresInX = Math.ceil(screenWidth/SQUARE_SIZE);
        const amountOfSquaresInY = Math.ceil(screenHeight/SQUARE_SIZE);

        let currentRow = [];
        let square;
        for(let y = 0; y<amountOfSquaresInY; y++) {
            currentRow = [];
            for(let x = 0; x<amountOfSquaresInX; x++) {
                square = new Square(x, y, this.getTerrainType(x, y));
                currentRow.push(square);
                this.layer.addEntity(square);
            }
            this.squares.push(currentRow);
        }
    }

    getBiomeType(x: number, y: number) {
        // const humidity = this.noise.scaled2D(x, y);
        return BiomeType.OCEAN;
    }

    getTerrainType(x: number, y: number) {
        const biomeType = this.getBiomeType(x, y);

        const height = this.noise.scaled2D(x, y);
        const squareType = this.squareTypeFromHeight(biomeType, height);

        return squareType;
    }

    squareTypeFromHeight(biome: BiomeType, height: number): SquareType {
        const biomeHeights = SQUARE_TERRAIN_HEIGHTS.get(biome);
        if(!biomeHeights) {
            throw new Error(`Biome ${biome} is not a biome in terrain heights.`);
        }

        let foundType = null;
        // TODO: Refactor this.
        biomeHeights.forEach((heights: TerrainHeightDefinition, type: SquareType) => {
            if(height >= heights.min && height <= heights.max) {
                foundType = type;
            }
        });
        if(foundType === null) {
            throw new Error(`Height is out of bounds. Received ${height}`);
        }
        return foundType;
    }
}