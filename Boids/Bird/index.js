"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Vector2D_1 = __importDefault(require("../Vector2D"));
const constants_1 = require("../constants");
const helpers_1 = require("../helpers");
const Cohesion_1 = __importDefault(require("../Rules/BirdRules/Cohesion"));
const Alignment_1 = __importDefault(require("../Rules/BirdRules/Alignment"));
const Separation_1 = __importDefault(require("../Rules/BirdRules/Separation"));
const colors_1 = require("../colors");
const Hunger_1 = __importDefault(require("../Rules/SelfRules/Hunger"));
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
        this.energy = constants_1.MAX_BIRD_ENERGY / 2 + constants_1.MAX_BIRD_ENERGY / 2 * Math.random();
        this.birdRules = [
            new Cohesion_1.default(this),
            new Alignment_1.default(this),
            new Separation_1.default(this),
        ];
        this.selfRules = [
            new Hunger_1.default(this),
        ];
        this.landed = false;
    }
    resetAccumulators() {
        this.acceleration.null();
        for (let i = 0; i < this.birdRules.length; i++) {
            this.birdRules[i].reset();
        }
    }
    performManeuvers(birds) {
        this.resetAccumulators();
        if (!this.landed) {
            let perceivedBirdCount = 0;
            for (let i = 0; i < birds.length; i++) {
                if (!birds[i].landed &&
                    birds[i] !== this &&
                    birds[i].position.distance(this.position) < constants_1.BIRD_VISUAL_RANGE) {
                    perceivedBirdCount += 1;
                    for (let r = 0; r < this.birdRules.length; r++) {
                        this.birdRules[r].accumulate(birds[i]);
                    }
                }
            }
            if (perceivedBirdCount !== 0) {
                for (let i = 0; i < this.birdRules.length; i++) {
                    this.acceleration.add(this.birdRules[i].perform(perceivedBirdCount));
                }
            }
        }
        this.checkVelocity();
    }
    performSenses() {
        for (let i = 0; i < this.selfRules.length; i++) {
            this.selfRules[i].perform();
        }
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
        if (this.velocity.magnitude() > constants_1.BIRD_SPEED) {
            this.velocity
                .normalize()
                .multiply(constants_1.BIRD_SPEED);
        }
    }
    die() {
        this.boids.birds.splice(this.boids.birds.indexOf(this), 1);
        this.boids.birdLayer.removeEntity(this);
    }
    update(deltaTime) {
        this.performSenses();
        this.performManeuvers(this.boids.birds);
        if (!this.landed) {
            this.position.add(this.velocity
                .clone()
                .multiply(deltaTime));
        }
        this.velocity.add(this.acceleration);
        this.checkBoundary();
        for (let i = 0; i < this.selfRules.length; i++) {
            this.selfRules[i].decrement(deltaTime);
        }
        if (this.energy < 0) {
            this.die();
        }
    }
    render(context) {
        this.rotate(context);
        context.strokeStyle = colors_1.BirdColor;
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
