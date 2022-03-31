import React, { Component } from 'react';
import Asteroid from '../Components/Asteroid';
import EnemyShip from '../Components/EnemyShip';
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
    SPACE: 32,
    PAUSE: 80
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
            score: 0,
            gamePaused: false
        }
        this.ship = [];
        this.projectiles = [];
        this.asteroids = [];
        this.enemyShips = [];
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
            case KEYS.PAUSE:
                if (event.type === 'keyup') {
                    this.pauseGame();
                }
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

    pauseGame() {
        if (this.state.gameRunning) {
            this.setState({gamePaused: !this.state.gamePaused});
            if (!this.state.gamePaused) {
                requestAnimationFrame(() => {this.update()})
            }
        }
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
        context.save();

        context.fillStyle = '#000';
        context.globalAlpha = 0.4;
        context.fillRect(0, 0, this.state.screen.width, this.state.screen.height);
        context.globalAlpha = 1;

        if (this.enemiesAreDead()) {
            this.setState({asteroidCount: this.state.asteroidCount+1, level: this.state.level+1});
            this.generateAsteroids(this.state.asteroidCount);
            if (this.state.level > 1) {
                for (let i=1; i <= this.state.level; i++) {
                    setTimeout(() => {
                        this.generateEnemyShip();
                    }, 5000*i);
                }
            }
        }

        this.handleCollisions(this.projectiles, this.asteroids, true);
        this.handleCollisions(this.projectiles, this.enemyShips);
        this.handleCollisions(this.projectiles, this.ship);
        this.handleCollisions(this.ship, this.asteroids);

        this.updateObjects(this.ship, 'ship');
        this.updateObjects(this.projectiles, 'projectiles');
        this.updateObjects(this.asteroids, 'asteroids');
        this.updateObjects(this.enemyShips, 'enemyShips');
        context.restore();
        if (!this.state.gamePaused) {
            requestAnimationFrame(() => {this.update()})
        }
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

    generateEnemyShip() {
        const enemyShip = new EnemyShip({
            position: {
                x: this.state.screen.width,
                y: this.state.screen.height*0.1
            },
            addToScore: this.addToTotalScore.bind(this),
            create: this.addToGameState.bind(this),
            // life: this.state.level - 1
            life: 2
        });
        this.addToGameState(enemyShip, 'enemyShips');
    }

    generateAsteroids(count) {
        const ship = this.ship[0];
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
                    objectsA[i].hit();
                    objectsB[j].hit();
                    if (log) {
                        // console.log('SCORE:',this.state.score);
                    }
                }
            }
        }
    }

    enemiesAreDead() {
        return (this.asteroids.length === 0 && this.enemyShips.length === 0);
    }

    doObjectsCollide(objectA, objectB) {
        //Prevent friendly fire
        if (!objectA.isEnemy && !objectB.isEnemy) {
            return false;
        }
        //Prevent enemy friendly fire
        if (objectA.isEnemy && objectB.isEnemy) {
            return false;
        }

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
        this.enemyShips = [];
        this.projectiles = [];
        this.generateAsteroids(startingAsteroidCount);
        this.generateEnemyShip();
    }

    gameOver() {
        this.setState({
            gameRunning: false
        });
    }


    render() {
        let endGame;
        let currentScore;
        let highScoreEle;
        let pauseMenu;
        const storedHighScore = localStorage.getItem('high_score');
        const highScore = (storedHighScore) ? parseInt(storedHighScore) : 0;


        if (!this.state.gameRunning) {
            if (this.state.score > highScore || highScore === 0) {
                localStorage.setItem('high_score', this.state.score);
            }
            endGame = (
                <div className="endGame">
                    <p>Game Over!</p>
                    <p>Score: {this.state.score}</p>
                    <p>Level: {this.state.level}</p>
                    <button
                        onClick={this.startGame.bind(this)}>
                        Start Again
                    </button>
                </div>
            )
        } else if (this.state.gamePaused) {
            pauseMenu = (
                <div className="pauseMenu">
                    <p>Game Paused</p>
                    <p>Score: {this.state.score}</p>
                    <p>Level: {this.state.level}</p>
                    {/* <button
                        onClick={this.pauseGame.bind(this)}>
                        Continue
                    </button> */}
                </div>
            )
        }
        else {
            currentScore = (
                <div className="currentScore">
                    <span>Score: {this.state.score}</span>
                    <span>Level: {this.state.level}</span>
                </div>
            )
        }

        highScoreEle = (
            <div className='highScore'>
                <span>High Score: {highScore}</span>
            </div>
        )
        return (
            <div>
                {currentScore}
                {highScoreEle}
                {endGame}
                {pauseMenu}
                <canvas id='map' height={this.state.screen.height} width={this.state.screen.width}/>
            </div>
        );
    }
}

export default Map;