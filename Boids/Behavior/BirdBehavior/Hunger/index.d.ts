import Vector2D from "../../../Vector2D";
import { IBird } from "../../../Bird";
import Behavior, { IBirdBehavior } from '..';
interface IHunger extends IBirdBehavior {
}
export default class Hunger extends Behavior implements IHunger {
    goUp(pOffset: Vector2D): void;
    goDown(pOffset: Vector2D): void;
    goRight(pOffset: Vector2D): void;
    goLeft(pOffset: Vector2D): void;
    walkAroundRange(pOffset: Vector2D): void;
    performFoodSearch(): Vector2D | null;
    perform(birdCount: number): Vector2D | null;
    accumulate(bird: IBird): void;
}
export {};
//# sourceMappingURL=index.d.ts.map