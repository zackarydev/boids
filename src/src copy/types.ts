export interface IPoint {
    x: number;
    y: number;
}

export interface IPoint3D {
    x: number;
    y: number;
    z: number;
}

export interface IPlayerControl {
    keys: number[];
    actionType: PlayerControlType;
}

export interface IPlayerControls {
    [x: string]: IPlayerControl;
}

export interface IPlayerColor {
    strokeStyle: string;
    fillStyle: string;

    bulletColor: string;
    buildingColor: string;
}

export enum LayerIndex {
    HEX_GRID = 0,
    BUILDING = 1,
    PLAYER = 2,
    STATIC_HUD = 9,
    HUD = 10,
}

export enum PlayerControlType {
    MOVE_UP,
    MOVE_DOWN,
    MOVE_LEFT,
    MOVE_RIGHT,
    OPEN_MENU,
}

export enum BiomeType {
    OCEAN,
    FLATLANDS,
    MOUNTAINOUS,
}

export enum HexType {
    OCEAN,
    WATER,
    SAND,
    GRASS,
    MOUNTAIN,
    MOUNTAIN_PEAK,
}

export enum BuildingType {
    CASTLE,
    TURRET,
    MINE,
    RESEARCH_LAB,
}

export enum ScreenType {
    SPLASH_SCREEN,
    BUILD_MENU,
    TECH_MENU,
}

export type RandomNumberGeneratorFunction = () => number;
