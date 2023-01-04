import { IRenderingLayer, IEntity } from '@zacktherrien/typescript-render-engine';

import { IPlayer } from '../Player';
import { angleBetweenVectors, distance } from '../../utils';
import { HexType } from '../../types';
import { BULLET_SIZE, BULLET_SPEED, PLAYER_SIZE } from '../../constants';
import { IGame } from '../../Game';
import { TWO_PI } from '../../math_constants';

export interface IBullet extends IEntity {}

export class Bullet implements IBullet {
    x: number;
    y: number;
    radians: number;
    dx: number;
    dy: number;
    size: number;

    drawX: number;
    drawY: number;

    game: IGame;
    owner: IPlayer;
    layer: IRenderingLayer;

    constructor(
        game: IGame,
        startX: number,
        startY: number,
        endX: number,
        endY: number,
        owner: IPlayer,
        layer: IRenderingLayer,
    ) {
        this.game = game;
        this.layer = layer;
        this.owner = owner;

        this.size = BULLET_SIZE * game.scale;

        const radians = angleBetweenVectors(startX, startY, endX, endY);

        this.radians = radians;
        this.dx = Math.cos(radians);
        this.dy = Math.sin(radians);
        this.x = owner.position.x + (this.dx * owner.size) / 2;
        this.y = owner.position.y + (this.dy * owner.size) / 2;

        this.drawX = this.x * game.scale;
        this.drawY = this.y * game.scale;
    }

    updateScale(scale: number) {
        this.size = BULLET_SIZE * scale;
        this.drawX = this.x * scale;
        this.drawY = this.y * scale;
    }

    checkCollisions() {
        const hex = this.game.terrain.getHexAtPosition(this.x, this.y);
        if (!hex) {
            this.destroy();
            return;
        }

        if (hex.building && hex.building.owner !== this.owner) {
            hex.building.receiveHitByBullet();
            this.destroy();
            return;
        }

        const enemy = this.game.getOppositePlayer(this.owner);
        if (!enemy) {
            return;
        }
        if (distance(this.x, this.y, enemy.position.x, enemy.position.y) < BULLET_SIZE / 2 + PLAYER_SIZE / 2) {
            enemy.receiveHitByBullet();
            this.destroy();
            return;
        }

        if (hex.hexType === HexType.WATER) {
            this.destroy();
            return;
        }
    }

    destroy() {
        // @ts-ignore
        this.radians = null;
        // @ts-ignore
        this.dx = null;
        // @ts-ignore
        this.dy = null;
        // @ts-ignore
        this.x = null;
        // @ts-ignore
        this.y = null;
        // @ts-ignore
        this.game = null;
        // @ts-ignore
        this.owner = null;
        this.layer.removeEntity(this);
        // @ts-ignore
        this.layer = null;
    }

    update(deltaTime: number) {
        this.x += (this.dx * BULLET_SPEED) / deltaTime;
        this.y += (this.dy * BULLET_SPEED) / deltaTime;

        this.drawX = this.x * this.game.scale;
        this.drawY = this.y * this.game.scale;

        this.checkCollisions();
    }

    render(context: CanvasRenderingContext2D) {
        context.fillStyle = this.owner.color.bulletColor;
        context.beginPath();
        context.arc(this.drawX, this.drawY, this.size, 0, TWO_PI);
        context.closePath();
        context.fill();
        context.stroke();
    }
}
