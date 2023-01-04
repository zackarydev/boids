import { IAIPlayer } from '.';

import FSMNodes, { INode } from './FSM';
import { distance, angleBetweenVectors } from '../../../utils';
import { HEX_RADIUS } from '../../../constants';
import { HexType } from '../../../types';
import { IPlayer } from '..';

export interface IAIBrain {
    playerIsVisible: boolean;
    playerIsNear: boolean;
    health: number;
    update(): void;
}

export default class AIBrain implements IAIBrain {
    ai: IAIPlayer;
    player: IPlayer;
    currentNode: INode;
    playerIsVisible: boolean;
    playerIsNear: boolean;
    health: number;

    constructor(ai: IAIPlayer) {
        this.ai = ai;
        this.player = ai.game.player;

        // defaults should not interfere with game initialization...
        this.playerIsVisible = this.getPlayerIsVisible(true);
        this.playerIsNear = this.getPlayerIsNear(true);
        this.health = this.ai.health;

        this.currentNode = FSMNodes.IDLE;
    }

    getPlayerIsNear(forced: boolean = false) {
        // as soon as the player changes hex or the AI changes hex,
        // see if the player is still visible to the AI.
        if (
            this.player.currentHex === this.player.previousHex &&
            this.ai.currentHex === this.ai.previousHex &&
            !forced
        ) {
            // if the player did not change hex, return the previous visibility.
            return this.playerIsNear;
        }

        const x = this.ai.position.x + this.ai.size / 2;
        const y = this.ai.position.y + this.ai.size / 2;
        const player = this.ai.game.player;
        const px = player.position.x + player.size / 2;
        const py = player.position.y + player.size / 2;

        return distance(x, y, px, py) < HEX_RADIUS * 5;
    }

    getPlayerIsVisible(forced: boolean = false) {
        // as soon as the player changes hex or the AI changes hex,
        // see if the player is still visible to the AI.
        if (
            this.player.currentHex === this.player.previousHex &&
            this.ai.currentHex === this.ai.previousHex &&
            !forced
        ) {
            // if the player did not change hex, return the previous visibility.
            return this.playerIsVisible;
        }

        const x = this.ai.position.x + this.ai.size / 2;
        const y = this.ai.position.y + this.ai.size / 2;
        const player = this.player;
        const px = player.position.x + player.size / 2;
        const py = player.position.y + player.size / 2;

        const angle = angleBetweenVectors(x, y, px, py);

        const dist = distance(x, y, px, py);
        const STEPS = 100;
        const distSteps = dist / STEPS;
        let ix = x;
        let iy = y;
        for (let i = 0; i < STEPS; i++) {
            ix += Math.cos(angle) * distSteps;
            iy += Math.sin(angle) * distSteps;

            const hex = this.ai.game.terrain.getHexAtPosition(ix, iy);
            if (hex) {
                // cannot see through buildings I do not own.
                if (hex.building && hex.building.owner !== this.ai) {
                    return false;
                }
                // cannot see through WATER hexes.
                if (hex.hexType === HexType.WATER) {
                    return false;
                }
            }
        }
        return true;
    }

    updateSenses() {
        this.playerIsVisible = this.getPlayerIsVisible();
        this.playerIsNear = this.getPlayerIsNear();
        this.health = this.ai.health;
    }

    update() {
        this.updateSenses();
        const transitionTo = this.currentNode.getTransition(this);
        if (!transitionTo) {
            // if no transition is viable, then remain in the current state.
            return;
        }
        console.log('Transition to node: ', transitionTo.node.name);
        this.currentNode = transitionTo.node;
        this.currentNode.setPlayerState(this.ai);
    }
}
