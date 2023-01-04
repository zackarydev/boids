import { IEntity } from '@zacktherrien/typescript-render-engine';

import { HexType, IPoint, IPoint3D } from '../types';
import { HEX_HEIGHT, HEX_WIDTH, HEX_SIDE, DEBUG_GRID, DEBUG_CENTERS } from '../constants';
import { HEX_STROKE_COLOR, HEX_COLORS } from '../rendering_constants';
import { IBuilding } from '../Entities/Buildings';
import { IHexGrid } from '../Terrain/HexGrid';

export interface IHex extends IEntity {
    path: Path2D;
    x: number;
    y: number;
    hexType: HexType;
    building: null | IBuilding;
    cubeCoordinates: IPoint3D;

    getCenterPosition(): IPoint;
    getDrawingPosition(): IPoint;
    setBuilding(building: IBuilding): void;
    destroyBuilding(): void;
    setType(newHexType: HexType): void;

    getNeighbours(): IHex[];
    getCubeCoordinates(): IPoint3D;
    getDistanceTo(hex: IHex): number;

    updateScale(scale: number): void;
}

export default class Hex implements IHex {
    hexGrid: IHexGrid;
    neighbours: IHex[] | null;

    x: number; // hex coord x
    y: number; // hex coord y
    path: Path2D;
    drawCoordinates: IPoint;
    centerCoordinates: IPoint;
    cubeCoordinates: IPoint3D;

    hexType: HexType;
    building: null | IBuilding;

    constructor(hexGrid: IHexGrid, x: number, y: number, hexType: HexType) {
        this.hexGrid = hexGrid;
        this.neighbours = null;

        this.x = x;
        this.y = y;
        this.hexType = hexType;
        this.building = null;

        this.cubeCoordinates = this.getCubeCoordinates();
        this.drawCoordinates = this.getDrawingPosition();
        this.centerCoordinates = this.getCenterPosition();

        this.path = new Path2D();
        this.initPath();
    }

    initPath() {
        this.updateScale(this.hexGrid.game.scale);
    }

    updateScale(scale: number) {
        this.drawCoordinates = this.getDrawingPosition(true);
        this.centerCoordinates = this.getCenterPosition(true);
        this.cubeCoordinates = this.getCubeCoordinates();

        const x0 = this.drawCoordinates.x;
        const y0 = this.drawCoordinates.y;
        this.path = new Path2D();
        this.path.moveTo(x0 + HEX_WIDTH * scale - HEX_SIDE * scale, y0);
        this.path.lineTo(x0 + HEX_SIDE * scale, y0);
        this.path.lineTo(x0 + HEX_WIDTH * scale, y0 + (HEX_HEIGHT / 2) * scale);
        this.path.lineTo(x0 + HEX_SIDE * scale, y0 + HEX_HEIGHT * scale);
        this.path.lineTo(x0 + HEX_WIDTH * scale - HEX_SIDE * scale, y0 + HEX_HEIGHT * scale);
        this.path.lineTo(x0, y0 + (HEX_HEIGHT / 2) * scale);
        this.path.closePath();
    }

    getCubeCoordinates() {
        if (!this.cubeCoordinates) {
            const z = this.y - (this.x - (this.x & 1)) / 2;
            this.cubeCoordinates = {
                x: this.x,
                y: -this.x - z,
                z,
            };
        }
        return this.cubeCoordinates;
    }

    getDistanceTo(hex: IHex) {
        return Math.max(
            Math.abs(this.cubeCoordinates.x - hex.cubeCoordinates.x),
            Math.abs(this.cubeCoordinates.y - hex.cubeCoordinates.y),
            Math.abs(this.cubeCoordinates.z - hex.cubeCoordinates.z),
        );
    }

    getNeighbours(): IHex[] {
        if (!this.neighbours) {
            this.neighbours = this.hexGrid.getNeighbouringHexes(this);
        }
        return this.neighbours;
    }

    setType(newHexType: HexType) {
        this.hexType = newHexType;
        this.hexGrid.updateRender();
    }

    setBuilding(building: IBuilding) {
        this.building = building;
        this.hexGrid.updateRender();
    }

    destroyBuilding() {
        this.building = null;
        this.hexGrid.updateRender();
    }

    getDrawingPosition(forced: boolean = false) {
        if (!this.drawCoordinates || forced) {
            this.drawCoordinates = {
                x: this.x * HEX_SIDE * this.hexGrid.game.scale,
                y:
                    this.y * HEX_HEIGHT * this.hexGrid.game.scale +
                    (this.x % 2 === 0 ? 0 : HEX_HEIGHT / 2) * this.hexGrid.game.scale,
            };
        }
        return this.drawCoordinates;
    }

    getCenterPosition(forced: boolean = false) {
        if (!this.centerCoordinates || forced) {
            const drawPos = this.getDrawingPosition();
            this.centerCoordinates = {
                x: drawPos.x + (HEX_WIDTH / 2) * this.hexGrid.game.scale,
                y: drawPos.y + (HEX_HEIGHT / 2) * this.hexGrid.game.scale,
            };
        }
        return this.centerCoordinates;
    }

    render(context: CanvasRenderingContext2D) {
        context.lineWidth = 1;
        context.fillStyle = HEX_COLORS[this.hexType];
        context.fill(this.path);
        context.strokeStyle = HEX_STROKE_COLOR;
        context.stroke(this.path);

        if (DEBUG_GRID) {
            context.font = '6px';
            context.fillStyle = '#000';

            // const { x, y, z } = this.getCubeCoordinates();
            // const debugText = `(${x} ${y} ${z})`;
            const debugText = `(${this.x}, ${this.y})`;
            const textWidth = context.measureText(debugText).width;
            context.fillText(debugText, this.centerCoordinates.x - textWidth / 2, this.centerCoordinates.y + 8 / 2 - 1);
        }
        if (DEBUG_CENTERS) {
            context.fillRect(this.centerCoordinates.x - 2, this.centerCoordinates.y - 2, 4, 4);
        }

        if (this.building) {
            this.building.render(context);
        }
    }
}
