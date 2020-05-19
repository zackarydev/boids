import { IBird } from "../../Bird";
export interface ISelfBehavior {
    reset(): void;
    perform(deltaTime: number): void;
}
export default abstract class SelfBehavior implements ISelfBehavior {
    value: number;
    bird: IBird;
    constructor(bird: IBird);
    reset: () => void;
    abstract perform(deltaTime: number): void;
}
//# sourceMappingURL=index.d.ts.map