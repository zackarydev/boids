import { IDeferredLayer } from "@zacktherrien/typescript-render-engine";
import FastSimplexNoise from '../../../node_modules/fast-simplex-noise/src';
import { ISquare } from "./Square";
import Vector2D from "../Vector2D";
import { SquareType } from "./types";
export interface ITerrain {
    layer: IDeferredLayer;
    getSquareAtLocation(position: Vector2D): ISquare | null;
    getSquareAtCoord(x: number, y: number): ISquare | null;
}
export default class Terrain implements ITerrain {
    layer: IDeferredLayer;
    squares: Array<Array<ISquare>>;
    heightMap: FastSimplexNoise;
    humidityMap: FastSimplexNoise;
    moistureMap: FastSimplexNoise;
    constructor();
    initSquares(): void;
    getSquareAtCoord(x: number, y: number): ISquare | null;
    getSquareAtLocation(position: Vector2D): ISquare | null;
    getTerrainType(x: number, y: number): SquareType;
    squareTypeFromHeight(height: number, humidity: number, moisture: number): SquareType;
}
//# sourceMappingURL=index.d.ts.map