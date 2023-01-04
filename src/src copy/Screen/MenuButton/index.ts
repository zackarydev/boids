import { IScreenElement } from '..';
import {
    BUILD_MENU_BACKGROUND_COLOR,
    BUILD_MENU_STROKE_COLOR,
    BUILD_MENU_TEXT_COLOR,
    BUILD_MENU_TEXT_PADDING,
    BUILD_MENU_BACKGROUND_COLOR_HOVER,
    BUILD_MENU_STROKE_COLOR_HOVER,
    BUILD_MENU_TEXT_COLOR_HOVER,
} from '../../rendering_constants';

export default class MenuButton implements IScreenElement {
    x: number;
    y: number;
    width: number;
    height: number;
    buttonText: string;
    onClickCb: Function;

    isHovered: boolean;

    constructor(x: number, y: number, width: number, height: number, buttonText: string, onClickCb: Function) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.buttonText = buttonText;
        this.onClickCb = onClickCb;

        this.isHovered = false;
    }

    onHover() {
        this.isHovered = true;
    }
    onHoverOut() {
        this.isHovered = false;
    }

    onClick(x: number, y: number) {
        if (this.isPointInElement(x, y)) {
            this.onClickCb();
            return true;
        }
        return false;
    }

    isPointInElement(x: number, y: number) {
        return x >= this.x && x <= this.width + this.x && y >= this.y && y <= this.height + this.y;
    }

    render(context: CanvasRenderingContext2D): void {
        context.fillStyle = this.isHovered ? BUILD_MENU_BACKGROUND_COLOR_HOVER : BUILD_MENU_BACKGROUND_COLOR;
        context.strokeStyle = this.isHovered ? BUILD_MENU_STROKE_COLOR_HOVER : BUILD_MENU_STROKE_COLOR;
        context.fillRect(this.x, this.y, this.width, this.height);
        context.strokeRect(this.x, this.y, this.width, this.height);

        context.fillStyle = this.isHovered ? BUILD_MENU_TEXT_COLOR_HOVER : BUILD_MENU_TEXT_COLOR;
        context.font = '12px Arial';
        context.fillText(this.buttonText, this.x + BUILD_MENU_TEXT_PADDING, this.y + this.height / 2 + 6);
    }
}
