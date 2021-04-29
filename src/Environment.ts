import { IParticle } from "./Particle";
import { IVector, Vector } from "./Vector";

export interface IEnvironment {
  context: CanvasRenderingContext2D;
  width: number;
  height: number;
  gravity: number;
  friction: number;
  particles: IParticle[];
  //forcefields: IForceField[]; --> //TODO
  //index --> //TODO
  resize(width: number, height: number): void;
  append(particle: IParticle): void;
  remove(particle: IParticle): void;
  isInBoundaries(element: IParticle): boolean;
  // appendForceField(params: object): void; --> //TODO
  //removeForceField() --> //TODO
  tick(): void;
}

type EnvironmentConstructor = {
  context: CanvasRenderingContext2D;
  width: number;
  height: number;
  gravity: number;
  friction: number;
};

export class Environment implements IEnvironment {
  static calculateGravity(mass: number, gravity: number): IVector {
    return new Vector(0, mass * gravity);
  }

  static calculateFriction(speed: IVector, friction: number): IVector {
    const force = new Vector(speed.x, speed.y);
    force.scale(-friction);
    return force;
  }

  context: CanvasRenderingContext2D;
  width: number;
  height: number;
  gravity: number;
  friction: number;
  particles: IParticle[];

  constructor({
    context,
    width = 0,
    height = 0,
    gravity = 0,
    friction = 0,
  }: EnvironmentConstructor) {
    if (!context) {
      console.error("Canvas context required to render the environment");
      return;
    }
    this.context = context;
    this.width = width;
    this.height = height;
    this.gravity = gravity;
    this.friction = friction;
    this.particles = [];
  }

  resize(width: number, height: number): void {
    this.width = width;
    this.height = height;
  }

  isInBoundaries(element: IParticle): boolean {
    if (element.x - element.radius < 0) return false;
    if (element.x + element.radius > this.width) return false;
    if (element.y - element.radius < 0) return false;
    if (element.y - element.radius > this.height) return false;
    return true;
  }

  append(particle: IParticle): void {
    this.particles.push(particle);
  }

  remove(particle: IParticle): void {
    const index = this.particles.indexOf(particle);
    this.particles.splice(index, 1);
  }

  tick(): void {
    this.particles.forEach((particle, index) => {
      if (this.gravity && !particle.isPinned) {
        const gravity = Environment.calculateGravity(
          particle.mass,
          this.gravity
        );
        particle.addForce("gravity", gravity);
      }
      if (this.friction) {
        const friction = Environment.calculateFriction(
          particle.speed,
          this.friction
        );
        particle.addForce("friction", friction);
      }
      particle.applyPhysics();
      if (!this.isInBoundaries(particle)) this.remove(particle);
      particle.draw(this.context);
    });
  }
}

export default Environment;
