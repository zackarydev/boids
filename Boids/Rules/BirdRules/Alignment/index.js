"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BirdBehavior_1 = __importDefault(require("../../../Behavior/BirdBehavior"));
const constants_1 = require("../../../constants");
class Alignment extends BirdBehavior_1.default {
    perform(birdCount) {
        return this.value
            .divide(birdCount)
            .normalize()
            .multiply(constants_1.BIRD_SPEED)
            .sub(this.bird.velocity)
            .multiply(constants_1.BIRD_ALIGNMENT_EAGERNESS);
    }
    accumulate(bird) {
        this.value.add(bird.velocity);
    }
}
exports.default = Alignment;
