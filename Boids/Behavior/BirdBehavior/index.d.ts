import Vector2D from "../../Vector2D";
import { IBird } from "../../Bird";
export interface IBirdBehavior {
    reset(): void;
    perform(birdCount: number): Vector2D | null;
    accumulate(boid: IBird): void;
}
export default abstract class BirdBehavior implements IBirdBehavior {
    value: Vector2D;
    bird: IBird;
    constructor(bird: IBird);
    reset: () => void;
    abstract perform(birdCount: number): Vector2D | null;
    abstract accumulate(boid: IBird): void;
}
//# sourceMappingURL=index.d.ts.map