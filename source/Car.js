class Car {
    constructor(x, y, width, angle, rotateMax, maxUp, maxDown) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.pX = 0.0;
        this.pY = 0.0;
        this.dirX = 0.0;
        this.dirY = 0.0;
        this.angle = angle;
        this.rotateMax = rotateMax;
        this.upBtn = 38;
        this.upBtn1 = 49;
        this.upBtn2 = 50;
        this.upBtn3 = 51;
        this.downBtn = 40;
        this.leftBtn = 37;
        this.rightBtn = 39;
        this.brake = 32;
        this.turnRight = false;
        this.turnLeft = false;
        this.maxDown = maxDown;
        this.maxUp = maxUp;
        this.p = 0.0;
        this.force = 10.0;
        this.force1 = 3.0;
        this.force2 = 6.0;
        this.force3 = 9.0;
        this.frontResForce = 1.0;
        this.sideResForce = 8.0;
        this.m = 2;
        this.delta = 1 / (FRAME_RATE);
        this.updateRemotion = false;
        this.remote = {
            forw: false,
            back: false,
            left: false,
            right: false,
            one: false,
            two: false,
            three: false,
            brake: false
        };
        this.health = 100;
        this.alive = true;
        this.total = 0.0;
    }

    reset() {
        this.x = WIDTH / 2 + (Math.random() - 0.5) * DELTA_X;
        this.y = HEIGHT / 2 + (Math.random() - 0.5) * DELTA_Y;
        this.angle = Math.random() * Math.PI;
        this.p = 0.0;
        this.pX = 0.0;
        this.pY = 0.0;
        this.dirX = 0.0;
        this.dirY = 0.0;
        this.health = 100;
    }

    damage(damage) {
        this.health -= damage;
        if (this.health < 0) {
            this.alive = false;
        }
        this.health = max(0, this.health);
    }

    setBtns(upBtn, downBtn, rightBtn, leftBtn) {
        this.upBtn = upBtn;
        this.downBtn = downBtn;
        this.rightBtn = rightBtn;
        this.leftBtn = leftBtn;
    }

    getSpeed() {
        return sqrt(this.pX ** 2 + this.pY ** 2) / this.m / timeFlow;
    }

    getSpeedX() {
        return this.pX / this.m;
    }

    getSpeedY() {
        return this.pY / this.m;
    }

    processRemotion() {
        this.remote = {
            forw: keyIsDown(this.upBtn),
            back: keyIsDown(this.downBtn),
            left: keyIsDown(this.leftBtn),
            right: keyIsDown(this.rightBtn),
            one: keyIsDown(this.upBtn1),
            two: keyIsDown(this.upBtn2),
            three: keyIsDown(this.upBtn3),
            brake: keyIsDown(this.brake)
        };
    }

    setRemoters(remoters) {
        this.remote = {
            forw: remoters[0],
            back: remoters[1],
            left: remoters[2],
            right: remoters[3],
            one: remoters[4],
            two: remoters[5],
            three: remoters[6],
            brake: remoters[7]
        };
    }

    updatePos() {
        if (this.updateRemotion) {
            this.processRemotion();
        }

        this.turnRight = this.turnLeft = false;
        if (this.remote.right) {
            this.turnRight = true;
        } else if (this.remote.left) {
            this.turnLeft = true;
        }

        if (this.turnLeft) {
            this.angle -= this.rotateMax * timeFlow;
        } else if (this.turnRight) {
            this.angle += this.rotateMax * timeFlow;
        }

        let pX = cos(this.angle) * (this.delta / timeFlow);
        let pY = sin(this.angle) * (this.delta / timeFlow);

        if (this.remote.one) {
            this.pX += pX * this.force1;
            this.pY += pY * this.force1;
        } else if (this.remote.two) {
            this.pX += pX * this.force2;
            this.pY += pY * this.force2;
        } else if (this.remote.three || this.remote.forw) {
            this.pX += pX * this.force3;
            this.pY += pY * this.force3;
        } else if (this.remote.back) {
            this.pX -= pX * this.force1;
            this.pY -= pY * this.force1;
        }

        let currentFrontResForce = this.frontResForce;

        if (this.remote.brake) {
            currentFrontResForce = this.sideResForce;
        }

        let dirFront = this.angle;
        let fResFront = currentFrontResForce * (Math.PI / 2 - diffAngle(this.dirX, this.dirY, cos(dirFront), sin(dirFront))) / Math.PI * 2;
        let dirSide = dirFront + Math.PI / 2;
        let fResSide = this.sideResForce * (Math.PI / 2 - diffAngle(this.dirX, this.dirY, cos(dirSide), sin(dirSide))) / Math.PI * 2;
        let fResFrontX = fResFront * cos(dirFront);
        let fResFrontY = fResFront * sin(dirFront);
        let fResSideX = fResSide * cos(dirSide);
        let fResSideY = fResSide * sin(dirSide);
        let fResX = abs(fResFrontX) + abs(fResSideX);
        let fResY = abs(fResFrontY) + abs(fResSideY);
        if (abs(this.pX) < abs(fResX * (this.delta / timeFlow))) {
            this.pX = 0.0;
        } else {
            if (this.pX > 0) {
                this.pX -= fResX * (this.delta / timeFlow);
            } else {
                this.pX += fResX * (this.delta / timeFlow);
            }
        }
        if (abs(this.pY) < abs(fResY * (this.delta / timeFlow))) {
            this.pY = 0.0;
        } else {
            if (this.pY > 0) {
                this.pY -= fResY * (this.delta / timeFlow);
            } else {
                this.pY += fResY * (this.delta / timeFlow);
            }
        }
        let speedX = this.pX / this.m;
        let speedY = this.pY / this.m;
        this.x += speedX;
        this.y += speedY;
        if (isEq(speedX ** 2 + speedY ** 2, 0.0)) {
            this.dirX = cos(this.angle);
            this.dirY = sin(this.angle);
        } else {
            this.dirX = speedX / sqrt(speedX ** 2 + speedY ** 2);
            this.dirY = speedY / sqrt(speedX ** 2 + speedY ** 2);
        }
    }

    draw() {
        push();
        translate(this.x, this.y);
        rotate(this.angle);
        imageMode(CENTER);
        image(this.texture, 0, 0, this.width, this.texture.height * this.width / this.texture.width);
        textSize(10);
        rotate(-this.angle);
        fill('red');
        textSize(20);
        // text(Math.floor(this.getSpeed() * 100) / 100, 0, 0);
        strokeWeight(3);
        stroke('red');
        line(this.health / 100 * 40 - 20, -20, 20, -20);
        stroke('green');
        line(-20, -20, this.health / 100 * 40 - 20, -20);
        pop();
    }
}