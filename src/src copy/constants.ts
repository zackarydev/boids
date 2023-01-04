import { IPlayerControls, PlayerControlType, BuildingType, HexType } from './types';

export const DEBUG = false;
export const DEBUG_GRID = false;
export const DEBUG_CENTERS = false;
export const DEBUG_PATHFINDER_GOAL = false;
// export const DEBUG_LOWEST_FPS_COUNT = 5; // less than 5 fps stop.
export const EXPOSE_GAME = true;

export const DEFAULT_GAME_SCALE = 1;
export const MINIMUM_GAME_SCALE = 0.25;
export const MAXIMUM_GAME_SCALE = 4;
export const RERENDER_DELAY_ON_GAME_SCALE_CHANGE = 45; // in MS. How long to wait before re-rendering the hex grid. every second frame.
export const GAME_SCALE_CHANGE_RESISTANCE = 0.0005; // how hard is it to change the scale?

export const HEX_RADIUS = 22;
export const HEX_HEIGHT = Math.sqrt(3) * HEX_RADIUS;
export const HEX_WIDTH = 2 * HEX_RADIUS;
export const HEX_SIDE = (3 / 2) * HEX_RADIUS;
export const HEX_OBTUSE_WIDTH = Math.sqrt(HEX_RADIUS * HEX_RADIUS - (HEX_HEIGHT / 2) * (HEX_HEIGHT / 2));

export const HEX_FRICTOIN = HEX_RADIUS / 1000; // how much time (in ms) does it take to go from full velocity to no velocity.

export const CASTLE_HEX_RADIUS = 8;
export const CASTLE_HEX_HEIGHT = Math.sqrt(3) * CASTLE_HEX_RADIUS;
export const CASTLE_HEX_WIDTH = 2 * CASTLE_HEX_RADIUS;
export const CASTLE_HEX_SIDE = (3 / 2) * CASTLE_HEX_RADIUS;

export const MINE_SIZE = 12;

export const RESEARCH_SIZE = 20;
export const RESEARCH_HEIGHT = (Math.sqrt(3) / 2) * RESEARCH_SIZE;

export const INITIAL_PLAYER_HP = 20;
export const INITIAL_PLAYER_MONEY = 100;

export const PLAYER_ACCELERATION = (HEX_RADIUS * 20) / 1000 / 1000; // in pixel/ms^2. Go from 0 hexes per second to 1 hexes per second in 1 second.
export const PLAYER_VELOCITY_MAX = (HEX_RADIUS * 4) / 1000; // in pixel/ms. 1 hex per second.

export const PLAYER_SIZE = 12;
export const PLAYER_SPEED_ACCELERATION_DURATION = 1000; // ms for the player to go full speed from standing position

export const BULLET_SIZE = 5;
export const BULLET_REFRESH_DURATION = 200; //  ms before the player can fire their gun again.
export const BULLET_SPEED = HEX_RADIUS * 1.5; // pixels per second
export const BUILDING_DAMAGE_FROM_BULLET = 5; // buildings receive x health damage from a bullet hit.
export const PLAYER_DAMAGE_FROM_BULLET = 1; // buildings receive x health damage from a bullet hit.

export const COLLISION_EASING = 3; // give a few pixels of easing between 2 blocked hextype

export const HEX_PROBABILITIES = {
    [HexType.WATER]: 0.9,
    [HexType.GRASS]: 0.7,
    [HexType.SAND]: 0,
};

export const BUILDING_HEALTH = {
    [BuildingType.CASTLE]: 200,
    [BuildingType.MINE]: 50,
    [BuildingType.TURRET]: 75,
    [BuildingType.RESEARCH_LAB]: 100,
};

export const BUILDING_COST = {
    [BuildingType.CASTLE]: -1, // cannot build a new castle?
    [BuildingType.MINE]: 25,
    [BuildingType.TURRET]: 50,
    [BuildingType.RESEARCH_LAB]: 100,
};

export const PREPARE_LAND_COST = 33;
export const DESTROY_BUILDING_COST = 10;

export const MINING_DURATION = 2000; // in ms
export const MINING_AMOUNT = 1; // after each mining duration, make x dollars

export const CASTLE_REGENERATE_HEALTH_DURATION = 5000; // in ms
export const CASTLE_REGENERATE_HEALTH_AMOUNT = 5; // renegenerate x health after each duration

export const RESEARCH_DURATION = 5000; // in ms
export const RESEARCH_PER_LAB = 1; // point per research duration
export const RESEARCH_LAB_PER_PROJECTS_HINDERANCE = 0.5; // reduce efficiency of research if multiple labs are working on the same project.

export const TURRET_RADIUS = 10; // pixel radius for turret
export const TURRET_BARREL_WIDTH = 7;
export const TURRET_BARREL_HEIGHT = 5;
export const TURRET_IDLE_SPIN_DURATION = 5000; // in ms, how long does it take the barrel to spin around the turret
export const TURRET_ACTIVE_SPIN_DURATION = 1000; // in ms, how long does it take the barrel to spin around the target
export const TURRET_FIRERATE = 150; // in ms before a turret can fire again

export const PLAYER_CONTROLS: IPlayerControls = {
    UP: {
        actionType: PlayerControlType.MOVE_UP,
        keys: [38, 87], // uparrow = 38, w = 87
    },
    DOWN: {
        actionType: PlayerControlType.MOVE_DOWN,
        keys: [40, 83], // downarrow = 40, s = 83
    },
    LEFT: {
        actionType: PlayerControlType.MOVE_LEFT,
        keys: [37, 65], // uparrow = 38, a = 65
    },
    RIGHT: {
        actionType: PlayerControlType.MOVE_RIGHT,
        keys: [39, 68], // rightarrow = 39, d = 68
    },
    OPEN_MENU: {
        actionType: PlayerControlType.OPEN_MENU,
        keys: [32, 16], // spacebar = 32, 16 = shift (left or right.)
    },
};
