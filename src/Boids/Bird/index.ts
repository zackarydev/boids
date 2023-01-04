import { IEntity } from '@zacktherrien/typescript-render-engine';
import Vector2D from '../Vector2D';
import Boids from '../';

// Constants, helpers, colors
import {
    BIRD_WIDTH,
    BIRD_HEIGHT,
    BIRD_SPEED,
    BIRD_VISUAL_RANGE,
    MAX_BIRD_ENERGY,
    BIRD_ACCELERATION,
} from '../constants';
import { BirdColor } from '../colors';
import { fromDegree, getAngle } from '../helpers';

// Behaviors
import { IBirdBehavior } from '../Behavior/BirdBehavior';
import Cohesion from '../Behavior/BirdBehavior/Cohesion';
import Alignment from '../Behavior/BirdBehavior/Alignment';
import Separation from '../Behavior/BirdBehavior/Separation';
import Hunger from '../Behavior/BirdBehavior/Hunger';

import { ISelfBehavior } from '../Behavior/SelfBehavior';
import Eating from '../Behavior/SelfBehavior/Eating';
import Exhaustion from '../Behavior/SelfBehavior/Exhaustion';

export interface IBird extends IEntity {
    position: Vector2D;
    velocity: Vector2D;
    acceleration: Vector2D;

    energy: number;

    landed: boolean;
}

export default class Bird implements IBird {
    boids: Boids;

    position: Vector2D;
    velocity: Vector2D;
    acceleration: Vector2D;

    energy: number;

    landed: boolean;

    birdRules: Array<IBirdBehavior>;
    selfRules: Array<ISelfBehavior>;

    constructor(boids: Boids, initialX: number, initialY: number) {
        this.boids = boids;

        this.position = new Vector2D(initialX, initialY);
        const randomAngle = fromDegree(Math.random() * 360);
        this.velocity = new Vector2D(Math.cos(randomAngle), Math.sin(randomAngle))
            .normalize()
            .multiply(BIRD_SPEED * Math.random());
        this.acceleration = Vector2D.ZERO();

        this.energy = MAX_BIRD_ENERGY * 0.5 + MAX_BIRD_ENERGY * Math.random();

        this.birdRules = [new Cohesion(this), new Alignment(this), new Separation(this), new Hunger(this)];

        this.selfRules = [new Exhaustion(this), new Eating(this)];

        this.landed = false;
    }

    resetAccumulators() {
        for (let i = 0; i < this.birdRules.length; i++) {
            this.birdRules[i].reset();
        }
    }

    /**
     * Perform all maneuvers for this bird.
     * @param birds The birds in range of this bird
     */
    performManeuvers(birds: Array<IBird>) {
        this.resetAccumulators();

        if (!this.landed) {
            let perceivedBirdCount = 0;
            for (let i = 0; i < birds.length; i++) {
                if (
                    !birds[i].landed && // only flying birds are taken into account
                    birds[i] !== this && // that is not this bird
                    birds[i].position.distance(this.position) < BIRD_VISUAL_RANGE // and is in range
                ) {
                    perceivedBirdCount += 1;
                    for (let r = 0; r < this.birdRules.length; r++) {
                        this.birdRules[r].accumulate(birds[i]);
                    }
                }
            }

            // Flock mechanics
            if (perceivedBirdCount !== 0) {
                let force;
                for (let i = 0; i < this.birdRules.length; i++) {
                    force = this.birdRules[i].perform(perceivedBirdCount);
                    if (force) {
                        this.acceleration.add(force);
                    }
                }
                // TODO: Limit acceleration.
            }
        }
        this.checkVelocity();
    }

    performSenses(deltaTime: number) {
        for (let i = 0; i < this.selfRules.length; i++) {
            this.selfRules[i].perform(deltaTime);
        }
    }

    checkBoundary() {
        if (this.position.x1 < 0) {
            this.position.x1 = Boids.instance.maxX;
        } else if (this.position.x1 > Boids.instance.maxX) {
            this.position.x1 = 0;
        }
        if (this.position.x2 < 0) {
            this.position.x2 = Boids.instance.maxY;
        } else if (this.position.x2 > Boids.instance.maxY) {
            this.position.x2 = 0;
        }
    }

    checkVelocity() {
        // limit velocity:
        if (this.velocity.magnitude() > BIRD_SPEED) {
            this.velocity.normalize().multiply(BIRD_SPEED);
        }
    }

    die() {
        this.boids.birds.splice(this.boids.birds.indexOf(this), 1);
        this.boids.birdLayer.removeEntity(this);
    }

    update(deltaTime: number) {
        this.performSenses(deltaTime);
        this.performManeuvers(this.boids.birds);

        if (!this.landed) {
            this.position.add(
                this.velocity
                    .clone() // we must clone because multiply mutates the object.
                    .multiply(deltaTime),
            );
        }
        this.velocity.add(this.acceleration);
        this.acceleration.null();
        this.checkBoundary();

        if (this.energy < 0) {
            this.die();
        }
    }

    render(context: CanvasRenderingContext2D) {
        this.rotate(context);
        context.strokeStyle = BirdColor;
        context.beginPath();
        context.moveTo(this.position.x1 + BIRD_WIDTH / 2, this.position.x2);
        context.lineTo(this.position.x1 - BIRD_WIDTH / 2, this.position.x2 + BIRD_HEIGHT / 2);
        context.lineTo(this.position.x1 - BIRD_WIDTH / 2, this.position.x2 - BIRD_HEIGHT / 2);
        context.closePath();
        context.fill();

        // context.strokeStyle = 'green';
        // context.beginPath();
        // context.arc(this.position.x1, this.position.x2, this.visibilityLeft.x2, this.visibilityLeft.x1, this.visibilityLeft.x1 - SIGHT_ANGLE, true);

        // context.stroke();

        // context.beginPath();
        // context.arc(this.position.x1, this.position.x2, this.visibilityRight.x2, this.visibilityRight.x1, Math.PI, true);
        // context.closePath();
        // context.stroke();

        this.unrotate(context);
    }

    rotate(context: CanvasRenderingContext2D) {
        // Move registration point to the center of the bird
        context.translate(this.position.x1, this.position.x2);
        // Rotate degree
        context.rotate(getAngle(this.velocity));
        context.translate(-this.position.x1, -this.position.x2);
    }

    unrotate(context: CanvasRenderingContext2D) {
        context.translate(this.position.x1, this.position.x2);
        // Rotate degree
        context.rotate(-getAngle(this.velocity));
        // Move registration point back to the top left corner of canvas
        context.translate(-this.position.x1, -this.position.x2);
    }
}
