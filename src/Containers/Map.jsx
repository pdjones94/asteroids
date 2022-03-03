import React, { Component } from 'react';
import Asteroid from '../Components/Asteroid';
import { randomNumberBetweenExcluding } from '../Components/helpers';
import Spaceship from '../Components/Spaceship';

const KEYS = {
    UP: 38,
    DOWN: 40,
    LEFT: 37,
    RIGHT: 39,
    W: 87,
    A: 65,
    S: 83,
    D: 68,
    SPACE: 32
}
const startingAsteroidCount = 3;

class Map extends Component {
    constructor() {
        super()
        this.state = {
            screen: {
                width: window.innerWidth,
                height: window.innerHeight,
            },
            context: null,
            keys: {
                forwards: false,
                backwards: false,
                left: false,
                right: false,
                shoot: false,
            },
            asteroidCount: 3,
            gameRunning: true,
            level: 1,
            score: 0
        }
        this.ship = [];
        this.projectiles = [];
        this.asteroids = [];
    }

    keyHandler(val, event) {
        let keys = this.state.keys;
        switch(event.keyCode) {
            case KEYS.UP:
            case KEYS.W:
                keys.forwards = val;
                break;
            case KEYS.LEFT:
            case KEYS.A:
                keys.left = val;
                break;
            case KEYS.RIGHT:
            case KEYS.D:
                keys.right = val;
                break;
            case KEYS.DOWN:
            case KEYS.S:
                keys.backwards = val;
                break;
            case KEYS.SPACE:
                keys.shoot = val;
                break;
            default:
                break;
        }
        this.setState({keys: keys})
    }

    resizeHandler(value, e) {
        this.setState({
            screen: {
                width: window.innerWidth,
                height: window.innerHeight
            }
        })
    }

    componentDidMount() {
        window.addEventListener('keydown', this.keyHandler.bind(this, true));
        window.addEventListener('keyup', this.keyHandler.bind(this, false));
        window.addEventListener('resize', this.resizeHandler.bind(this, false));

        const canvasContext = document.getElementById('map').getContext('2d');
        this.setState({context: canvasContext})
        this.startGame();
        requestAnimationFrame(() => {this.update()})
    }

    componentWillUnmount() {
        window.removeEventListener('keydown', this.keyHandler);
        window.removeEventListener('keyup', this.keyHandler);
    }

    update() {
        const context = this.state.context;
        // const ship = this.ship;
        context.save();

        context.fillStyle = '#000';
        context.globalAlpha = 0.4;
        context.fillRect(0, 0, this.state.screen.width, this.state.screen.height);
        context.globalAlpha = 1;

        if (this.asteroids.length === 0) {
            this.setState({asteroidCount: this.state.asteroidCount+1, level: this.state.level+1});
            this.generateAsteroids(this.state.asteroidCount);
        }

        this.handleCollisions(this.projectiles, this.asteroids, true);
        this.handleCollisions(this.ship, this.asteroids);

        this.updateObjects(this.ship, 'ship');
        this.updateObjects(this.projectiles, 'projectiles');
        this.updateObjects(this.asteroids, 'asteroids');
        context.restore();
        requestAnimationFrame(() => {this.update()})
    }

    updateObjects(items, type) {
        let i = 0;
        for (let item of items) {
            if (item.delete) {
                this[type].splice(i,1);
            } else {
                items[i].render(this.state);
            }
            i++;
        }
    }

    addToGameState(item, type) {
        this[type].push(item);
    }

    addToTotalScore(points) {
        if (this.state.gameRunning) {
            this.setState({
                score: this.state.score + points
            })
        }
    }

    generateAsteroids(count) {
        const ship = this.ship[0];
        // console.log(`Generating ${count} Asteroids`);
        for (let i = 0; i < count; i++) {
            const asteroid = new Asteroid({
                size: 80,
                position: {
                    x: randomNumberBetweenExcluding(0, this.state.screen.width, ship.position.x-60, ship.position.x+60),
                    y: randomNumberBetweenExcluding(0, this.state.screen.height, ship.position.y-60, ship.position.y+60)
                },
                create: this.addToGameState.bind(this),
                addToScore: this.addToTotalScore.bind(this)
            });
            this.addToGameState(asteroid, 'asteroids');
        }
    }

    handleCollisions(objectsA, objectsB, log=false) {
        for (let i = objectsA.length-1; i >= 0; i--) {
            for (let j = objectsB.length-1; j >= 0; j--) {
                if (this.doObjectsCollide(objectsA[i], objectsB[j])) {
                    objectsA[i].remove();
                    objectsB[j].remove();
                    if (log) {
                        console.log('SCORE:',this.state.score);
                    }
                }
            }
        }
    }

    doObjectsCollide(objectA, objectB) {
        const diffX = objectA.position.x - objectB.position.x;
        const diffY = objectA.position.y - objectB.position.y;
        const aToB = Math.sqrt(diffX**2 + diffY**2);
        if (aToB < objectA.radius + objectB.radius) {
            return true;
        } else {
            return false;
        }
    }

    startGame() {
        this.setState({
            gameRunning: true,
            asteroidCount: 3,
            level: 1,
            score: 0
        })
        const ship = new Spaceship({
            position: {
                x: this.state.screen.width / 2,
                y: this.state.screen.height / 2
            },
            create: this.addToGameState.bind(this),
            onDeath: this.gameOver.bind(this)
        });

        this.addToGameState(ship, 'ship');
        this.asteroids = [];
        this.generateAsteroids(startingAsteroidCount);

    }

    gameOver() {
        this.setState({
            gameRunning: false
        });
    }


    render() {
        let endGame;

        if (!this.state.gameRunning) {
            endGame = (
                <div className="endGame">
                    <p>Game Over!</p>
                    <p>Score: {this.state.score}</p>
                    <button
                        onClick={this.startGame.bind(this)}>
                        Start Again
                    </button>
                </div>
            )
        }

        return (
            <div>
                {endGame}
                <canvas id='map' height={this.state.screen.height} width={this.state.screen.width}/>
            </div>
        );
    }
}

export default Map;