import Projectile from "./Projectile";
const keyMap = {
    Left: 'L',
    Right: 'R',
    Forward: 'F'
}
class Spaceship {
    constructor(props) {
        this.position = props.position;
        this.velocity = {
            x: 0,
            y: 0
        };
        this.radius = 20;
        this.rotation = 0;
        this.rotationalSpeed = 2;
        this.acceleration = 0;
        this.accelerationConstant = 0.01;
        // this.speed = 0;
        this.inertia = 0.99;
        this.maxSpeed = 9;
        this.shootSpeed = 300;
        this.lastShot = 0;
        this.create = props.create;
        this.onDeath = props.onDeath;
        this.isEnemy = false;
    }

    remove() {
        this.delete = true;
        this.onDeath();
        //death animation
    }


    handleRotate(direction) {
        if (direction === keyMap.Left) {
            this.rotation -= this.rotationalSpeed;
        }
        if (direction === keyMap.Right) {
            this.rotation += this.rotationalSpeed; 
        }
        // console.log('rotation:',this.rotation);
        // console.log(this.rotation);
    }

    handleAcceleration(direction) {
        if (direction === keyMap.Forward) {
            if (this.acceleration < 2) {
                this.acceleration += this.accelerationConstant;
            }
        } else {
            this.acceleration = 0;
        }
        // console.log(this.acceleration);
        this.accelerate();
    }

    accelerate() {
        this.velocity.x -= Math.sin(-this.rotation*Math.PI/180) * this.acceleration * 0.1;
        this.velocity.y -= Math.cos(-this.rotation*Math.PI/180) * this.acceleration * 0.1;
        if (this.velocity.x > this.maxSpeed) {
            this.velocity.x = this.maxSpeed
        } else if (this.velocity.x < -this.maxSpeed) {
            this.velocity.x = -this.maxSpeed;
        }
        if (this.velocity.y > this.maxSpeed) {
            this.velocity.y = this.maxSpeed;
        } else if (this.velocity.y < -this.maxSpeed) {
            this.velocity.y = -this.maxSpeed;
        }
    }

    shoot() {
        if (Date.now() - this.lastShot > this.shootSpeed) {
            const bullet = new Projectile({ship: this, size: 2})
            // console.log('creating projectile');
            this.create(bullet, 'projectiles')
            this.lastShot = Date.now();
        }
    }

    render(state) {

        if (state.keys.left) {
            this.handleRotate('L');
        }
        if (state.keys.right) {
            this.handleRotate('R');
        }

        if (state.keys.forwards) {
            this.handleAcceleration('F')        
        } else {
            this.handleAcceleration()
        }

        if (state.keys.shoot) {
            this.shoot();
        }

        if (this.rotation >= 360) {
            this.rotation -= 360;
        } else if (this.rotation < 0){
            this.rotation += 360;
        }


        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        this.velocity.x *= this.inertia;
        this.velocity.y *= this.inertia;
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
        context.rotate(this.rotation * Math.PI / 180);
        context.strokeStyle = '#ffffff';
        context.fillStyle = '#000000';
        context.lineWidth = 2;
        context.beginPath();
        context.moveTo(0, -15);
        context.lineTo(10, 10);
        context.lineTo(5, 7);
        context.lineTo(-5, 7);
        context.lineTo(-10, 10);
        context.closePath();
        context.fill();
        context.stroke();
        context.restore();
    }
}

export default Spaceship;