export enum LayerIndex {
    BACKGROUND,
    BIRDS
};

export const BIRD_COUNT = 500;

export const BIRD_WIDTH = 4;
export const BIRD_HEIGHT = 2;
export const BIRD_SPEED = 100 / 1000; // 60 pixels per 1000ms

export const BIRD_VISUAL_RANGE = 75;
export const BIRD_RETURN_VELOCITY = 0;

export const BIRD_SEPARATION_DISTANCE = 2*Math.sqrt(BIRD_WIDTH*BIRD_WIDTH + BIRD_HEIGHT*BIRD_HEIGHT); // x pixels before they move apart
export const BIRD_SEPARATION_EAGERNESS = 0.2;
export const BIRD_COHESION_EAGERNESS = 0.01; // Where 0 = Not Eager. 1 = Immediate change to coalesse
export const BIRD_ALIGNMENT_EAGERNESS = 0.1; // Where 0 = Not Eager. 1 = Immediate change.

export const SIGHT_ANGLE = Math.PI*0.5; // Almost 180 degree vision per eye.
export const SIGHT_RANGE = 50; // 50 pixels

export enum LayerIndex {
    BACKGROUND,
    BIRDS
};