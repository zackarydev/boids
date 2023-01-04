import { RenderingLayer, LayerType, IEntity } from '@zacktherrien/typescript-render-engine';

import { IGame } from '../../Game';
import { LayerIndex } from '../../types';
import { HUD_OVERVIEW_BAR } from '../../rendering_constants';

export interface IStaticHUD extends IEntity {
    widthOffset: number;
    totalWidth: number;
}

export class StaticHUD implements IStaticHUD {
    layer: RenderingLayer;

    widthOffset: number;
    totalWidth: number;

    constructor(game: IGame) {
        this.layer = new RenderingLayer(LayerIndex.STATIC_HUD, LayerType.STATIC, this);
        game.engine.registerLayer(this.layer);

        this.widthOffset = this.layer.width * HUD_OVERVIEW_BAR.WIDTH_OFFSET;
        this.totalWidth = this.layer.width - this.widthOffset * 2;

        this.layer.render();
    }

    updateScale(_: number, _2: number) {}

    render(context: CanvasRenderingContext2D) {
        context.lineWidth = 1;

        //Drawing background color square.
        context.fillStyle = HUD_OVERVIEW_BAR.BACKGROUND_COLOR;
        context.strokeStyle = HUD_OVERVIEW_BAR.STROKE_COLOR;
        context.rect(this.widthOffset, 0, this.totalWidth, HUD_OVERVIEW_BAR.HEIGHT);
        context.fill();
        context.stroke();
    }
}
