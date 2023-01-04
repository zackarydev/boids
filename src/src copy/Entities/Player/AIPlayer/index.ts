import { Player, IPlayer } from '..';
import { IGame } from '../../../Game';
import { PLAYER_TWO_COLORS } from '../../../rendering_constants';
import { IHex } from '../../../Hex';
import { angleBetweenVectors, distance } from '../../../utils';
import { IPoint } from '../../../types';
import PathFinder, { IPathFinder } from '../../../PathFinder';
import AIBrain, { IAIBrain } from './AIBrain';
import { DEBUG_PATHFINDER_GOAL } from '../../../constants';

export interface IAIPlayer extends IPlayer {
    setIdle(): void;
    setAttackPlayer(): void;
    setStalkPlayer(): void;
}

export default class AIPlayer extends Player implements IAIPlayer {
    targetDestination: IPoint | null;
    moveDirectionX: number;
    moveDirectionY: number;

    pathFinder: IPathFinder | null;
    pathFinderGoal: IHex | null;

    attackPlayer: boolean; // will the AI fire at the player?
    stalkPlayer: boolean; // will the AI follow the player?

    brain: IAIBrain;

    constructor(game: IGame) {
        super(game, PLAYER_TWO_COLORS);

        this.targetDestination = null;
        this.moveDirectionX = 0;
        this.moveDirectionY = 0;

        this.pathFinder = null;
        this.pathFinderGoal = null;

        this.stalkPlayer = false;
        this.attackPlayer = false;

        this.brain = new AIBrain(this);
    }

    teleportToHex(hex: IHex) {
        super.teleportToHex(hex);

        if (this.pathFinder && this.pathFinderGoal) {
            this.setTargetDestination(this.pathFinderGoal);
        }
    }

    setTargetDestination(hex: IHex) {
        if (!this.currentHex) {
            throw new Error('Cannot set target destination if no current hex.');
        }
        this.pathFinder = new PathFinder(this.game.terrain, this.currentHex, hex);

        if (!this.pathFinder.hasNext()) {
            console.log('Path finder failed to find path.');
            return;
        }

        this.pathFinderGoal = this.pathFinder.getGoal();
        let next = this.pathFinder.next();
        if (next === this.currentHex && this.pathFinder.hasNext()) {
            next = this.pathFinder.next();
        }
        this.moveTowards(next);
    }

    setAttackPlayer() {
        this.attackPlayer = true;
    }

    setStalkPlayer() {
        this.stalkPlayer = true;
        this.attackPlayer = true;
    }

    setIdle() {
        this.attackPlayer = false;
        this.stalkPlayer = false;

        this.targetDestination = null;
        this.moveDirectionX = 0;
        this.moveDirectionY = 0;

        this.pathFinder = null;
        this.pathFinderGoal = null;

        this.setTargetDestination(this.game.terrain.getRandomHex());
    }

    moveTowards(hex: IHex) {
        this.targetDestination = hex.getCenterPosition();
        const angle = angleBetweenVectors(
            this.position.x,
            this.position.y,
            this.targetDestination.x,
            this.targetDestination.y,
        );
        this.moveDirectionX = Math.cos(angle);
        this.moveDirectionY = Math.sin(angle);
    }

    hasReachedDestination() {
        if (!this.targetDestination) {
            console.log('reached destination bc no destination');
            return true; // if I have no destination, then I have reached my destination.
        }
        // if the next tick will make our distance further than our target, then stop now.
        return (
            distance(this.position.x, this.position.y, this.targetDestination.x, this.targetDestination.y) < this.speed
        );
    }

    hasNextDestination() {
        return this.pathFinder && this.pathFinder.hasNext();
    }

    getNextDestination() {
        if (this.pathFinder) {
            return this.pathFinder.next();
        }
        return null;
    }

    updateStalkPlayer() {
        if (!this.game.player.currentHex) {
            throw new Error('Cannot stalk player since player has no current hex.');
        }

        this.setTargetDestination(this.game.player.currentHex);
    }

    updateMovement(deltaTime: number) {
        // do not do the super.
        if (this.targetDestination) {
            if (this.hasReachedDestination()) {
                if (this.hasNextDestination()) {
                    const hex = this.getNextDestination();
                    if (hex) {
                        this.moveTowards(hex);
                    } else {
                        this.setIdle();
                    }
                } else {
                    this.setIdle();
                }
            } else {
                this.updateMoveByDirection(deltaTime, this.moveDirectionX, this.moveDirectionY);
            }
        }
    }

    update(deltaTime: number) {
        super.update(deltaTime);

        this.brain.update();

        if (this.stalkPlayer) {
            if (this.pathFinderGoal !== this.game.player.currentHex) {
                this.updateStalkPlayer();
            }
        }

        if (this.attackPlayer) {
            this.fireBullet(this.game.player.position.x, this.game.player.position.y);
        }
    }

    render(context: CanvasRenderingContext2D) {
        if (DEBUG_PATHFINDER_GOAL) {
            if (this.pathFinder) {
                const length = this.pathFinder.hexes.length;
                this.pathFinder.hexes.forEach((hex, index: number) => {
                    const { x, y } = hex.getCenterPosition();

                    context.strokeStyle = 'red';
                    if (index === length - 1) {
                        context.strokeStyle = 'green';
                    }

                    context.beginPath();
                    const thickness = 5;
                    const sides = 10;
                    context.moveTo(x - thickness / 2 - sides / 2 - thickness, y - thickness / 2 - sides / 2);
                    context.lineTo(x - thickness / 2 - sides / 2, y - thickness / 2 - sides / 2 - thickness);
                    context.lineTo(x, y - thickness / 2);

                    context.lineTo(x + sides / 2 + thickness / 2, y - thickness / 2 - sides / 2 - thickness);
                    context.lineTo(x + sides / 2 + thickness / 2 + thickness, y - thickness / 2 - sides / 2);
                    context.lineTo(x + thickness / 2, y);

                    context.lineTo(x + sides / 2 + thickness / 2 + thickness, y + thickness / 2 + sides / 2);
                    context.lineTo(x + sides / 2 + thickness / 2, y + thickness / 2 + sides / 2 + thickness);
                    context.lineTo(x, y + thickness / 2);

                    context.lineTo(x - thickness / 2 - sides / 2, y + thickness / 2 + sides / 2 + thickness);
                    context.lineTo(x - thickness / 2 - sides / 2 - thickness, y + thickness / 2 + sides / 2);
                    context.lineTo(x - thickness / 2, y);

                    context.closePath();
                    context.stroke();
                });
            }
        }

        super.render(context);
    }
}
