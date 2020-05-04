import Engine, { IEngine, RenderingLayer, LayerType, IRenderingLayer } from '@zacktherrien/typescript-render-engine';

import { LayerIndex, BIRD_COUNT } from './constants';

import Bird, { IBird, } from './Bird';

export default class Boids {

    engine: IEngine;
    background: IRenderingLayer;

    birdLayer: IRenderingLayer;
    birds: Array<IBird>;

    constructor() {
        this.background = new RenderingLayer(LayerIndex.BACKGROUND, LayerType.STATIC);
        this.birdLayer = new RenderingLayer(LayerIndex.BIRDS, LayerType.DYNAMIC);

        this.birds = [];
        for(let i = 0; i<BIRD_COUNT; i++) {
            // add a bird at a random location in our layer.
            const bird = new Bird(
                Math.random() * this.birdLayer.getWidth(), 
                Math.random() * this.birdLayer.getHeight(),
                this.birdLayer.getWidth(),
                this.birdLayer.getHeight(),
            );

            this.birds.push(bird);
            this.birdLayer.addEntity(bird);
        }

        this.engine = new Engine();

        this.engine.registerLayer(this.background);
        this.engine.registerLayer(this.birdLayer);
        this.engine.start();
    }
}