import { IEntity } from "@zacktherrien/typescript-render-engine";
import { SQUARE_SIZE } from "../constants";
import { SquareColors } from "../../colors";
import { SquareType } from "../types";

export interface ISquare extends IEntity {

}

export default class Square implements ISquare {

    x: number;
    y: number;

    type: SquareType;

    constructor(x: number, y: number, type: SquareType) {
        this.x = x;
        this.y = y;
        this.type = type;
    }

    render(context: CanvasRenderingContext2D) {
        context.fillStyle = SquareColors[this.type];
        context.fillRect(this.x * SQUARE_SIZE, this.y * SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE);
    }

}