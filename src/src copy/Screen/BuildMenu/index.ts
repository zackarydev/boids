import {
    BUILD_MENU_WIDTH,
    BUILD_MENU_BUTTON_HEIGHT,
    BUILD_MENU_TITLE_HEIGHT,
    BUILD_MENU_TITLE_PADDING,
} from '../../rendering_constants';
import Screen from '../';
import MenuButton from '../MenuButton';
import { ScreenType, HexType, BuildingType } from '../../types';
import { IGame } from '../../Game';
import { PREPARE_LAND_COST, BUILDING_COST, DESTROY_BUILDING_COST } from '../../constants';
import MenuTitle from '../MenuTitle';

export default class BuildMenu extends Screen {
    game: IGame;

    constructor(game: IGame, x: number, y: number) {
        super(ScreenType.BUILD_MENU, x, y, BUILD_MENU_WIDTH, 0, game.hud.closeScreen.bind(game.hud)); // height will be fixed after all elements are added to the menu.
        this.game = game;

        const playerHex = game.player.currentHex;
        if (!playerHex) {
            this.destroy();
            return; // nothing on this screen.
        }

        let height = 0;
        this.addScreenElement(
            new MenuTitle(x, y + height, BUILD_MENU_WIDTH, BUILD_MENU_TITLE_HEIGHT, `Buildings and Upgrades`),
        );
        height += BUILD_MENU_TITLE_HEIGHT + BUILD_MENU_TITLE_PADDING;

        if (playerHex.hexType === HexType.SAND) {
            this.addScreenElement(
                new MenuButton(
                    x,
                    y + height,
                    BUILD_MENU_WIDTH,
                    BUILD_MENU_BUTTON_HEIGHT,
                    `Prepare Land ($${PREPARE_LAND_COST})`,
                    this.prepareLand.bind(this),
                ),
            );
            height += BUILD_MENU_BUTTON_HEIGHT;
        }

        if (playerHex.hexType === HexType.GRASS && !playerHex.building) {
            this.addScreenElement(
                new MenuButton(
                    x,
                    y + height,
                    BUILD_MENU_WIDTH,
                    BUILD_MENU_BUTTON_HEIGHT,
                    `Build Mine ($${BUILDING_COST[BuildingType.MINE]})`,
                    this.buildMine.bind(this),
                ),
            );
            height += BUILD_MENU_BUTTON_HEIGHT;

            this.addScreenElement(
                new MenuButton(
                    x,
                    y + height,
                    BUILD_MENU_WIDTH,
                    BUILD_MENU_BUTTON_HEIGHT,
                    `Build Research Lab ($${BUILDING_COST[BuildingType.RESEARCH_LAB]})`,
                    this.buildResearchLab.bind(this),
                ),
            );
            height += BUILD_MENU_BUTTON_HEIGHT;

            this.addScreenElement(
                new MenuButton(
                    x,
                    y + height,
                    BUILD_MENU_WIDTH,
                    BUILD_MENU_BUTTON_HEIGHT,
                    `Build Turret ($${BUILDING_COST[BuildingType.TURRET]})`,
                    this.buildTurret.bind(this),
                ),
            );
            height += BUILD_MENU_BUTTON_HEIGHT;
        }

        if (
            playerHex.building &&
            playerHex.building.buildingType !== BuildingType.CASTLE &&
            playerHex.building.owner === game.player
        ) {
            this.addScreenElement(
                new MenuButton(
                    x,
                    y + height,
                    BUILD_MENU_WIDTH,
                    BUILD_MENU_BUTTON_HEIGHT,
                    `Destroy Building ($${DESTROY_BUILDING_COST})`,
                    this.destroyBuilding.bind(this),
                ),
            );
            height += BUILD_MENU_BUTTON_HEIGHT;
        }

        if (
            playerHex.building &&
            playerHex.building.buildingType === BuildingType.CASTLE &&
            playerHex.building.owner === game.player
        ) {
            this.addScreenElement(
                new MenuButton(
                    x,
                    y + height,
                    BUILD_MENU_WIDTH,
                    BUILD_MENU_BUTTON_HEIGHT,
                    `Upgrade Castle Walls ($${0})`,
                    this.upgradeCastle.bind(this),
                ),
            );
            height += BUILD_MENU_BUTTON_HEIGHT;
        }

        this.height = height;
    }

    prepareLand() {
        this.game.player.prepareLand();
        this.destroy();
    }

    buildMine() {
        this.game.player.buildMine();
        this.destroy();
    }

    buildResearchLab() {
        this.game.player.buildResearchLab();
        this.destroy();
    }

    buildTurret() {
        this.game.player.buildTurret();
        this.destroy();
    }

    upgradeCastle() {
        console.log('Upgrade castle');
        this.destroy();
    }

    destroyBuilding() {
        this.game.player.destroyBuilding();
        this.destroy();
    }

    update(_: number) {}

    render(context: CanvasRenderingContext2D) {
        this.elements.forEach((button) => button.render(context));
    }
}
