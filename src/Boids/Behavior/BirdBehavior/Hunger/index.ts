import Vector2D from "../../../Vector2D";
import Boids from "../../..";
import { IBird } from "../../../Bird";

import Behavior, { IBirdBehavior } from '..';

import { 
    BIRD_VISUAL_RANGE, 
    BIRD_SPEED, 
    MAX_BIRD_ENERGY,
    BIRD_COMMUNAL_LANDING_DESIRE,
    BIRD_HUNGER_LANDING_DESIRE
} from "../../../constants";
import { SQUARE_SIZE } from "../../../Terrain/constants";

interface IHunger extends IBirdBehavior {
}

export default class Hunger extends Behavior implements IHunger {
    goUp(pOffset: Vector2D) {
        pOffset.x2 -= 1;
    }

    goDown(pOffset: Vector2D) {
        pOffset.x2 += 1;
    }

    goRight(pOffset: Vector2D) {
        pOffset.x1 += 1;
    }

    goLeft(pOffset: Vector2D) {
        pOffset.x1 -= 1;
    }
    
    /**
     * Walk the squares around the bird outwards.
     * 5   4   3
     * 6   1   2
     * 7   8   9 
     */
    walkAroundRange(pOffset: Vector2D) {
        if(pOffset.x1 === 0 && pOffset.x2 === 0) {
            pOffset.x1 = 1;
        }
        if(Math.abs(pOffset.x1) === Math.abs(pOffset.x2)) {
            if(pOffset.x1 > 0 && pOffset.x2 > 0) {
                this.goLeft(pOffset);
            }else if(pOffset.x1 < 0 && pOffset.x2 > 0) {
                this.goDown(pOffset);
            }else if(pOffset.x1 < 0 && pOffset.x2 < 0) {
                this.goRight(pOffset);
            }else if(pOffset.x1 > 0 && pOffset.x2 < 0) {
                this.goUp(pOffset);
            }
        } else {
            if(pOffset.x1 > pOffset.x2 && Math.abs(pOffset.x1) > Math.abs(pOffset.x2)) {
                this.goUp(pOffset);
            }else if(pOffset.x1 < pOffset.x2 && Math.abs(pOffset.x1) < Math.abs(pOffset.x2)) {
                this.goLeft(pOffset);
            }else if(pOffset.x1 < pOffset.x2 && Math.abs(pOffset.x1) > Math.abs(pOffset.x2)) {
                this.goDown(pOffset);
            }else if(pOffset.x1 > pOffset.x2 && Math.abs(pOffset.x1) < Math.abs(pOffset.x2)) {
                this.goRight(pOffset);
            }
        }
    }

    /**
     * Returns the vector towards the first food block.
     */
    performFoodSearch(): Vector2D | null {
        let squareCenter;
        let square;
        let x;
        const startingLocation = Boids.instance.terrain.getSquareAtLocation(this.bird.position);
        if(!startingLocation) return null;

        const squaresInVisualRange = (BIRD_VISUAL_RANGE / SQUARE_SIZE) * 2;
        const pOffset = new Vector2D(0,0);
        for(x = 0; x<squaresInVisualRange; x++) {
            square = Boids.instance.terrain.getSquareAtCoord(pOffset.x1 + startingLocation.x, pOffset.x2 + startingLocation.y);


            if(square && square.foodLevel > 0) {
                squareCenter = square.getPixelCenter();
                if(this.bird.position.distance(square.getPixelCenter()) < BIRD_VISUAL_RANGE) {
                    return squareCenter
                        .clone()
                        .sub(this.bird.position);
                }
            }
            
            this.walkAroundRange(pOffset);
        }
        return null;
    }
    
    perform(birdCount: number): Vector2D | null {
        this.value.x1 /= birdCount; // average the position of nearby birds.
        this.value.x2 = (this.bird.energy / MAX_BIRD_ENERGY) * BIRD_HUNGER_LANDING_DESIRE; // get percent hunger.

        const desireToLand = 1 - this.value.magnitude();
        // where desireToLand of 0 = do not land. 1 = land right now.

        if(desireToLand > 0.5) {
            const foodSquareVector = this.performFoodSearch();
            if(!foodSquareVector) return null;

            if(foodSquareVector.magnitude() < SQUARE_SIZE) {
                this.bird.landed = true;
                return null;
            } else {
                return foodSquareVector
                    .normalize()                // not normalizing means the average velocities cancel out and the birds grind to a halt.
                    .multiply(this.bird.velocity.magnitude())
                    .sub(this.bird.velocity)    // subtract our velocity to get the force
                    .multiply(desireToLand); // Change how fast birds want to align. 0 = No alignment, 1 = Immediate alignment.
            }
        } else {
            // no desire to land. Find the next nearest desire.

            return null;
        }
    }

    accumulate(bird: IBird) {
        if(bird.landed) {
            // landed birds, very close by will increase desire to land
            this.value.x1 += (1 - bird.position.distance(this.bird.position) / BIRD_VISUAL_RANGE) * BIRD_COMMUNAL_LANDING_DESIRE;
        }
    }
}