import Vector2D from "../../../Vector2D";
import { IBird } from "../../../Bird";
import Behavior, { IBirdBehavior } from '../../../Behavior/BirdBehavior';
interface IAlignment extends IBirdBehavior {
}
export default class Alignment extends Behavior implements IAlignment {
    perform(birdCount: number): Vector2D;
    accumulate(bird: IBird): void;
}
export {};
//# sourceMappingURL=index.d.ts.map