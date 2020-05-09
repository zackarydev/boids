import { IEntity } from "@zacktherrien/typescript-render-engine";
import { SQUARE_SIZE, SQUARE_FOODS } from "../constants";
import { SquareColors } from "../../colors";
import { SquareType } from "../types";

export interface ISquare extends IEntity {
    foodLevel: number;
}

export default class Square implements ISquare {

    x: number;
    y: number;

    type: SquareType;

    foodLevel: number;

    constructor(x: number, y: number, type: SquareType) {
        this.x = x;
        this.y = y;
        this.type = type;

        this.foodLevel = SQUARE_FOODS.get(this.type) || 0;
    }

    render(context: CanvasRenderingContext2D) {
        context.fillStyle = SquareColors[this.type];
        context.fillRect(this.x * SQUARE_SIZE, this.y * SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE);
    }

}