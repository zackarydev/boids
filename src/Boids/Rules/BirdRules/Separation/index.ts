import Vector2D from "../../../Vector2D";
import { IBird } from "../../../Bird";
import Behavior, { IBirdBehavior } from '../../../Behavior/BirdBehavior';
import { BIRD_SPEED, BIRD_SEPARATION_DISTANCE, BIRD_SEPARATION_EAGERNESS } from "../../../constants";

interface ISeparation extends IBirdBehavior {
}

export default class Separation extends Behavior implements ISeparation {
    perform(birdCount: number): Vector2D {
        return this.value
            .divide(birdCount)
            .normalize()            // not normalizing means the average velocities cancel out and the birds grind to a halt.
            .multiply(BIRD_SPEED)   // 
            .sub(this.bird.velocity)     // find the difference between the separation velocity and ours.
            .multiply(BIRD_SEPARATION_EAGERNESS); // Change how fast birds want to align. 0 = No alignment, 1 = Immediate alignment.
    }

    accumulate(bird: IBird) {
        const positionDiff = this.bird.position
            .clone()             // must clone because Vector2D is mutable
            .sub(bird.position); // find the difference to the other bird

        const distance = positionDiff.magnitude(); // find the distance
        if(distance <= BIRD_SEPARATION_DISTANCE) {
            this.value.add(     // add the force to our accumulator
                positionDiff.divide(distance)
            );
        }
    }
}