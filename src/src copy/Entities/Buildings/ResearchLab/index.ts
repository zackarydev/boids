import Building, { IBuilding } from '..';
import { BuildingType } from '../../../types';
import { IGame } from '../../../Game';
import { IHex } from '../../../Hex';
import { IPlayer } from '../../Player';
import {
    RESEARCH_SIZE,
    RESEARCH_HEIGHT,
    RESEARCH_DURATION,
    RESEARCH_PER_LAB,
    RESEARCH_LAB_PER_PROJECTS_HINDERANCE,
} from '../../../constants';
import ResearchProject, { IResearchProject } from '../../../ResearchProject';

export interface IResearchBuilding extends IBuilding {
    setResearchProject(researchProject: ResearchProject): void;
}

export default class ResearchBuilding extends Building implements IResearchBuilding {
    researchProject: IResearchProject | null;

    constructor(game: IGame, hex: IHex, owner: IPlayer) {
        super(game, hex, owner, BuildingType.RESEARCH_LAB);

        this.researchProject = null;
    }

    setResearchProject(researchProject: ResearchProject) {
        this.researchProject = researchProject;
        this.researchProject.addResearchBuilding(this);
    }

    update(deltaTime: number) {
        if (!this.researchProject) {
            return;
        }
        this.refreshDuration += deltaTime;
        if (this.refreshDuration >= RESEARCH_DURATION) {
            this.refreshDuration = 0;
            this.researchProject.currentResearchPoints +=
                RESEARCH_PER_LAB * RESEARCH_LAB_PER_PROJECTS_HINDERANCE * this.researchProject.getResearchersCount() -
                1;
        }
    }

    render(context: CanvasRenderingContext2D) {
        const { x, y } = this.hex.getCenterPosition();
        context.fillStyle = this.owner.color.buildingColor;
        context.strokeStyle = '#000000';
        context.lineWidth = 1;

        context.beginPath();
        context.moveTo(x, y - (RESEARCH_HEIGHT / 2) * this.game.scale);
        context.lineTo(x + (RESEARCH_SIZE / 2) * this.game.scale, y + (RESEARCH_HEIGHT / 2) * this.game.scale);
        context.lineTo(x - (RESEARCH_SIZE / 2) * this.game.scale, y + (RESEARCH_HEIGHT / 2) * this.game.scale);
        context.closePath();
        context.fill();
        context.stroke();
    }
}
