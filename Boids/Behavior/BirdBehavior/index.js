"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Vector2D_1 = __importDefault(require("../../Vector2D"));
class BirdBehavior {
    constructor(bird) {
        this.reset = () => {
            this.value.null();
        };
        this.bird = bird;
        this.value = Vector2D_1.default.ZERO();
    }
}
exports.default = BirdBehavior;
