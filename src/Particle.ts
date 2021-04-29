import { Vector, IVector } from "./Vector";
import { IEnvironment } from "./Environment";

export interface IParticle {
  readonly x: number;
  readonly y: number;
  readonly isPinned: boolean;
  position: IVector;
  radius: number;
  mass: number;
  damping: number;
  target: IVector;
  tightness: number;
  speed: IVector;
  forces: Map<string, IVector>;
  insertInto(environment: IEnvironment): void;
  addForce(name: string, force: IVector): void;
  pinTo(x: number, y: number, tightness: number): void;
  unpin(): void;
  addAttractionForce(): void;
  applyPhysics(): void;
  draw(context: CanvasRenderingContext2D): void;
}

export class Particle implements IParticle {
  static maxSpeed(
    mass: number,
    gravity: number,
    friction: number,
    damping: number
  ): IVector {
    return new Vector(0, (gravity * mass * (1 - damping)) / friction);
  }

  static mass(
    targetSpeed: IVector,
    gravity: number,
    friction: number,
    damping: number
  ): number {
    return (targetSpeed.y * friction) / (gravity * (1 - damping));
  }

  static damping(
    targetSpeed: IVector,
    gravity: number,
    friction: number,
    mass: number
  ): number {
    return 1 - (targetSpeed.y * friction) / (mass * gravity);
  }

  position: IVector;
  radius: number;
  mass: number;
  damping: number;
  target: IVector;
  tightness: number;
  speed: IVector;
  forces: Map<string, IVector>;

  get x() {
    return this.position.x;
  }

  get y() {
    return this.position.y;
  }

  get isPinned() {
    return this.target ? true : false;
  }

  constructor({
    position = new Vector(),
    radius = 0,
    mass = 0,
    damping = 0,
    initialSpeed = new Vector(),
  }) {
    this.position = new Vector(position.x, position.y);
    this.radius = radius;
    this.mass = mass;
    this.damping = damping;
    this.speed = new Vector(initialSpeed.x, initialSpeed.y);
    this.forces = new Map();
    this.target = null;
    this.tightness = 0;
  }

  insertInto(environment: IEnvironment): void {
    environment.append(this);
  }

  addForce(name: string, force: IVector): void {
    this.forces.set(name, new Vector(force.x, force.y));
  }

  pinTo(x: number, y: number, tightness: number): void {
    this.target = new Vector(x, y);
    this.tightness = tightness;
  }

  unpin(): void {
    this.target = null;
  }

  addAttractionForce(): void {
    const attractionForce = this.position.differenceWith(this.target);
    attractionForce.scale(this.tightness);
    this.addForce("attraction", attractionForce);
  }

  applyPhysics(): void {
    if (this.isPinned) this.addAttractionForce();
    const acceleration = Vector.sum(this.forces);
    this.forces.clear();
    this.speed.translate(acceleration);
    this.speed.scale(1 - this.damping);
    this.position.translate(this.speed);
  }

  draw(context: CanvasRenderingContext2D): void {
    // Should be overwritten by children definitions
    console.debug(`Nothing to draw for this kind of particle`);
  }
}

export default Particle;
