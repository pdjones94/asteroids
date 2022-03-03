import { asteroidVertices, randomIntBetween, randomNumberBetween } from "./helpers";


class Asteroid {
    constructor(props) {
        this.position = props.position;
        this.velocity = {
            x: randomNumberBetween(-1,1),
            y: randomNumberBetween(-1,1)
        }

        this.rotation = 0;
        this.rotationalSpeed = 1;
        this.radius = props.size;
        this.children = 3;
        this.create = props.create
        this.vertices = asteroidVertices(randomIntBetween(6,10), props.size);
        this.pointsValue = Math.ceil((100/this.radius)*2);
        this.addToScore = props.addToScore;
        // console.log('Creating asteroid with', props)
    }

    remove() {
        this.delete = true;
        this.destroy();
    }

    destroy() {
        this.addToScore(this.pointsValue);

        if (this.radius > 20) {
            for (let i=0;i<this.children;i++) {
                const asteroid = new Asteroid({
                    size: this.radius/2,
                    position: {
                        x: randomNumberBetween(-10,10)+this.position.x,
                        y: randomNumberBetween(-10,10)+this.position.y
                    },
                    create: this.create.bind(this),
                    addToScore: this.addToScore.bind(this)
                });
                this.create(asteroid, 'asteroids');
            }
        }
    }

    render(state) {
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        this.rotation += this.rotationalSpeed;
        if (this.rotation >= 360) {
            this.rotation -= 360;
        }
        if (this.rotation < 0) {
            this.rotation += 360;
        }

        if (this.position.x > state.screen.width + this.radius) {
            this.position.x = -this.radius;
        } else if (this.position.x < -this.radius) {
            this.position.x = state.screen.width + this.radius;
        }
        if (this.position.y > state.screen.height + this.radius) {
            this.position.y = -this.radius;
        } else if (this.position.y < -this.radius) {
            this.position.y = state.screen.height + this.radius;
        }

        const context = state.context;
        context.save();
        context.translate(this.position.x, this.position.y);
        context.rotate(this.rotation * Math.PI / 180);
        context.strokeStyle = '#FFF';
        context.lineWidth = 2;
        context.beginPath();
        context.moveTo(0, -this.radius);
        for (let i = 1; i<this.vertices.length; i++) {
            context.lineTo(this.vertices[i].x, this.vertices[i].y);
        }
        context.closePath();
        context.stroke();
        context.restore();
    }
}

export default Asteroid;