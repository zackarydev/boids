import { RenderingLayer, LayerType, IEntity } from '@zacktherrien/typescript-render-engine';

import { IGame } from '../Game';
import { LayerIndex, ScreenType } from '../types';
import { HUD_OVERVIEW_BAR } from '../rendering_constants';
import { IScreen } from '../Screen';
import BuildMenu from '../Screen/BuildMenu';
import { StaticHUD, IStaticHUD } from './StaticHUD';

export interface IHUD extends IEntity {
    closeScreen(screenType: ScreenType): void;
    openScreen(screenType: ScreenType, x: number, y: number): void;
    onClick(x: number, y: number): boolean;
    onMouseMove(x: number, y: number): void;
}

export class HUD implements IHUD {
    game: IGame;
    layer: RenderingLayer;
    staticHUD: IStaticHUD;

    screens: IScreen[];

    moneyStart: number;
    castleStart: number;
    hpStart: number;

    constructor(game: IGame) {
        this.game = game;
        this.layer = new RenderingLayer(LayerIndex.HUD, LayerType.DYNAMIC, this);
        game.engine.registerLayer(this.layer);

        this.staticHUD = new StaticHUD(game);
        this.screens = [];

        const castleHPWidth = HUD_OVERVIEW_BAR.TEXT_PADDINGS + HUD_OVERVIEW_BAR.CASTLE_HP_WIDTH;
        const hpWidth = HUD_OVERVIEW_BAR.TEXT_PADDINGS + HUD_OVERVIEW_BAR.HP_WIDTH;
        this.moneyStart =
            this.staticHUD.widthOffset +
            this.staticHUD.totalWidth / 2 -
            (HUD_OVERVIEW_BAR.MONEY_WIDTH + castleHPWidth) / 2 -
            (HUD_OVERVIEW_BAR.CASTLE_HP_WIDTH + hpWidth) / 2;
        this.castleStart = this.moneyStart + HUD_OVERVIEW_BAR.MONEY_WIDTH + HUD_OVERVIEW_BAR.TEXT_PADDINGS;
        this.hpStart = this.castleStart + HUD_OVERVIEW_BAR.MONEY_WIDTH + HUD_OVERVIEW_BAR.TEXT_PADDINGS;
    }

    closeScreen(screenType: ScreenType) {
        const screenIndex = this.screens.findIndex((screen) => screen.screenType === screenType);
        if (screenIndex !== -1) {
            this.layer.removeEntity(this.screens[screenIndex]);
            this.screens.splice(screenIndex, 1);
        }
    }

    openScreen(screenType: ScreenType, x: number, y: number) {
        switch (screenType) {
            case ScreenType.SPLASH_SCREEN: {
                break;
            }
            case ScreenType.BUILD_MENU: {
                const screenIsOpen = Boolean(this.screens.find((screen) => screen.screenType === screenType));
                if (screenIsOpen) {
                    this.closeScreen(screenType);
                    return;
                }

                const screen = new BuildMenu(this.game, x, y);
                this.screens.push(screen);
                this.layer.addEntity(screen);
                break;
            }
            case ScreenType.TECH_MENU: {
                break;
            }
            default:
                throw new Error('Unknown screen type...');
        }
    }

    onClick(x: number, y: number) {
        return Boolean(this.screens.find((screen) => screen.onClick(x, y)));
    }

    onMouseMove(x: number, y: number) {
        this.screens.forEach((screen) => screen.onHover(x, y));
    }

    updateScale(_: number, _2: number) {}

    update(_: number) {}

    render(context: CanvasRenderingContext2D) {
        //Drawing title
        context.font = '12px Arial';
        context.fillStyle = HUD_OVERVIEW_BAR.TEXT_COLOR;

        const moneyText = `Money: $${Math.round(this.game.player.money)}`;

        const castleHP = this.game.player.castle ? this.game.player.castle.health : 0;
        const castleHPText = `Castle HP: ${Math.round(castleHP)}`;

        const playerHPText = `HP: ${Math.round(this.game.player.health)}`;

        context.fillText(moneyText, this.moneyStart, HUD_OVERVIEW_BAR.HEIGHT / 2 + 3);
        context.fillText(castleHPText, this.castleStart, HUD_OVERVIEW_BAR.HEIGHT / 2 + 3);
        context.fillText(playerHPText, this.hpStart, HUD_OVERVIEW_BAR.HEIGHT / 2 + 3);
    }
}
