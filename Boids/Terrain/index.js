"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typescript_render_engine_1 = require("@zacktherrien/typescript-render-engine");
const src_1 = __importDefault(require("../../../node_modules/fast-simplex-noise/src"));
const Square_1 = __importDefault(require("./Square"));
const constants_1 = require("../constants");
const constants_2 = require("./constants");
class Terrain {
    constructor() {
        this.layer = new typescript_render_engine_1.DeferredLayer(constants_2.TERRAIN_UPDATE_RATE, constants_1.LayerIndex.BACKGROUND);
        this.layer.update(constants_2.TERRAIN_UPDATE_RATE);
        this.heightMap = new src_1.default({
            frequency: 0.01,
            max: 1,
            min: 0,
            octaves: 4,
        });
        this.humidityMap = new src_1.default({
            frequency: 0.01,
            max: 1,
            min: 0,
            octaves: 8,
        });
        this.moistureMap = new src_1.default({
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
        const amountOfSquaresInX = Math.ceil(screenWidth / constants_2.SQUARE_SIZE);
        const amountOfSquaresInY = Math.ceil(screenHeight / constants_2.SQUARE_SIZE);
        let currentRow = [];
        let square;
        for (let y = 0; y < amountOfSquaresInY; y++) {
            currentRow = [];
            for (let x = 0; x < amountOfSquaresInX; x++) {
                square = new Square_1.default(x, y, this.getTerrainType(x, y));
                currentRow.push(square);
                this.layer.addEntity(square);
            }
            this.squares.push(currentRow);
        }
    }
    getSquareAtCoord(x, y) {
        if (x > this.squares[0].length) {
            return null;
        }
        if (y > this.squares.length) {
            return null;
        }
        if (!this.squares || !this.squares[y] || !this.squares[y][x]) {
            return null;
        }
        return this.squares[y][x];
    }
    getSquareAtLocation(position) {
        const row = Math.floor(position.x2 / constants_2.SQUARE_SIZE);
        const col = Math.floor(position.x1 / constants_2.SQUARE_SIZE);
        if (col > this.squares[0].length) {
            return null;
        }
        if (row > this.squares.length) {
            return null;
        }
        if (!this.squares || !this.squares[row] || !this.squares[row][col]) {
            return null;
        }
        return this.squares[row][col];
    }
    getTerrainType(x, y) {
        const height = this.heightMap.scaled2D(x, y);
        const humidity = this.humidityMap.scaled2D(x, y);
        const moisture = this.moistureMap.scaled2D(x, y);
        const squareType = this.squareTypeFromHeight(height, humidity, moisture);
        return squareType;
    }
    squareTypeFromHeight(height, humidity, moisture) {
        let foundType = null;
        constants_2.SQUARE_TERRAIN_DEFINITIONS.forEach((values, type) => {
            if (height >= values.height.min && height <= values.height.max) {
                if (humidity >= values.humidity.min && humidity <= values.humidity.max) {
                    if (moisture >= values.moisture.min && moisture <= values.moisture.max) {
                        foundType = type;
                    }
                }
            }
        });
        if (foundType === null) {
            ;
            ;
            debugger;
            ;
            throw new Error();
        }
        return foundType;
    }
}
exports.default = Terrain;
