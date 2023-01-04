import SelfBehavior, { ISelfBehavior } from '..';
import { BIRD_EATING_SPEED, MAX_BIRD_ENERGY } from '../../../constants';
import Boids from '../../..';

interface IEating extends ISelfBehavior {}

export default class Eating extends SelfBehavior implements IEating {
    perform(deltaTime: number) {
        if (this.bird.landed) {
            const square = Boids.instance.terrain.getSquareAtLocation(this.bird.position);
            if (square && square.foodLevel > 0) {
                const potentialConsumption = BIRD_EATING_SPEED * deltaTime;
                let actualConsumption = potentialConsumption;
                if (potentialConsumption > square.foodLevel) {
                    actualConsumption = square.foodLevel;
                }
                if (actualConsumption + this.bird.energy > MAX_BIRD_ENERGY) {
                    actualConsumption = MAX_BIRD_ENERGY - this.bird.energy;
                }

                // birds will consume everything until there is no more food.
                square.foodLevel -= actualConsumption;
                this.bird.energy += actualConsumption;
                if (this.bird.energy >= MAX_BIRD_ENERGY) {
                    this.bird.landed = false;
                }
            } else {
                this.bird.landed = false;
            }
        }
    }
}
