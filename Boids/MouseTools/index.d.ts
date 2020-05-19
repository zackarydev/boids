import { IEntity, IStaticLayer } from "@zacktherrien/typescript-render-engine";
import Vector2D from "../Vector2D";
export interface IMouseTool extends IEntity {
    updatePosition(newPosition: Vector2D): void;
    getGeometry(): {
        top: number;
        left: number;
        width: number;
        height: number;
    };
}
export interface IMouseToolsManager {
    layer: IStaticLayer;
}
export default class MouseToolsManager implements IMouseToolsManager {
    layer: IStaticLayer;
    initialMouseLocation: Vector2D;
    mouseLocation: Vector2D;
    currentTool: IMouseTool | null;
    constructor();
    chooseTool(tool: IMouseTool): void;
    resetTool(): void;
    handleMouseDown(e: MouseEvent): void;
    handleMouseMove(e: MouseEvent): void;
    handleMouseUp(): void;
}
//# sourceMappingURL=index.d.ts.map