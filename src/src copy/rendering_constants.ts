import { HexType } from './types';

export const HEX_STROKE_COLOR = '#000000';

export const PLAYER_ONE_COLORS = {
    strokeStyle: '#000000',
    fillStyle: '#4C4CFF',
    bulletColor: '#4C4CFF',
    buildingColor: '#4C4CFF',
};
export const PLAYER_TWO_COLORS = {
    strokeStyle: '#000000',
    fillStyle: '#62BD8D',
    bulletColor: '#62BD8D',
    buildingColor: '#62BD8D',
};

export const HUD_OVERVIEW_BAR = {
    WIDTH_OFFSET: 0.1, // percent from the edge of screen
    MONEY_WIDTH: 100,
    CASTLE_HP_WIDTH: 100,
    HP_WIDTH: 100,
    HEIGHT: 30,
    BACKGROUND_COLOR: '#333333',
    STROKE_COLOR: '#FFAE18',
    TEXT_COLOR: '#FFAE18',
    TEXT_PADDINGS: 20, // pixel between text informations
};

export const BUILD_MENU_WIDTH = 175;
export const BUILD_MENU_BUTTON_HEIGHT = 35;
export const BUILD_MENU_TITLE_HEIGHT = 25;
export const BUILD_MENU_TITLE_PADDING = 4;
export const BUILD_MENU_TEXT_PADDING = 10;
export const BUILD_MENU_BACKGROUND_COLOR = '#333333';
export const BUILD_MENU_STROKE_COLOR = '#FFAE18';
export const BUILD_MENU_TEXT_COLOR = '#FFAE18';
export const BUILD_MENU_BACKGROUND_COLOR_HOVER = '#444444';
export const BUILD_MENU_STROKE_COLOR_HOVER = '#FFCC22';
export const BUILD_MENU_TEXT_COLOR_HOVER = '#FFCC22';

export const HEX_COLORS = {
    [HexType.OCEAN]: '#086CFF',
    [HexType.WATER]: '#0AACFF',
    [HexType.SAND]: '#C2B280',
    [HexType.GRASS]: '#567D46',
    [HexType.MOUNTAIN]: '#444333',
    [HexType.MOUNTAIN_PEAK]: '#FFFFFF',
};
