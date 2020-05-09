import { IEntity } from "@zacktherrien/typescript-render-engine";

import Vector2D from "../Vector2D";

import Boids from '../';

import { 
    BIRD_WIDTH, 
    BIRD_HEIGHT, 
    BIRD_SPEED,
    BIRD_VISUAL_RANGE,
    INITIAL_BIRD_ENERGY,
    ACCELERATION_ENERGY_COST,
    LIVING_ENERGY_COST,
} from '../constants';
import { fromDegree, getAngle } from '../helpers';
import { IBehavior } from "../Behavior";
import Cohesion from "../Rules/Cohesion";
import Alignment from "../Rules/Alignment";
import Separation from "../Rules/Separation";
import { BirdColor } from "../colors";

export interface IBird extends IEntity {
    position: Vector2D;
    velocity: Vector2D;
}

export default class Bird implements IBird {
    
    boids: Boids;
    maxX: number;
    maxY: number;

    position: Vector2D;
    velocity: Vector2D;
    acceleration: Vector2D;

    energy: number;

    rules: Array<IBehavior>;

    // visibilityLeft: Vector2D;
    // visibilityRight: Vector2D;

    constructor(boids: Boids, initialX: number, initialY: number, maxX: number, maxY: number) {
        this.boids = boids;

        this.maxX = maxX;
        this.maxY = maxY;

        this.position = new Vector2D(initialX, initialY);
        const randomAngle = fromDegree(Math.random() * 360);
        this.velocity = new Vector2D(
            Math.cos(randomAngle),
            Math.sin(randomAngle)
        )
            .normalize()
            .multiply(BIRD_SPEED);
        this.acceleration = Vector2D.ZERO();

        this.energy = INITIAL_BIRD_ENERGY;

        this.rules = [
            new Cohesion(this),
            new Alignment(this),
            new Separation(this),
        ];

        // this.visibilityLeft = new Vector2D(SIGHT_ANGLE - 0.01*Math.PI, SIGHT_RANGE);
        // this.visibilityRight = new Vector2D(-SIGHT_ANGLE - 0.01*Math.PI, SIGHT_RANGE);
    }

    resetAccumulators() {
        this.acceleration.null();

        for(let i = 0; i<this.rules.length; i++) {
            this.rules[i].reset();
        }
    }

    /**
     * Perform all maneuvers for this bird.
     * @param birds The birds in range of this bird
     */
    performManeuvers(birds: Array<IBird>) {
        this.resetAccumulators();

        let perceivedBirdCount = 0;
        for(let i = 0; i<birds.length; i++) {
            if(birds[i] !== this && birds[i].position.distance(this.position) < BIRD_VISUAL_RANGE) {
                perceivedBirdCount += 1;
                for(let r = 0; r<this.rules.length; r++) {
                    this.rules[r].accumulate(birds[i]);
                }
            }
        }

        // Flock mechanics
        if(perceivedBirdCount !== 0) {
            for(let i = 0; i<this.rules.length; i++) {
                this.acceleration.add(
                    this.rules[i].perform(perceivedBirdCount)
                );
            }
            // TODO: Limit acceleration.
        }

        this.checkBoundary();
        this.checkVelocity();
    }

    checkBoundary() {
        if(this.position.x1 < 0){
            this.position.x1 = this.maxX
        } else if(this.position.x1 > this.maxX){
            this.position.x1 = 0;
        }
        if(this.position.x2 < 0){
            this.position.x2 = this.maxY;
        } else if(this.position.x2 > this.maxY){
            this.position.x2 = 0;
        }
    }

    checkVelocity() {
        // limit velocity:
        if (this.velocity.magnitude() > BIRD_SPEED) {
            this.velocity
                .normalize()
                .multiply(BIRD_SPEED);
        }
    }

    die() {
        this.boids.birds.splice(this.boids.birds.indexOf(this), 1);
        this.boids.birdLayer.removeEntity(this);
    }

    update(deltaTime: number) {
        this.performManeuvers(this.boids.birds);

        this.position.add(
            this.velocity
                .clone() // we must clone because multiply mutates the object.
                .multiply(deltaTime)
        );
        this.velocity.add(this.acceleration);
        this.energy -= (
            ACCELERATION_ENERGY_COST * this.acceleration.magnitude() * deltaTime * deltaTime +
            LIVING_ENERGY_COST * deltaTime
        );

        if(this.energy < 0) {
            this.die();
        }
    }

    render(context: CanvasRenderingContext2D) {
        this.rotate(context);
        context.strokeStyle = BirdColor;
        context.beginPath();
        context.moveTo(this.position.x1 + BIRD_WIDTH/2, this.position.x2);
        context.lineTo(this.position.x1 - BIRD_WIDTH/2, this.position.x2 + BIRD_HEIGHT/2);
        context.lineTo(this.position.x1 - BIRD_WIDTH/2, this.position.x2 - BIRD_HEIGHT/2);
        context.closePath();
        context.stroke();

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