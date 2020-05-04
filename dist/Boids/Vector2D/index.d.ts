export default class Vector2D {
    x1: number;
    x2: number;
    constructor(x1?: number, x2?: number);
    static ZERO(): Vector2D;
    static ONE(): Vector2D;
    add(vector: Vector2D): this;
    multiply(scalar: number): this;
    divide(scalar: number): this;
    normalize(): this;
    magnitude(): number;
    clone(): Vector2D;
}
//# sourceMappingURL=index.d.ts.map