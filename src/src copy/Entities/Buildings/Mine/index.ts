import Building, { IBuilding } from '..';
import { BuildingType } from '../../../types';
import { IGame } from '../../../Game';
import { IHex } from '../../../Hex';
import { IPlayer } from '../../Player';
import { MINE_SIZE, MINING_DURATION, MINING_AMOUNT } from '../../../constants';

export interface IMineBuilding extends IBuilding {}

export default class MineBuilding extends Building implements IMineBuilding {
    constructor(game: IGame, hex: IHex, owner: IPlayer) {
        super(game, hex, owner, BuildingType.MINE);
    }

    update(deltaTime: number) {
        this.refreshDuration += deltaTime;
        if (this.refreshDuration >= MINING_DURATION) {
            this.refreshDuration = 0;
            this.owner.money += MINING_AMOUNT;
        }
    }

    render(context: CanvasRenderingContext2D) {
        const { x, y } = this.hex.getCenterPosition();
        context.fillStyle = this.owner.color.buildingColor;
        context.strokeStyle = '#000000';
        context.lineWidth = 1;

        context.beginPath();
        context.rect(
            x - (MINE_SIZE / 2) * this.game.scale,
            y - (MINE_SIZE / 2) * this.game.scale,
            MINE_SIZE * this.game.scale,
            MINE_SIZE * this.game.scale,
        );
        context.closePath();
        context.fill();
        context.stroke();
    }
}
