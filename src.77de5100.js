// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"../node_modules/@zacktherrien/typescript-render-engine/dist/types.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var LayerType;
(function (LayerType) {
    LayerType[LayerType["STATIC"] = 0] = "STATIC";
    LayerType[LayerType["DYNAMIC"] = 1] = "DYNAMIC";
})(LayerType = exports.LayerType || (exports.LayerType = {}));
var ResizeMethod;
(function (ResizeMethod) {
    ResizeMethod[ResizeMethod["FROM_ORIGIN"] = 0] = "FROM_ORIGIN";
    ResizeMethod[ResizeMethod["FROM_CENTER"] = 1] = "FROM_CENTER";
})(ResizeMethod = exports.ResizeMethod || (exports.ResizeMethod = {}));

},{}],"../node_modules/@zacktherrien/typescript-render-engine/dist/Engine/index.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("../types");
class Engine {
    constructor() {
        this.staticLayers = [];
        this.dynamicLayers = [];
        this.shouldRender = true;
        this.lastFrameRenderedTime = null;
        this.renderingId = null;
        this.requestFrameA = this.requestFrameA.bind(this);
        this.requestFrameB = this.requestFrameB.bind(this);
    }
    getLayer(layerIndex, layerType) {
        if (layerType === types_1.LayerType.DYNAMIC) {
            return this.dynamicLayers.find((layer) => layer.layerIndex === layerIndex) || null;
        }
        else {
            return this.staticLayers.find((layer) => layer.layerIndex === layerIndex) || null;
        }
    }
    registerLayer(layer) {
        if (layer.layerType === types_1.LayerType.DYNAMIC) {
            this.dynamicLayers.push(layer);
        }
        else {
            this.staticLayers.push(layer);
        }
    }
    start() {
        this.shouldRender = true;
        this.renderingId = window.requestAnimationFrame(this.requestFrameA);
    }
    stop() {
        this.shouldRender = false;
        if (this.renderingId) {
            window.cancelAnimationFrame(this.renderingId);
        }
    }
    requestFrameA(timestamp) {
        this.render(timestamp);
        if (this.shouldRender) {
            this.renderingId = window.requestAnimationFrame(this.requestFrameB);
        }
    }
    requestFrameB(timestamp) {
        this.render(timestamp);
        if (this.shouldRender) {
            this.renderingId = window.requestAnimationFrame(this.requestFrameA);
        }
    }
    render(timestamp = 0) {
        if (!this.lastFrameRenderedTime) {
            this.lastFrameRenderedTime = timestamp;
        }
        const deltaTime = timestamp - this.lastFrameRenderedTime;
        this.lastFrameRenderedTime = timestamp;
        for (let i = 0; i < this.dynamicLayers.length; i++) {
            this.dynamicLayers[i].update(deltaTime);
            this.dynamicLayers[i].render();
        }
    }
}
exports.default = Engine;

},{"../types":"../node_modules/@zacktherrien/typescript-render-engine/dist/types.js"}],"../node_modules/@zacktherrien/typescript-render-engine/dist/RenderingLayer/index.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("../types");
class RenderingLayer {
    constructor(layerIndex, layerType, initialWidth, initialHeight, initialX = 0, initialY = 0) {
        this.layerIndex = layerIndex;
        this.layerType = layerType;
        this.entities = [];
        this.width = initialWidth === undefined ? document.body.clientWidth + 1 : initialWidth;
        this.height = initialHeight === undefined ? document.body.clientHeight + 1 : initialHeight;
        this.x = initialX;
        this.y = initialY;
        const canvas = document.createElement('canvas');
        canvas.style.position = 'absolute';
        canvas.style.zIndex = `${this.layerIndex}`;
        canvas.style.display = 'inline';
        document.body.appendChild(canvas);
        const context = canvas.getContext('2d');
        if (!context) {
            throw new Error('Could not initialize canvas 2D context.');
        }
        this.context = context;
        this.context.translate(-0.5, -0.5);
        this.resize(this.width, this.height);
        this.setPosition(this.x, this.y);
    }
    resize(newWidth, newHeight, resizeMethod = types_1.ResizeMethod.FROM_ORIGIN) {
        let xOffset = 0;
        let yOffset = 0;
        if (resizeMethod === types_1.ResizeMethod.FROM_CENTER) {
            xOffset = (this.width - newWidth) / 2;
            yOffset = (this.height - newHeight) / 2;
        }
        this.width = newWidth;
        this.height = newHeight;
        this.context.canvas.width = this.width;
        this.context.canvas.height = this.height;
        this.setPosition(this.x + xOffset, this.y + yOffset);
    }
    setPosition(newX, newY) {
        this.x = newX;
        this.y = newY;
        if (!this._isLayerWithinBounds()) {
            throw new Error('Cannot position and resize a layer outside of document body.');
        }
        this.context.canvas.style.left = `${this.x}px`;
        this.context.canvas.style.top = `${this.y}px`;
    }
    addEntity(entity) {
        if (!this._entityIsRenderable(entity)) {
            throw new Error('All entities must have a render function.');
        }
        if (this.layerType === types_1.LayerType.DYNAMIC && !this._entityIsUpdatable(entity)) {
            throw new Error('All entities of dynamic layers must have an updater function.');
        }
        this.entities.push(entity);
    }
    removeEntity(removeEntity) {
        const renderersIdx = this.entities.indexOf(removeEntity);
        if (renderersIdx !== -1) {
            this.entities.splice(renderersIdx, 1);
        }
    }
    getWidth() {
        return this.width;
    }
    getHeight() {
        return this.height;
    }
    getX() {
        return this.x;
    }
    getY() {
        return this.y;
    }
    getContext() {
        return this.context;
    }
    clear() {
        this.context.clearRect(-1, -1, this.width, this.height);
    }
    update(deltaTime) {
        if (this.layerType !== types_1.LayerType.DYNAMIC) {
            return;
        }
        for (let i = 0; i < this.entities.length; i++) {
            this.entities[i].update(deltaTime);
        }
    }
    render() {
        this.clear();
        for (let i = 0; i < this.entities.length; i++) {
            this.entities[i].render(this.context);
        }
    }
    _entityIsRenderable(entity) {
        return Boolean(entity.render);
    }
    _entityIsUpdatable(entity) {
        return Boolean(entity.update);
    }
    _isLayerWithinBounds() {
        return (this.width + this.x > document.body.clientWidth ||
            this.height + this.y > document.body.clientHeight ||
            this.x < 0 ||
            this.y < 0);
    }
}
exports.RenderingLayer = RenderingLayer;

},{"../types":"../node_modules/@zacktherrien/typescript-render-engine/dist/types.js"}],"../node_modules/@zacktherrien/typescript-render-engine/dist/index.js":[function(require,module,exports) {
"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Engine_1 = __importDefault(require("./Engine"));
var RenderingLayer_1 = require("./RenderingLayer");
exports.RenderingLayer = RenderingLayer_1.RenderingLayer;
__export(require("./types"));
exports.default = Engine_1.default;

},{"./Engine":"../node_modules/@zacktherrien/typescript-render-engine/dist/Engine/index.js","./RenderingLayer":"../node_modules/@zacktherrien/typescript-render-engine/dist/RenderingLayer/index.js","./types":"../node_modules/@zacktherrien/typescript-render-engine/dist/types.js"}],"Boids/constants.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BIRD_COUNT = 500;
exports.BIRD_WIDTH = 4;
exports.BIRD_HEIGHT = 2;
exports.BIRD_SPEED = 100 / 1000;
exports.BIRD_VISUAL_RANGE = 75;
exports.BIRD_RETURN_VELOCITY = 0;
exports.BIRD_SEPARATION_DISTANCE = 2 * Math.sqrt(exports.BIRD_WIDTH * exports.BIRD_WIDTH + exports.BIRD_HEIGHT * exports.BIRD_HEIGHT);
exports.BIRD_SEPARATION_EAGERNESS = 0.2;
exports.BIRD_COHESION_EAGERNESS = 0.01;
exports.BIRD_ALIGNMENT_EAGERNESS = 0.1;
exports.SIGHT_ANGLE = Math.PI * 0.5;
exports.SIGHT_RANGE = 50;
var LayerIndex;

(function (LayerIndex) {
  LayerIndex[LayerIndex["BACKGROUND"] = 0] = "BACKGROUND";
  LayerIndex[LayerIndex["BIRDS"] = 1] = "BIRDS";
})(LayerIndex = exports.LayerIndex || (exports.LayerIndex = {}));

;
},{}],"Boids/Vector2D/index.ts":[function(require,module,exports) {
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var Vector2D = /*#__PURE__*/function () {
  function Vector2D() {
    var x1 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var x2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

    _classCallCheck(this, Vector2D);

    this.x1 = x1;
    this.x2 = x2;
  }

  _createClass(Vector2D, [{
    key: "null",
    value: function _null() {
      this.x1 = 0;
      this.x2 = 0;
    }
  }, {
    key: "add",
    value: function add(vector) {
      this.x1 += vector.x1;
      this.x2 += vector.x2;
      return this;
    }
  }, {
    key: "sub",
    value: function sub(vector) {
      this.x1 -= vector.x1;
      this.x2 -= vector.x2;
      return this;
    }
  }, {
    key: "multiply",
    value: function multiply(scalar) {
      this.x1 *= scalar;
      this.x2 *= scalar;
      return this;
    }
  }, {
    key: "divide",
    value: function divide(scalar) {
      this.x1 /= scalar;
      this.x2 /= scalar;
      return this;
    }
  }, {
    key: "normalize",
    value: function normalize() {
      var mag = this.magnitude();

      if (mag === 0) {
        return Vector2D.ZERO();
      }

      return this.divide(mag);
    }
  }, {
    key: "magnitude",
    value: function magnitude() {
      return Math.sqrt(this.x1 * this.x1 + this.x2 * this.x2);
    }
  }, {
    key: "distance",
    value: function distance(vector) {
      return Math.sqrt(Math.pow(this.x1 - vector.x1, 2) + Math.pow(this.x2 - vector.x2, 2));
    }
  }, {
    key: "clone",
    value: function clone() {
      return new Vector2D(this.x1, this.x2);
    }
  }], [{
    key: "ZERO",
    value: function ZERO() {
      return new Vector2D(0, 0);
    }
  }, {
    key: "ONE",
    value: function ONE() {
      return new Vector2D(1, 1);
    }
  }]);

  return Vector2D;
}();

exports.default = Vector2D;
Vector2D.CONST_ZERO = Vector2D.ZERO();
Vector2D.CONST_ONE = Vector2D.ONE();
},{}],"Boids/helpers.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.fromDegree = function (degree) {
  return degree * Math.PI / 180;
};

exports.getAngle = function (vector) {
  return Math.atan2(vector.x2, vector.x1);
};

exports.flipVector = function (vector, plane, direction) {
  var angle = exports.getAngle(vector);
  var normal = 0;

  if (plane === 'x' && direction === 'left') {
    normal = 0;
  } else if (plane === 'x' && direction === 'right') {
    normal = Math.PI;
  } else if (plane === 'y' && direction === 'up') {
    normal = Math.PI * 0.5;
  } else if (plane === 'y' && direction === 'down') {
    normal = Math.PI * 1.5;
  }

  var newAngle = normal * 2 - Math.PI - angle;
  vector.x1 = Math.cos(newAngle);
  vector.x2 = Math.sin(newAngle);
};
},{}],"Boids/Bird/index.ts":[function(require,module,exports) {
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var Vector2D_1 = __importDefault(require("../Vector2D"));

var constants_1 = require("../constants");

var helpers_1 = require("../helpers");

var Bird = /*#__PURE__*/function () {
  function Bird(boids, initialX, initialY, maxX, maxY) {
    _classCallCheck(this, Bird);

    this.boids = boids;
    this.maxX = maxX;
    this.maxY = maxY;
    this.position = new Vector2D_1.default(initialX, initialY);
    var randomAngle = helpers_1.fromDegree(Math.random() * 360);
    this.velocity = new Vector2D_1.default(Math.cos(randomAngle), Math.sin(randomAngle)).normalize().multiply(constants_1.BIRD_SPEED);
    this.acceleration = Vector2D_1.default.ZERO();
    this.cohesionAccumulator = Vector2D_1.default.ZERO();
    this.separationAccumulator = Vector2D_1.default.ZERO();
    this.alignmentAccumulator = Vector2D_1.default.ZERO();
  }

  _createClass(Bird, [{
    key: "resetAccumulators",
    value: function resetAccumulators() {
      this.acceleration.null();
      this.cohesionAccumulator.null();
      this.separationAccumulator.null();
      this.alignmentAccumulator.null();
    }
  }, {
    key: "performManeuvers",
    value: function performManeuvers(birds) {
      this.resetAccumulators();
      var perceivedBirdCount = 0;

      for (var i = 0; i < birds.length; i++) {
        if (birds[i] !== this && birds[i].position.distance(this.position) < constants_1.BIRD_VISUAL_RANGE) {
          perceivedBirdCount += 1;
          this.accumulateCohesion(birds[i]);
          this.accumulateSeparation(birds[i]);
          this.accumulateAlignment(birds[i]);
        }
      }

      if (perceivedBirdCount !== 0) {
        this.acceleration.add(this.performCohesion(perceivedBirdCount)).add(this.performSeparation(perceivedBirdCount)).add(this.performAlignment(perceivedBirdCount));
      }

      this.checkBoundary();
      this.checkVelocity();
    }
  }, {
    key: "accumulateCohesion",
    value: function accumulateCohesion(bird) {
      this.cohesionAccumulator.add(bird.position);
    }
  }, {
    key: "accumulateSeparation",
    value: function accumulateSeparation(bird) {
      var positionDiff = this.position.clone().sub(bird.position);
      var distance = positionDiff.magnitude();

      if (distance <= constants_1.BIRD_SEPARATION_DISTANCE) {
        this.separationAccumulator.add(positionDiff.divide(distance));
      }
    }
  }, {
    key: "accumulateAlignment",
    value: function accumulateAlignment(bird) {
      this.alignmentAccumulator.add(bird.velocity);
    }
  }, {
    key: "performCohesion",
    value: function performCohesion(birdCount) {
      return this.cohesionAccumulator.divide(birdCount).sub(this.position).normalize().multiply(constants_1.BIRD_SPEED).sub(this.velocity).multiply(constants_1.BIRD_COHESION_EAGERNESS);
    }
  }, {
    key: "performSeparation",
    value: function performSeparation(birdCount) {
      return this.separationAccumulator.divide(birdCount).normalize().multiply(constants_1.BIRD_SPEED).sub(this.velocity).multiply(constants_1.BIRD_SEPARATION_EAGERNESS);
    }
  }, {
    key: "performAlignment",
    value: function performAlignment(birdCount) {
      return this.alignmentAccumulator.divide(birdCount).normalize().multiply(constants_1.BIRD_SPEED).sub(this.velocity).multiply(constants_1.BIRD_ALIGNMENT_EAGERNESS);
    }
  }, {
    key: "checkPredators",
    value: function checkPredators() {
      if (this.boids.isRightClicked) {
        return this.boids.mouseLocation.clone().sub(this.position).divide(constants_1.BIRD_COHESION_EAGERNESS).multiply(-1);
      }

      return Vector2D_1.default.CONST_ZERO;
    }
  }, {
    key: "checkGoals",
    value: function checkGoals() {
      if (this.boids.isLeftClicked) {
        return this.boids.mouseLocation.clone().sub(this.position).divide(constants_1.BIRD_COHESION_EAGERNESS);
      }

      return Vector2D_1.default.CONST_ZERO;
    }
  }, {
    key: "checkBoundary",
    value: function checkBoundary() {
      if (this.position.x1 < 0) {
        this.position.x1 = this.maxX;
      } else if (this.position.x1 > this.maxX) {
        this.position.x1 = 0;
      }

      if (this.position.x2 < 0) {
        this.position.x2 = this.maxY;
      } else if (this.position.x2 > this.maxY) {
        this.position.x2 = 0;
      }
    }
  }, {
    key: "checkVelocity",
    value: function checkVelocity() {
      this.velocity.normalize().multiply(constants_1.BIRD_SPEED);
    }
  }, {
    key: "update",
    value: function update(deltaTime) {
      this.performManeuvers(this.boids.birds);
      this.position.add(this.velocity.clone().multiply(deltaTime));
      this.velocity.add(this.acceleration);
    }
  }, {
    key: "render",
    value: function render(context) {
      this.rotate(context);
      context.strokeStyle = 'red';
      context.beginPath();
      context.moveTo(this.position.x1 + constants_1.BIRD_WIDTH / 2, this.position.x2);
      context.lineTo(this.position.x1 - constants_1.BIRD_WIDTH / 2, this.position.x2 + constants_1.BIRD_HEIGHT / 2);
      context.lineTo(this.position.x1 - constants_1.BIRD_WIDTH / 2, this.position.x2 - constants_1.BIRD_HEIGHT / 2);
      context.closePath();
      context.stroke();
      this.unrotate(context);
    }
  }, {
    key: "rotate",
    value: function rotate(context) {
      context.translate(this.position.x1, this.position.x2);
      context.rotate(helpers_1.getAngle(this.velocity));
      context.translate(-this.position.x1, -this.position.x2);
    }
  }, {
    key: "unrotate",
    value: function unrotate(context) {
      context.translate(this.position.x1, this.position.x2);
      context.rotate(-helpers_1.getAngle(this.velocity));
      context.translate(-this.position.x1, -this.position.x2);
    }
  }]);

  return Bird;
}();

exports.default = Bird;
},{"../Vector2D":"Boids/Vector2D/index.ts","../constants":"Boids/constants.ts","../helpers":"Boids/helpers.ts"}],"Boids/index.ts":[function(require,module,exports) {
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var __importStar = this && this.__importStar || function (mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) for (var k in mod) {
    if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
  }
  result["default"] = mod;
  return result;
};

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var typescript_render_engine_1 = __importStar(require("@zacktherrien/typescript-render-engine"));

var constants_1 = require("./constants");

var Bird_1 = __importDefault(require("./Bird"));

var Vector2D_1 = __importDefault(require("./Vector2D"));

var Boids = /*#__PURE__*/function () {
  function Boids() {
    _classCallCheck(this, Boids);

    this.background = new typescript_render_engine_1.RenderingLayer(constants_1.LayerIndex.BACKGROUND, typescript_render_engine_1.LayerType.STATIC);
    this.birdLayer = new typescript_render_engine_1.RenderingLayer(constants_1.LayerIndex.BIRDS, typescript_render_engine_1.LayerType.DYNAMIC);
    this.birds = [];

    for (var i = 0; i < constants_1.BIRD_COUNT; i++) {
      var bird = new Bird_1.default(this, Math.random() * this.birdLayer.getWidth(), Math.random() * this.birdLayer.getHeight(), this.birdLayer.getWidth(), this.birdLayer.getHeight());
      this.birds.push(bird);
      this.birdLayer.addEntity(bird);
    }

    this.isLeftClicked = false;
    this.isRightClicked = false;
    this.mouseLocation = Vector2D_1.default.ZERO();
    this.engine = new typescript_render_engine_1.default();
    this.engine.registerLayer(this.background);
    this.engine.registerLayer(this.birdLayer);
    this.engine.start();
    document.addEventListener('mousedown', this.handleMouseDown.bind(this));
    document.addEventListener('mouseup', this.handleMouseUp.bind(this));
    document.addEventListener('mousemove', this.handleMouseMove.bind(this));
    document.addEventListener('contextmenu', function (event) {
      return event.preventDefault();
    });
  }

  _createClass(Boids, [{
    key: "handleMouseDown",
    value: function handleMouseDown(e) {
      if (e.button === 0) {
        this.isLeftClicked = true;
      } else {
        this.isRightClicked = true;
        e.preventDefault();
        e.stopImmediatePropagation();
      }

      this.mouseLocation = new Vector2D_1.default(e.offsetX, e.offsetY);
    }
  }, {
    key: "handleMouseMove",
    value: function handleMouseMove(e) {
      this.mouseLocation = new Vector2D_1.default(e.offsetX, e.offsetY);
    }
  }, {
    key: "handleMouseUp",
    value: function handleMouseUp() {
      this.isLeftClicked = false;
      this.isRightClicked = false;
      this.mouseLocation = Vector2D_1.default.ZERO();
    }
  }]);

  return Boids;
}();

exports.default = Boids;
},{"@zacktherrien/typescript-render-engine":"../node_modules/@zacktherrien/typescript-render-engine/dist/index.js","./constants":"Boids/constants.ts","./Bird":"Boids/Bird/index.ts","./Vector2D":"Boids/Vector2D/index.ts"}],"index.ts":[function(require,module,exports) {
"use strict";

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var Boids_1 = __importDefault(require("./Boids"));

function load() {
  var boids = new Boids_1.default();
  window.boids = boids;
}

window.addEventListener('load', load);
},{"./Boids":"Boids/index.ts"}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "49288" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","index.ts"], null)
//# sourceMappingURL=/src.77de5100.js.map