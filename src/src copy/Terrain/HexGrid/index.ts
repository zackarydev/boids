import { RenderingLayer, LayerType, IEntity } from '@zacktherrien/typescript-render-engine';

import { IGame } from '../../Game';

import { HEX_HEIGHT, HEX_WIDTH, HEX_OBTUSE_WIDTH, HEX_SIDE } from '../../constants';
import Hex, { IHex } from '../../Hex';
import { HexType, LayerIndex } from '../../types';

export interface IHexGrid extends IEntity {
    game: IGame;

    hexGridWidth: number;
    hexGridHeight: number;

    getCastleHex(): IHex;
    getHexAt(x: number, y: number): IHex | null;
    getHexAtPosition(posX: number, posY: number): IHex | null;
    getHexAtPixel(pixelX: number, pixelY: number): IHex | null;
    getNeighbouringHexes(hex: IHex): IHex[];
    getMovementCost(currentHex: IHex, toHex: IHex): number;
    getRandomHex(): IHex;

    updateRender(): void;

    // "Memory leak improvements"
    _filterWATER(hex: IHex): boolean;
}

export default abstract class HexGrid implements IHexGrid {
    game: IGame;
    layer: RenderingLayer;

    scaleChangeTimerId: number | null;

    hexGridWidth: number;
    hexGridHeight: number;

    hexes: IHex[][];
    flatHexes: IHex[];

    constructor(game: IGame) {
        this.game = game;
        this.layer = new RenderingLayer(LayerIndex.HEX_GRID, LayerType.STATIC, this);

        game.engine.registerLayer(this.layer);

        this.scaleChangeTimerId = null;

        this.hexes = [];
        this.flatHexes = [];

        this.hexGridWidth = Math.floor(this.layer.width / (HEX_WIDTH * game.scale - HEX_OBTUSE_WIDTH * game.scale)) + 1;
        this.hexGridHeight = Math.floor((this.layer.height / HEX_HEIGHT) * game.scale) + 1;
    }

    updateScale(scale: number) {
        this.hexGridWidth =
            Math.floor(this.layer.width / (HEX_WIDTH * this.game.scale - HEX_OBTUSE_WIDTH * this.game.scale)) + 1;
        this.hexGridHeight = Math.floor(this.layer.height / (HEX_HEIGHT * this.game.scale)) + 1;

        for (let i = 0; i < this.flatHexes.length; i++) {
            this.flatHexes[i].updateScale(scale);
        }
        this.updateRender();
    }

    updateRender() {
        this.layer.render();
    }

    abstract initHexes(): void;

    setHexes(hexes: IHex[][], flatHexes: IHex[]) {
        this.hexes = hexes;
        this.flatHexes = flatHexes;

        this.updateRender();
    }

    _filterWATER = (hex: IHex) => hex.hexType === HexType.WATER;
    _filterGRASS = (hex: IHex) => hex.hexType === HexType.GRASS && !hex.building;

    getRandomHex() {
        const hexes = this.flatHexes.filter(this._filterWATER);
        return hexes[Math.floor(Math.random() * hexes.length)];
    }

    getCastleHex() {
        const GRASSHexes = this.flatHexes.filter(this._filterGRASS);
        return GRASSHexes[Math.floor(Math.random() * GRASSHexes.length)];
    }

    getHexAt(x: number, y: number): IHex | null {
        if (y < this.hexGridHeight && y >= 0) {
            if (x < this.hexGridWidth && x >= 0) {
                return this.hexes[x][y];
            }
        }
        return null;
    }

    getHexAtPosition(posX: number, posY: number): IHex | null {
        return this.getHexAtPixel(posX * this.game.scale, posY * this.game.scale);
    }

    getHexAtPixel(pixelX: number, pixelY: number): IHex | null {
        // use math to drop the number from O(N) N=hexes to O(1).
        const hexStartX = Math.floor(pixelX / (HEX_SIDE * this.game.scale));
        const hexStartY = Math.floor(pixelY / (HEX_HEIGHT * this.game.scale));

        const RADIUS_CHECK = 1; // how many hexes around the potential hex should we check?

        let hexFound = null;
        for (let ix = -RADIUS_CHECK; ix <= RADIUS_CHECK; ix++) {
            for (let iy = -RADIUS_CHECK; iy <= RADIUS_CHECK; iy++) {
                const hex = this.getHexAt(ix + hexStartX, iy + hexStartY);
                if (hex) {
                    if (this.layer.context.isPointInPath(hex.path, pixelX, pixelY)) {
                        hexFound = hex;
                    }
                }
            }
        }
        return hexFound;
    }

    _neighbourMap = (hex: IHex) => (coordDiff: number[]) => this.getHexAt(hex.x + coordDiff[0], hex.y + coordDiff[1]);
    getNeighbouringHexes(hex: Hex): Hex[] {
        const ySign = hex.x % 2 === 0 ? -1 : 1; // if the hex is even column, then y is negative.

        const neighbours = [
            [-1, ySign], // left above or below
            [-1, 0], // left above or below
            [1, ySign], // right above or below
            [1, 0], // right above or below.

            [0, 1], // above
            [0, -1], // below
        ];

        // @ts-ignore: this will absolutely return a not null list because of .filter(Boolean)
        return neighbours.map(this._neighbourMap(hex)).filter(Boolean);
    }

    getMovementCost(_: IHex, _1: IHex) {
        return 0;
    }

    _renderHex = (context: CanvasRenderingContext2D) => (hex: IHex) => hex.render(context);
    render(context: CanvasRenderingContext2D) {
        const renderHex = this._renderHex(context);
        this.flatHexes.forEach(renderHex);
    }
}
