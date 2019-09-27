class Bullet {
    constructor(weapon, speed, damage) {
        this.weapon = weapon;
        this.speed = speed;
        this.x = this.weapon.car.x;
        this.y = this.weapon.car.y;
        this.angle = this.weapon.angle;
        this.lenght = 6;
        this.speedX = this.weapon.car.getSpeedX();
        this.speedY = this.weapon.car.getSpeedY();
        this.damage = damage;
    }

    inside() {
        return !((WIDTH <= this.x || this.x <= 0) || (HEIGHT <= this.y || this.y <= 0));
    }

    processCollisions(enemies) {
        for (let i = 0; i < enemies.length; i += 1) {
            if ((enemies[i].x - this.x) ** 2 + (enemies[i].y - this.y) ** 2 < (enemies[i].width / 2) ** 2) {
                enemies[i].health -= this.damage;
                enemies[i].damage(this.damage);
                return true;
            }
        }
        return false;
    } 

    updatePos(enemies) {
        if (this.processCollisions(enemies)) {
            delete this;
            return false;
        }
        this.x += cos(this.angle) * this.speed + this.speedX;
        this.y += sin(this.angle) * this.speed + this.speedY;
        if (!this.inside()) {
            delete this;
            return false;
        }
        return true;
    }

    draw() {
        push();
        strokeWeight(3);
        stroke('gray');
        line(this.x, this.y, this.x - cos(this.angle) * this.lenght, this.y - sin(this.angle) * this.lenght);
        pop();
    }
}