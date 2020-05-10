import { IEntity } from "@zacktherrien/typescript-render-engine";
import Vector2D from "../Vector2D";
import Boids from '../';
import { IBirdBehavior } from "../Behavior/BirdBehavior";
import { ISelfBehavior } from "../Behavior/SelfBehavior";
export interface IBird extends IEntity {
    position: Vector2D;
    velocity: Vector2D;
    acceleration: Vector2D;
    energy: number;
    landed: boolean;
}
export default class Bird implements IBird {
    boids: Boids;
    maxX: number;
    maxY: number;
    position: Vector2D;
    velocity: Vector2D;
    acceleration: Vector2D;
    energy: number;
    landed: boolean;
    birdRules: Array<IBirdBehavior>;
    selfRules: Array<ISelfBehavior>;
    constructor(boids: Boids, initialX: number, initialY: number, maxX: number, maxY: number);
    resetAccumulators(): void;
    performManeuvers(birds: Array<IBird>): void;
    performSenses(): void;
    checkBoundary(): void;
    checkVelocity(): void;
    die(): void;
    update(deltaTime: number): void;
    render(context: CanvasRenderingContext2D): void;
    rotate(context: CanvasRenderingContext2D): void;
    unrotate(context: CanvasRenderingContext2D): void;
}
//# sourceMappingURL=index.d.ts.map