import Vector2D from "../../../Vector2D";
import { IBird } from "../../../Bird";
import Behavior, { IBirdBehavior } from '../../../Behavior/BirdBehavior';
interface ISeparation extends IBirdBehavior {
}
export default class Separation extends Behavior implements ISeparation {
    perform(birdCount: number): Vector2D;
    accumulate(bird: IBird): void;
}
export {};
//# sourceMappingURL=index.d.ts.map