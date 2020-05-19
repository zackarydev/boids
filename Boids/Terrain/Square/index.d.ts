import { IEntity } from "@zacktherrien/typescript-render-engine";
import { SquareType } from "../types";
import Vector2D from "../../Vector2D";
export interface ISquare extends IEntity {
    readonly isLandable: boolean;
    readonly x: number;
    readonly y: number;
    foodLevel: number;
    getPixelCenter(): Vector2D;
}
export default class Square implements ISquare {
    readonly isLandable: boolean;
    x: number;
    y: number;
    center: Vector2D;
    type: SquareType;
    foodLevel: number;
    constructor(x: number, y: number, type: SquareType);
    getPixelCenter(): Vector2D;
    update(_: number): void;
    render(context: CanvasRenderingContext2D): void;
}
//# sourceMappingURL=index.d.ts.map