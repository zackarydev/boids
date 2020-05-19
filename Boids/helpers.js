"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.flipVector = exports.getAngle = exports.fromDegree = void 0;
exports.fromDegree = (degree) => {
    return degree * Math.PI / 180;
};
exports.getAngle = (vector) => {
    return Math.atan2(vector.x2, vector.x1);
};
exports.flipVector = (vector, plane, direction) => {
    const angle = exports.getAngle(vector);
    let normal = 0;
    if (plane === 'x' && direction === 'left') {
        normal = 0;
    }
    else if (plane === 'x' && direction === 'right') {
        normal = Math.PI;
    }
    else if (plane === 'y' && direction === 'up') {
        normal = Math.PI * 0.5;
    }
    else if (plane === 'y' && direction === 'down') {
        normal = Math.PI * 1.5;
    }
    const newAngle = normal * 2 - Math.PI - angle;
    vector.x1 = Math.cos(newAngle);
    vector.x2 = Math.sin(newAngle);
};
