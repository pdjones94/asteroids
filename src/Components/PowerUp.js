// import { shotTypes } from "./helpers";
class PowerUp {
    constructor(props) {
        this.position = props.position;
        this.velocity = {
            x: props.startLeft ? 1.5 : -1.5,
            y: 0
        };
        this.radius = 40;
        this.rotation = 180;
        // this.speed = 0;
        this.shootSpeed = 1000;
        this.lastShot = 0;
        // this.create = props.create;
        this.pointsValue = 200;
        this.addToScore = props.addToScore;
        this.life = props.life;
        this.isEnemy = false;
        this.shotType = props.shotType;
        // this.onDeath = props.onDeath;
    }

    hit() {
        //Change projectile type of ship
        this.delete = true;
    }


    render(state) {

        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;


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
        context.save();
        context.translate(this.position.x, this.position.y);

        context.strokeStyle = '#66ff33';
        context.lineWidth = 3;
        context.beginPath();
        context.moveTo(20, 20);
        context.lineTo(60, 20);
        context.lineTo(60, 60);
        context.lineTo(20, 60);
        context.lineTo(20, 20);
        context.closePath()
        context.moveTo(40,30);
        context.arc(30,30,10,0,2*Math.PI);
        context.moveTo(60,30);
        context.arc(50,30,10,0,2*Math.PI);
        context.moveTo(50,50);
        context.arc(40,50,10,0,2*Math.PI);
        context.stroke();
        context.closePath();
        context.stroke();
        context.restore();
    }
}

export default PowerUp;