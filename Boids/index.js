"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typescript_render_engine_1 = __importStar(require("@zacktherrien/typescript-render-engine"));
const constants_1 = require("./constants");
const Bird_1 = __importDefault(require("./Bird"));
const Terrain_1 = __importDefault(require("./Terrain"));
const MouseTools_1 = __importDefault(require("./MouseTools"));
class Boids {
    constructor() {
        Boids.instance = this;
        this.mouseTools = new MouseTools_1.default();
        this.terrain = new Terrain_1.default();
        this.birdLayer = new typescript_render_engine_1.DynamicLayer(constants_1.LayerIndex.BIRDS);
        this.maxX = this.birdLayer.getWidth();
        this.maxY = this.birdLayer.getHeight();
        this.birds = [];
        for (let i = 0; i < constants_1.BIRD_COUNT; i++) {
            const bird = new Bird_1.default(this, Math.random() * this.birdLayer.getWidth(), Math.random() * this.birdLayer.getHeight());
            this.birds.push(bird);
            this.birdLayer.addEntity(bird);
        }
        this.engine = new typescript_render_engine_1.default();
        this.engine.registerLayer(this.terrain.layer);
        this.engine.registerLayer(this.mouseTools.layer);
        this.engine.registerLayer(this.birdLayer);
        this.engine.start();
        this.terrain.layer.render();
    }
}
exports.default = Boids;
