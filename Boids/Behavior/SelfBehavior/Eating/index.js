"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = __importDefault(require(".."));
const constants_1 = require("../../../constants");
const __2 = __importDefault(require("../../.."));
class Eating extends __1.default {
    perform(deltaTime) {
        if (this.bird.landed) {
            const square = __2.default.instance.terrain.getSquareAtLocation(this.bird.position);
            if (square && square.foodLevel > 0) {
                const potentialConsumption = constants_1.BIRD_EATING_SPEED * deltaTime;
                let actualConsumption = potentialConsumption;
                if (potentialConsumption > square.foodLevel) {
                    actualConsumption = square.foodLevel;
                }
                if (actualConsumption + this.bird.energy > constants_1.MAX_BIRD_ENERGY) {
                    actualConsumption = constants_1.MAX_BIRD_ENERGY - this.bird.energy;
                }
                square.foodLevel -= actualConsumption;
                this.bird.energy += actualConsumption;
                if (this.bird.energy >= constants_1.MAX_BIRD_ENERGY) {
                    this.bird.landed = false;
                }
            }
            else {
                this.bird.landed = false;
            }
        }
    }
}
exports.default = Eating;
