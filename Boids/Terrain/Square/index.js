"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../constants");
const colors_1 = require("../../colors");
const types_1 = require("../types");
const Vector2D_1 = __importDefault(require("../../Vector2D"));
class Square {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.isLandable = types_1.LANDABLE_SQUARE_TYPES.indexOf(this.type) !== -1;
        this.center = new Vector2D_1.default(this.x * constants_1.SQUARE_SIZE + constants_1.SQUARE_SIZE / 2, this.y * constants_1.SQUARE_SIZE + constants_1.SQUARE_SIZE / 2);
        this.foodLevel = constants_1.SQUARE_FOODS.get(this.type) || 0;
    }
    getPixelCenter() {
        return this.center;
    }
    update(_) {
    }
    render(context) {
        context.fillStyle = colors_1.SquareColors[this.type];
        context.fillRect(this.x * constants_1.SQUARE_SIZE, this.y * constants_1.SQUARE_SIZE, constants_1.SQUARE_SIZE, constants_1.SQUARE_SIZE);
    }
}
exports.default = Square;
