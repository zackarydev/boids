import Vector2D from '../../Vector2D';
import { IMouseTool } from '..';

export interface ISelectionTool extends IMouseTool {
    updatePosition(newPosition: Vector2D): void;
    getGeometry(): {
        top: number;
        left: number;
        width: number;
        height: number;
    };
}

export default class SelectionTool implements ISelectionTool {
    initialPosition: Vector2D;
    position: Vector2D;

    top: number;
    left: number;
    width: number;
    height: number;

    constructor(initialPosition: Vector2D) {
        this.initialPosition = initialPosition;
        this.position = initialPosition;

        this.top = 0;
        this.left = 0;
        this.width = 0;
        this.height = 0;
    }

    getGeometry() {
        return {
            top: this.top,
            left: this.left,
            width: this.width,
            height: this.height,
        };
    }

    updatePosition(newPosition: Vector2D) {
        this.position = newPosition;

        this.left = Math.min(this.initialPosition.x1, this.position.x1);
        this.top = Math.min(this.initialPosition.x2, this.position.x2);

        const right = Math.max(this.initialPosition.x1, this.position.x1);
        const bottom = Math.max(this.initialPosition.x2, this.position.x2);
        this.width = right - this.left;
        this.height = bottom - this.top;
    }

    render(context: CanvasRenderingContext2D) {
        context.strokeStyle = '#0F0';
        context.strokeRect(this.left, this.top, this.width, this.height);
    }
}
