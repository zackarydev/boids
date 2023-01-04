import { IEntity, LayerType, IRenderingLayer } from '@zacktherrien/typescript-render-engine';

import { IGame } from '../../Game';
import { LayerIndex, IPlayerColor, HexType, BuildingType, IPoint } from '../../types';
import {
    INITIAL_PLAYER_HP,
    INITIAL_PLAYER_MONEY,
    PLAYER_SIZE,
    HEX_RADIUS,
    COLLISION_EASING,
    BULLET_REFRESH_DURATION,
    PREPARE_LAND_COST,
    BUILDING_COST,
    DESTROY_BUILDING_COST,
    DEBUG_CENTERS,
    PLAYER_DAMAGE_FROM_BULLET,
    PLAYER_VELOCITY_MAX,
    PLAYER_ACCELERATION,
    HEX_FRICTOIN,
} from '../../constants';
import { PLAYER_ONE_COLORS } from '../../rendering_constants';
import { IHex } from '../../Hex';
import { distance, clamp, magnitude } from '../../utils';
import { Bullet } from '../../Entities/Bullet';
import { IBuilding } from '../../Entities/Buildings';
import MineBuilding from '../../Entities/Buildings/Mine';
import TurretBuilding from '../../Entities/Buildings/Turret';
import ResearchBuilding from '../../Entities/Buildings/ResearchLab';
import { TWO_PI } from '../../math_constants';

export interface IPlayer extends IEntity {
    position: IPoint;
    velocity: IPoint;
    acceleration: IPoint;

    health: number;
    size: number;
    color: IPlayerColor;
    game: IGame;
    money: number;
    castle: IBuilding | null;
    currentHex: IHex | null;
    previousHex: IHex | null;

    receiveHitByBullet(): void;
    setCastle(building: IBuilding): void;
    teleportToHex(hex: IHex): void;

    prepareLand(): void;
    buildMine(): void;
    buildResearchLab(): void;
    buildTurret(): void;
    destroyBuilding(): void;
}

export abstract class Player implements IPlayer {
    game: IGame;
    layer: IRenderingLayer;

    drawPosition: IPoint;
    position: IPoint;
    velocity: IPoint;
    acceleration: IPoint;

    speed: number;
    health: number;
    size: number;
    money: number;
    color: IPlayerColor;
    castle: IBuilding | null;

    bulletRefreshDuration: number;
    currentHex: IHex | null;
    previousHex: IHex | null;

    constructor(game: IGame, color = PLAYER_ONE_COLORS) {
        this.game = game;
        const layer = this.game.engine.getLayer(LayerIndex.PLAYER, LayerType.DYNAMIC);
        if (!layer) {
            throw new Error('Player layer not initialized...');
        }
        layer.addEntity(this);
        this.layer = layer;

        this.drawPosition = {
            x: 0,
            y: 0,
        };

        this.position = {
            x: 0,
            y: 0,
        };
        this.velocity = {
            x: 0,
            y: 0,
        };
        this.acceleration = {
            x: 0,
            y: 0,
        };

        this.speed = 0; // player is standing still and is not moving.
        this.color = color;
        this.size = PLAYER_SIZE;
        this.health = INITIAL_PLAYER_HP;
        this.money = INITIAL_PLAYER_MONEY;
        this.castle = this.game.builder.createCastle(this);

        this.bulletRefreshDuration = 0;
        this.currentHex = this.game.terrain.getHexAtPosition(this.position.x, this.position.y);
        this.previousHex = this.currentHex;
    }

    updateScale(scale: number) {
        this.size = PLAYER_SIZE * scale;
        // console.log('p size: ', this.size, sizeDelta);
        // this.size = clamp(this.size, PLAYER_SIZE*MINIMUM_GAME_SCALE, PLAYER_SIZE*MAXIMUM_GAME_SCALE);

        // console.log(scaleDelta, this.position.x, this.position.x + this.position.x*scaleDelta);

        // Reposition player.
        this.drawPosition.x = this.position.x * scale;
        this.drawPosition.y = this.position.y * scale;
    }

    setCastle(castle: IBuilding) {
        this.castle = castle;
    }

    teleportToHex(hex: IHex) {
        const centerPos = hex.getCenterPosition();
        this.position.x = centerPos.x / this.game.scale;
        this.position.y = centerPos.y / this.game.scale;
        this.drawPosition.x = centerPos.x;
        this.drawPosition.y = centerPos.y;
        this.currentHex = hex;
    }

    receiveHitByBullet() {
        this.health -= PLAYER_DAMAGE_FROM_BULLET;
        if (this.health <= 0) {
            this.game.gameOver(this);
        }
    }

    prepareLand() {
        if (!this.currentHex) {
            throw new Error('Not on a hex.');
        }
        if (this.currentHex.hexType !== HexType.SAND) {
            return;
        }
        if (this.money < PREPARE_LAND_COST) {
            return;
        }
        this.money -= PREPARE_LAND_COST;
        this.currentHex.setType(HexType.GRASS);
    }

    buildMine() {
        if (!this.currentHex) {
            throw new Error('Not on a hex.');
        }
        if (this.currentHex.hexType !== HexType.GRASS) {
            return;
        }
        if (this.currentHex.building) {
            return; // if the hex already has a building do not allow to build another.
        }
        if (this.money < BUILDING_COST[BuildingType.MINE]) {
            return;
        }
        this.money -= BUILDING_COST[BuildingType.MINE];
        this.game.builder.addBuilding(new MineBuilding(this.game, this.currentHex, this));
    }

    buildResearchLab() {
        if (!this.currentHex) {
            throw new Error('Not on a hex.');
        }
        if (this.currentHex.hexType !== HexType.GRASS) {
            return;
        }
        if (this.currentHex.building) {
            return; // if the hex already has a building do not allow to build another.
        }
        if (this.money < BUILDING_COST[BuildingType.RESEARCH_LAB]) {
            return;
        }
        this.money -= BUILDING_COST[BuildingType.RESEARCH_LAB];
        this.game.builder.addBuilding(new ResearchBuilding(this.game, this.currentHex, this));
    }

    buildTurret() {
        if (!this.currentHex) {
            throw new Error('Not on a hex.');
        }
        if (this.currentHex.hexType !== HexType.GRASS) {
            return;
        }
        if (this.currentHex.building) {
            return; // if the hex already has a building do not allow to build another.
        }
        if (this.money < BUILDING_COST[BuildingType.TURRET]) {
            return;
        }
        this.money -= BUILDING_COST[BuildingType.TURRET];
        this.game.builder.addBuilding(new TurretBuilding(this.game, this.currentHex, this));
    }

    destroyBuilding() {
        if (!this.currentHex) {
            throw new Error('Not on a hex.');
        }
        if (this.currentHex.hexType !== HexType.GRASS) {
            return;
        }
        if (!this.currentHex.building) {
            return; // if there are no buildings on this hex return.
        }
        if (this.money < DESTROY_BUILDING_COST) {
            return;
        }
        this.money -= DESTROY_BUILDING_COST;
        this.game.builder.destroyBuilding(this.currentHex.building);
    }

    /**
     * Handle a mouse click.
     * @param absX Pixel x on the screen
     * @param absY Pixel y on the screen
     */
    fireBullet(absX: number, absY: number) {
        if (this.bulletRefreshDuration <= 0) {
            //We need greater than because current refresh is not int, but double.
            this.layer.addEntity(
                new Bullet(this.game, this.drawPosition.x, this.drawPosition.y, absX, absY, this, this.layer),
            );
            this.bulletRefreshDuration = BULLET_REFRESH_DURATION;
        }
    }

    updateBulletRefresh(deltaTime: number) {
        if (this.bulletRefreshDuration > 0) {
            this.bulletRefreshDuration -= deltaTime;
        }
    }

    /**
     * Check whether the player collided with anything, and whether they can keep
     * going in that direction.
     *
     * @param moveX Number of pixels the user moved in the last update
     * @param moveY Number of pixels the user moved in the last update
     */
    checkCollisions(moveX: number, moveY: number) {
        const hex = this.game.terrain.getHexAtPosition(this.position.x, this.position.y);
        if (!hex) {
            throw new Error('Player is not in a hex?');
        }
        this.previousHex = this.currentHex;
        this.currentHex = hex;

        if (hex.hexType === HexType.WATER) {
            // undo the move if it is a blocked hex.
            this.position.x -= moveX;
            this.position.y -= moveY;
            this.velocity.x = 0;
            this.velocity.y = 0;
            return; // no need to check for neighbouring hexes.
        }

        const hexes = this.game.terrain.getNeighbouringHexes(hex); // get the 6 potential neighbour hexes
        const collidingHex = hexes.find((neighbourHex: IHex) => {
            if (neighbourHex.hexType !== HexType.WATER) {
                return false;
            }

            // get the distance:
            const absHexPos = neighbourHex.getCenterPosition();
            const dist = distance(absHexPos.x, absHexPos.y, this.drawPosition.x, this.drawPosition.y);
            return dist < HEX_RADIUS * this.game.scale + this.size - COLLISION_EASING;
        });

        if (collidingHex) {
            // undo the move if it is a blocked hex.
            this.position.x -= moveX;
            this.position.y -= moveY;
            this.velocity.x = 0;
            this.velocity.y = 0;
            return; // no need to check for neighbouring hexes.
        }
    }

    updateMoveByDirection(deltaTime: number, xDirection: number, yDirection: number): IHex | null {
        // if the player did not move, reset the speed and acceleration duration

        this.acceleration.x = xDirection * PLAYER_ACCELERATION;
        this.acceleration.y = yDirection * PLAYER_ACCELERATION;

        if (xDirection === 0) {
            if (this.velocity.x > 0) {
                this.velocity.x = Math.max(this.velocity.x - HEX_FRICTOIN * deltaTime, 0);
            } else if (this.velocity.x < 0) {
                this.velocity.x = Math.min(this.velocity.x + HEX_FRICTOIN * deltaTime, 0);
            }
        } else {
            this.velocity.x = clamp(
                this.velocity.x + this.acceleration.x * deltaTime,
                -PLAYER_VELOCITY_MAX,
                PLAYER_VELOCITY_MAX,
            );
        }

        if (yDirection === 0) {
            if (this.velocity.y > 0) {
                this.velocity.y = Math.max(this.velocity.y - HEX_FRICTOIN * deltaTime, 0);
            } else if (this.velocity.y < 0) {
                this.velocity.y = Math.min(this.velocity.y + HEX_FRICTOIN * deltaTime, 0);
            }
        } else {
            this.velocity.y = clamp(
                this.velocity.y + this.acceleration.y * deltaTime,
                -PLAYER_VELOCITY_MAX,
                PLAYER_VELOCITY_MAX,
            );
        }

        let moveX: number | null = this.velocity.x * deltaTime;
        let moveY: number | null = this.velocity.y * deltaTime;

        let totalVelocity: number | null = magnitude(moveX, moveY);
        if (totalVelocity > 0) {
            moveX = moveX / totalVelocity;
            moveY = moveY / totalVelocity;
        } else {
            moveX = 0;
            moveY = 0;
        }

        this.position.x += moveX;
        this.position.y += moveY;

        const prevHex = this.currentHex;
        this.checkCollisions(moveX, moveY);
        this.drawPosition.x = this.position.x * this.game.scale;
        this.drawPosition.y = this.position.y * this.game.scale;
        moveX = null;
        moveY = null;
        totalVelocity = null;
        return prevHex;
    }

    abstract updateMovement(deltaTime: number): void;

    update(deltaTime: number) {
        this.updateMovement(deltaTime);
        this.updateBulletRefresh(deltaTime);
    }

    render(context: CanvasRenderingContext2D) {
        context.strokeStyle = this.color.strokeStyle;
        context.fillStyle = this.color.fillStyle;
        context.lineWidth = 1;

        context.beginPath();
        context.arc(this.drawPosition.x, this.drawPosition.y, this.size, 0, TWO_PI);
        context.fill();
        context.closePath();
        context.stroke();

        if (DEBUG_CENTERS) {
            context.font = '8px';
            context.fillStyle = '#000';
            context.fillRect(this.drawPosition.x - 2, this.drawPosition.y - 2, 4, 4);
        }
    }
}
