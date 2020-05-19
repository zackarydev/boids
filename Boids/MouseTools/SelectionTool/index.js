"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SelectionTool {
    constructor(initialPosition) {
        this.initialPosition = initialPosition;
        this.position = initialPosition;
        this.top = 0;
        this.left = 0;
        this.width = 0;
        this.height = 0;
    }
    getGeometry() {
        return {
            top: this.top,
            left: this.left,
            width: this.width,
            height: this.height,
        };
    }
    updatePosition(newPosition) {
        this.position = newPosition;
        this.left = Math.min(this.initialPosition.x1, this.position.x1);
        this.top = Math.min(this.initialPosition.x2, this.position.x2);
        const right = Math.max(this.initialPosition.x1, this.position.x1);
        const bottom = Math.max(this.initialPosition.x2, this.position.x2);
        this.width = right - this.left;
        this.height = bottom - this.top;
    }
    render(context) {
        context.strokeStyle = '#0F0';
        context.strokeRect(this.left, this.top, this.width, this.height);
    }
}
exports.default = SelectionTool;
