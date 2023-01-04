import Building, { IBuilding } from '..';
import { BuildingType } from '../../../types';
import { IGame } from '../../../Game';
import { IHex } from '../../../Hex';
import { IPlayer } from '../../Player';
import {
    CASTLE_HEX_RADIUS,
    CASTLE_HEX_HEIGHT,
    CASTLE_HEX_WIDTH,
    CASTLE_HEX_SIDE,
    BUILDING_HEALTH,
    CASTLE_REGENERATE_HEALTH_DURATION,
    CASTLE_REGENERATE_HEALTH_AMOUNT,
} from '../../../constants';

export interface ICastleBuilding extends IBuilding {}

export default class CastleBuilding extends Building implements ICastleBuilding {
    constructor(game: IGame, hex: IHex, owner: IPlayer) {
        super(game, hex, owner, BuildingType.CASTLE);
    }

    receiveHitByBullet() {
        super.receiveHitByBullet();
        if (this.health <= 0) {
            this.owner.castle = null;
        }
    }

    update(deltaTime: number) {
        if (this.health < BUILDING_HEALTH[this.buildingType]) {
            // Castle regenerate health over time.
            this.refreshDuration += deltaTime;
            if (this.refreshDuration >= CASTLE_REGENERATE_HEALTH_DURATION) {
                this.refreshDuration = 0;
                this.health += CASTLE_REGENERATE_HEALTH_AMOUNT;
                if (this.health > BUILDING_HEALTH[this.buildingType]) {
                    this.health = BUILDING_HEALTH[this.buildingType];
                }
            }
        }
    }

    render(context: CanvasRenderingContext2D) {
        const { x, y } = this.hex.getCenterPosition();

        const x0 = x - CASTLE_HEX_RADIUS * this.game.scale;
        const y0 = y - (CASTLE_HEX_HEIGHT / 2) * this.game.scale;

        context.beginPath();
        context.moveTo(x0 + CASTLE_HEX_WIDTH * this.game.scale - CASTLE_HEX_SIDE * this.game.scale, y0);
        context.lineTo(x0 + CASTLE_HEX_SIDE * this.game.scale, y0);
        context.lineTo(x0 + CASTLE_HEX_WIDTH * this.game.scale, y0 + (CASTLE_HEX_HEIGHT / 2) * this.game.scale);
        context.lineTo(x0 + CASTLE_HEX_SIDE * this.game.scale, y0 + CASTLE_HEX_HEIGHT * this.game.scale);
        context.lineTo(
            x0 + CASTLE_HEX_WIDTH * this.game.scale - CASTLE_HEX_SIDE * this.game.scale,
            y0 + CASTLE_HEX_HEIGHT * this.game.scale,
        );
        context.lineTo(x0, y0 + (CASTLE_HEX_HEIGHT / 2) * this.game.scale);
        context.closePath();

        context.fillStyle = this.owner.color.buildingColor;
        context.strokeStyle = '#000000';
        context.lineWidth = 2;
        context.fill();
        context.stroke();
    }
}
