"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Behavior_1 = __importDefault(require("../../Behavior"));
const constants_1 = require("../../constants");
class Separation extends Behavior_1.default {
    perform(birdCount) {
        return this.value
            .divide(birdCount)
            .normalize()
            .multiply(constants_1.BIRD_SPEED)
            .sub(this.bird.velocity)
            .multiply(constants_1.BIRD_SEPARATION_EAGERNESS);
    }
    accumulate(bird) {
        const positionDiff = this.bird.position
            .clone()
            .sub(bird.position);
        const distance = positionDiff.magnitude();
        if (distance <= constants_1.BIRD_SEPARATION_DISTANCE) {
            this.value.add(positionDiff.divide(distance));
        }
    }
}
exports.default = Separation;
