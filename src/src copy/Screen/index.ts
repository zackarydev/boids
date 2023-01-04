import { IEntity } from '@zacktherrien/typescript-render-engine';

import { ScreenType } from '../types';

export interface IScreenElement extends IEntity {
    x: number;
    y: number;
    width: number;
    height: number;

    onHover(): void;
    onHoverOut(): void;
    onClick(x: number, y: number): boolean;
    isPointInElement(x: number, y: number): boolean;
}

export interface IScreen extends IEntity {
    screenType: ScreenType;

    x: number;
    y: number;
    width: number;
    height: number;

    elements: IScreenElement[];

    onHover(x: number, y: number): void;
    onClick(x: number, y: number): boolean;
    isPointInScreen(x: number, y: number): boolean;
}

export default abstract class Screen implements IScreen {
    screenType: ScreenType;
    x: number;
    y: number;
    width: number;
    height: number;

    elements: IScreenElement[];
    closeScreenCB: Function;

    constructor(screenType: ScreenType, x: number, y: number, width: number, height: number, close: Function) {
        this.screenType = screenType;

        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.closeScreenCB = close;

        this.elements = [];
    }

    destroy() {
        this.closeScreenCB(this.screenType);
    }

    addScreenElement(element: IScreenElement) {
        this.elements.push(element);
    }

    isPointInScreen(x: number, y: number) {
        return x >= this.x && x <= this.width + this.x && y >= this.y && y <= this.height + this.y;
    }

    onHover(x: number, y: number) {
        if (!this.isPointInScreen(x, y)) {
            this.elements.forEach((element) => {
                element.onHoverOut();
            });
            return;
        }
        this.elements.forEach((element) => {
            if (element.isPointInElement(x, y)) {
                element.onHover();
            } else {
                element.onHoverOut();
            }
        });
    }

    onClick(x: number, y: number) {
        if (!this.isPointInScreen(x, y)) {
            return false;
        }
        return Boolean(this.elements.find((element) => element.onClick(x, y)));
    }

    abstract update(deltaTime: number): void;

    abstract render(context: CanvasRenderingContext2D): void;
}
