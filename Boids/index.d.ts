import { IEngine, IRenderingLayer } from '@zacktherrien/typescript-render-engine';
import { IBird } from './Bird';
import { ITerrain } from './Terrain';
import { IMouseToolsManager } from './MouseTools';
export default class Boids {
    static instance: Boids;
    maxX: number;
    maxY: number;
    engine: IEngine;
    terrain: ITerrain;
    mouseTools: IMouseToolsManager;
    birdLayer: IRenderingLayer;
    birds: Array<IBird>;
    constructor();
}
//# sourceMappingURL=index.d.ts.map