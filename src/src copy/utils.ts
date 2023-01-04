export function magnitude(x: number, y: number) {
    return Math.sqrt(x ** 2 + y ** 2);
}

export function distance(x0: number, y0: number, x1: number, y1: number): number {
    return magnitude(x1 - x0, y1 - y0);
}

export function angleBetweenVectors(x0: number, y0: number, x1: number, y1: number): number {
    return Math.atan2(y1 - y0, x1 - x0);
}

export function angleToRad(angle: number) {
    return angle * (Math.PI / 180);
}

export function radToAngle(radian: number) {
    return radian * (180 / Math.PI);
}

export function angleDistance(angle0: number, angle1: number) {
    // 0 -> 361 = -361 => -1
    // 15 -> 30 = 15
    // 30 -> 15 = -15

    const diff = (angle1 - angle0) % 360;
    if (diff < -180) {
        return diff + 360;
    } else if (diff > 179) {
        return diff - 360;
    }
    return diff;
}

export function clamp(num: number, min: number, max: number) {
    return Math.min(max, Math.max(min, num));
}
