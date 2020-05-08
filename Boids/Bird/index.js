"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Vector2D_1 = __importDefault(require("../Vector2D"));
const constants_1 = require("../constants");
const helpers_1 = require("../helpers");
class Bird {
    constructor(boids, initialX, initialY, maxX, maxY) {
        this.boids = boids;
        this.maxX = maxX;
        this.maxY = maxY;
        this.position = new Vector2D_1.default(initialX, initialY);
        const randomAngle = helpers_1.fromDegree(Math.random() * 360);
        this.velocity = new Vector2D_1.default(Math.cos(randomAngle), Math.sin(randomAngle))
            .normalize()
            .multiply(constants_1.BIRD_SPEED);
        this.acceleration = Vector2D_1.default.ZERO();
        this.cohesionAccumulator = Vector2D_1.default.ZERO();
        this.separationAccumulator = Vector2D_1.default.ZERO();
        this.alignmentAccumulator = Vector2D_1.default.ZERO();
    }
    resetAccumulators() {
        this.acceleration.null();
        this.cohesionAccumulator.null();
        this.separationAccumulator.null();
        this.alignmentAccumulator.null();
    }
    performManeuvers(birds) {
        this.resetAccumulators();
        let perceivedBirdCount = 0;
        for (let i = 0; i < birds.length; i++) {
            if (birds[i] !== this && birds[i].position.distance(this.position) < constants_1.BIRD_VISUAL_RANGE) {
                perceivedBirdCount += 1;
                this.accumulateCohesion(birds[i]);
                this.accumulateSeparation(birds[i]);
                this.accumulateAlignment(birds[i]);
            }
        }
        if (perceivedBirdCount !== 0) {
            this.acceleration
                .add(this.performCohesion(perceivedBirdCount))
                .add(this.performSeparation(perceivedBirdCount))
                .add(this.performAlignment(perceivedBirdCount));
        }
        this.checkBoundary();
        this.checkVelocity();
    }
    accumulateCohesion(bird) {
        this.cohesionAccumulator.add(bird.position);
    }
    accumulateSeparation(bird) {
        const positionDiff = this.position
            .clone()
            .sub(bird.position);
        const distance = positionDiff.magnitude();
        if (distance <= constants_1.BIRD_SEPARATION_DISTANCE) {
            this.separationAccumulator.add(positionDiff.divide(distance));
        }
    }
    accumulateAlignment(bird) {
        this.alignmentAccumulator.add(bird.velocity);
    }
    performCohesion(birdCount) {
        return this.cohesionAccumulator
            .divide(birdCount)
            .sub(this.position)
            .normalize()
            .multiply(constants_1.BIRD_SPEED)
            .sub(this.velocity)
            .multiply(constants_1.BIRD_COHESION_EAGERNESS);
    }
    performSeparation(birdCount) {
        return this.separationAccumulator
            .divide(birdCount)
            .normalize()
            .multiply(constants_1.BIRD_SPEED)
            .sub(this.velocity)
            .multiply(constants_1.BIRD_SEPARATION_EAGERNESS);
    }
    performAlignment(birdCount) {
        return this.alignmentAccumulator
            .divide(birdCount)
            .normalize()
            .multiply(constants_1.BIRD_SPEED)
            .sub(this.velocity)
            .multiply(constants_1.BIRD_ALIGNMENT_EAGERNESS);
    }
    checkPredators() {
        if (this.boids.isRightClicked) {
            return this.boids.mouseLocation
                .clone()
                .sub(this.position)
                .divide(constants_1.BIRD_COHESION_EAGERNESS)
                .multiply(-1);
        }
        return Vector2D_1.default.CONST_ZERO;
    }
    checkGoals() {
        if (this.boids.isLeftClicked) {
            return this.boids.mouseLocation
                .clone()
                .sub(this.position)
                .divide(constants_1.BIRD_COHESION_EAGERNESS);
        }
        return Vector2D_1.default.CONST_ZERO;
    }
    checkBoundary() {
        if (this.position.x1 < 0) {
            this.position.x1 = this.maxX;
        }
        else if (this.position.x1 > this.maxX) {
            this.position.x1 = 0;
        }
        if (this.position.x2 < 0) {
            this.position.x2 = this.maxY;
        }
        else if (this.position.x2 > this.maxY) {
            this.position.x2 = 0;
        }
    }
    checkVelocity() {
        this.velocity
            .normalize()
            .multiply(constants_1.BIRD_SPEED);
    }
    update(deltaTime) {
        this.performManeuvers(this.boids.birds);
        this.position.add(this.velocity
            .clone()
            .multiply(deltaTime));
        this.velocity.add(this.acceleration);
    }
    render(context) {
        this.rotate(context);
        context.strokeStyle = 'red';
        context.beginPath();
        context.moveTo(this.position.x1 + constants_1.BIRD_WIDTH / 2, this.position.x2);
        context.lineTo(this.position.x1 - constants_1.BIRD_WIDTH / 2, this.position.x2 + constants_1.BIRD_HEIGHT / 2);
        context.lineTo(this.position.x1 - constants_1.BIRD_WIDTH / 2, this.position.x2 - constants_1.BIRD_HEIGHT / 2);
        context.closePath();
        context.stroke();
        this.unrotate(context);
    }
    rotate(context) {
        context.translate(this.position.x1, this.position.x2);
        context.rotate(helpers_1.getAngle(this.velocity));
        context.translate(-this.position.x1, -this.position.x2);
    }
    unrotate(context) {
        context.translate(this.position.x1, this.position.x2);
        context.rotate(-helpers_1.getAngle(this.velocity));
        context.translate(-this.position.x1, -this.position.x2);
    }
}
exports.default = Bird;
