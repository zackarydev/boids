import { IEntity } from '@zacktherrien/typescript-render-engine';

import { BuildingType } from '../../types';
import { IGame } from '../../Game';
import { BUILDING_HEALTH, BUILDING_DAMAGE_FROM_BULLET } from '../../constants';
import { IPlayer } from '../Player';
import { IHex } from '../../Hex';

export interface IBuilding extends IEntity {
    health: number;
    buildingType: BuildingType;
    owner: IPlayer;
    hex: IHex;

    receiveHitByBullet(): void;
}

export default abstract class Building implements IBuilding {
    game: IGame;

    hex: IHex;
    owner: IPlayer;
    buildingType: BuildingType;

    health: number;
    refreshDuration: number;

    constructor(game: IGame, hex: IHex, owner: IPlayer, buildingType: BuildingType) {
        this.game = game;

        this.hex = hex;
        this.owner = owner;
        this.buildingType = buildingType;

        this.health = BUILDING_HEALTH[this.buildingType];
        this.refreshDuration = 0;
        this.hex.setBuilding(this);
    }

    receiveHitByBullet() {
        this.health -= BUILDING_DAMAGE_FROM_BULLET;
        if (this.health <= 0) {
            this.hex.destroyBuilding();
            this.game.builder.destroyBuilding(this);
        }
    }

    // updated in a different layer than the render.
    abstract update(deltaTime: number): void;

    abstract render(context: CanvasRenderingContext2D): void;
}
