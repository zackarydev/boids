import { IRenderingLayer } from "@zacktherrien/typescript-render-engine";
import FastSimplexNoise from '../../../node_modules/fast-simplex-noise/src';
import { ISquare } from "./Square";
import Vector2D from "../Vector2D";
import { SquareType } from "./types";
export interface ITerrain {
    layer: IRenderingLayer;
    getSquareAtLocation(position: Vector2D): ISquare;
}
export default class Terrain implements ITerrain {
    layer: IRenderingLayer;
    squares: Array<Array<ISquare>>;
    heightMap: FastSimplexNoise;
    humidityMap: FastSimplexNoise;
    moistureMap: FastSimplexNoise;
    constructor();
    initSquares(): void;
    getSquareAtLocation(position: Vector2D): ISquare;
    getTerrainType(x: number, y: number): SquareType;
    squareTypeFromHeight(height: number, humidity: number, moisture: number): SquareType;
}
//# sourceMappingURL=index.d.ts.map