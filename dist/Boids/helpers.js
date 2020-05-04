"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fromDegree = (degree) => {
    return degree * Math.PI / 180;
};
exports.flipVector = (vector, plane, direction) => {
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
    vector.x1 = normal * 2 - Math.PI - vector.x1;
};
