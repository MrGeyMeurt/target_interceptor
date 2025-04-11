import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { TYPE, getTarget, respawn } from './targets';

// Variables globales
let gameState = 'title';
const titleScreen = document.getElementById('titleScreen');
const gameOverScreen = document.getElementById('gameOverScreen');
const startButton = document.getElementById('startButton');
const replayButton = document.getElementById('replayButton');
const scoreElement = document.getElementById('score');

// Gestion des clics
startButton.addEventListener('click', startGame);
replayButton.addEventListener('click', startGame);

titleScreen.classList.add('visible');

function startGame() {
    gameState = 'playing';
    titleScreen.classList.remove('visible');
    gameOverScreen.classList.remove('visible');
    playerScore = 0;
    scoreElement.textContent = '0';
    
    // Réinitialiser les cibles
    targets.forEach(target => respawn(target));
}

function gameOver() {
    gameState = 'gameOver';
    gameOverScreen.classList.add('visible');
    document.getElementById('finalScore').textContent = playerScore;
}

/**
 * Base
 */
let playerScore = 0;

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

/**
 * Build scene
 */
const mapLevel1 = [
    TYPE.SPHERE,
    TYPE.SPHERE,
    TYPE.SPHERE,
    TYPE.SPHERE,
    TYPE.SPHERE,
    TYPE.POLYGON,
    TYPE.POLYGON,
    TYPE.BONUS,
];

const targets = [];

for(let j=0; j<mapLevel1.length; j++){
    const t = getTarget(mapLevel1[j]);
    respawn(t);
    scene.add(t);
    targets.push(t);
}

console.log(targets);


/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
})

/**
 * Camera
 */

// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.z = 8;
scene.add(camera);

// Score
const scoreDiv = document.createElement('div');

// Raycaster
const ray = new THREE.Raycaster();

const rayOrigin = new THREE.Vector3(-10, 0, 0);
const rayDirection = new THREE.Vector3(1,0,0);
rayDirection.normalize();

ray.set(rayOrigin, rayDirection);

const pointer = new THREE.Vector2();

document.addEventListener('click', (event) => {
    if(gameState !== 'playing') return;

    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

    ray.setFromCamera(pointer, camera);
    const intersects = ray.intersectObjects(targets);
    
    intersects.forEach(intersect => {
        playerScore += intersect.object.userData.gain;
        scoreElement.textContent = playerScore;
        respawn(intersect.object);
    });
});




/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    antialias: true,
    canvas: canvas
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
    const delta = clock.getDelta();
    
    if(gameState === 'playing') {
        // Mise à jour des positions
        targets.forEach(target => {
            target.position.x += target.userData.speed * delta * 0.5;
            
            if(target.position.x > SCREEN_LIMIT.RIGHT) {
                gameOver();
            }
        });
    }
    
    renderer.render(scene, camera);
    requestAnimationFrame(tick);
}

tick();


 