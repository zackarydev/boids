import Vector2D from "../../Vector2D";
import { IBird } from "../../Bird";
import Behavior, { IBehavior } from '../../Behavior';
interface IAlignment extends IBehavior {
}
export default class Alignment extends Behavior implements IAlignment {
    perform(birdCount: number): Vector2D;
    accumulate(bird: IBird): void;
}
export {};
//# sourceMappingURL=index.d.ts.map