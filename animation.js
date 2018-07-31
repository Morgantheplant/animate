import {
  World,
  Bodies,
  Body,
  Render,
  Composite,
  Composites,
  Constraint,
  Runner,
  Engine
} from "matter-js";

const svgns = "http://www.w3.org/2000/svg";

const width = 43,
  height = 20,
  padding = 3,
  initColor = "#26333c",
  initHighlight = "#014971";

export class MainAnimation {
  constructor(options) {
    this.engine = Engine.create();
    this.svgBods = [];
    this.physicsBodies = [];
    this.vertSprings = [];
    this.horzSprings = [];
    this.mainBackground = options.el;
    this.animationLoop = options.animationLoop;
    this._matterEngine = this.matterEngine.bind(this);
    this.createBodies = this.createBodies.bind(this);
    this._render = this.render.bind(this);
    this.name = options.name;
    return this;
  }

  init(data) {
    this.createBodies(data);
    World.add(
      this.engine.world,
      this.physicsBodies.concat(this.vertSprings.concat(this.horzSprings))
    );
    this.animationLoop.addAnimation(this._matterEngine);
    this.animationLoop.addAnimation(this._render);
    this.animationLoop.start();
    this.debug();
  }

  render() {
    let bodies = Composite.allBodies(this.engine.world);
    let constraints = Composite.allConstraints(this.engine.world);
    for (let i = 0; i < bodies.length; i++) {
      let vertices = bodies[i].vertices;
      let circle = this.svgBods[i];
      if (circle) {
        circle.setAttributeNS(null, "r", vertices[0].y / 12);
      }
    }
  }

  matterEngine() {
    Engine.update(this.engine, 1000 / 60);

  }

  debug() {

    // var renderer = Render.create({
    //   element: document.body,
    //   engine: this.engine
    // });
    // Render.run(renderer);
     var runner = Runner.create();
    Runner.run(runner, this.engine);
    
  }

  _mouseOver(i) {
    return () => {
      const body = this.physicsBodies[i];
      Body.setVelocity(body, { x: 0, y: 5 }, { x: 0.0, y: 0.001 });
    };
  }

  createBodies(values) {
    for (var i = 0; i < values.length; i++) {
      let physicsBody = this.createPhysicsBodies(i);
      let circle = this.createSVG(i);
      circle.addEventListener("click", this._mouseOver(i));
      circle.addEventListener("mouseover", this._mouseOver(i));
    }
  }

  createPhysicsBodies(i) {
    // create physics bodies
    let xCoordP = 20 * i + 20 * (i + 1);
    let physicsBody = Bodies.rectangle(xCoordP, 50, 10, 10);
    let vertSpring = Constraint.create({
      bodyA: physicsBody,
      pointB: { x: xCoordP, y: 0 }
    });
    vertSpring.stiffness = 0.001;
    vertSpring.length = 50;

    let prevBody = this.physicsBodies[i - 1];
    if (prevBody) {
      let horizontalSpring = Constraint.create({
        bodyA: physicsBody,
        bodyB: prevBody
      });
      horizontalSpring.length = 40;
      horizontalSpring.stiffness = 0.001;
      horizontalSpring.dampening = 0;
      this.horzSprings.push(horizontalSpring);
    }
    this.vertSprings.push(vertSpring);
    this.physicsBodies.push(physicsBody);

    return physicsBody;
  }
  createSVG(i) {
    const initialSize = 20;
    const padding = 40;
    const xCoord = initialSize * 2 * (i + 1) + padding * i;
    const circle = document.createElementNS(svgns, "circle");
    circle.setAttributeNS(null, "cx", xCoord);
    circle.setAttributeNS(null, "cy", 50);
    circle.setAttributeNS(null, "r", initialSize);
    circle.setAttributeNS(null, "style", "fill: grey; opacity: 0.5;");
    this.mainBackground.appendChild(circle);
    this.svgBods.push(circle);
    return circle;
  }
}