"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Vector2D_1 = __importDefault(require("../../../Vector2D"));
const __1 = __importDefault(require("../../.."));
const __2 = __importDefault(require(".."));
const constants_1 = require("../../../constants");
const constants_2 = require("../../../Terrain/constants");
class Hunger extends __2.default {
    goUp(pOffset) {
        pOffset.x2 -= 1;
    }
    goDown(pOffset) {
        pOffset.x2 += 1;
    }
    goRight(pOffset) {
        pOffset.x1 += 1;
    }
    goLeft(pOffset) {
        pOffset.x1 -= 1;
    }
    walkAroundRange(pOffset) {
        if (pOffset.x1 === 0 && pOffset.x2 === 0) {
            pOffset.x1 = 1;
        }
        if (Math.abs(pOffset.x1) === Math.abs(pOffset.x2)) {
            if (pOffset.x1 > 0 && pOffset.x2 > 0) {
                this.goLeft(pOffset);
            }
            else if (pOffset.x1 < 0 && pOffset.x2 > 0) {
                this.goDown(pOffset);
            }
            else if (pOffset.x1 < 0 && pOffset.x2 < 0) {
                this.goRight(pOffset);
            }
            else if (pOffset.x1 > 0 && pOffset.x2 < 0) {
                this.goUp(pOffset);
            }
        }
        else {
            if (pOffset.x1 > pOffset.x2 && Math.abs(pOffset.x1) > Math.abs(pOffset.x2)) {
                this.goUp(pOffset);
            }
            else if (pOffset.x1 < pOffset.x2 && Math.abs(pOffset.x1) < Math.abs(pOffset.x2)) {
                this.goLeft(pOffset);
            }
            else if (pOffset.x1 < pOffset.x2 && Math.abs(pOffset.x1) > Math.abs(pOffset.x2)) {
                this.goDown(pOffset);
            }
            else if (pOffset.x1 > pOffset.x2 && Math.abs(pOffset.x1) < Math.abs(pOffset.x2)) {
                this.goRight(pOffset);
            }
        }
    }
    performFoodSearch() {
        let squareCenter;
        let square;
        let x;
        const startingLocation = __1.default.instance.terrain.getSquareAtLocation(this.bird.position);
        if (!startingLocation)
            return null;
        const squaresInVisualRange = (constants_1.BIRD_VISUAL_RANGE / constants_2.SQUARE_SIZE) * 2;
        const pOffset = new Vector2D_1.default(0, 0);
        for (x = 0; x < squaresInVisualRange; x++) {
            square = __1.default.instance.terrain.getSquareAtCoord(pOffset.x1 + startingLocation.x, pOffset.x2 + startingLocation.y);
            if (square && square.foodLevel > 0) {
                squareCenter = square.getPixelCenter();
                if (this.bird.position.distance(square.getPixelCenter()) < constants_1.BIRD_VISUAL_RANGE) {
                    return squareCenter
                        .clone()
                        .sub(this.bird.position);
                }
            }
            this.walkAroundRange(pOffset);
        }
        return null;
    }
    perform(birdCount) {
        this.value.x1 /= birdCount;
        this.value.x2 = (this.bird.energy / constants_1.MAX_BIRD_ENERGY) * constants_1.BIRD_HUNGER_LANDING_DESIRE;
        const desireToLand = 1 - this.value.magnitude();
        if (desireToLand > 0.5) {
            const foodSquareVector = this.performFoodSearch();
            if (!foodSquareVector)
                return null;
            if (foodSquareVector.magnitude() < constants_2.SQUARE_SIZE) {
                this.bird.landed = true;
                return null;
            }
            else {
                return foodSquareVector
                    .normalize()
                    .multiply(this.bird.velocity.magnitude())
                    .sub(this.bird.velocity)
                    .multiply(desireToLand);
            }
        }
        else {
            return null;
        }
    }
    accumulate(bird) {
        if (bird.landed) {
            this.value.x1 += (1 - bird.position.distance(this.bird.position) / constants_1.BIRD_VISUAL_RANGE) * constants_1.BIRD_COMMUNAL_LANDING_DESIRE;
        }
    }
}
exports.default = Hunger;
