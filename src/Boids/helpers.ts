import Vector2D from "./Vector2D";

/**
 * @param degree A number between 0 and 360
 */
export const fromDegree = (degree: number) => {
    return degree * Math.PI / 180;
};

export const getAngle = (vector: Vector2D) => {
    return Math.atan2(vector.x2, vector.x1);
}

export const flipVector = (vector: Vector2D, plane: 'x' | 'y', direction: 'left' | 'right' | 'up' | 'down') => {
    const angle = getAngle(vector);


    let normal = 0;
    if (plane === 'x' && direction === 'left') {
        normal = 0;
    } else if (plane === 'x' && direction === 'right') {
        normal = Math.PI;
    } else if (plane === 'y' && direction === 'up') {
        normal = Math.PI*0.5;
    } else if (plane === 'y' && direction === 'down') {
        normal = Math.PI*1.5;
    }
    const newAngle = normal * 2 - Math.PI - angle;

    vector.x1 = Math.cos(newAngle);
    vector.x2 = Math.sin(newAngle);
};