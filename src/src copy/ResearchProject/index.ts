import { IResearchBuilding } from '../Entities/Buildings/ResearchLab';

export interface IResearchProject {
    researchPointsRequired: number;
    currentResearchPoints: number;

    getResearchersCount(): number;
    addResearchBuilding(building: IResearchBuilding): void;
}

export default class ResearchProject implements IResearchProject {
    researchPointsRequired: number;
    currentResearchPoints: number;

    researchers: IResearchBuilding[];

    constructor() {
        this.researchPointsRequired = 100;
        this.currentResearchPoints = 0;

        this.researchers = [];
    }

    getResearchersCount() {
        return this.researchers.length;
    }

    addResearchBuilding(building: IResearchBuilding) {
        if (this.researchers.indexOf(building) !== -1) {
            return; // it was already added.
        }
        this.researchers.push(building);
    }
}
