import SelfBehavior, { ISelfBehavior } from "../../../Behavior/SelfBehavior";
interface IHunger extends ISelfBehavior {
}
export default class Hunger extends SelfBehavior implements IHunger {
    performFoodSearch(): void;
    perform(): void;
    decrement(deltaTime: number): void;
}
export {};
//# sourceMappingURL=index.d.ts.map