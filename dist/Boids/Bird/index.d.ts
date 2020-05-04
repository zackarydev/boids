import { IEntity } from "@zacktherrien/typescript-render-engine";
import Vector2D from "../Vector2D";
export interface IBird extends IEntity {
}
export default class Bird implements IBird {
    position: Vector2D;
    velocity: Vector2D;
    maxX: number;
    maxY: number;
    constructor(initialX: number, initialY: number, maxX: number, maxY: number);
    checkBoundary(): void;
    update(deltaTime: number): void;
    render(context: CanvasRenderingContext2D): void;
    rotate(context: CanvasRenderingContext2D): void;
    unrotate(context: CanvasRenderingContext2D): void;
}
//# sourceMappingURL=index.d.ts.map