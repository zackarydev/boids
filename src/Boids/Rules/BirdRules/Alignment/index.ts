import Vector2D from "../../../Vector2D";
import { IBird } from "../../../Bird";
import Behavior, { IBirdBehavior } from '../../../Behavior/BirdBehavior';
import { BIRD_SPEED, BIRD_ALIGNMENT_EAGERNESS } from "../../../constants";

interface IAlignment extends IBirdBehavior {
}

export default class Alignment extends Behavior implements IAlignment {
    perform(birdCount: number): Vector2D {
        return this.value
            .divide(birdCount)      // average velocity of other birds
            .normalize()            // not normalizing means the average velocities cancel out and the birds grind to a halt.
            .multiply(BIRD_SPEED)   // 
            .sub(this.bird.velocity)     // subtract our velocity to get the force
            .multiply(BIRD_ALIGNMENT_EAGERNESS); // Change how fast birds want to align. 0 = No alignment, 1 = Immediate alignment.
    }

    accumulate(bird: IBird) {
        this.value.add(bird.velocity);
    }
}