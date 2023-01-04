import HexGrid, { IHexGrid } from './HexGrid';
import { IGame } from '../Game';
import { HEX_PROBABILITIES } from '../constants';
import { HexType } from '../types';
import Hex from '../Hex';

export interface ITerrain extends IHexGrid {}

export default class Terrain extends HexGrid implements ITerrain {
    constructor(game: IGame) {
        super(game);
    }

    initHexes() {
        let currentHexType = HexType.WATER;

        const flatHexes = [];
        const hexes = [];
        for (let col = 0; col < this.hexGridWidth; col++) {
            const rowHexes = [];
            for (let row = 0; row < this.hexGridHeight; row++) {
                //Is this the boarder of the game space
                if (col === 0 || col === this.hexGridWidth - 1 || row === 0 || row === this.hexGridHeight - 1) {
                    currentHexType = HexType.WATER;
                } else {
                    const _random = Math.random();
                    for (let entry in Object.entries(HEX_PROBABILITIES)) {
                        let type = Number(entry[0]);
                        // @ts-ignore
                        let value = HEX_PROBABILITIES[type];
                        if (_random > value) {
                            currentHexType = type;
                        }
                    }
                }

                const hex = new Hex(this, col, row, currentHexType);
                rowHexes.push(hex);
                flatHexes.push(hex);
            }
            hexes.push(rowHexes);
        }

        this.setHexes(hexes, flatHexes);
    }
}
