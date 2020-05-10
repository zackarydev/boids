import Vector2D from "../../Vector2D";
import { IBird } from "../../Bird";
import Behavior, { IBehavior } from '../../Behavior';
interface ISeparation extends IBehavior {
}
export default class Separation extends Behavior implements ISeparation {
    perform(birdCount: number): Vector2D;
    accumulate(bird: IBird): void;
}
export {};
//# sourceMappingURL=index.d.ts.map