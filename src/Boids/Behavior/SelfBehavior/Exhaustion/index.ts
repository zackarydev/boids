import SelfBehavior, { ISelfBehavior } from "..";
import { 
    ACCELERATION_ENERGY_COST,
    LIVING_ENERGY_COST,
    // BIRD_VISUAL_RANGE
} from "../../../constants";

interface IExhaustion extends ISelfBehavior {
}

export default class Exhaustion extends SelfBehavior implements IExhaustion {
    perform(deltaTime: number) {
        this.bird.energy -= (
            ACCELERATION_ENERGY_COST * this.bird.acceleration.magnitude() * deltaTime * deltaTime +
            LIVING_ENERGY_COST * deltaTime
        );
    }
}