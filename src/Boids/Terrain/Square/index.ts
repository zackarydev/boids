import { IEntity } from "@zacktherrien/typescript-render-engine";
import { SQUARE_SIZE, SQUARE_FOODS } from "../constants";
import { SquareColors } from "../../colors";
import { SquareType, LANDABLE_SQUARE_TYPES } from "../types";
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

    constructor(x: number, y: number, type: SquareType) {
        this.x = x;
        this.y = y;
        this.type = type;

        this.isLandable = LANDABLE_SQUARE_TYPES.indexOf(this.type) !== -1;

        this.center = new Vector2D(
            this.x * SQUARE_SIZE + SQUARE_SIZE/2,
            this.y * SQUARE_SIZE + SQUARE_SIZE/2
        );

        this.foodLevel = SQUARE_FOODS.get(this.type) || 0;
    }

    getPixelCenter() {
        return this.center;
    }

    render(context: CanvasRenderingContext2D) {
        context.fillStyle = SquareColors[this.type];
        context.fillRect(this.x * SQUARE_SIZE, this.y * SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE);
    }

}