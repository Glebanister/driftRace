class Unit {
    constructor(parent=undefined) {
        this.car = new Car(WIDTH / 2,
                           HEIGHT / 2,
                           20,
                           0.0,
                           0.04,
                           20,
                           10
                          );
        this.car.texture = carTexture1;
        let inputLayer = new Layer(6);
        let outputLayer = new Layer(9, inputLayer);
        this.input = inputLayer;
        this.output = outputLayer;
        this.weapon = new Weapon(this.car, 15, 0.1, 100, 1);
        if (parent) {
            this.inherit(parent);
        } else {
            this.rand();
        }
        this.total = 0;
        this.enemy = undefined;
    }

    inherit(parentCore) {
        this.input.inherit(parentCore.input);
        this.output.inherit(parentCore.output);
    }

    reset() {
        this.output.reset();
        this.total = 0.0;
        this.enemy = undefined;
        this.car.reset();
    }

    rand() {
        this.input.rand();
        this.output.rand();
    }

    speedReward() {
        if (this.car.getSpeed() > speedLimit) {
            this.total += speedReward;
        }
    }

    shootPenny() {
        if (this.weapon.remoters.shoot && this.weapon.isReady()) {
            this.total -= shootPenny;
        }
    }

    reward() {
        if (!(0 <= this.car.x && this.car.x <= WIDTH && 0 <= this.car.y && this.car.y <= HEIGHT)) {
            this.total -= 0.02;
        }
        this.shootPenny();
        this.speedReward();
    }

    predict() {
        let x = cos(this.car.angle);
        let y = sin(this.car.angle);
        let input = [
                     diffAngle(x, y, WIDTH / 2 - this.car.x, HEIGHT / 2 - this.car.y) / Math.PI,
                     diffAngle(x, y, this.enemy.x - this.car.x, this.enemy.y - this.car.y) / Math.PI,
                     this.car.getSpeed() / 30,
                     atan2(this.car.getSpeedY(), this.car.getSpeedX()) / Math.PI, 
                     ((this.car.x - this.enemy.x) ** 2 + (this.car.y - this.enemy.y) ** 2) / (HEIGHT ** 2 + WIDTH ** 2),
                     ((this.car.x - WIDTH / 2) ** 2 + (this.car.y - HEIGHT / 2) ** 2) / (HEIGHT ** 2 + WIDTH ** 2)
                    ];
        this.input.setInput(input);
        this.output.processInput();
        let out = this.output.getOutput();
        let carOut = out.slice(0, 8);
        let weaponOut = out.slice(8);
        this.car.setRemoters(carOut);
        this.weapon.setRemoters(weaponOut);
    }
}
