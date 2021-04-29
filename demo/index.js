import { Particle, Environment, Vector } from "../src";

class Flake extends Particle {
  draw(context) {
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    context.fillStyle = "red";
    context.fill();
  }
}

function main() {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  const gui = new dat.GUI();
  const button = document.getElementById("action");
  let { width, height } = canvas;

  const env = new Environment({
    context: ctx,
    width: width,
    height: height,
    gravity: 1,
    friction: 0.02,
  });
  gui.add(env, "gravity", 0, 5).step(0.001);
  gui.add(env, "friction", 0, 0.05).step(0.001);
  let ball = new Flake({
    radius: 10,
    position: new Vector(50, 50),
    mass: 0.5,
    damping: 0.01,
    initialSpeed: new Vector(20, 0),
  });
  gui.add(ball, "mass", 0, 3).step(0.1);
  gui.add(ball, "damping", 0, 0.05).step(0.001);
  ball.insertInto(env);

  function resize() {
    const { innerWidth, innerHeight } = window;
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    width = innerWidth;
    height = innerHeight;

    env.resize(width, height);
  }

  function click() {
    if (env.particles.length === 0) {
      ball.position = new Vector(50, 50);
      ball.speed = new Vector(10, 0);
      ball.insertInto(env);
      return;
    }
    if (ball.isPinned) {
      ball.unpin();
      return;
    }
    ball.pinTo(300, 300, 0.005);
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    env.tick();
    window.requestAnimationFrame(draw);
  }

  resize();
  draw();
  window.addEventListener("resize", resize);

  button.onclick = click;
}

document.addEventListener("DOMContentLoaded", main);
