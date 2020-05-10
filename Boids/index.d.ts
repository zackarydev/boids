import { IEngine, IRenderingLayer } from '@zacktherrien/typescript-render-engine';
import { IBird } from './Bird';
import Vector2D from './Vector2D';
import { ITerrain } from './Terrain';
export default class Boids {
    static instance: Boids;
    engine: IEngine;
    terrain: ITerrain;
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