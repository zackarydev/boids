import { IEntity } from "@zacktherrien/typescript-render-engine";
import { SquareType } from "../types";
export interface ISquare extends IEntity {
    foodLevel: number;
}
export default class Square implements ISquare {
    x: number;
    y: number;
    type: SquareType;
    foodLevel: number;
    constructor(x: number, y: number, type: SquareType);
    render(context: CanvasRenderingContext2D): void;
}
//# sourceMappingURL=index.d.ts.map