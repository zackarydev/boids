import { IHex } from '../Hex';
import { IHexGrid } from '../Terrain/HexGrid';

import Heap from 'heap';

type HexWithPriority = [number, IHex];

export interface IPathFinder {
    hexes: IHex[];

    hasNext(): boolean;
    next(): IHex;
    getGoal(): IHex | null;
}

export default class PathFinder implements IPathFinder {
    hexes: IHex[];

    constructor(hexGrid: IHexGrid, startHex: IHex, finalHex: IHex) {
        // TODO: Memory leak here.
        const frontier = new Heap(function (a: HexWithPriority, b: HexWithPriority) {
            return a[0] - b[0];
        });
        frontier.push([0, startHex]);

        const cameFrom = new Map();
        const costSoFar = new Map<IHex, number>();

        cameFrom.set(startHex, null);
        costSoFar.set(startHex, 0);

        while (!frontier.empty()) {
            const current: IHex = frontier.pop()[1];

            if (current === finalHex) {
                break; // we're done.
            }

            const neighbours = current.getNeighbours().filter(hexGrid._filterWATER);
            neighbours.forEach((neighbour: IHex) => {
                // @ts-ignore
                const newCost = costSoFar.get(current) + hexGrid.getMovementCost(current, neighbour);
                // @ts-ignore
                if (!costSoFar.has(neighbour) || newCost < costSoFar.get(neighbour)) {
                    costSoFar.set(neighbour, newCost);
                    const priority = newCost + finalHex.getDistanceTo(neighbour);
                    frontier.push([priority, neighbour]);
                    cameFrom.set(neighbour, current);
                }
            });
        }

        this.hexes = [];

        let previous = finalHex;
        while (previous) {
            this.hexes.push(previous);

            previous = cameFrom.get(previous);
        }

        this.hexes = this.hexes.reverse();
    }

    getGoal() {
        if (this.hasNext()) {
            return this.hexes[this.hexes.length - 1];
        }
        return null;
    }

    hasNext() {
        return this.hexes.length > 0;
    }

    next() {
        return this.hexes.splice(0, 1)[0]; // will always only delete 1 element from the start of the pathfinding
    }
}
