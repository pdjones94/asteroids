
class Particle {
    constructor(props) {
        this.position = props.position;
        this.velocity = props.velocity;
        this.radius = props.size;
        this.life = props.life;
        this.inertia = 0.99;
    }

    destroy() {
        this.delete = true;
    }

    render() {

    }
}
export default Particle