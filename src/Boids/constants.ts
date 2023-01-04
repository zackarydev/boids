export enum LayerIndex {
    BACKGROUND,
    BIRDS,
    TOOLS,
}

export const BIRD_COUNT = 750;

export const BIRD_WIDTH = 4;
export const BIRD_HEIGHT = 2;
export const BIRD_SPEED = 100 / 1000; // X pixels per 1000ms
export const BIRD_ACCELERATION = 1 / 1000 / 1000; // 1 pixels per second per second

export const BIRD_VISUAL_RANGE = 75;

export const MAX_BIRD_ENERGY = 500;
export const ACCELERATION_ENERGY_COST = 50 / 100; // 1 energy per 100 pixel accelaration
export const LIVING_ENERGY_COST = 10 / 1000; // 1 energy loss per second to live
export const BIRD_EATING_SPEED = 150 / 1000; // 150 energy per second can be consumed.

export const BIRD_SEPARATION_DISTANCE = 1.5 * Math.sqrt(BIRD_WIDTH * BIRD_WIDTH + BIRD_HEIGHT * BIRD_HEIGHT); // x pixels before they move apart
export const BIRD_SEPARATION_EAGERNESS = 0.1;
export const BIRD_COHESION_EAGERNESS = 0.01; // Where 0 = Not Eager. 1 = Immediate change to coalesse
export const BIRD_ALIGNMENT_EAGERNESS = 0.1; // Where 0 = Not Eager. 1 = Immediate change.

export const BIRD_COMMUNAL_LANDING_DESIRE = 1; // birds will land if they see other birds landed
export const BIRD_HUNGER_LANDING_DESIRE = 1; // birds will land if they are hungry
