import { RenderingLayer, LayerType } from '@zacktherrien/typescript-render-engine';

import { IGame } from '../Game';
import { LayerIndex } from '../types';
import { IBuilding } from '../Entities/Buildings';
import CastleBuilding, { ICastleBuilding } from '../Entities/Buildings/Castle';
import { IPlayer } from '../Entities/Player';

export interface IBuilder {
    createCastle(player: IPlayer): ICastleBuilding;
    getCastle(player: IPlayer): ICastleBuilding | null;
    addBuilding(building: IBuilding): void;
    destroyBuilding(building: IBuilding): void;
}

export default class Builder implements IBuilder {
    game: IGame;
    layer: RenderingLayer;

    buildings: IBuilding[];
    castles: Map<IPlayer, ICastleBuilding>;

    constructor(game: IGame) {
        this.game = game;
        this.layer = new RenderingLayer(LayerIndex.BUILDING, LayerType.DYNAMIC);
        this.game.engine.registerLayer(this.layer);

        this.buildings = [];
        this.castles = new Map();
    }

    createCastle(player: IPlayer) {
        const playerCastleHex = this.game.terrain.getCastleHex();
        if (!playerCastleHex) {
            throw new Error("Could not create the user's castle.");
        }
        const playerCastle = new CastleBuilding(this.game, playerCastleHex, player);
        // move player to their castle.
        player.teleportToHex(playerCastleHex);
        player.setCastle(playerCastle);
        this.castles.set(player, playerCastle);

        this.addBuilding(playerCastle);

        return playerCastle;
    }

    getCastle(player: IPlayer) {
        return this.castles.get(player) || null;
    }

    addBuilding(building: IBuilding) {
        this.buildings.push(building);
        this.layer.addEntity(building);
    }

    destroyBuilding(building: IBuilding) {
        const buildingsIdx = this.buildings.indexOf(building);
        if (buildingsIdx !== -1) {
            this.buildings.splice(buildingsIdx);
        }
        this.layer.removeEntity(building);
        building.hex.destroyBuilding();
    }
}
