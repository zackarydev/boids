import { IEntity } from "@zacktherrien/typescript-render-engine";

import Vector2D from "../Vector2D";

import { BIRD_WIDTH, BIRD_HEIGHT, BIRD_SPEED } from '../constants';
import { fromDegree, flipVector } from '../helpers';

export interface IBird extends IEntity {

}

export default class Bird implements IBird {

    position: Vector2D;
    velocity: Vector2D; // direction (angle) + speed

    maxX: number;
    maxY: number;

    constructor(initialX: number, initialY: number, maxX: number, maxY: number) {
        this.maxX = maxX;
        this.maxY = maxY;

        this.position = new Vector2D(initialX, initialY);
        this.velocity = new Vector2D(
            fromDegree(Math.random() * 360), // random direction.
            BIRD_SPEED // speed.
        );
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
        const angle = this.velocity.x1;
        const speed = this.velocity.x2 * deltaTime;
        // this.velocity.add(new Vector2D(1/100, 0));
        this.position.add(
            new Vector2D(Math.cos(angle), Math.sin(angle))
                .multiply(speed)
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
        this.unrotate(context);
    }

    rotate(context: CanvasRenderingContext2D) {
        // Move registration point to the center of the bird
        context.translate(this.position.x1, this.position.x2);
        // Rotate degree
        context.rotate(this.velocity.x1);
        context.translate(-this.position.x1, -this.position.x2);
    }

    unrotate(context: CanvasRenderingContext2D) {
        context.translate(this.position.x1, this.position.x2);
        // Rotate degree
        context.rotate(-this.velocity.x1);
        // Move registration point back to the top left corner of canvas
        context.translate(-this.position.x1, -this.position.x2);
    }
}