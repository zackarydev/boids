import { IEngine, IRenderingLayer } from '@zacktherrien/typescript-render-engine';
import { IBird } from './Bird';
import Vector2D from './Vector2D';
export default class Boids {
    engine: IEngine;
    background: IRenderingLayer;
    birdLayer: IRenderingLayer;
    birds: Array<IBird>;
    isLeftClicked: boolean;
    isRightClicked: boolean;
    mouseLocation: Vector2D;
    constructor();
    handleMouseDown(e: MouseEvent): void;
    handleMouseMove(e: MouseEvent): void;
    handleMouseUp(): void;
}
//# sourceMappingURL=index.d.ts.map