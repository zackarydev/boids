import { IBird } from "../../Bird";

export interface ISelfBehavior {
    reset(): void;
    perform(): void;
    decrement(deltaTime: number): void;
}

export default abstract class SelfBehavior implements ISelfBehavior {
    value: number;
    bird: IBird;

    constructor(bird: IBird) {
        this.bird = bird;
        this.value = 0;
    }

    reset = () => {
        this.value = 0;
    }

    abstract perform(): void;

    abstract decrement(deltaTime: number): void;

}