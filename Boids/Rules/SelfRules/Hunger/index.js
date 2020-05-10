"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const SelfBehavior_1 = __importDefault(require("../../../Behavior/SelfBehavior"));
const constants_1 = require("../../../constants");
const __1 = __importDefault(require("../../.."));
class Hunger extends SelfBehavior_1.default {
    performFoodSearch() {
    }
    perform() {
        if (this.bird.energy < constants_1.BIRD_START_HUNGER_ENERGY) {
            const square = __1.default.instance.terrain.getSquareAtLocation(this.bird.position);
            if (square && square.foodLevel > 0) {
                this.bird.landed = true;
            }
            this.performFoodSearch();
        }
    }
    decrement(deltaTime) {
        if (this.bird.landed) {
            const square = __1.default.instance.terrain.getSquareAtLocation(this.bird.position);
            if (square.foodLevel > 0) {
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
            }
            else {
                this.bird.landed = false;
            }
        }
        this.bird.energy -= (constants_1.ACCELERATION_ENERGY_COST * this.bird.acceleration.magnitude() * deltaTime * deltaTime +
            constants_1.LIVING_ENERGY_COST * deltaTime);
    }
}
exports.default = Hunger;
