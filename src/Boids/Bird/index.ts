import { IEntity } from "@zacktherrien/typescript-render-engine";

import Vector2D from "../Vector2D";

import Boids from '../';

import { BIRD_WIDTH, BIRD_HEIGHT, BIRD_SPEED, SIGHT_ANGLE, SIGHT_RANGE } from '../constants';
import { fromDegree, getAngle, flipVector } from '../helpers';

export interface IBird extends IEntity {
    position: Vector2D;
}

export default class Bird implements IBird {

    boids: Boids;

    position: Vector2D;
    velocity: Vector2D;

    maxX: number;
    maxY: number;

    cohesionAccumulator: Vector2D;

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

        this.visibilityLeft = new Vector2D(SIGHT_ANGLE - 0.01*Math.PI, SIGHT_RANGE);
        this.visibilityRight = new Vector2D(-SIGHT_ANGLE - 0.01*Math.PI, SIGHT_RANGE);

        // Accumulators for performance
        this.cohesionAccumulator = Vector2D.ZERO();
    }

    resetAccumulators() {
        this.cohesionAccumulator = Vector2D.ZERO();
    }

    /**
     * Perform all manouevers for this bird.
     * @param birds The birds in range of this bird
     */
    performManouevers(birds: Array<IBird>) {
        this.resetAccumulators();

        for(let i = 0; i<birds.length; i++) {
            if(birds[i] !== this) {
                this.accumulateCohesion(birds[i]);
            }
        }

        this.velocity
            .add(this.performCohesion(birds.length))
            .normalize()
            .multiply(BIRD_SPEED);
    }

    performSeparation(bird: IBird) {

    }

    performAlignment(bird: IBird) {

    }

    accumulateCohesion(bird: IBird) {
        this.cohesionAccumulator.add(bird.position);
    }

    performCohesion(birdCount: number): Vector2D {
        return this.cohesionAccumulator
            .divide(birdCount - 1)
            .sub(this.position)
            .divide(1000);
    }

    checkBoundary() {
        if(this.position.x1 < 0 || this.position.x1 > this.maxX) {
            flipVector(this.velocity, 'x', this.position.x1 < 0 ? 'left' : 'right');
            return;
        }
        if(this.position.x2 < 0 || this.position.x2 > this.maxY) {
            flipVector(this.velocity, 'y', this.position.x2 < 0 ? 'up' : 'down');
            return;
        }
    }

    update(deltaTime: number) {
        this.performManouevers(this.boids.birds);

        this.position.add(
            this.velocity
                .clone()
                .multiply(deltaTime)
        );
        this.checkBoundary();
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