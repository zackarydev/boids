import SelfBehavior, { ISelfBehavior } from "..";
interface IExhaustion extends ISelfBehavior {
}
export default class Exhaustion extends SelfBehavior implements IExhaustion {
    perform(deltaTime: number): void;
}
export {};
//# sourceMappingURL=index.d.ts.map