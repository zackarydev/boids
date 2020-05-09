import Engine, { IEngine, RenderingLayer, LayerType, IRenderingLayer } from '@zacktherrien/typescript-render-engine';

import { LayerIndex, BIRD_COUNT } from './constants';

import Bird, { IBird, } from './Bird';
import Vector2D from './Vector2D';
import Terrain, { ITerrain } from './Terrain';

export default class Boids {

    engine: IEngine;
    terrain: ITerrain;

    birdLayer: IRenderingLayer;
    birds: Array<IBird>;

    isLeftClicked: boolean;
    isRightClicked: boolean;
    mouseLocation: Vector2D;

    constructor() {
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

        this.isLeftClicked = false;
        this.isRightClicked = false;
        this.mouseLocation = Vector2D.ZERO();

        this.engine = new Engine();

        this.engine.registerLayer(this.terrain.layer);
        this.engine.registerLayer(this.birdLayer);
        this.engine.start();
        this.terrain.layer.render();

        document.addEventListener('mousedown', this.handleMouseDown.bind(this));
        document.addEventListener('mouseup', this.handleMouseUp.bind(this));
        document.addEventListener('mousemove', this.handleMouseMove.bind(this));
        document.addEventListener('contextmenu', event => event.preventDefault());
    }

    handleMouseDown(e: MouseEvent) {
        if(e.button === 0) {
            this.isLeftClicked = true;
        } else {
            this.isRightClicked = true;
            e.preventDefault();
            e.stopImmediatePropagation();
        }
        this.mouseLocation = new Vector2D(e.offsetX, e.offsetY);
    }

    handleMouseMove(e: MouseEvent) {
        this.mouseLocation = new Vector2D(e.offsetX, e.offsetY);
    }

    handleMouseUp() {
        this.isLeftClicked = false;
        this.isRightClicked = false;
        this.mouseLocation = Vector2D.ZERO();
    }
}