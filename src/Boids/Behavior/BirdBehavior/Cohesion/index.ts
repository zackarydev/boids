import Vector2D from '../../../Vector2D';
import { IBird } from '../../../Bird';
import Behavior, { IBirdBehavior } from '..';
import { BIRD_SPEED, BIRD_COHESION_EAGERNESS } from '../../../constants';

interface ICohesion extends IBirdBehavior {}

export default class Cohesion extends Behavior implements ICohesion {
    perform(birdCount: number): Vector2D {
        return this.value
            .divide(birdCount) // average position of other birds
            .sub(this.bird.position) // how far away are they from this bird
            .normalize() // not normalizing means the average positions cancel out and the birds grind to a halt.
            .multiply(BIRD_SPEED) //
            .sub(this.bird.velocity) // subtract our velocity to get the force
            .multiply(BIRD_COHESION_EAGERNESS); // change how fast birds want to coalesce
    }

    accumulate(bird: IBird) {
        this.value.add(bird.position);
    }
}
