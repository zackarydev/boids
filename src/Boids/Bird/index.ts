import { IEntity } from "@zacktherrien/typescript-render-engine";

import Vector2D from "../Vector2D";

import Boids from '../';

import { 
    BIRD_WIDTH, 
    BIRD_HEIGHT, 
    BIRD_SPEED, 
    SIGHT_ANGLE, 
    SIGHT_RANGE, 
    BIRD_COHESION_RESISTANCE, 
    BIRD_SEPARATION_DISTANCE,
    BIRD_SEPARATION_RESISTANCE,
    BIRD_ALIGNMENT_EAGERNESS,
    BIRD_VISUAL_RANGE,
    BIRD_RETURN_VELOCITY,
} from '../constants';
import { fromDegree, getAngle } from '../helpers';

export interface IBird extends IEntity {
    position: Vector2D;
    velocity: Vector2D;
}

export default class Bird implements IBird {

    boids: Boids;

    position: Vector2D;
    velocity: Vector2D;
    acceleration: Vector2D;

    maxX: number;
    maxY: number;

    cohesionAccumulator: Vector2D;
    separationAccumulator: Vector2D;
    alignmentAccumulator: Vector2D;

    visibilityLeft: Vector2D;
    visibilityRight: Vector2D;

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

        this.visibilityLeft = new Vector2D(SIGHT_ANGLE - 0.01*Math.PI, SIGHT_RANGE);
        this.visibilityRight = new Vector2D(-SIGHT_ANGLE - 0.01*Math.PI, SIGHT_RANGE);

        // Accumulators for performance
        this.cohesionAccumulator = Vector2D.ZERO();
        this.separationAccumulator = Vector2D.ZERO();
        this.alignmentAccumulator = Vector2D.ZERO();
    }

    resetAccumulators() {
        this.acceleration.null();

        this.cohesionAccumulator.null();
        this.separationAccumulator.null();
        this.alignmentAccumulator.null();
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
                this.accumulateCohesion(birds[i]);
                this.accumulateSeparation(birds[i]);
                this.accumulateAlignment(birds[i]);
            }
        }

        // Flock mechanics
        if(perceivedBirdCount !== 0) {
            this.acceleration
                .add(this.performCohesion(perceivedBirdCount))
                .add(this.performSeparation())
                .add(this.performAlignment(perceivedBirdCount));
        }

        // Goal seeking
        // this.velocity
        //     .add(this.checkGoals())
        //     .add(this.checkPredators());
        
        this.checkBoundary();
        // this.checkVelocity();
    }

    accumulateCohesion(bird: IBird) {
        this.cohesionAccumulator.add(bird.position);
    }

    accumulateSeparation(bird: IBird) {
        const diff = this.position.clone().sub(bird.position);

        if (diff.magnitude() < BIRD_SEPARATION_DISTANCE) {
            this.separationAccumulator.add(
                diff.divide(diff.magnitude())
            );
        }
    }

    accumulateAlignment(bird: IBird) {
        this.alignmentAccumulator.add(bird.velocity);
    }

    performCohesion(birdCount: number): Vector2D {
        return this.cohesionAccumulator
            .divide(birdCount)
            .sub(this.position)
            .divide(BIRD_COHESION_RESISTANCE)
            .sub(this.velocity);
    }

    performSeparation():Vector2D {
        return this.separationAccumulator
            .divide(BIRD_SEPARATION_RESISTANCE)
            .sub(this.velocity)
            .normalize()
            .multiply(0.1);
    }

    performAlignment(birdCount: number): Vector2D {
        return this.alignmentAccumulator
            .divide(birdCount)
            .sub(this.velocity)
            .multiply(BIRD_ALIGNMENT_EAGERNESS);
    }

    checkPredators() {
        if (this.boids.isRightClicked) {
            return this.boids.mouseLocation
                .clone()
                .sub(this.position)
                .divide(BIRD_COHESION_RESISTANCE)
                .multiply(-1);
        }
        return Vector2D.CONST_ZERO;
    }

    checkGoals() {
        if (this.boids.isLeftClicked) {
            return this.boids.mouseLocation
                .clone()
                .sub(this.position)
                .divide(BIRD_COHESION_RESISTANCE);
        }
        return Vector2D.CONST_ZERO;
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

    update(deltaTime: number) {
        this.performManeuvers(this.boids.birds);

        this.position.add(this.velocity.clone().multiply(deltaTime));
        this.velocity.add(this.acceleration);
        this.checkVelocity();
    }

    render(context: CanvasRenderingContext2D) {
        this.rotate(context);
        context.strokeStyle = 'red';
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