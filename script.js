"use strict";

class Tank {
    constructor(x, y) {
        this.tank = document.createElement('div');
        this.field = document.querySelector('#field');

        this._x = x;
        this._y = y;

        this.setCoordinat(this._x, this._y);
    }

    createTank() {
        this.tank.classList.add('tank');
        this.field.appendChild(this.tank);
    }

    setCoordinat(x, y) {
        this._x = x;
        this._y = y;

        this.tank.style.left = this._x + 'px';
        this.tank.style.top = this._y + 'px';
    }

    getCoordinatX() {
        return parseInt(this.tank.style.left);
    }

    getCoordinatY() {
        return parseInt(this.tank.style.top);
    }

    setDirection(num) {
        if (num == 37) {
            this.removeDirection();
            this.tank.setAttribute('data-dir', 'left');
            this.tank.style.backgroundImage = "url('player-left.png')";
        } else if (num == 38) {
            this.removeDirection();
            this.tank.setAttribute('data-dir', 'top');
            this.tank.style.backgroundImage = "url('player-top.png')";
        } else if (num == 39) {
            this.removeDirection();
            this.tank.setAttribute('data-dir', 'right');
            this.tank.style.backgroundImage = "url('player-right.png')";
        } else if (num == 40) {
            this.removeDirection();
            this.tank.setAttribute('data-dir', 'bottom');
            this.tank.style.backgroundImage = "url('player-bottom.png')";
        }
    }

    removeDirection() {
        this.tank.removeAttribute('data-dir');
    }

    doShot(tank) {
        let bullet = new Bullet(tank);
        bullet.addBullet(tank.getCoordinatX(), tank.getCoordinatY());
        bullet.steps(tank);
    }
}

class Enemy extends Tank {
    constructor(field) {
        super();
        this.field = field;
    }

    createEnemy() {
        let field = document.querySelector('#field');
        this.tank.classList.add('tank');
        this.tank.classList.add('tank-enemy');
        this.tank.style.backgroundImage = "url('enemy-right.png')";
        this.setCoordinat(getRandom(0, this.field.getWidth() - 90), getRandom(0, this.field.getHeight() - 90));
        field.appendChild(this.tank);
    }
}

class Field {
    constructor() {
        this.field = document.querySelector('#field');
    }

    createField() {
        this.field.classList.add('field');
    }

    getWidth() {
        return this.field.offsetWidth;
    }

    getHeight() {
        return this.field.offsetHeight;
    }
}

class Bullet {
    constructor(tank) {
        this.tank = tank;
        this.bullet = document.createElement('div');
        this.field = document.querySelector('#field');
        this.dir = this.tank.tank.getAttribute('data-dir');
    }

    addBullet(x, y) {
        this.bullet.classList.add('bullet');
        this.field.appendChild(this.bullet);
        this.bullet.setAttribute('data-dir', this.dir);
        let bulletDir = this.bullet.getAttribute('data-dir');

        switch (bulletDir) {
            case 'top':
                this.bullet.style.left = x + 33 + 'px';
                this.bullet.style.top = y - 18 + 'px';
                break;
            case 'right':
                this.bullet.style.left = x + 80 + 'px';
                this.bullet.style.top = y + 31 + 'px';
                break;
            case 'bottom':
                this.bullet.style.left = x + 31 + 'px';
                this.bullet.style.top = y + 78 + 'px';
                break;
            case 'left':
                this.bullet.style.left = x - 18 + 'px';
                this.bullet.style.top = y + 30 + 'px';
                break;
            case null:
                //this.field.removeChild(this.bullet);
                this.bullet.style.left = x + 80 + 'px';
                this.bullet.style.top = y + 31 + 'px';
                break;
        }
    }

    steps() {
        let bullets = document.querySelectorAll('.bullet');

        setInterval(() => {
            bullets.forEach((bullet) => {
                let dir = bullet.getAttribute('data-dir');
                switch (dir) {
                    case 'top':
                        if (bullet.getBoundingClientRect().top < 0) {
                            bullet.parentElement.removeChild(bullet);
                        } else {
                            if (!this.checkTarget(bullet, dir)) {
                                bullet.style.top = bullet.getBoundingClientRect().top - 2 + 'px';
                            }
                        }
                        break;
                    case 'bottom':
                        if (bullet.getBoundingClientRect().bottom > field.getBoundingClientRect().bottom - 5) {
                            bullet.parentElement.removeChild(bullet);
                        } else {
                            if (!this.checkTarget(bullet, dir)) {
                                bullet.style.top = bullet.getBoundingClientRect().top + 5 + 'px';
                            }
                        }
                        break;
                    case 'left':
                        if (bullet.getBoundingClientRect().left < 5) {
                            bullet.parentElement.removeChild(bullet);
                            bullet.removeAttribute('data-dir');
                        } else {
                            if (!this.checkTarget(bullet, dir)) {
                                bullet.style.left = bullet.getBoundingClientRect().left - 2 + 'px';
                            }
                        }
                        break;
                    case 'right':
                        if (bullet.getBoundingClientRect().right > field.getBoundingClientRect().right - 5) {
                            bullet.parentElement.removeChild(bullet);
                        } else {
                            if (!this.checkTarget(bullet, dir)) {
                                bullet.style.left = bullet.getBoundingClientRect().left + 2 + 'px';
                            }
                        }
                        break;
                }
            });
        }, 50);
    }

    checkTarget(bullet, dir) {
        let tanksEnemy = document.querySelectorAll('.tank-enemy');

        tanksEnemy.forEach((tankEnemy) => {
            if (dir == 'top' || dir == 'bottom') {
                if (tankEnemy.getBoundingClientRect().bottom > bullet.getBoundingClientRect().top &&
                    tankEnemy.getBoundingClientRect().top < bullet.getBoundingClientRect().bottom &&
                    tankEnemy.getBoundingClientRect().left < bullet.getBoundingClientRect().right &&
                    tankEnemy.getBoundingClientRect().right > bullet.getBoundingClientRect().left) {
                    bullet.parentElement.removeChild(bullet);
                    tankEnemy.parentElement.removeChild(tankEnemy);
                    return true;
                }
            } else if (dir == 'right' || dir == 'left') {
                if (tankEnemy.getBoundingClientRect().left < bullet.getBoundingClientRect().right &&
                    tankEnemy.getBoundingClientRect().right > bullet.getBoundingClientRect().left &&
                    tankEnemy.getBoundingClientRect().top < bullet.getBoundingClientRect().bottom &&
                    tankEnemy.getBoundingClientRect().bottom > bullet.getBoundingClientRect().top) {
                    bullet.parentElement.removeChild(bullet);
                    tankEnemy.parentElement.removeChild(tankEnemy);
                    bullet.removeAttribute('data-dir');
                    return true;
                }
            }
        });
        return false;
    }
}

class Game {
    constructor() {
        this._field = new Field;
        this._tank = new Tank(300, 100);

        this._run();
        this.controllers();
    }

    _run() {
        this._field.createField();
        this._tank.createTank();
        setInterval(() => {
            this._enemy = new Enemy(this._field);
            this._enemy.createEnemy();
        }, 5000);
    }

    controllers() {
        let field = document.querySelector('#field');
        document.addEventListener('keydown', (e) => {
            switch (e.keyCode) {
                case 37:
                    if (this._tank.getCoordinatX() >= 10) {
                        this._tank.setDirection(e.keyCode);
                        this._tank.setCoordinat(this._tank.getCoordinatX() - 10);
                    }
                    break;
                case 38:
                    if (this._tank.getCoordinatY() >= 10) {
                        this._tank.setDirection(e.keyCode);
                        this._tank.setCoordinat(this._tank.getCoordinatX(), this._tank.getCoordinatY() - 10);
                    }
                    break;
                case 39:
                    if (this._tank.getCoordinatX() < field.getBoundingClientRect().right - 81) {
                        this._tank.setDirection(e.keyCode);
                        this._tank.setCoordinat(this._tank.getCoordinatX() + 10);
                    }
                    break;
                case 40:
                    if (this._tank.getCoordinatY() < field.getBoundingClientRect().bottom - 83) {
                        this._tank.setDirection(e.keyCode);
                        this._tank.setCoordinat(this._tank.getCoordinatX(), this._tank.getCoordinatY() + 10);
                    }
                    break;
                case 32:
                    if (this._tank.tank.getAttribute('data-dir')) {
                        this._tank.doShot(this._tank);
                    }
                    break;
            }
        });
    }
}

function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

new Game();