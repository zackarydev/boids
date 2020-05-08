
export const BIRD_COUNT = 500;

export const BIRD_WIDTH = 4;
export const BIRD_HEIGHT = 2;
export const BIRD_SPEED = 40 / 1000; // 660 pixels per 1000ms
export const BIRD_VISUAL_RANGE = 150;
export const BIRD_RETURN_VELOCITY = 0;

export const BIRD_COHESION_RESISTANCE = 1;
export const BIRD_SEPARATION_DISTANCE = 1.5*Math.sqrt(BIRD_WIDTH*BIRD_WIDTH + BIRD_HEIGHT*BIRD_HEIGHT); // x pixels before they move apart
export const BIRD_SEPARATION_RESISTANCE = 1;
export const BIRD_ALIGNMENT_EAGERNESS = 4; // where higher numbers = less eager.

export const SIGHT_ANGLE = Math.PI*0.5; // Almost 180 degree vision per eye.
export const SIGHT_RANGE = 50; // 50 pixels

export enum LayerIndex {
    BACKGROUND,
    BIRDS
};