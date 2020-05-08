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
    null() {
        this.x1 = 0;
        this.x2 = 0;
    }
    add(vector) {
        this.x1 += vector.x1;
        this.x2 += vector.x2;
        return this;
    }
    sub(vector) {
        this.x1 -= vector.x1;
        this.x2 -= vector.x2;
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
        const mag = this.magnitude();
        if (mag === 0) {
            return Vector2D.ZERO();
        }
        return this.divide(mag);
    }
    magnitude() {
        return Math.sqrt(this.x1 * this.x1 + this.x2 * this.x2);
    }
    distance(vector) {
        return Math.sqrt(Math.pow((this.x1 - vector.x1), 2) + Math.pow((this.x2 - vector.x2), 2));
    }
    clone() {
        return new Vector2D(this.x1, this.x2);
    }
}
exports.default = Vector2D;
Vector2D.CONST_ZERO = Vector2D.ZERO();
Vector2D.CONST_ONE = Vector2D.ONE();
