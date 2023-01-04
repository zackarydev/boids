import Boids from './Boids';

function load() {
    const boids = new Boids();
    // @ts-ignore
    window.boids = boids;
}

window.addEventListener('load', load);
