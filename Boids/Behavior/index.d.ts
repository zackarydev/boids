import Vector2D from "../Vector2D";
import { IBird } from "../Bird";
export interface IBehavior {
    reset(): void;
    perform(birdCount: number): Vector2D;
    accumulate(boid: IBird): void;
}
export default abstract class Behavior implements IBehavior {
    value: Vector2D;
    bird: IBird;
    constructor(bird: IBird);
    reset: () => void;
    abstract perform(birdCount: number): Vector2D;
    abstract accumulate(boid: IBird): void;
}
//# sourceMappingURL=index.d.ts.map