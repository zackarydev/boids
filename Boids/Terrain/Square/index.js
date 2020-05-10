"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../constants");
const colors_1 = require("../../colors");
class Square {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.foodLevel = constants_1.SQUARE_FOODS.get(this.type) || 0;
    }
    render(context) {
        context.fillStyle = colors_1.SquareColors[this.type];
        context.fillRect(this.x * constants_1.SQUARE_SIZE, this.y * constants_1.SQUARE_SIZE, constants_1.SQUARE_SIZE, constants_1.SQUARE_SIZE);
    }
}
exports.default = Square;
