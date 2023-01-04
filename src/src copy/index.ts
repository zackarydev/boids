import { EXPOSE_GAME } from './constants';
import Game from './Game';

(function () {
    const game = new Game();
    if (EXPOSE_GAME) {
        // @ts-ignore
        window.game = game;
    }
})();
