import { RenderingLayer, LayerType, IRenderingLayer } from "@zacktherrien/typescript-render-engine";
import FastSimplexNoise from '../../../node_modules/fast-simplex-noise/src';

import Square, { ISquare } from "./Square";
import Vector2D from "../Vector2D";

import { LayerIndex } from "../constants";
import { SquareType, TerrainDefinitions } from "./types";
import { SQUARE_TERRAIN_DEFINITIONS, SQUARE_SIZE } from "./constants";

export interface  ITerrain { 
    layer: IRenderingLayer;

    getSquareAtLocation(position: Vector2D): ISquare;
}

export default class Terrain implements ITerrain {

    layer: IRenderingLayer;

    squares: Array<Array<ISquare>>;

    heightMap: FastSimplexNoise;

    humidityMap: FastSimplexNoise;

    moistureMap: FastSimplexNoise;

    constructor() {
        this.layer = new RenderingLayer(LayerIndex.BACKGROUND, LayerType.STATIC);

        this.heightMap = new FastSimplexNoise({ 
            frequency: 0.01, 
            max: 1, 
            min: 0, 
            octaves: 4,
        });
        this.humidityMap = new FastSimplexNoise({
            frequency: 0.01,
            max: 1,
            min: 0,
            octaves: 8,
        });
        this.moistureMap = new FastSimplexNoise({
            frequency: 0.01,
            max: 1,
            min: 0,
            octaves: 8,
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

    getSquareAtLocation(position: Vector2D): ISquare {
        const row = Math.floor(position.x2/SQUARE_SIZE);
        const col = Math.floor(position.x1/SQUARE_SIZE);
        if(col > this.squares[0].length) {
            ;;debugger;;
        }
        if(row > this.squares.length) {
            ;;debugger;;
        }
        if(!this.squares || !this.squares[row] || !this.squares[row][col]) {
            ;;debugger;;
        }
        return this.squares[row][col];
    }

    getTerrainType(x: number, y: number) {
        const height = this.heightMap.scaled2D(x, y);
        // const humidity = this.humidityMap.scaled2D(x, y);
        const moisture = this.moistureMap.scaled2D(x, y);
        const squareType = this.squareTypeFromHeight(height, 0, moisture);

        return squareType;
    }

    squareTypeFromHeight(height: number, humidity: number, moisture: number): SquareType {
        let foundType = null;
        SQUARE_TERRAIN_DEFINITIONS.forEach((values: TerrainDefinitions, type: SquareType) => {
            if(height >= values.height.min && height <= values.height.max) {
                // if(humidity >= values.humidity.min && humidity <= values.humidity.max) {
                    if(moisture >= values.moisture.min && moisture <= values.moisture.max) {
                        foundType = type;
                    }
                // }
            }
        });
        if(foundType === null) {
            ;;debugger;;
            throw new Error();
        }
        return foundType;
    }
}