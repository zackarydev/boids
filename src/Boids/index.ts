import Engine, { IEngine, DynamicLayer, IRenderingLayer } from '@zacktherrien/typescript-render-engine';

import { LayerIndex, BIRD_COUNT } from './constants';

import Bird, { IBird } from './Bird';
import Terrain, { ITerrain } from './Terrain';
import MouseTools, { IMouseToolsManager } from './MouseTools';

export default class Boids {
    static instance: Boids;

    maxX: number;
    maxY: number;

    engine: IEngine;
    terrain: ITerrain;
    mouseTools: IMouseToolsManager;

    birdLayer: IRenderingLayer;
    birds: Array<IBird>;

    constructor() {
        Boids.instance = this;
        this.mouseTools = new MouseTools();
        this.terrain = new Terrain();

        this.birdLayer = new DynamicLayer(LayerIndex.BIRDS);
        this.maxX = this.birdLayer.getWidth();
        this.maxY = this.birdLayer.getHeight();

        this.birds = [];
        for (let i = 0; i < BIRD_COUNT; i++) {
            // add a bird at a random location in our layer.
            const bird = new Bird(
                this,
                Math.random() * this.birdLayer.getWidth(),
                Math.random() * this.birdLayer.getHeight(),
            );

            this.birds.push(bird);
            this.birdLayer.addEntity(bird);
        }

        this.engine = new Engine();

        this.engine.registerLayer(this.terrain.layer);
        this.engine.registerLayer(this.mouseTools.layer);
        this.engine.registerLayer(this.birdLayer);
        this.engine.start();
        this.terrain.layer.render();
    }
}
