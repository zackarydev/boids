import Engine, { IEngine, RenderingLayer, LayerType, IRenderingLayer } from '@zacktherrien/typescript-render-engine';

import { LayerIndex, BIRD_COUNT } from './constants';

import Bird, { IBird, } from './Bird';
import Terrain, { ITerrain } from './Terrain';
import MouseTools, { IMouseTools } from './MouseTools';

export default class Boids {

    static instance: Boids;

    engine: IEngine;
    terrain: ITerrain;
    mouseTools: IMouseTools;

    birdLayer: IRenderingLayer;
    birds: Array<IBird>;

    constructor() {
        Boids.instance = this;
        this.mouseTools = new MouseTools();
        this.terrain = new Terrain();
        this.birdLayer = new RenderingLayer(LayerIndex.BIRDS, LayerType.DYNAMIC);

        this.birds = [];
        for(let i = 0; i<BIRD_COUNT; i++) {
            // add a bird at a random location in our layer.
            const bird = new Bird(
                this,
                Math.random() * this.birdLayer.getWidth(), 
                Math.random() * this.birdLayer.getHeight(),
                this.birdLayer.getWidth(),
                this.birdLayer.getHeight(),
            );

            this.birds.push(bird);
            this.birdLayer.addEntity(bird);
        }

        this.engine = new Engine();

        this.engine.registerLayer(this.terrain.layer);
        this.engine.registerLayer(this.birdLayer);
        this.engine.start();
        this.terrain.layer.render();
    }
}