export default class Vector2D {
    x1: number;
    x2: number;
    constructor(x1?: number, x2?: number);
    static ZERO(): Vector2D;
    static ONE(): Vector2D;
    static CONST_ZERO: Vector2D;
    static CONST_ONE: Vector2D;
    null(): void;
    add(vector: Vector2D): this;
    sub(vector: Vector2D): this;
    multiply(scalar: number): this;
    divide(scalar: number): this;
    normalize(): Vector2D;
    magnitude(): number;
    distance(vector: Vector2D): number;
    clone(): Vector2D;
}
//# sourceMappingURL=index.d.ts.map