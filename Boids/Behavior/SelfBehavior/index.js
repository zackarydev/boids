"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SelfBehavior {
    constructor(bird) {
        this.reset = () => {
            this.value = 0;
        };
        this.bird = bird;
        this.value = 0;
    }
}
exports.default = SelfBehavior;
