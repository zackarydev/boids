import Engine, { IEngine, LayerType, RenderingLayer } from '@zacktherrien/typescript-render-engine';

import { PlayerControlType, ScreenType, LayerIndex } from '../types';
import { IPlayer } from '../Entities/Player';
import { PLAYER_CONTROLS, DEFAULT_GAME_SCALE } from '../constants';
import { HUD, IHUD } from '../HUD';
import Builder, { IBuilder } from '../Builder';
import AIPlayer, { IAIPlayer } from '../Entities/Player/AIPlayer';
import HumanPlayer, { IHumanPlayer } from '../Entities/Player/HumanPlayer';
import ProceduralTerrain from '../Terrain/ProceduralTerrain';
import { ITerrain } from '../Terrain';

export interface IGame {
    engine: IEngine;

    pressedKeys: boolean[];
    mousePressed: boolean;
    mouseLocationX: number;
    mouseLocationY: number;
    scale: number;

    terrain: ITerrain;
    builder: IBuilder;
    player: IHumanPlayer;
    aiPlayer: IAIPlayer;
    hud: IHUD;

    gameOver(loser: IPlayer): void;
    getOppositePlayer(owner: IPlayer): IPlayer;
}

export default class Game implements IGame {
    engine: IEngine;

    prevScale: number;
    scale: number;
    scaleChangeTimerId: number | null;

    pressedKeys: boolean[];
    mousePressed: boolean;
    mouseLocationX: number;
    mouseLocationY: number;

    terrain: ITerrain;
    builder: IBuilder;
    player: IHumanPlayer;
    aiPlayer: IAIPlayer;
    hud: IHUD;

    constructor() {
        this.engine = new Engine();

        // Game scale controls
        this.scale = DEFAULT_GAME_SCALE;
        this.prevScale = this.scale;
        this.scaleChangeTimerId = null;

        // player controls
        this.pressedKeys = [];
        this.mousePressed = false;
        this.mouseLocationX = 0;
        this.mouseLocationY = 0;

        // hexes
        // this.hexGrid = new HexGrid(this);
        this.terrain = new ProceduralTerrain(this);
        // this.terrain = new TestTerrain(this);

        // builder
        this.builder = new Builder(this);

        // Players
        this.engine.registerLayer(new RenderingLayer(LayerIndex.PLAYER, LayerType.DYNAMIC));
        this.player = new HumanPlayer(this);
        this.aiPlayer = new AIPlayer(this);

        // HUD
        this.hud = new HUD(this);

        // Registering events and starting engine.
        this.registerEvents();
        this.engine.start();
    }

    registerEvents() {
        window.addEventListener('keydown', this.onKeyDown.bind(this));
        window.addEventListener('keyup', this.onKeyUp.bind(this));
        window.addEventListener('click', this.onClick.bind(this));
        window.addEventListener('mousedown', this.onMouseDown.bind(this));
        window.addEventListener('mouseup', this.onMouseUp.bind(this));
        window.addEventListener('mousemove', this.onMouseMove.bind(this));
        // window.addEventListener('wheel', this.onScroll.bind(this), {passive: false});
    }

    // updateScale = () => {
    //     const scale = this.scale;
    //     const scaleDelta = this.prevScale - this.scale;
    //     for(let i = 0; i<this.dynamicLayers.length; i++) {
    //         this.dynamicLayers[i].updateScale(scale, scaleDelta);
    //     }
    //     for(let i = 0; i<this.staticLayers.length; i++) {
    //         this.staticLayers[i].updateScale(scale, scaleDelta);
    //     }
    // };

    // onScroll(event: WheelEvent) {
    //     event.preventDefault();

    //     const prevScale = this.scale;
    //     const scaleChange = event.deltaY * GAME_SCALE_CHANGE_RESISTANCE;
    //     this.scale -= scaleChange;
    //     this.scale = clamp(this.scale, MINIMUM_GAME_SCALE, MAXIMUM_GAME_SCALE);
    //     this.prevScale = prevScale;
    //     // only update the scale if it has changed.
    //     if(this.scale !== prevScale) {
    //         this.scaleChangeTimerId = setTimeout(this.updateScale, RERENDER_DELAY_ON_GAME_SCALE_CHANGE);
    //     }
    // }

    onMouseDown(_: MouseEvent) {
        this.mousePressed = true;
    }

    onMouseUp(_: MouseEvent) {
        this.mousePressed = false;
    }

    onMouseMove(event: MouseEvent) {
        const pageX = event.pageX;
        const pageY = event.pageY;

        this.mouseLocationX = pageX;
        this.mouseLocationY = pageY;

        this.hud.onMouseMove(pageX, pageY);
    }

    onClick(event: MouseEvent) {
        event.preventDefault();
        const pageX = event.pageX;
        const pageY = event.pageY;

        const wasHandled = this.hud.onClick(pageX, pageY);
        if (!wasHandled) {
            this.player.handleClick(pageX, pageY);
        }
    }

    onKeyDown(event: KeyboardEvent) {
        event.preventDefault();
        const keyCode = event.keyCode;
        for (let control in PLAYER_CONTROLS) {
            let playerControl = PLAYER_CONTROLS[control];
            if (playerControl.keys.indexOf(keyCode) !== -1) {
                this.pressedKeys[playerControl.actionType] = true;
            }
        }
    }

    onKeyUp(event: KeyboardEvent) {
        event.preventDefault();
        const keyCode = event.keyCode;
        for (let control in PLAYER_CONTROLS) {
            let playerControl = PLAYER_CONTROLS[control];
            if (playerControl.keys.indexOf(keyCode) !== -1) {
                this.pressedKeys[playerControl.actionType] = false;

                if (playerControl.actionType === PlayerControlType.OPEN_MENU) {
                    this.hud.openScreen(ScreenType.BUILD_MENU, this.player.position.x, this.player.position.y);
                }
            }
        }
    }

    gameOver(loser: IPlayer) {
        console.log(this.getOppositePlayer(loser), 'is the winner!');
        this.engine.stop();
    }

    getOppositePlayer(player: IPlayer) {
        if (player === this.player) {
            return this.aiPlayer;
        } else {
            return this.player;
        }
    }
}
