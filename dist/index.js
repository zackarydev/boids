"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Boids_1 = __importDefault(require("./Boids"));
function load() {
    const boids = new Boids_1.default();
    window.boids = boids;
}
window.addEventListener('load', load);
