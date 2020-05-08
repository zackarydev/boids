import Vector2D from "../Vector2D";
import { IBird } from "../Bird";

interface IAccumulator {
    perform(): Vector2D;
    accumulate(boid: IBird): void;
}

export default abstract class Accumulator implements IAccumulator {
    value: Vector2D;

    constructor() {
        this.value = Vector2D.ZERO();
    }

    abstract perform(): Vector2D;

    abstract accumulate(boid: IBird): void;

}