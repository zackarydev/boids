"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typescript_render_engine_1 = __importStar(require("@zacktherrien/typescript-render-engine"));
const constants_1 = require("./constants");
const Bird_1 = __importDefault(require("./Bird"));
const Vector2D_1 = __importDefault(require("./Vector2D"));
class Boids {
    constructor() {
        this.background = new typescript_render_engine_1.RenderingLayer(constants_1.LayerIndex.BACKGROUND, typescript_render_engine_1.LayerType.STATIC);
        this.birdLayer = new typescript_render_engine_1.RenderingLayer(constants_1.LayerIndex.BIRDS, typescript_render_engine_1.LayerType.DYNAMIC);
        this.birds = [];
        for (let i = 0; i < constants_1.BIRD_COUNT; i++) {
            const bird = new Bird_1.default(this, Math.random() * this.birdLayer.getWidth(), Math.random() * this.birdLayer.getHeight(), this.birdLayer.getWidth(), this.birdLayer.getHeight());
            this.birds.push(bird);
            this.birdLayer.addEntity(bird);
        }
        this.isLeftClicked = false;
        this.isRightClicked = false;
        this.mouseLocation = Vector2D_1.default.ZERO();
        this.engine = new typescript_render_engine_1.default();
        this.engine.registerLayer(this.background);
        this.engine.registerLayer(this.birdLayer);
        this.engine.start();
        document.addEventListener('mousedown', this.handleMouseDown.bind(this));
        document.addEventListener('mouseup', this.handleMouseUp.bind(this));
        document.addEventListener('mousemove', this.handleMouseMove.bind(this));
        document.addEventListener('contextmenu', event => event.preventDefault());
    }
    handleMouseDown(e) {
        if (e.button === 0) {
            this.isLeftClicked = true;
        }
        else {
            this.isRightClicked = true;
            e.preventDefault();
            e.stopImmediatePropagation();
        }
        this.mouseLocation = new Vector2D_1.default(e.offsetX, e.offsetY);
    }
    handleMouseMove(e) {
        this.mouseLocation = new Vector2D_1.default(e.offsetX, e.offsetY);
    }
    handleMouseUp() {
        this.isLeftClicked = false;
        this.isRightClicked = false;
        this.mouseLocation = Vector2D_1.default.ZERO();
    }
}
exports.default = Boids;
