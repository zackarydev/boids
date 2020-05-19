"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = __importDefault(require(".."));
const constants_1 = require("../../../constants");
class Exhaustion extends __1.default {
    perform(deltaTime) {
        this.bird.energy -= (constants_1.ACCELERATION_ENERGY_COST * this.bird.acceleration.magnitude() * deltaTime * deltaTime +
            constants_1.LIVING_ENERGY_COST * deltaTime);
    }
}
exports.default = Exhaustion;
