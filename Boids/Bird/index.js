"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Vector2D_1 = __importDefault(require("../Vector2D"));
const __1 = __importDefault(require("../"));
const constants_1 = require("../constants");
const colors_1 = require("../colors");
const helpers_1 = require("../helpers");
const Cohesion_1 = __importDefault(require("../Behavior/BirdBehavior/Cohesion"));
const Alignment_1 = __importDefault(require("../Behavior/BirdBehavior/Alignment"));
const Separation_1 = __importDefault(require("../Behavior/BirdBehavior/Separation"));
const Hunger_1 = __importDefault(require("../Behavior/BirdBehavior/Hunger"));
const Eating_1 = __importDefault(require("../Behavior/SelfBehavior/Eating"));
const Exhaustion_1 = __importDefault(require("../Behavior/SelfBehavior/Exhaustion"));
class Bird {
    constructor(boids, initialX, initialY) {
        this.boids = boids;
        this.position = new Vector2D_1.default(initialX, initialY);
        const randomAngle = helpers_1.fromDegree(Math.random() * 360);
        this.velocity = new Vector2D_1.default(Math.cos(randomAngle), Math.sin(randomAngle))
            .normalize()
            .multiply(constants_1.BIRD_SPEED * Math.random());
        this.acceleration = Vector2D_1.default.ZERO();
        this.energy = constants_1.MAX_BIRD_ENERGY * 0.5 + constants_1.MAX_BIRD_ENERGY * Math.random();
        this.birdRules = [
            new Cohesion_1.default(this),
            new Alignment_1.default(this),
            new Separation_1.default(this),
            new Hunger_1.default(this),
        ];
        this.selfRules = [
            new Exhaustion_1.default(this),
            new Eating_1.default(this),
        ];
        this.landed = false;
    }
    resetAccumulators() {
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
                let force;
                for (let i = 0; i < this.birdRules.length; i++) {
                    force = this.birdRules[i].perform(perceivedBirdCount);
                    if (force) {
                        this.acceleration.add(force);
                    }
                }
            }
        }
        this.checkVelocity();
    }
    performSenses(deltaTime) {
        for (let i = 0; i < this.selfRules.length; i++) {
            this.selfRules[i].perform(deltaTime);
        }
    }
    checkBoundary() {
        if (this.position.x1 < 0) {
            this.position.x1 = __1.default.instance.maxX;
        }
        else if (this.position.x1 > __1.default.instance.maxX) {
            this.position.x1 = 0;
        }
        if (this.position.x2 < 0) {
            this.position.x2 = __1.default.instance.maxY;
        }
        else if (this.position.x2 > __1.default.instance.maxY) {
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
        this.performSenses(deltaTime);
        this.performManeuvers(this.boids.birds);
        if (!this.landed) {
            this.position.add(this.velocity
                .clone()
                .multiply(deltaTime));
        }
        this.velocity.add(this.acceleration);
        this.acceleration.null();
        this.checkBoundary();
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
        context.fill();
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
