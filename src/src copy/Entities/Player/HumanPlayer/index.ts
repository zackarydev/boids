import { Player, IPlayer } from '..';
import { IGame } from '../../../Game';
import { PLAYER_ONE_COLORS } from '../../../rendering_constants';
import { PlayerControlType, ScreenType } from '../../../types';

export interface IHumanPlayer extends IPlayer {
    handleClick(x: number, y: number): void;
}

export default class HumanPlayer extends Player implements IHumanPlayer {
    constructor(game: IGame) {
        super(game, PLAYER_ONE_COLORS);
    }

    /**
     * Handle a mouse click.
     * @param absX Pixel x on the screen
     * @param absY Pixel y on the screen
     */
    handleClick(absX: number, absY: number) {
        this.fireBullet(absX, absY);
    }

    updateMovement(deltaTime: number) {
        let xDirection = 0;
        let yDirection = 0;
        if (this.game.pressedKeys[PlayerControlType.MOVE_UP]) {
            yDirection = -1;
        }
        if (this.game.pressedKeys[PlayerControlType.MOVE_DOWN]) {
            yDirection = 1;
        }
        if (this.game.pressedKeys[PlayerControlType.MOVE_LEFT]) {
            xDirection = -1;
        }
        if (this.game.pressedKeys[PlayerControlType.MOVE_RIGHT]) {
            xDirection = 1;
        }

        const prevHex = this.updateMoveByDirection(deltaTime, xDirection, yDirection);

        if (prevHex !== this.currentHex) {
            this.game.hud.closeScreen(ScreenType.BUILD_MENU); // on move close the build menu.
        }
    }

    updateBulletClick() {
        if (this.game.mousePressed) {
            this.fireBullet(this.game.mouseLocationX, this.game.mouseLocationY);
        }
    }

    update(deltaTime: number) {
        super.update(deltaTime);

        this.updateBulletClick();
    }
}
