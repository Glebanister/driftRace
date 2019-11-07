const FRAME_RATE = 97;
const POP_SIZE = 1000;
const GENERATIONS = 20000;
const PACE = 0.05;
var SAMPLES = 2;
var ROUND_TIME = 10;
var DELTA_X = 150;
var DELTA_Y = 200;
const ALIVE_PART = 0.4;
var population;
var carTexture1;
var carTexture2;
let start;
var bestCar;
var speedSlider;
var shootSlider;
var speedLimitSlider;
var roundTimeSlider;
var timeFlowSlider;
var shootPenny = 0.02;
var speedReward = 0.02;
var speedLimit = 3;
var timeFlow = 2;

function genNewPop() {
    p = [];
    for (let i = 0; i < POP_SIZE; i += 1) {
        p.push(new Unit());
    }
    for (let i = 0; i < p.length; i += 2) {
        p[i].reset();
        p[i + 1].reset();
        p[i].enemy = p[i + 1].car;
        p[i + 1].enemy = p[i].car;
        p[i].car.texture = carTexture1;
        p[i + 1].car.texture = carTexture2;
    }
    return p;
}

function genNextPop() {
    population.sort(compare);
    let sum = 0;
    for (let i = 0; i < population.length; i += 1) {
        sum += population[i].total;
    }
    console.log("Average result:", sum / POP_SIZE);
    let nextGeneration = [];
    for (let i = 0; i < Math.floor(POP_SIZE * ALIVE_PART); i += 1) {
        nextGeneration.push(population[i]);
    }
    for (let i = Math.floor(POP_SIZE * ALIVE_PART); i < POP_SIZE; i += 1) {
        nextGeneration.push(new Unit(population[i - Math.floor(POP_SIZE * ALIVE_PART)]));
    }
    population = nextGeneration;
    shuffle(population);
}

function compare(unit1, unit2) {
    if (unit1.total > unit2.total) {
        return -1;
    }
    return 1;
}

function setup() {
    WIDTH = windowWidth - 20;
    HEIGHT = windowHeight - 20;
    frameRate(FRAME_RATE);
    createCanvas(WIDTH, HEIGHT);
    carTexture1 = loadImage("textures/car.png");    
    carTexture2 = loadImage("textures/car1.png");
    population = genNewPop();
    start = new Date();
    console.log("Gen 1");
    speedSlider = createSlider(0, 0.2, speedReward, 0.01);
    speedSlider.position(100, 20);
    shootSlider = createSlider(0, 0.2, shootPenny, 0.01);
    shootSlider.position(100, 50);
    speedLimitSlider = createSlider(0, 30, speedLimit, 0.5);
    speedLimitSlider.position(100, 80);
    roundTimeSlider = createSlider(1, 100, ROUND_TIME, 1);
    roundTimeSlider.position(100, 110);
    timeFlowSlider = createSlider(0.5, 100, timeFlow, 0.5);
    timeFlowSlider.position(100, 140);
}

let genNum = 1;

function updateSliders() {
    speedReward = speedSlider.value();
    speedLimit = speedLimitSlider.value();
    shootPenny = shootSlider.value();
    ROUND_TIME = roundTimeSlider.value();
    timeFlow = timeFlowSlider.value();
}

function draw() {
    updateSliders();
    let now = new Date();
    if (now - start > ROUND_TIME * 1000 / timeFlow) {
        for (let i = 0; i < population.length; i += 2) {
            population[i].total += (100 - population[i + 1].car.health);
            population[i].total -= (100 - population[i].car.health);
            population[i + 1].total += (100 - population[i].car.health);
            population[i + 1].total -= (100 - population[i + 1].car.health);
        }
        genNum += 1;
        genNextPop();
        console.log("Gen", genNum);
        for (let i = 0; i < population.length; i += 2) {
            population[i].reset();
            population[i + 1].reset();
            population[i].enemy = population[i + 1].car;
            population[i + 1].enemy = population[i].car;
            population[i].car.texture = carTexture1;
            population[i + 1].car.texture = carTexture2;
        }
        start = now;
    }
    background("white");
    textSize(15);
    text("Speed reward", 0, 30);
    text("Shoot penny", 0, 60);
    text("Min speed", 0, 90);
    text("Round time", 0, 120);
    text("Time flow", 0, 150);
    text(speedReward, 230, 30);
    text(shootPenny, 230, 60);
    text(speedLimit, 230, 90);
    text(ROUND_TIME, 230, 120);
    text(timeFlow, 230, 150);
    textSize(30);
    text(ROUND_TIME - Math.floor((now - start) / 1000 * timeFlow) - 1, WIDTH - 120, 50);
    text("Gen " + String(genNum), WIDTH - 120, 100);
    for (let i = 0; i < population.length; i += 1) {
        population[i].predict();
        population[i].car.updatePos();
        population[i].weapon.updatePos([population[i].enemy]);
        population[i].reward();
    }
    for (let i = 0; i < SAMPLES; i += 2) {
        population[i].car.draw();
        population[i].weapon.draw([population[i].enemy]);
        population[i + 1].car.draw();
        population[i + 1].weapon.draw([population[i + 1].enemy]);
    }
}