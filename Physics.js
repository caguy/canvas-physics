/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/Environment.ts":
/*!****************************!*\
  !*** ./src/Environment.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Environment": () => (/* binding */ Environment),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Vector__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Vector */ "./src/Vector.ts");

var Environment = /** @class */ (function () {
    function Environment(_a) {
        var context = _a.context, _b = _a.width, width = _b === void 0 ? 0 : _b, _c = _a.height, height = _c === void 0 ? 0 : _c, _d = _a.gravity, gravity = _d === void 0 ? 0 : _d, _e = _a.friction, friction = _e === void 0 ? 0 : _e;
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
    Environment.calculateGravity = function (mass, gravity) {
        return new _Vector__WEBPACK_IMPORTED_MODULE_0__.Vector(0, mass * gravity);
    };
    Environment.calculateFriction = function (speed, friction) {
        var force = new _Vector__WEBPACK_IMPORTED_MODULE_0__.Vector(speed.x, speed.y);
        force.scale(-friction);
        return force;
    };
    Environment.prototype.resize = function (width, height) {
        this.width = width;
        this.height = height;
    };
    Environment.prototype.isInBoundaries = function (element) {
        if (element.x - element.radius < 0)
            return false;
        if (element.x + element.radius > this.width)
            return false;
        if (element.y - element.radius < 0)
            return false;
        if (element.y - element.radius > this.height)
            return false;
        return true;
    };
    Environment.prototype.append = function (particle) {
        this.particles.push(particle);
    };
    Environment.prototype.remove = function (particle) {
        var index = this.particles.indexOf(particle);
        this.particles.splice(index, 1);
    };
    Environment.prototype.tick = function () {
        var _this = this;
        this.particles.forEach(function (particle, index) {
            if (_this.gravity && !particle.isPinned) {
                var gravity = Environment.calculateGravity(particle.mass, _this.gravity);
                particle.addForce("gravity", gravity);
            }
            if (_this.friction) {
                var friction = Environment.calculateFriction(particle.speed, _this.friction);
                particle.addForce("friction", friction);
            }
            particle.applyPhysics();
            if (!_this.isInBoundaries(particle))
                _this.remove(particle);
            particle.draw(_this.context);
        });
    };
    return Environment;
}());

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Environment);


/***/ }),

/***/ "./src/Particle.ts":
/*!*************************!*\
  !*** ./src/Particle.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Particle": () => (/* binding */ Particle),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Vector__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Vector */ "./src/Vector.ts");

var Particle = /** @class */ (function () {
    function Particle(_a) {
        var _b = _a.position, position = _b === void 0 ? new _Vector__WEBPACK_IMPORTED_MODULE_0__.Vector() : _b, _c = _a.radius, radius = _c === void 0 ? 0 : _c, _d = _a.mass, mass = _d === void 0 ? 0 : _d, _e = _a.damping, damping = _e === void 0 ? 0 : _e, _f = _a.initialSpeed, initialSpeed = _f === void 0 ? new _Vector__WEBPACK_IMPORTED_MODULE_0__.Vector() : _f;
        this.position = new _Vector__WEBPACK_IMPORTED_MODULE_0__.Vector(position.x, position.y);
        this.radius = radius;
        this.mass = mass;
        this.damping = damping;
        this.speed = new _Vector__WEBPACK_IMPORTED_MODULE_0__.Vector(initialSpeed.x, initialSpeed.y);
        this.forces = new Map();
        this.target = null;
        this.tightness = 0;
    }
    Particle.maxSpeed = function (mass, gravity, friction, damping) {
        return new _Vector__WEBPACK_IMPORTED_MODULE_0__.Vector(0, (gravity * mass * (1 - damping)) / friction);
    };
    Particle.mass = function (targetSpeed, gravity, friction, damping) {
        return (targetSpeed.y * friction) / (gravity * (1 - damping));
    };
    Particle.damping = function (targetSpeed, gravity, friction, mass) {
        return 1 - (targetSpeed.y * friction) / (mass * gravity);
    };
    Object.defineProperty(Particle.prototype, "x", {
        get: function () {
            return this.position.x;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Particle.prototype, "y", {
        get: function () {
            return this.position.y;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Particle.prototype, "isPinned", {
        get: function () {
            return this.target ? true : false;
        },
        enumerable: false,
        configurable: true
    });
    Particle.prototype.insertInto = function (environment) {
        environment.append(this);
    };
    Particle.prototype.addForce = function (name, force) {
        this.forces.set(name, new _Vector__WEBPACK_IMPORTED_MODULE_0__.Vector(force.x, force.y));
    };
    Particle.prototype.pinTo = function (x, y, tightness) {
        this.target = new _Vector__WEBPACK_IMPORTED_MODULE_0__.Vector(x, y);
        this.tightness = tightness;
    };
    Particle.prototype.unpin = function () {
        this.target = null;
    };
    Particle.prototype.addAttractionForce = function () {
        var attractionForce = this.position.differenceWith(this.target);
        attractionForce.scale(this.tightness);
        this.addForce("attraction", attractionForce);
    };
    Particle.prototype.applyPhysics = function () {
        if (this.isPinned)
            this.addAttractionForce();
        var acceleration = _Vector__WEBPACK_IMPORTED_MODULE_0__.Vector.sum(this.forces);
        this.forces.clear();
        this.speed.translate(acceleration);
        this.speed.scale(1 - this.damping);
        this.position.translate(this.speed);
    };
    Particle.prototype.draw = function (context) {
        // Should be overwritten by children definitions
        console.debug("Nothing to draw for this kind of particle");
    };
    return Particle;
}());

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Particle);


/***/ }),

/***/ "./src/Vector.ts":
/*!***********************!*\
  !*** ./src/Vector.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Vector": () => (/* binding */ Vector),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
var Vector = /** @class */ (function () {
    function Vector(x, y) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        this.x = x;
        this.y = y;
    }
    Vector.getLength = function (x, y) {
        return Math.sqrt(x * x + y * y);
    };
    Vector.getDistance = function (pointA, pointB) {
        return Vector.getLength(pointB.x - pointA.x, pointB.y - pointA.y);
    };
    Vector.getDifference = function (vectorA, vectorB) {
        return new Vector(vectorB.x - vectorA.x, vectorB.y - vectorA.y);
    };
    Vector.sum = function (vectors) {
        var result = new Vector();
        vectors.forEach(function (vector) {
            result.translate(vector);
        });
        return result;
    };
    Object.defineProperty(Vector.prototype, "length", {
        get: function () {
            return Vector.getLength(this.x, this.y);
        },
        enumerable: false,
        configurable: true
    });
    Vector.prototype.translate = function (_a) {
        var x = _a.x, y = _a.y;
        this.x += x;
        this.y += y;
    };
    Vector.prototype.scale = function (ratio) {
        this.x *= ratio;
        this.y *= ratio;
    };
    Vector.prototype.distanceTo = function (vector) {
        return Vector.getDistance(this, vector);
    };
    Vector.prototype.differenceWith = function (vector) {
        return Vector.getDifference(this, vector);
    };
    return Vector;
}());

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Vector);


/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Environment": () => (/* reexport safe */ _Environment__WEBPACK_IMPORTED_MODULE_0__.default),
/* harmony export */   "Particle": () => (/* reexport safe */ _Particle__WEBPACK_IMPORTED_MODULE_1__.default),
/* harmony export */   "Vector": () => (/* reexport safe */ _Vector__WEBPACK_IMPORTED_MODULE_2__.default)
/* harmony export */ });
/* harmony import */ var _Environment__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Environment */ "./src/Environment.ts");
/* harmony import */ var _Particle__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Particle */ "./src/Particle.ts");
/* harmony import */ var _Vector__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Vector */ "./src/Vector.ts");






/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		var scriptUrl;
/******/ 		if (__webpack_require__.g.importScripts) scriptUrl = __webpack_require__.g.location + "";
/******/ 		var document = __webpack_require__.g.document;
/******/ 		if (!scriptUrl && document) {
/******/ 			if (document.currentScript)
/******/ 				scriptUrl = document.currentScript.src
/******/ 			if (!scriptUrl) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				if(scripts.length) scriptUrl = scripts[scripts.length - 1].src
/******/ 			}
/******/ 		}
/******/ 		// When supporting browsers where an automatic publicPath is not supported you must specify an output.publicPath manually via configuration
/******/ 		// or pass an empty string ("") and set the __webpack_public_path__ variable from your code to use your own logic.
/******/ 		if (!scriptUrl) throw new Error("Automatic publicPath is not supported in this browser");
/******/ 		scriptUrl = scriptUrl.replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/");
/******/ 		__webpack_require__.p = scriptUrl;
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
var __webpack_exports__ = {};
/*!***********************!*\
  !*** ./demo/index.js ***!
  \***********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _src__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../src */ "./src/index.ts");


class Flake extends _src__WEBPACK_IMPORTED_MODULE_0__.Particle {
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

  const env = new _src__WEBPACK_IMPORTED_MODULE_0__.Environment({
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
    position: new _src__WEBPACK_IMPORTED_MODULE_0__.Vector(50, 50),
    mass: 0.5,
    damping: 0.01,
    initialSpeed: new _src__WEBPACK_IMPORTED_MODULE_0__.Vector(20, 0),
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
      ball.position = new _src__WEBPACK_IMPORTED_MODULE_0__.Vector(50, 50);
      ball.speed = new _src__WEBPACK_IMPORTED_MODULE_0__.Vector(10, 0);
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

})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!*************************!*\
  !*** ./demo/index.html ***!
  \*************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "index.html");
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9jYW52YXMtcGh5c2ljcy8uL3NyYy9FbnZpcm9ubWVudC50cyIsIndlYnBhY2s6Ly9jYW52YXMtcGh5c2ljcy8uL3NyYy9QYXJ0aWNsZS50cyIsIndlYnBhY2s6Ly9jYW52YXMtcGh5c2ljcy8uL3NyYy9WZWN0b3IudHMiLCJ3ZWJwYWNrOi8vY2FudmFzLXBoeXNpY3MvLi9zcmMvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vY2FudmFzLXBoeXNpY3Mvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vY2FudmFzLXBoeXNpY3Mvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2NhbnZhcy1waHlzaWNzL3dlYnBhY2svcnVudGltZS9nbG9iYWwiLCJ3ZWJwYWNrOi8vY2FudmFzLXBoeXNpY3Mvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9jYW52YXMtcGh5c2ljcy93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2NhbnZhcy1waHlzaWNzL3dlYnBhY2svcnVudGltZS9wdWJsaWNQYXRoIiwid2VicGFjazovL2NhbnZhcy1waHlzaWNzLy4vZGVtby9pbmRleC5qcyIsIndlYnBhY2s6Ly9jYW52YXMtcGh5c2ljcy8uL2RlbW8vaW5kZXguaHRtbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0FBQzJDO0FBNEIzQztJQWtCRSxxQkFBWSxFQU1hO1lBTHZCLE9BQU8sZUFDUCxhQUFTLEVBQVQsS0FBSyxtQkFBRyxDQUFDLE9BQ1QsY0FBVSxFQUFWLE1BQU0sbUJBQUcsQ0FBQyxPQUNWLGVBQVcsRUFBWCxPQUFPLG1CQUFHLENBQUMsT0FDWCxnQkFBWSxFQUFaLFFBQVEsbUJBQUcsQ0FBQztRQUVaLElBQUksQ0FBQyxPQUFPLEVBQUU7WUFDWixPQUFPLENBQUMsS0FBSyxDQUFDLG1EQUFt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O1dBQ0Esc0RBQXNELGtCQUFrQjtXQUN4RTtXQUNBLCtDQUErQyxjQUFjO1dBQzdELEU7Ozs7O1dDTkE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0Esa0M7Ozs7Ozs7Ozs7Ozs7QUNmdUQ7O0FBRXZELG9CQUFvQiwwQ0FBUTtBQUM1QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTyxnQkFBZ0I7O0FBRXZCLGtCQUFrQiw2Q0FBVztBQUM3QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCLHdDQUFNO0FBQ3hCO0FBQ0E7QUFDQSxzQkFBc0Isd0NBQU07QUFDNUIsR0FBRztBQUNIO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLFdBQVcsMEJBQTBCO0FBQ3JDO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLDBCQUEwQix3Q0FBTTtBQUNoQyx1QkFBdUIsd0NBQU07QUFDN0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7Ozs7QUMzRUEsaUVBQWUscUJBQXVCLGVBQWUsRSIsImZpbGUiOiJQaHlzaWNzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSVBhcnRpY2xlIH0gZnJvbSBcIi4vUGFydGljbGVcIjtcbmltcG9ydCB7IElWZWN0b3IsIFZlY3RvciB9IGZyb20gXCIuL1ZlY3RvclwiO1xuXG5leHBvcnQgaW50ZXJmYWNlIElFbnZpcm9ubWVudCB7XG4gIGNvbnRleHQ6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRDtcbiAgd2lkdGg6IG51bWJlcjtcbiAgaGVpZ2h0OiBudW1iZXI7XG4gIGdyYXZpdHk6IG51bWJlcjtcbiAgZnJpY3Rpb246IG51bWJlcjtcbiAgcGFydGljbGVzOiBJUGFydGljbGVbXTtcbiAgLy9mb3JjZWZpZWxkczogSUZvcmNlRmllbGRbXTsgLS0+IC8vVE9ET1xuICAvL2luZGV4IC0tPiAvL1RPRE9cbiAgcmVzaXplKHdpZHRoOiBudW1iZXIsIGhlaWdodDogbnVtYmVyKTogdm9pZDtcbiAgYXBwZW5kKHBhcnRpY2xlOiBJUGFydGljbGUpOiB2b2lkO1xuICByZW1vdmUocGFydGljbGU6IElQYXJ0aWNsZSk6IHZvaWQ7XG4gIGlzSW5Cb3VuZGFyaWVzKGVsZW1lbnQ6IElQYXJ0aWNsZSk6IGJvb2xlYW47XG4gIC8vIGFwcGVuZEZvcmNlRmllbGQocGFyYW1zOiBvYmplY3QpOiB2b2lkOyAtLT4gLy9UT0RPXG4gIC8vcmVtb3ZlRm9yY2VGaWVsZCgpIC0tPiAvL1RPRE9cbiAgdGljaygpOiB2b2lkO1xufVxuXG50eXBlIEVudmlyb25tZW50Q29uc3RydWN0b3IgPSB7XG4gIGNvbnRleHQ6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRDtcbiAgd2lkdGg6IG51bWJlcjtcbiAgaGVpZ2h0OiBudW1iZXI7XG4gIGdyYXZpdHk6IG51bWJlcjtcbiAgZnJpY3Rpb246IG51bWJlcjtcbn07XG5cbmV4cG9ydCBjbGFzcyBFbnZpcm9ubWVudCBpbXBsZW1lbnRzIElFbnZpcm9ubWVudCB7XG4gIHN0YXRpYyBjYWxjdWxhdGVHcmF2aXR5KG1hc3M6IG51bWJlciwgZ3Jhdml0eTogbnVtYmVyKTogSVZlY3RvciB7XG4gICAgcmV0dXJuIG5ldyBWZWN0b3IoMCwgbWFzcyAqIGdyYXZpdHkpO1xuICB9XG5cbiAgc3RhdGljIGNhbGN1bGF0ZUZyaWN0aW9uKHNwZWVkOiBJVmVjdG9yLCBmcmljdGlvbjogbnVtYmVyKTogSVZlY3RvciB7XG4gICAgY29uc3QgZm9yY2UgPSBuZXcgVmVjdG9yKHNwZWVkLngsIHNwZWVkLnkpO1xuICAgIGZvcmNlLnNjYWxlKC1mcmljdGlvbik7XG4gICAgcmV0dXJuIGZvcmNlO1xuICB9XG5cbiAgY29udGV4dDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEO1xuICB3aWR0aDogbnVtYmVyO1xuICBoZWlnaHQ6IG51bWJlcjtcbiAgZ3Jhdml0eTogbnVtYmVyO1xuICBmcmljdGlvbjogbnVtYmVyO1xuICBwYXJ0aWNsZXM6IElQYXJ0aWNsZVtdO1xuXG4gIGNvbnN0cnVjdG9yKHtcbiAgICBjb250ZXh0LFxuICAgIHdpZHRoID0gMCxcbiAgICBoZWlnaHQgPSAwLFxuICAgIGdyYXZpdHkgPSAwLFxuICAgIGZyaWN0aW9uID0gMCxcbiAgfTogRW52aXJvbm1lbnRDb25zdHJ1Y3Rvcikge1xuICAgIGlmICghY29udGV4dCkge1xuICAgICAgY29uc29sZS5lcnJvcihcIkNhbnZhcyBjb250ZXh0IHJlcXVpcmVkIHRvIHJlbmRlciB0aGUgZW52aXJvbm1lbnRcIik7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMuY29udGV4dCA9IGNvbnRleHQ7XG4gICAgdGhpcy53aWR0aCA9IHdpZHRoO1xuICAgIHRoaXMuaGVpZ2h0ID0gaGVpZ2h0O1xuICAgIHRoaXMuZ3Jhdml0eSA9IGdyYXZpdHk7XG4gICAgdGhpcy5mcmljdGlvbiA9IGZyaWN0aW9uO1xuICAgIHRoaXMucGFydGljbGVzID0gW107XG4gIH1cblxuICByZXNpemUod2lkdGg6IG51bWJlciwgaGVpZ2h0OiBudW1iZXIpOiB2b2lkIHtcbiAgICB0aGlzLndpZHRoID0gd2lkdGg7XG4gICAgdGhpcy5oZWlnaHQgPSBoZWlnaHQ7XG4gIH1cblxuICBpc0luQm91bmRhcmllcyhlbGVtZW50OiBJUGFydGljbGUpOiBib29sZWFuIHtcbiAgICBpZiAoZWxlbWVudC54IC0gZWxlbWVudC5yYWRpdXMgPCAwKSByZXR1cm4gZmFsc2U7XG4gICAgaWYgKGVsZW1lbnQueCArIGVsZW1lbnQucmFkaXVzID4gdGhpcy53aWR0aCkgcmV0dXJuIGZhbHNlO1xuICAgIGlmIChlbGVtZW50LnkgLSBlbGVtZW50LnJhZGl1cyA8IDApIHJldHVybiBmYWxzZTtcbiAgICBpZiAoZWxlbWVudC55IC0gZWxlbWVudC5yYWRpdXMgPiB0aGlzLmhlaWdodCkgcmV0dXJuIGZhbHNlO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgYXBwZW5kKHBhcnRpY2xlOiBJUGFydGljbGUpOiB2b2lkIHtcbiAgICB0aGlzLnBhcnRpY2xlcy5wdXNoKHBhcnRpY2xlKTtcbiAgfVxuXG4gIHJlbW92ZShwYXJ0aWNsZTogSVBhcnRpY2xlKTogdm9pZCB7XG4gICAgY29uc3QgaW5kZXggPSB0aGlzLnBhcnRpY2xlcy5pbmRleE9mKHBhcnRpY2xlKTtcbiAgICB0aGlzLnBhcnRpY2xlcy5zcGxpY2UoaW5kZXgsIDEpO1xuICB9XG5cbiAgdGljaygpOiB2b2lkIHtcbiAgICB0aGlzLnBhcnRpY2xlcy5mb3JFYWNoKChwYXJ0aWNsZSwgaW5kZXgpID0+IHtcbiAgICAgIGlmICh0aGlzLmdyYXZpdHkgJiYgIXBhcnRpY2xlLmlzUGlubmVkKSB7XG4gICAgICAgIGNvbnN0IGdyYXZpdHkgPSBFbnZpcm9ubWVudC5jYWxjdWxhdGVHcmF2aXR5KFxuICAgICAgICAgIHBhcnRpY2xlLm1hc3MsXG4gICAgICAgICAgdGhpcy5ncmF2aXR5XG4gICAgICAgICk7XG4gICAgICAgIHBhcnRpY2xlLmFkZEZvcmNlKFwiZ3Jhdml0eVwiLCBncmF2aXR5KTtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLmZyaWN0aW9uKSB7XG4gICAgICAgIGNvbnN0IGZyaWN0aW9uID0gRW52aXJvbm1lbnQuY2FsY3VsYXRlRnJpY3Rpb24oXG4gICAgICAgICAgcGFydGljbGUuc3BlZWQsXG4gICAgICAgICAgdGhpcy5mcmljdGlvblxuICAgICAgICApO1xuICAgICAgICBwYXJ0aWNsZS5hZGRGb3JjZShcImZyaWN0aW9uXCIsIGZyaWN0aW9uKTtcbiAgICAgIH1cbiAgICAgIHBhcnRpY2xlLmFwcGx5UGh5c2ljcygpO1xuICAgICAgaWYgKCF0aGlzLmlzSW5Cb3VuZGFyaWVzKHBhcnRpY2xlKSkgdGhpcy5yZW1vdmUocGFydGljbGUpO1xuICAgICAgcGFydGljbGUuZHJhdyh0aGlzLmNvbnRleHQpO1xuICAgIH0pO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEVudmlyb25tZW50O1xuIiwiaW1wb3J0IHsgVmVjdG9yLCBJVmVjdG9yIH0gZnJvbSBcIi4vVmVjdG9yXCI7XG5pbXBvcnQgeyBJRW52aXJvbm1lbnQgfSBmcm9tIFwiLi9FbnZpcm9ubWVudFwiO1xuXG5leHBvcnQgaW50ZXJmYWNlIElQYXJ0aWNsZSB7XG4gIHJlYWRvbmx5IHg6IG51bWJlcjtcbiAgcmVhZG9ubHkgeTogbnVtYmVyO1xuICByZWFkb25seSBpc1Bpbm5lZDogYm9vbGVhbjtcbiAgcG9zaXRpb246IElWZWN0b3I7XG4gIHJhZGl1czogbnVtYmVyO1xuICBtYXNzOiBudW1iZXI7XG4gIGRhbXBpbmc6IG51bWJlcjtcbiAgdGFyZ2V0OiBJVmVjdG9yO1xuICB0aWdodG5lc3M6IG51bWJlcjtcbiAgc3BlZWQ6IElWZWN0b3I7XG4gIGZvcmNlczogTWFwPHN0cmluZywgSVZlY3Rvcj47XG4gIGluc2VydEludG8oZW52aXJvbm1lbnQ6IElFbnZpcm9ubWVudCk6IHZvaWQ7XG4gIGFkZEZvcmNlKG5hbWU6IHN0cmluZywgZm9yY2U6IElWZWN0b3IpOiB2b2lkO1xuICBwaW5Ubyh4OiBudW1iZXIsIHk6IG51bWJlciwgdGlnaHRuZXNzOiBudW1iZXIpOiB2b2lkO1xuICB1bnBpbigpOiB2b2lkO1xuICBhZGRBdHRyYWN0aW9uRm9yY2UoKTogdm9pZDtcbiAgYXBwbHlQaHlzaWNzKCk6IHZvaWQ7XG4gIGRyYXcoY29udGV4dDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEKTogdm9pZDtcbn1cblxuZXhwb3J0IGNsYXNzIFBhcnRpY2xlIGltcGxlbWVudHMgSVBhcnRpY2xlIHtcbiAgc3RhdGljIG1heFNwZWVkKFxuICAgIG1hc3M6IG51bWJlcixcbiAgICBncmF2aXR5OiBudW1iZXIsXG4gICAgZnJpY3Rpb246IG51bWJlcixcbiAgICBkYW1waW5nOiBudW1iZXJcbiAgKTogSVZlY3RvciB7XG4gICAgcmV0dXJuIG5ldyBWZWN0b3IoMCwgKGdyYXZpdHkgKiBtYXNzICogKDEgLSBkYW1waW5nKSkgLyBmcmljdGlvbik7XG4gIH1cblxuICBzdGF0aWMgbWFzcyhcbiAgICB0YXJnZXRTcGVlZDogSVZlY3RvcixcbiAgICBncmF2aXR5OiBudW1iZXIsXG4gICAgZnJpY3Rpb246IG51bWJlcixcbiAgICBkYW1waW5nOiBudW1iZXJcbiAgKTogbnVtYmVyIHtcbiAgICByZXR1cm4gKHRhcmdldFNwZWVkLnkgKiBmcmljdGlvbikgLyAoZ3Jhdml0eSAqICgxIC0gZGFtcGluZykpO1xuICB9XG5cbiAgc3RhdGljIGRhbXBpbmcoXG4gICAgdGFyZ2V0U3BlZWQ6IElWZWN0b3IsXG4gICAgZ3Jhdml0eTogbnVtYmVyLFxuICAgIGZyaWN0aW9uOiBudW1iZXIsXG4gICAgbWFzczogbnVtYmVyXG4gICk6IG51bWJlciB7XG4gICAgcmV0dXJuIDEgLSAodGFyZ2V0U3BlZWQueSAqIGZyaWN0aW9uKSAvIChtYXNzICogZ3Jhdml0eSk7XG4gIH1cblxuICBwb3NpdGlvbjogSVZlY3RvcjtcbiAgcmFkaXVzOiBudW1iZXI7XG4gIG1hc3M6IG51bWJlcjtcbiAgZGFtcGluZzogbnVtYmVyO1xuICB0YXJnZXQ6IElWZWN0b3I7XG4gIHRpZ2h0bmVzczogbnVtYmVyO1xuICBzcGVlZDogSVZlY3RvcjtcbiAgZm9yY2VzOiBNYXA8c3RyaW5nLCBJVmVjdG9yPjtcblxuICBnZXQgeCgpIHtcbiAgICByZXR1cm4gdGhpcy5wb3NpdGlvbi54O1xuICB9XG5cbiAgZ2V0IHkoKSB7XG4gICAgcmV0dXJuIHRoaXMucG9zaXRpb24ueTtcbiAgfVxuXG4gIGdldCBpc1Bpbm5lZCgpIHtcbiAgICByZXR1cm4gdGhpcy50YXJnZXQgPyB0cnVlIDogZmFsc2U7XG4gIH1cblxuICBjb25zdHJ1Y3Rvcih7XG4gICAgcG9zaXRpb24gPSBuZXcgVmVjdG9yKCksXG4gICAgcmFkaXVzID0gMCxcbiAgICBtYXNzID0gMCxcbiAgICBkYW1waW5nID0gMCxcbiAgICBpbml0aWFsU3BlZWQgPSBuZXcgVmVjdG9yKCksXG4gIH0pIHtcbiAgICB0aGlzLnBvc2l0aW9uID0gbmV3IFZlY3Rvcihwb3NpdGlvbi54LCBwb3NpdGlvbi55KTtcbiAgICB0aGlzLnJhZGl1cyA9IHJhZGl1cztcbiAgICB0aGlzLm1hc3MgPSBtYXNzO1xuICAgIHRoaXMuZGFtcGluZyA9IGRhbXBpbmc7XG4gICAgdGhpcy5zcGVlZCA9IG5ldyBWZWN0b3IoaW5pdGlhbFNwZWVkLngsIGluaXRpYWxTcGVlZC55KTtcbiAgICB0aGlzLmZvcmNlcyA9IG5ldyBNYXAoKTtcbiAgICB0aGlzLnRhcmdldCA9IG51bGw7XG4gICAgdGhpcy50aWdodG5lc3MgPSAwO1xuICB9XG5cbiAgaW5zZXJ0SW50byhlbnZpcm9ubWVudDogSUVudmlyb25tZW50KTogdm9pZCB7XG4gICAgZW52aXJvbm1lbnQuYXBwZW5kKHRoaXMpO1xuICB9XG5cbiAgYWRkRm9yY2UobmFtZTogc3RyaW5nLCBmb3JjZTogSVZlY3Rvcik6IHZvaWQge1xuICAgIHRoaXMuZm9yY2VzLnNldChuYW1lLCBuZXcgVmVjdG9yKGZvcmNlLngsIGZvcmNlLnkpKTtcbiAgfVxuXG4gIHBpblRvKHg6IG51bWJlciwgeTogbnVtYmVyLCB0aWdodG5lc3M6IG51bWJlcik6IHZvaWQge1xuICAgIHRoaXMudGFyZ2V0ID0gbmV3IFZlY3Rvcih4LCB5KTtcbiAgICB0aGlzLnRpZ2h0bmVzcyA9IHRpZ2h0bmVzcztcbiAgfVxuXG4gIHVucGluKCk6IHZvaWQge1xuICAgIHRoaXMudGFyZ2V0ID0gbnVsbDtcbiAgfVxuXG4gIGFkZEF0dHJhY3Rpb25Gb3JjZSgpOiB2b2lkIHtcbiAgICBjb25zdCBhdHRyYWN0aW9uRm9yY2UgPSB0aGlzLnBvc2l0aW9uLmRpZmZlcmVuY2VXaXRoKHRoaXMudGFyZ2V0KTtcbiAgICBhdHRyYWN0aW9uRm9yY2Uuc2NhbGUodGhpcy50aWdodG5lc3MpO1xuICAgIHRoaXMuYWRkRm9yY2UoXCJhdHRyYWN0aW9uXCIsIGF0dHJhY3Rpb25Gb3JjZSk7XG4gIH1cblxuICBhcHBseVBoeXNpY3MoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuaXNQaW5uZWQpIHRoaXMuYWRkQXR0cmFjdGlvbkZvcmNlKCk7XG4gICAgY29uc3QgYWNjZWxlcmF0aW9uID0gVmVjdG9yLnN1bSh0aGlzLmZvcmNlcyk7XG4gICAgdGhpcy5mb3JjZXMuY2xlYXIoKTtcbiAgICB0aGlzLnNwZWVkLnRyYW5zbGF0ZShhY2NlbGVyYXRpb24pO1xuICAgIHRoaXMuc3BlZWQuc2NhbGUoMSAtIHRoaXMuZGFtcGluZyk7XG4gICAgdGhpcy5wb3NpdGlvbi50cmFuc2xhdGUodGhpcy5zcGVlZCk7XG4gIH1cblxuICBkcmF3KGNvbnRleHQ6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCk6IHZvaWQge1xuICAgIC8vIFNob3VsZCBiZSBvdmVyd3JpdHRlbiBieSBjaGlsZHJlbiBkZWZpbml0aW9uc1xuICAgIGNvbnNvbGUuZGVidWcoYE5vdGhpbmcgdG8gZHJhdyBmb3IgdGhpcyBraW5kIG9mIHBhcnRpY2xlYCk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgUGFydGljbGU7XG4iLCJleHBvcnQgaW50ZXJmYWNlIElQb2ludCB7XG4gIHg6IG51bWJlcjtcbiAgeTogbnVtYmVyO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIElWZWN0b3IgZXh0ZW5kcyBJUG9pbnQge1xuICByZWFkb25seSBsZW5ndGg6IG51bWJlcjtcbiAgdHJhbnNsYXRlKHZlY3RvcjogSVBvaW50KTogdm9pZDtcbiAgc2NhbGUocmF0aW86IG51bWJlcik6IHZvaWQ7XG4gIGRpc3RhbmNlVG8odmVjdG9yOiBJUG9pbnQpOiBudW1iZXI7XG4gIGRpZmZlcmVuY2VXaXRoKHZlY3RvcjogSVBvaW50KTogSVZlY3Rvcjtcbn1cblxuZXhwb3J0IGNsYXNzIFZlY3RvciBpbXBsZW1lbnRzIElWZWN0b3Ige1xuICBzdGF0aWMgZ2V0TGVuZ3RoKHg6IG51bWJlciwgeTogbnVtYmVyKTogbnVtYmVyIHtcbiAgICByZXR1cm4gTWF0aC5zcXJ0KHggKiB4ICsgeSAqIHkpO1xuICB9XG5cbiAgc3RhdGljIGdldERpc3RhbmNlKHBvaW50QTogSVBvaW50LCBwb2ludEI6IElQb2ludCk6IG51bWJlciB7XG4gICAgcmV0dXJuIFZlY3Rvci5nZXRMZW5ndGgocG9pbnRCLnggLSBwb2ludEEueCwgcG9pbnRCLnkgLSBwb2ludEEueSk7XG4gIH1cblxuICBzdGF0aWMgZ2V0RGlmZmVyZW5jZSh2ZWN0b3JBOiBJVmVjdG9yLCB2ZWN0b3JCOiBJVmVjdG9yKTogSVZlY3RvciB7XG4gICAgcmV0dXJuIG5ldyBWZWN0b3IodmVjdG9yQi54IC0gdmVjdG9yQS54LCB2ZWN0b3JCLnkgLSB2ZWN0b3JBLnkpO1xuICB9XG5cbiAgc3RhdGljIHN1bSh2ZWN0b3JzOiBJVmVjdG9yW10gfCBNYXA8c3RyaW5nLCBJVmVjdG9yPik6IElWZWN0b3Ige1xuICAgIGNvbnN0IHJlc3VsdDogSVZlY3RvciA9IG5ldyBWZWN0b3IoKTtcbiAgICB2ZWN0b3JzLmZvckVhY2goKHZlY3RvcjogSVZlY3RvcikgPT4ge1xuICAgICAgcmVzdWx0LnRyYW5zbGF0ZSh2ZWN0b3IpO1xuICAgIH0pO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICB4OiBudW1iZXI7XG4gIHk6IG51bWJlcjtcbiAgZ2V0IGxlbmd0aCgpIHtcbiAgICByZXR1cm4gVmVjdG9yLmdldExlbmd0aCh0aGlzLngsIHRoaXMueSk7XG4gIH1cblxuICBjb25zdHJ1Y3Rvcih4ID0gMCwgeSA9IDApIHtcbiAgICB0aGlzLnggPSB4O1xuICAgIHRoaXMueSA9IHk7XG4gIH1cblxuICB0cmFuc2xhdGUoeyB4LCB5IH06IElQb2ludCk6IHZvaWQge1xuICAgIHRoaXMueCArPSB4O1xuICAgIHRoaXMueSArPSB5O1xuICB9XG5cbiAgc2NhbGUocmF0aW86IG51bWJlcik6IHZvaWQge1xuICAgIHRoaXMueCAqPSByYXRpbztcbiAgICB0aGlzLnkgKj0gcmF0aW87XG4gIH1cblxuICBkaXN0YW5jZVRvKHZlY3RvcjogSVBvaW50KTogbnVtYmVyIHtcbiAgICByZXR1cm4gVmVjdG9yLmdldERpc3RhbmNlKHRoaXMsIHZlY3Rvcik7XG4gIH1cblxuICBkaWZmZXJlbmNlV2l0aCh2ZWN0b3I6IElWZWN0b3IpOiBJVmVjdG9yIHtcbiAgICByZXR1cm4gVmVjdG9yLmdldERpZmZlcmVuY2UodGhpcywgdmVjdG9yKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBWZWN0b3I7XG4iLCJpbXBvcnQgRW52aXJvbm1lbnQgZnJvbSBcIi4vRW52aXJvbm1lbnRcIjtcbmltcG9ydCBQYXJ0aWNsZSBmcm9tIFwiLi9QYXJ0aWNsZVwiO1xuaW1wb3J0IFZlY3RvciBmcm9tIFwiLi9WZWN0b3JcIjtcblxuZXhwb3J0IHsgRW52aXJvbm1lbnQsIFBhcnRpY2xlLCBWZWN0b3IgfTtcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLmcgPSAoZnVuY3Rpb24oKSB7XG5cdGlmICh0eXBlb2YgZ2xvYmFsVGhpcyA9PT0gJ29iamVjdCcpIHJldHVybiBnbG9iYWxUaGlzO1xuXHR0cnkge1xuXHRcdHJldHVybiB0aGlzIHx8IG5ldyBGdW5jdGlvbigncmV0dXJuIHRoaXMnKSgpO1xuXHR9IGNhdGNoIChlKSB7XG5cdFx0aWYgKHR5cGVvZiB3aW5kb3cgPT09ICdvYmplY3QnKSByZXR1cm4gd2luZG93O1xuXHR9XG59KSgpOyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJ2YXIgc2NyaXB0VXJsO1xuaWYgKF9fd2VicGFja19yZXF1aXJlX18uZy5pbXBvcnRTY3JpcHRzKSBzY3JpcHRVcmwgPSBfX3dlYnBhY2tfcmVxdWlyZV9fLmcubG9jYXRpb24gKyBcIlwiO1xudmFyIGRvY3VtZW50ID0gX193ZWJwYWNrX3JlcXVpcmVfXy5nLmRvY3VtZW50O1xuaWYgKCFzY3JpcHRVcmwgJiYgZG9jdW1lbnQpIHtcblx0aWYgKGRvY3VtZW50LmN1cnJlbnRTY3JpcHQpXG5cdFx0c2NyaXB0VXJsID0gZG9jdW1lbnQuY3VycmVudFNjcmlwdC5zcmNcblx0aWYgKCFzY3JpcHRVcmwpIHtcblx0XHR2YXIgc2NyaXB0cyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwic2NyaXB0XCIpO1xuXHRcdGlmKHNjcmlwdHMubGVuZ3RoKSBzY3JpcHRVcmwgPSBzY3JpcHRzW3NjcmlwdHMubGVuZ3RoIC0gMV0uc3JjXG5cdH1cbn1cbi8vIFdoZW4gc3VwcG9ydGluZyBicm93c2VycyB3aGVyZSBhbiBhdXRvbWF0aWMgcHVibGljUGF0aCBpcyBub3Qgc3VwcG9ydGVkIHlvdSBtdXN0IHNwZWNpZnkgYW4gb3V0cHV0LnB1YmxpY1BhdGggbWFudWFsbHkgdmlhIGNvbmZpZ3VyYXRpb25cbi8vIG9yIHBhc3MgYW4gZW1wdHkgc3RyaW5nIChcIlwiKSBhbmQgc2V0IHRoZSBfX3dlYnBhY2tfcHVibGljX3BhdGhfXyB2YXJpYWJsZSBmcm9tIHlvdXIgY29kZSB0byB1c2UgeW91ciBvd24gbG9naWMuXG5pZiAoIXNjcmlwdFVybCkgdGhyb3cgbmV3IEVycm9yKFwiQXV0b21hdGljIHB1YmxpY1BhdGggaXMgbm90IHN1cHBvcnRlZCBpbiB0aGlzIGJyb3dzZXJcIik7XG5zY3JpcHRVcmwgPSBzY3JpcHRVcmwucmVwbGFjZSgvIy4qJC8sIFwiXCIpLnJlcGxhY2UoL1xcPy4qJC8sIFwiXCIpLnJlcGxhY2UoL1xcL1teXFwvXSskLywgXCIvXCIpO1xuX193ZWJwYWNrX3JlcXVpcmVfXy5wID0gc2NyaXB0VXJsOyIsImltcG9ydCB7IFBhcnRpY2xlLCBFbnZpcm9ubWVudCwgVmVjdG9yIH0gZnJvbSBcIi4uL3NyY1wiO1xuXG5jbGFzcyBGbGFrZSBleHRlbmRzIFBhcnRpY2xlIHtcbiAgZHJhdyhjb250ZXh0KSB7XG4gICAgY29udGV4dC5iZWdpblBhdGgoKTtcbiAgICBjb250ZXh0LmFyYyh0aGlzLngsIHRoaXMueSwgdGhpcy5yYWRpdXMsIDAsIDIgKiBNYXRoLlBJKTtcbiAgICBjb250ZXh0LmZpbGxTdHlsZSA9IFwicmVkXCI7XG4gICAgY29udGV4dC5maWxsKCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gbWFpbigpIHtcbiAgY29uc3QgY2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjYW52YXNcIik7XG4gIGNvbnN0IGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIik7XG4gIGNvbnN0IGd1aSA9IG5ldyBkYXQuR1VJKCk7XG4gIGNvbnN0IGJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYWN0aW9uXCIpO1xuICBsZXQgeyB3aWR0aCwgaGVpZ2h0IH0gPSBjYW52YXM7XG5cbiAgY29uc3QgZW52ID0gbmV3IEVudmlyb25tZW50KHtcbiAgICBjb250ZXh0OiBjdHgsXG4gICAgd2lkdGg6IHdpZHRoLFxuICAgIGhlaWdodDogaGVpZ2h0LFxuICAgIGdyYXZpdHk6IDEsXG4gICAgZnJpY3Rpb246IDAuMDIsXG4gIH0pO1xuICBndWkuYWRkKGVudiwgXCJncmF2aXR5XCIsIDAsIDUpLnN0ZXAoMC4wMDEpO1xuICBndWkuYWRkKGVudiwgXCJmcmljdGlvblwiLCAwLCAwLjA1KS5zdGVwKDAuMDAxKTtcbiAgbGV0IGJhbGwgPSBuZXcgRmxha2Uoe1xuICAgIHJhZGl1czogMTAsXG4gICAgcG9zaXRpb246IG5ldyBWZWN0b3IoNTAsIDUwKSxcbiAgICBtYXNzOiAwLjUsXG4gICAgZGFtcGluZzogMC4wMSxcbiAgICBpbml0aWFsU3BlZWQ6IG5ldyBWZWN0b3IoMjAsIDApLFxuICB9KTtcbiAgZ3VpLmFkZChiYWxsLCBcIm1hc3NcIiwgMCwgMykuc3RlcCgwLjEpO1xuICBndWkuYWRkKGJhbGwsIFwiZGFtcGluZ1wiLCAwLCAwLjA1KS5zdGVwKDAuMDAxKTtcbiAgYmFsbC5pbnNlcnRJbnRvKGVudik7XG5cbiAgZnVuY3Rpb24gcmVzaXplKCkge1xuICAgIGNvbnN0IHsgaW5uZXJXaWR0aCwgaW5uZXJIZWlnaHQgfSA9IHdpbmRvdztcbiAgICBjYW52YXMud2lkdGggPSBpbm5lcldpZHRoO1xuICAgIGNhbnZhcy5oZWlnaHQgPSBpbm5lckhlaWdodDtcbiAgICB3aWR0aCA9IGlubmVyV2lkdGg7XG4gICAgaGVpZ2h0ID0gaW5uZXJIZWlnaHQ7XG5cbiAgICBlbnYucmVzaXplKHdpZHRoLCBoZWlnaHQpO1xuICB9XG5cbiAgZnVuY3Rpb24gY2xpY2soKSB7XG4gICAgaWYgKGVudi5wYXJ0aWNsZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICBiYWxsLnBvc2l0aW9uID0gbmV3IFZlY3Rvcig1MCwgNTApO1xuICAgICAgYmFsbC5zcGVlZCA9IG5ldyBWZWN0b3IoMTAsIDApO1xuICAgICAgYmFsbC5pbnNlcnRJbnRvKGVudik7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChiYWxsLmlzUGlubmVkKSB7XG4gICAgICBiYWxsLnVucGluKCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGJhbGwucGluVG8oMzAwLCAzMDAsIDAuMDA1KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGRyYXcoKSB7XG4gICAgY3R4LmNsZWFyUmVjdCgwLCAwLCB3aWR0aCwgaGVpZ2h0KTtcbiAgICBlbnYudGljaygpO1xuICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZHJhdyk7XG4gIH1cblxuICByZXNpemUoKTtcbiAgZHJhdygpO1xuICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInJlc2l6ZVwiLCByZXNpemUpO1xuXG4gIGJ1dHRvbi5vbmNsaWNrID0gY2xpY2s7XG59XG5cbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsIG1haW4pO1xuIiwiZXhwb3J0IGRlZmF1bHQgX193ZWJwYWNrX3B1YmxpY19wYXRoX18gKyBcImluZGV4Lmh0bWxcIjsiXSwic291cmNlUm9vdCI6IiJ9