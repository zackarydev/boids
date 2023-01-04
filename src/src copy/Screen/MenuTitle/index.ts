import { IScreenElement } from '..';
import {
    BUILD_MENU_BACKGROUND_COLOR,
    BUILD_MENU_STROKE_COLOR,
    BUILD_MENU_TEXT_COLOR,
    BUILD_MENU_TEXT_PADDING,
} from '../../rendering_constants';

export default class MenuTitle implements IScreenElement {
    x: number;
    y: number;
    width: number;
    height: number;
    title: string;

    constructor(x: number, y: number, width: number, height: number, title: string) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.title = title;
    }

    onHover() {}
    onHoverOut() {}

    onClick(x: number, y: number) {
        if (this.isPointInElement(x, y)) {
            return true;
        }
        return false;
    }

    isPointInElement(x: number, y: number) {
        return x >= this.x && x <= this.width + this.x && y >= this.y && y <= this.height + this.y;
    }

    render(context: CanvasRenderingContext2D): void {
        context.fillStyle = BUILD_MENU_BACKGROUND_COLOR;
        context.strokeStyle = BUILD_MENU_STROKE_COLOR;
        context.fillRect(this.x, this.y, this.width, this.height);
        context.strokeRect(this.x, this.y, this.width, this.height);

        context.fillStyle = BUILD_MENU_TEXT_COLOR;
        context.font = '12px Arial';
        context.fillText(this.title, this.x + BUILD_MENU_TEXT_PADDING, this.y + this.height / 2 + 4);
    }
}
