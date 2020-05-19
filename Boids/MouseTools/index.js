"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typescript_render_engine_1 = require("@zacktherrien/typescript-render-engine");
const constants_1 = require("../constants");
const Vector2D_1 = __importDefault(require("../Vector2D"));
const __1 = __importDefault(require(".."));
const SelectionTool_1 = __importDefault(require("./SelectionTool"));
class MouseToolsManager {
    constructor() {
        this.layer = new typescript_render_engine_1.StaticLayer(constants_1.LayerIndex.TOOLS);
        this.currentTool = null;
        this.initialMouseLocation = Vector2D_1.default.ZERO();
        this.mouseLocation = Vector2D_1.default.ZERO();
        document.addEventListener('mousedown', this.handleMouseDown.bind(this));
        document.addEventListener('mouseup', this.handleMouseUp.bind(this));
        document.addEventListener('mousemove', this.handleMouseMove.bind(this));
        document.addEventListener('contextmenu', event => event.preventDefault());
    }
    chooseTool(tool) {
        this.resetTool();
        this.currentTool = tool;
        this.layer.addEntity(this.currentTool);
    }
    resetTool() {
        if (this.currentTool) {
            this.layer.removeEntity(this.currentTool);
            this.layer.allowRenderOnNextFrame();
        }
    }
    handleMouseDown(e) {
        if (e.button !== 0) {
            e.preventDefault();
            e.stopImmediatePropagation();
        }
        this.mouseLocation = new Vector2D_1.default(e.offsetX, e.offsetY);
        this.chooseTool(new SelectionTool_1.default(this.mouseLocation));
    }
    handleMouseMove(e) {
        this.mouseLocation = new Vector2D_1.default(e.offsetX, e.offsetY);
        if (this.currentTool) {
            this.layer.allowRenderOnNextFrame();
            this.currentTool.updatePosition(this.mouseLocation);
        }
    }
    handleMouseUp() {
        var _a;
        if (!this.currentTool)
            return;
        const { left, top, width, height } = (_a = this.currentTool) === null || _a === void 0 ? void 0 : _a.getGeometry();
        const right = left + width;
        const bottom = top + height;
        for (let i = 0; i < __1.default.instance.birds.length; i++) {
            if (__1.default.instance.birds[i].position.x1 < right &&
                __1.default.instance.birds[i].position.x1 > left &&
                __1.default.instance.birds[i].position.x2 < bottom &&
                __1.default.instance.birds[i].position.x2 > top) {
                console.log(__1.default.instance.birds[i]);
            }
        }
        this.resetTool();
    }
}
exports.default = MouseToolsManager;
