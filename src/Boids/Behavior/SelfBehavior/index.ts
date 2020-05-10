import { IBird } from "../../Bird";

export interface ISelfBehavior {
    reset(): void;
    perform(deltaTime: number): void;
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

    abstract perform(deltaTime: number): void;
}