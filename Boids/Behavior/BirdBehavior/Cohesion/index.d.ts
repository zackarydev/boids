import Vector2D from "../../../Vector2D";
import { IBird } from "../../../Bird";
import Behavior, { IBirdBehavior } from '..';
interface ICohesion extends IBirdBehavior {
}
export default class Cohesion extends Behavior implements ICohesion {
    perform(birdCount: number): Vector2D;
    accumulate(bird: IBird): void;
}
export {};
//# sourceMappingURL=index.d.ts.map