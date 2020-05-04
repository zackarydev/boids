
export const BIRD_COUNT = 100;

export const BIRD_WIDTH = 15;
export const BIRD_HEIGHT = 12;
export const BIRD_SPEED = 500 / 1000; // 10 pixels per second?

export const SIGHT_ANGLE = Math.PI*0.5; // Almost 180 degree vision per eye.
export const SIGHT_RANGE = 50; // 50 pixels

export enum LayerIndex {
    BACKGROUND,
    BIRDS
};