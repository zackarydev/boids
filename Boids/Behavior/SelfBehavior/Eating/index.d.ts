import SelfBehavior, { ISelfBehavior } from "..";
interface IEating extends ISelfBehavior {
}
export default class Eating extends SelfBehavior implements IEating {
    perform(deltaTime: number): void;
}
export {};
//# sourceMappingURL=index.d.ts.map