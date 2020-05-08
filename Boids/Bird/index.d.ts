import { IEntity } from "@zacktherrien/typescript-render-engine";
import Vector2D from "../Vector2D";
import Boids from '../';
export interface IBird extends IEntity {
    position: Vector2D;
    velocity: Vector2D;
}
export default class Bird implements IBird {
    boids: Boids;
    maxX: number;
    maxY: number;
    position: Vector2D;
    velocity: Vector2D;
    acceleration: Vector2D;
    cohesionAccumulator: Vector2D;
    separationAccumulator: Vector2D;
    alignmentAccumulator: Vector2D;
    constructor(boids: Boids, initialX: number, initialY: number, maxX: number, maxY: number);
    resetAccumulators(): void;
    performManeuvers(birds: Array<IBird>): void;
    accumulateCohesion(bird: IBird): void;
    accumulateSeparation(bird: IBird): void;
    accumulateAlignment(bird: IBird): void;
    performCohesion(birdCount: number): Vector2D;
    performSeparation(birdCount: number): Vector2D;
    performAlignment(birdCount: number): Vector2D;
    checkPredators(): Vector2D;
    checkGoals(): Vector2D;
    checkBoundary(): void;
    checkVelocity(): void;
    update(deltaTime: number): void;
    render(context: CanvasRenderingContext2D): void;
    rotate(context: CanvasRenderingContext2D): void;
    unrotate(context: CanvasRenderingContext2D): void;
}
//# sourceMappingURL=index.d.ts.map