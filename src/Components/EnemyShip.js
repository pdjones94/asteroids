import Projectile from "./Projectile";

class EnemyShip {
    constructor(props) {
        this.position = props.position;
        this.velocity = {
            x: -2,
            y: 0
        };
        this.radius = 40;
        this.rotation = 180;
        // this.speed = 0;
        this.shootSpeed = 1000;
        this.lastShot = 0;
        this.create = props.create;
        this.pointsValue = 200;
        this.isEnemy = true;
        this.addToScore = props.addToScore;
        // this.onDeath = props.onDeath;
    }

    remove() {
        this.delete = true;
        this.addToScore(this.pointsValue);
        // this.onDeath();
        //death animation
    }

    shoot() {
        if (Date.now() - this.lastShot > this.shootSpeed) {
            const bullet = new Projectile({ship: this, size: 2, isEnemy: true})
            // console.log('creating projectile');
            this.create(bullet, 'projectiles')
            this.lastShot = Date.now();
        }
    }

    render(state) {

        // if (state.keys.shoot) {
            this.shoot();
        // }

        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        // this.velocity.x *= this.inertia;
        // this.velocity.y *= this.inertia;
        // console.log(this.velocity.x, this.velocity.y);

        if (this.position.x > state.screen.width) {
            this.position.x = 0;
        } else if (this.position.x < 0) {
            this.position.x = state.screen.width;
        }
        if (this.position.y > state.screen.height) {
            this.position.y = 0;
        } else if (this.position.y < 0) {
            this.position.y = state.screen.height;
        }

        const context = state.context;
        // context.clearRect(0,0,state.screen.width, state.screen.height);
        context.save();
        context.translate(this.position.x, this.position.y);
        // console.log(this.rotation);
        // context.rotate(this.rotation * Math.PI / 180);
        context.strokeStyle = '#ffffff';
        context.fillStyle = '#000000';
        context.lineWidth = 3;
        context.beginPath();
        context.moveTo(0, -12);
        context.lineTo(25, -12);
        context.lineTo(33, 5);
        context.lineTo(60, 23);
        context.lineTo(33, 41);
        context.lineTo(-8, 41);
        context.lineTo(-35, 23);
        context.lineTo(-8, 5);
        context.moveTo(-35, 23);
        context.lineTo(60, 23);
        context.moveTo(-8, 5);
        context.lineTo(33,5);
        context.moveTo(-8, 5);
        context.lineTo(0,-12);
        context.closePath();
        context.fill();
        context.stroke();
        context.restore();
    }
}

export default EnemyShip;