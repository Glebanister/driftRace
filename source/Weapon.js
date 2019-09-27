class Weapon {
    constructor(car, bulletSpeed, rotateSpeed, reloadTime, damage) {
        this.car = car;
        this.bulletSpeed = bulletSpeed;
        this.rotateSpeed = rotateSpeed;
        this.reloadTime = reloadTime;
        this.angle = this.car.angle;
        this.bullets = [];
        this.lastShot = new Date();
        this.keyShoot = 17; 
        this.damage = damage;
        this.updateWithKeys = false;
        this.remoters = {
            shoot: false,
        }
    }

    isReady() {
        return (new Date()) - this.lastShot > this.reloadTime;
    }

    updatePos(enemies) {
        this.angle = this.car.angle;
        this.shoot();
        let newBullets = [];
        for (let i = 0; i < this.bullets.length; i++) {
            if (this.bullets[i].updatePos(enemies)) {
                newBullets.push(this.bullets[i]); 
            }
        }
        this.bullets = newBullets;
    }

    processKeys() {
        this.remoters.shoot = keyIsDown(this.keyShoot);
    }

    shoot() {
        if (this.updateWithKeys) {
            this.processKeys();
        }
        if (this.remoters.shoot && this.isReady()) {
            this.lastShot = new Date();
            this.bullets.push(new Bullet(this, this.bulletSpeed, this.damage));
        }
    }

    setRemoters(input) {
        this.remoters.shoot = input[0];
    }

    draw() {
        push();
        for (let i = 0; i < this.bullets.length; i++) {
            this.bullets[i].draw();
        }
        pop();
    }
}