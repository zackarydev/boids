import Building, { IBuilding } from '..';
import { BuildingType } from '../../../types';
import { IGame } from '../../../Game';
import { IHex } from '../../../Hex';
import { IPlayer } from '../../Player';
import {
    TURRET_RADIUS,
    TURRET_FIRERATE,
    TURRET_BARREL_WIDTH,
    TURRET_BARREL_HEIGHT,
    TURRET_IDLE_SPIN_DURATION,
} from '../../../constants';
import { angleToRad, angleBetweenVectors, radToAngle } from '../../../utils';
import { TWO_PI } from '../../../math_constants';

export interface ITurretBuilding extends IBuilding {}

export default class TurretBuilding extends Building implements ITurretBuilding {
    firingAngle: number;
    shouldFire: boolean;

    target: IPlayer | null;
    targetAcquired: boolean;

    constructor(game: IGame, hex: IHex, owner: IPlayer) {
        super(game, hex, owner, BuildingType.TURRET);

        this.firingAngle = 0;
        this.target = null;
        this.targetAcquired = false;
        this.shouldFire = false;
    }

    updateScale() {}

    fire() {}

    idle(deltaTime: number) {
        this.firingAngle += (360 / TURRET_IDLE_SPIN_DURATION) * deltaTime;
        this.firingAngle %= 360;
    }

    setTarget(target: IPlayer) {
        this.target = target;
        this.targetAcquired = true;
        this.shouldFire = true;
    }

    loseTarget() {
        this.target = null;
        this.targetAcquired = false;
        this.shouldFire = false;
    }

    update(deltaTime: number) {
        if (this.targetAcquired && this.target) {
            const { x, y } = this.hex.getCenterPosition();
            const rads = angleBetweenVectors(x, y, this.target.position.x, this.target.position.y);
            const newFiringAngle = radToAngle(rads);

            this.firingAngle = newFiringAngle;
        }

        if (this.shouldFire) {
            this.refreshDuration += deltaTime;
            if (this.refreshDuration >= TURRET_FIRERATE) {
                this.refreshDuration = 0;
                this.fire();
            }
        } else {
            this.idle(deltaTime);
        }
    }

    renderBuilding(context: CanvasRenderingContext2D) {
        const { x, y } = this.hex.getCenterPosition();
        context.fillStyle = this.owner.color.buildingColor;
        context.strokeStyle = '#000000';
        context.lineWidth = 1;

        context.beginPath();
        context.arc(x, y, TURRET_RADIUS * this.game.scale, 0, TWO_PI);
        context.fill();
        context.closePath();
        context.stroke();
    }

    render(context: CanvasRenderingContext2D) {
        const { x, y } = this.hex.getCenterPosition();

        context.fillStyle = this.owner.color.buildingColor;
        context.strokeStyle = '#000000';
        context.lineWidth = 1;

        // draw the barrel
        const rad = angleToRad(this.firingAngle);
        const bx = x + Math.cos(rad) * TURRET_RADIUS * this.game.scale;
        const by = y + Math.sin(rad) * TURRET_RADIUS * this.game.scale;

        const centerX = bx;
        const centerY = by;

        context.translate(centerX, centerY); // move to the center of the turret
        context.rotate(rad);
        context.translate(-centerX, -centerY);

        // console.log(bx, by, rad, this.firingAngle);
        context.beginPath();
        context.rect(
            bx - (TURRET_BARREL_WIDTH / 2) * this.game.scale,
            by - (TURRET_BARREL_HEIGHT / 2) * this.game.scale,
            TURRET_BARREL_WIDTH * this.game.scale,
            TURRET_BARREL_HEIGHT * this.game.scale,
        );
        context.closePath();
        context.fill();
        context.stroke();

        context.translate(centerX, centerY); // move to the center of the turret
        context.rotate(-rad);
        context.translate(-centerX, -centerY);
    }
}
