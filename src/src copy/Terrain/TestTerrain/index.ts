import { IGame } from '../../Game';
import Terrain, { ITerrain } from '..';
import { HexType } from '../../types';
import Hex from '../../Hex';
// import Building from "../../Entities/Buildings";
// import Builder from "../../Builder";
// import CastleBuilding from "../../Entities/Buildings/Castle";
// import TurretBuilding from "../../Entities/Buildings/Turret";
// import MineBuilding from "../../Entities/Buildings/Mine";
// import ResearchBuilding from "../../Entities/Buildings/ResearchLab";

export interface ITestTerrain extends ITerrain {}

export default class TestTerrain extends Terrain implements ITestTerrain {
    constructor(game: IGame) {
        super(game);
        this.initHexes();
    }

    initHexes() {
        let currentHexType = HexType.WATER;

        // const showBuildingsAt = Math.floor((this.hexGridWidth/2 - BuildingType.RESEARCH_LAB/2));

        const flatHexes = [];
        const hexes = [];
        for (let col = 0; col < this.hexGridWidth; col++) {
            const rowHexes = [];
            for (let row = 0; row < this.hexGridHeight; row++) {
                if (row <= HexType.MOUNTAIN_PEAK) {
                    currentHexType = row;
                }

                if (row === HexType.MOUNTAIN_PEAK + 1) {
                    continue; // no hex on this row.
                }

                if (row > HexType.MOUNTAIN_PEAK + 2) {
                    break; // no more rows.
                }

                const hex = new Hex(this, col, row, currentHexType);

                // if(row === HexType.MOUNTAIN_PEAK + 2) {
                //     // add buildings.

                //     if(col >= showBuildingsAt && col < showBuildingsAt + BuildingType.RESEARCH_LAB) {
                //         const buildingIndex = col - showBuildingsAt;
                //         switch(buildingIndex) {
                //             case BuildingType.CASTLE:
                //                 this.game.builder.addBuilding(new CastleBuilding(this.game, hex, this.game.player));
                //                 break;
                //             case BuildingType.TURRET:
                //                 this.game.builder.addBuilding(new TurretBuilding(this.game, hex, this.game.player));
                //                 break;
                //             case BuildingType.MINE:
                //                 this.game.builder.addBuilding(new MineBuilding(this.game, hex, this.game.player));
                //                 break;
                //             case BuildingType.RESEARCH_LAB:
                //                 this.game.builder.addBuilding(new ResearchBuilding(this.game, hex, this.game.player));
                //                 break;
                //             default:
                //                 throw new Error(`Unknown building type: ${buildingIndex}`);
                //         }
                //     }
                // }

                rowHexes.push(hex);
                flatHexes.push(hex);
            }
            hexes.push(rowHexes);
        }

        this.setHexes(hexes, flatHexes);
    }
}
