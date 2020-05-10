import Vector2D from "../../Vector2D";
import { IBird } from "../../Bird";
import Behavior, { IBehavior } from '../../Behavior';
interface ICohesion extends IBehavior {
}
export default class Cohesion extends Behavior implements ICohesion {
    perform(birdCount: number): Vector2D;
    accumulate(bird: IBird): void;
}
export {};
//# sourceMappingURL=index.d.ts.map