"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Vector2D {
    constructor(x1 = 0, x2 = 0) {
        this.x1 = x1;
        this.x2 = x2;
    }
    static ZERO() {
        return new Vector2D(0, 0);
    }
    static ONE() {
        return new Vector2D(1, 1);
    }
    add(vector) {
        this.x1 += vector.x1;
        this.x2 += vector.x2;
        return this;
    }
    multiply(scalar) {
        this.x1 *= scalar;
        this.x2 *= scalar;
        return this;
    }
    divide(scalar) {
        this.x1 /= scalar;
        this.x2 /= scalar;
        return this;
    }
    normalize() {
        return this.divide(this.magnitude());
    }
    magnitude() {
        return Math.sqrt(this.x1 * this.x1 + this.x2 * this.x2);
    }
    clone() {
        return new Vector2D(this.x1, this.x2);
    }
}
exports.default = Vector2D;
