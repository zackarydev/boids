import { IRenderingLayer, RenderingLayer, LayerType, IEntity } from "@zacktherrien/typescript-render-engine";
import { LayerIndex } from "../constants";
import Vector2D from "../Vector2D";
import Boids from "..";
import SelectionTool from "./SelectionTool";

export interface IMouseTool extends IEntity {
    updatePosition(newPosition: Vector2D): void;
    getGeometry(): {
        top: number;
        left: number;
        width: number;
        height: number;
    };
}

export interface IMouseToolsManager {
    layer: IRenderingLayer;
}

export default class MouseToolsManager implements IMouseToolsManager {
    layer: IRenderingLayer;

    initialMouseLocation: Vector2D;
    mouseLocation: Vector2D;

    currentTool: IMouseTool | null;

    constructor() {
        this.layer = new RenderingLayer(LayerIndex.TOOLS, LayerType.STATIC);

        this.currentTool = null;

        this.initialMouseLocation = Vector2D.ZERO();
        this.mouseLocation = Vector2D.ZERO();

        document.addEventListener('mousedown', this.handleMouseDown.bind(this));
        document.addEventListener('mouseup', this.handleMouseUp.bind(this));
        document.addEventListener('mousemove', this.handleMouseMove.bind(this));
        document.addEventListener('contextmenu', event => event.preventDefault());
    }

    chooseTool(tool: IMouseTool) {
        this.resetTool();

        this.currentTool = tool;
        this.layer.addEntity(this.currentTool);
    }

    resetTool() {
        if (this.currentTool) {
            this.layer.removeEntity(this.currentTool);
            this.layer.render();
        }
    }

    handleMouseDown(e: MouseEvent) {
        if(e.button !== 0) {
            e.preventDefault();
            e.stopImmediatePropagation();
        }
        this.mouseLocation = new Vector2D(e.offsetX, e.offsetY);
        
        this.chooseTool(new SelectionTool(this.mouseLocation));
    }

    handleMouseMove(e: MouseEvent) {
        this.mouseLocation = new Vector2D(e.offsetX, e.offsetY);

        if(this.currentTool) {
            this.currentTool.updatePosition(this.mouseLocation);
    
            this.layer.render();
        }
    }

    handleMouseUp() {
        if(!this.currentTool) return;

        const { left, top, width, height } = this.currentTool?.getGeometry();

        const right = left + width;
        const bottom = top + height;

        for(let i = 0; i<Boids.instance.birds.length; i++) {
            if(
                Boids.instance.birds[i].position.x1 < right &&
                Boids.instance.birds[i].position.x1 > left &&
                Boids.instance.birds[i].position.x2 < bottom &&
                Boids.instance.birds[i].position.x2 > top
            ) {
                console.log(Boids.instance.birds[i]);
            }
        }

        this.resetTool();
    }
}