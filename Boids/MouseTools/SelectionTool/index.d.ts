import Vector2D from "../../Vector2D";
import { IMouseTool } from "..";
export interface ISelectionTool extends IMouseTool {
    updatePosition(newPosition: Vector2D): void;
    getGeometry(): {
        top: number;
        left: number;
        width: number;
        height: number;
    };
}
export default class SelectionTool implements ISelectionTool {
    initialPosition: Vector2D;
    position: Vector2D;
    top: number;
    left: number;
    width: number;
    height: number;
    constructor(initialPosition: Vector2D);
    getGeometry(): {
        top: number;
        left: number;
        width: number;
        height: number;
    };
    updatePosition(newPosition: Vector2D): void;
    render(context: CanvasRenderingContext2D): void;
}
//# sourceMappingURL=index.d.ts.map