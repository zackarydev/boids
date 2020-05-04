"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Vector2D_1 = __importDefault(require("../Vector2D"));
const constants_1 = require("../constants");
const helpers_1 = require("../helpers");
class Bird {
    constructor(initialX, initialY, maxX, maxY) {
        this.maxX = maxX;
        this.maxY = maxY;
        this.position = new Vector2D_1.default(initialX, initialY);
        this.velocity = new Vector2D_1.default(helpers_1.fromDegree(Math.random() * 360), constants_1.BIRD_SPEED);
    }
    checkBoundary() {
        if (this.position.x1 < 0 || this.position.x1 > this.maxX) {
            helpers_1.flipVector(this.velocity, 'x', this.position.x1 < 0 ? 'left' : 'right');
            return;
        }
        if (this.position.x2 < 0 || this.position.x2 > this.maxY) {
            helpers_1.flipVector(this.velocity, 'y', this.position.x2 < 0 ? 'up' : 'down');
            return;
        }
    }
    update(deltaTime) {
        const angle = this.velocity.x1;
        const speed = this.velocity.x2 * deltaTime;
        this.position.add(new Vector2D_1.default(Math.cos(angle), Math.sin(angle))
            .multiply(speed));
        this.checkBoundary();
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
        context.rotate(this.velocity.x1);
        context.translate(-this.position.x1, -this.position.x2);
    }
    unrotate(context) {
        context.translate(this.position.x1, this.position.x2);
        context.rotate(-this.velocity.x1);
        context.translate(-this.position.x1, -this.position.x2);
    }
}
exports.default = Bird;
