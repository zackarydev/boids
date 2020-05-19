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
})({"../node_modules/@zacktherrien/typescript-render-engine/dist/Engine/index.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Engine {
    constructor() {
        this.layers = [];
        this.layerCounter = 0;
        this.shouldRender = true;
        this.lastFrameRenderedTime = null;
        this.renderingId = null;
        this.currentDeltaTime = 0;
        this.requestFrameA = this.requestFrameA.bind(this);
        this.requestFrameB = this.requestFrameB.bind(this);
    }
    getLayer(layerIndex) {
        return this.layers.find((layer) => layer.layerIndex === layerIndex) || null;
    }
    registerLayer(layer) {
        this.layers.push(layer);
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
        this.currentDeltaTime = timestamp - this.lastFrameRenderedTime;
        this.lastFrameRenderedTime = timestamp;
        for (this.layerCounter = 0; this.layerCounter < this.layers.length; this.layerCounter++) {
            this.layers[this.layerCounter].update(this.currentDeltaTime);
            this.layers[this.layerCounter].render();
        }
    }
}
exports.default = Engine;

},{}],"../node_modules/@zacktherrien/typescript-render-engine/dist/types.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ResizeMethod;
(function (ResizeMethod) {
    ResizeMethod[ResizeMethod["FROM_ORIGIN"] = 0] = "FROM_ORIGIN";
    ResizeMethod[ResizeMethod["FROM_CENTER"] = 1] = "FROM_CENTER";
})(ResizeMethod = exports.ResizeMethod || (exports.ResizeMethod = {}));

},{}],"../node_modules/@zacktherrien/typescript-render-engine/dist/RenderingLayer/index.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("../types");
class RenderingLayer {
    constructor(layerIndex, initialWidth, initialHeight, initialX = 0, initialY = 0) {
        this.layerIndex = layerIndex;
        this.entities = [];
        this.entityCounter = 0;
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
        if (!this._isEntityValid(entity)) {
            throw new Error('Invalid entity cannot be added to this layer.');
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
        var _a, _b;
        for (this.entityCounter = 0; this.entityCounter < this.entities.length; this.entityCounter++) {
            (_b = (_a = this.entities[this.entityCounter]).update) === null || _b === void 0 ? void 0 : _b.call(_a, deltaTime);
        }
    }
    render() {
        this.clear();
        for (this.entityCounter = 0; this.entityCounter < this.entities.length; this.entityCounter++) {
            this.entities[this.entityCounter].render(this.context);
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

},{"../types":"../node_modules/@zacktherrien/typescript-render-engine/dist/types.js"}],"../node_modules/@zacktherrien/typescript-render-engine/dist/RenderingLayer/StaticLayer/index.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
class StaticLayer extends __1.RenderingLayer {
    constructor(layerIndex, initialWidth, initialHeight, initialX = 0, initialY = 0) {
        super(layerIndex, initialWidth, initialHeight, initialX, initialY);
        this.rerenderNextFrame = false;
    }
    allowRenderOnNextFrame() {
        this.rerenderNextFrame = true;
    }
    _isEntityValid(entity) {
        return super._entityIsRenderable(entity);
    }
    render() {
        if (this.rerenderNextFrame) {
            this.rerenderNextFrame = false;
            super.render();
        }
    }
}
exports.StaticLayer = StaticLayer;

},{"..":"../node_modules/@zacktherrien/typescript-render-engine/dist/RenderingLayer/index.js"}],"../node_modules/@zacktherrien/typescript-render-engine/dist/RenderingLayer/DynamicLayer/index.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
class DynamicLayer extends __1.RenderingLayer {
    constructor(layerIndex, initialWidth, initialHeight, initialX = 0, initialY = 0) {
        super(layerIndex, initialWidth, initialHeight, initialX, initialY);
    }
    _isEntityValid(entity) {
        return super._entityIsRenderable(entity) && this._entityIsUpdatable(entity);
    }
}
exports.DynamicLayer = DynamicLayer;

},{"..":"../node_modules/@zacktherrien/typescript-render-engine/dist/RenderingLayer/index.js"}],"../node_modules/@zacktherrien/typescript-render-engine/dist/RenderingLayer/DeferredLayer/index.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
class DeferredLayer extends __1.RenderingLayer {
    constructor(deferredTime, layerIndex, initialWidth, initialHeight, initialX = 0, initialY = 0) {
        super(layerIndex, initialWidth, initialHeight, initialX, initialY);
        this.deferredTime = deferredTime;
        this.elapsedTimeSinceRender = 0;
    }
    _isEntityValid(entity) {
        return super._entityIsRenderable(entity) && this._entityIsUpdatable(entity);
    }
    update(deltaTime) {
        this.elapsedTimeSinceRender += deltaTime;
        if (this.elapsedTimeSinceRender > this.deferredTime) {
            super.update(deltaTime);
        }
    }
    render() {
        if (this.elapsedTimeSinceRender > this.deferredTime) {
            this.elapsedTimeSinceRender = 0;
            super.render();
        }
    }
}
exports.DeferredLayer = DeferredLayer;

},{"..":"../node_modules/@zacktherrien/typescript-render-engine/dist/RenderingLayer/index.js"}],"../node_modules/@zacktherrien/typescript-render-engine/dist/index.js":[function(require,module,exports) {
"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Engine_1 = __importDefault(require("./Engine"));
exports.default = Engine_1.default;
var RenderingLayer_1 = require("./RenderingLayer");
exports.RenderingLayer = RenderingLayer_1.RenderingLayer;
var StaticLayer_1 = require("./RenderingLayer/StaticLayer");
exports.StaticLayer = StaticLayer_1.StaticLayer;
var DynamicLayer_1 = require("./RenderingLayer/DynamicLayer");
exports.DynamicLayer = DynamicLayer_1.DynamicLayer;
var DeferredLayer_1 = require("./RenderingLayer/DeferredLayer");
exports.DeferredLayer = DeferredLayer_1.DeferredLayer;
__export(require("./types"));

},{"./Engine":"../node_modules/@zacktherrien/typescript-render-engine/dist/Engine/index.js","./RenderingLayer":"../node_modules/@zacktherrien/typescript-render-engine/dist/RenderingLayer/index.js","./RenderingLayer/StaticLayer":"../node_modules/@zacktherrien/typescript-render-engine/dist/RenderingLayer/StaticLayer/index.js","./RenderingLayer/DynamicLayer":"../node_modules/@zacktherrien/typescript-render-engine/dist/RenderingLayer/DynamicLayer/index.js","./RenderingLayer/DeferredLayer":"../node_modules/@zacktherrien/typescript-render-engine/dist/RenderingLayer/DeferredLayer/index.js","./types":"../node_modules/@zacktherrien/typescript-render-engine/dist/types.js"}],"Boids/constants.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BIRD_HUNGER_LANDING_DESIRE = exports.BIRD_COMMUNAL_LANDING_DESIRE = exports.BIRD_ALIGNMENT_EAGERNESS = exports.BIRD_COHESION_EAGERNESS = exports.BIRD_SEPARATION_EAGERNESS = exports.BIRD_SEPARATION_DISTANCE = exports.BIRD_EATING_SPEED = exports.LIVING_ENERGY_COST = exports.ACCELERATION_ENERGY_COST = exports.MAX_BIRD_ENERGY = exports.BIRD_VISUAL_RANGE = exports.BIRD_SPEED = exports.BIRD_HEIGHT = exports.BIRD_WIDTH = exports.BIRD_COUNT = exports.LayerIndex = void 0;
var LayerIndex;

(function (LayerIndex) {
  LayerIndex[LayerIndex["BACKGROUND"] = 0] = "BACKGROUND";
  LayerIndex[LayerIndex["BIRDS"] = 1] = "BIRDS";
  LayerIndex[LayerIndex["TOOLS"] = 2] = "TOOLS";
})(LayerIndex = exports.LayerIndex || (exports.LayerIndex = {}));

;
exports.BIRD_COUNT = 750;
exports.BIRD_WIDTH = 4;
exports.BIRD_HEIGHT = 2;
exports.BIRD_SPEED = 100 / 1000;
exports.BIRD_VISUAL_RANGE = 75;
exports.MAX_BIRD_ENERGY = 500;
exports.ACCELERATION_ENERGY_COST = 50 / 100;
exports.LIVING_ENERGY_COST = 10 / 1000;
exports.BIRD_EATING_SPEED = 150 / 1000;
exports.BIRD_SEPARATION_DISTANCE = 1.5 * Math.sqrt(exports.BIRD_WIDTH * exports.BIRD_WIDTH + exports.BIRD_HEIGHT * exports.BIRD_HEIGHT);
exports.BIRD_SEPARATION_EAGERNESS = 0.1;
exports.BIRD_COHESION_EAGERNESS = 0.01;
exports.BIRD_ALIGNMENT_EAGERNESS = 0.1;
exports.BIRD_COMMUNAL_LANDING_DESIRE = 1;
exports.BIRD_HUNGER_LANDING_DESIRE = 1;
},{}],"Boids/Vector2D/index.ts":[function(require,module,exports) {
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var Vector2D = function () {
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

  Vector2D.CONST_ZERO = Vector2D.ZERO();
  Vector2D.CONST_ONE = Vector2D.ONE();
  return Vector2D;
}();

exports.default = Vector2D;
},{}],"Boids/Terrain/types.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LANDABLE_SQUARE_TYPES = exports.SquareType = void 0;
var SquareType;

(function (SquareType) {
  SquareType[SquareType["DEEP_WATER"] = 0] = "DEEP_WATER";
  SquareType[SquareType["SHORE_WATER"] = 1] = "SHORE_WATER";
  SquareType[SquareType["SAND"] = 2] = "SAND";
  SquareType[SquareType["SWAMP"] = 3] = "SWAMP";
  SquareType[SquareType["GRASSLAND"] = 4] = "GRASSLAND";
  SquareType[SquareType["RAIN_FOREST"] = 5] = "RAIN_FOREST";
  SquareType[SquareType["MOUNTAIN"] = 6] = "MOUNTAIN";
  SquareType[SquareType["SNOW_PEAK"] = 7] = "SNOW_PEAK";
})(SquareType = exports.SquareType || (exports.SquareType = {}));

;
exports.LANDABLE_SQUARE_TYPES = [SquareType.SAND, SquareType.SWAMP, SquareType.GRASSLAND, SquareType.RAIN_FOREST, SquareType.MOUNTAIN, SquareType.SNOW_PEAK];
},{}],"Boids/colors.ts":[function(require,module,exports) {
"use strict";

var _exports$SquareColors;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SquareColors = exports.BirdColor = void 0;

var types_1 = require("./Terrain/types");

exports.BirdColor = '#242124';
exports.SquareColors = (_exports$SquareColors = {}, _defineProperty(_exports$SquareColors, types_1.SquareType.DEEP_WATER, '#006B99'), _defineProperty(_exports$SquareColors, types_1.SquareType.SHORE_WATER, '#008ECC'), _defineProperty(_exports$SquareColors, types_1.SquareType.SAND, '#e5d8c1'), _defineProperty(_exports$SquareColors, types_1.SquareType.SWAMP, '#555c45'), _defineProperty(_exports$SquareColors, types_1.SquareType.GRASSLAND, '#bbcba0'), _defineProperty(_exports$SquareColors, types_1.SquareType.RAIN_FOREST, '#92b29f'), _defineProperty(_exports$SquareColors, types_1.SquareType.MOUNTAIN, '#AAAAAA'), _defineProperty(_exports$SquareColors, types_1.SquareType.SNOW_PEAK, '#FFFFFF'), _exports$SquareColors);
},{"./Terrain/types":"Boids/Terrain/types.ts"}],"Boids/helpers.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.flipVector = exports.getAngle = exports.fromDegree = void 0;

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
},{}],"Boids/Behavior/BirdBehavior/index.ts":[function(require,module,exports) {
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var Vector2D_1 = __importDefault(require("../../Vector2D"));

var BirdBehavior = function BirdBehavior(bird) {
  var _this = this;

  _classCallCheck(this, BirdBehavior);

  this.reset = function () {
    _this.value.null();
  };

  this.bird = bird;
  this.value = Vector2D_1.default.ZERO();
};

exports.default = BirdBehavior;
},{"../../Vector2D":"Boids/Vector2D/index.ts"}],"Boids/Behavior/BirdBehavior/Cohesion/index.ts":[function(require,module,exports) {
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function () { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var __1 = __importDefault(require(".."));

var constants_1 = require("../../../constants");

var Cohesion = /*#__PURE__*/function (_1$default) {
  _inherits(Cohesion, _1$default);

  var _super = _createSuper(Cohesion);

  function Cohesion() {
    _classCallCheck(this, Cohesion);

    return _super.apply(this, arguments);
  }

  _createClass(Cohesion, [{
    key: "perform",
    value: function perform(birdCount) {
      return this.value.divide(birdCount).sub(this.bird.position).normalize().multiply(constants_1.BIRD_SPEED).sub(this.bird.velocity).multiply(constants_1.BIRD_COHESION_EAGERNESS);
    }
  }, {
    key: "accumulate",
    value: function accumulate(bird) {
      this.value.add(bird.position);
    }
  }]);

  return Cohesion;
}(__1.default);

exports.default = Cohesion;
},{"..":"Boids/Behavior/BirdBehavior/index.ts","../../../constants":"Boids/constants.ts"}],"Boids/Behavior/BirdBehavior/Alignment/index.ts":[function(require,module,exports) {
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function () { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var __1 = __importDefault(require(".."));

var constants_1 = require("../../../constants");

var Alignment = /*#__PURE__*/function (_1$default) {
  _inherits(Alignment, _1$default);

  var _super = _createSuper(Alignment);

  function Alignment() {
    _classCallCheck(this, Alignment);

    return _super.apply(this, arguments);
  }

  _createClass(Alignment, [{
    key: "perform",
    value: function perform(birdCount) {
      return this.value.divide(birdCount).normalize().multiply(constants_1.BIRD_SPEED).sub(this.bird.velocity).multiply(constants_1.BIRD_ALIGNMENT_EAGERNESS);
    }
  }, {
    key: "accumulate",
    value: function accumulate(bird) {
      this.value.add(bird.velocity);
    }
  }]);

  return Alignment;
}(__1.default);

exports.default = Alignment;
},{"..":"Boids/Behavior/BirdBehavior/index.ts","../../../constants":"Boids/constants.ts"}],"Boids/Behavior/BirdBehavior/Separation/index.ts":[function(require,module,exports) {
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function () { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var __1 = __importDefault(require(".."));

var constants_1 = require("../../../constants");

var Separation = /*#__PURE__*/function (_1$default) {
  _inherits(Separation, _1$default);

  var _super = _createSuper(Separation);

  function Separation() {
    _classCallCheck(this, Separation);

    return _super.apply(this, arguments);
  }

  _createClass(Separation, [{
    key: "perform",
    value: function perform(birdCount) {
      return this.value.divide(birdCount).normalize().multiply(constants_1.BIRD_SPEED).sub(this.bird.velocity).multiply(constants_1.BIRD_SEPARATION_EAGERNESS);
    }
  }, {
    key: "accumulate",
    value: function accumulate(bird) {
      var positionDiff = this.bird.position.clone().sub(bird.position);
      var distance = positionDiff.magnitude();

      if (distance <= constants_1.BIRD_SEPARATION_DISTANCE) {
        this.value.add(positionDiff.divide(distance));
      }
    }
  }]);

  return Separation;
}(__1.default);

exports.default = Separation;
},{"..":"Boids/Behavior/BirdBehavior/index.ts","../../../constants":"Boids/constants.ts"}],"Boids/Terrain/constants.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SQUARE_TERRAIN_DEFINITIONS = exports.SQUARE_FOODS = exports.SQUARE_SIZE = exports.TERRAIN_UPDATE_RATE = void 0;

var types_1 = require("./types");

exports.TERRAIN_UPDATE_RATE = 5000;
exports.SQUARE_SIZE = 6;
exports.SQUARE_FOODS = new Map([[types_1.SquareType.DEEP_WATER, 0], [types_1.SquareType.SHORE_WATER, 0], [types_1.SquareType.SWAMP, 250], [types_1.SquareType.SAND, 50], [types_1.SquareType.GRASSLAND, 250], [types_1.SquareType.RAIN_FOREST, 1000], [types_1.SquareType.MOUNTAIN, 50], [types_1.SquareType.SNOW_PEAK, 0]]);
exports.SQUARE_TERRAIN_DEFINITIONS = new Map([[types_1.SquareType.DEEP_WATER, {
  height: {
    min: 0,
    max: 0.35
  },
  moisture: {
    min: 0,
    max: 1
  },
  humidity: {
    min: 0,
    max: 1
  }
}], [types_1.SquareType.SHORE_WATER, {
  height: {
    min: 0.35,
    max: 0.45
  },
  moisture: {
    min: 0,
    max: 0.7
  },
  humidity: {
    min: 0,
    max: 1
  }
}], [types_1.SquareType.SWAMP, {
  height: {
    min: 0.35,
    max: 0.45
  },
  moisture: {
    min: 0.7,
    max: 1
  },
  humidity: {
    min: 0,
    max: 1
  }
}], [types_1.SquareType.SAND, {
  height: {
    min: 0.45,
    max: 0.7
  },
  moisture: {
    min: 0,
    max: 0.4
  },
  humidity: {
    min: 0,
    max: 1
  }
}], [types_1.SquareType.GRASSLAND, {
  height: {
    min: 0.45,
    max: 0.7
  },
  moisture: {
    min: 0.4,
    max: 0.7
  },
  humidity: {
    min: 0,
    max: 1
  }
}], [types_1.SquareType.RAIN_FOREST, {
  height: {
    min: 0.45,
    max: 0.7
  },
  moisture: {
    min: 0.7,
    max: 1
  },
  humidity: {
    min: 0,
    max: 1
  }
}], [types_1.SquareType.MOUNTAIN, {
  height: {
    min: 0.7,
    max: 0.8
  },
  moisture: {
    min: 0,
    max: 1
  },
  humidity: {
    min: 0,
    max: 1
  }
}], [types_1.SquareType.SNOW_PEAK, {
  height: {
    min: 0.8,
    max: 1
  },
  moisture: {
    min: 0,
    max: 1
  },
  humidity: {
    min: 0,
    max: 1
  }
}]]);
},{"./types":"Boids/Terrain/types.ts"}],"Boids/Behavior/BirdBehavior/Hunger/index.ts":[function(require,module,exports) {
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function () { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var Vector2D_1 = __importDefault(require("../../../Vector2D"));

var __1 = __importDefault(require("../../.."));

var __2 = __importDefault(require(".."));

var constants_1 = require("../../../constants");

var constants_2 = require("../../../Terrain/constants");

var Hunger = /*#__PURE__*/function (_2$default) {
  _inherits(Hunger, _2$default);

  var _super = _createSuper(Hunger);

  function Hunger() {
    _classCallCheck(this, Hunger);

    return _super.apply(this, arguments);
  }

  _createClass(Hunger, [{
    key: "goUp",
    value: function goUp(pOffset) {
      pOffset.x2 -= 1;
    }
  }, {
    key: "goDown",
    value: function goDown(pOffset) {
      pOffset.x2 += 1;
    }
  }, {
    key: "goRight",
    value: function goRight(pOffset) {
      pOffset.x1 += 1;
    }
  }, {
    key: "goLeft",
    value: function goLeft(pOffset) {
      pOffset.x1 -= 1;
    }
  }, {
    key: "walkAroundRange",
    value: function walkAroundRange(pOffset) {
      if (pOffset.x1 === 0 && pOffset.x2 === 0) {
        pOffset.x1 = 1;
      }

      if (Math.abs(pOffset.x1) === Math.abs(pOffset.x2)) {
        if (pOffset.x1 > 0 && pOffset.x2 > 0) {
          this.goLeft(pOffset);
        } else if (pOffset.x1 < 0 && pOffset.x2 > 0) {
          this.goDown(pOffset);
        } else if (pOffset.x1 < 0 && pOffset.x2 < 0) {
          this.goRight(pOffset);
        } else if (pOffset.x1 > 0 && pOffset.x2 < 0) {
          this.goUp(pOffset);
        }
      } else {
        if (pOffset.x1 > pOffset.x2 && Math.abs(pOffset.x1) > Math.abs(pOffset.x2)) {
          this.goUp(pOffset);
        } else if (pOffset.x1 < pOffset.x2 && Math.abs(pOffset.x1) < Math.abs(pOffset.x2)) {
          this.goLeft(pOffset);
        } else if (pOffset.x1 < pOffset.x2 && Math.abs(pOffset.x1) > Math.abs(pOffset.x2)) {
          this.goDown(pOffset);
        } else if (pOffset.x1 > pOffset.x2 && Math.abs(pOffset.x1) < Math.abs(pOffset.x2)) {
          this.goRight(pOffset);
        }
      }
    }
  }, {
    key: "performFoodSearch",
    value: function performFoodSearch() {
      var squareCenter;
      var square;
      var x;

      var startingLocation = __1.default.instance.terrain.getSquareAtLocation(this.bird.position);

      if (!startingLocation) return null;
      var squaresInVisualRange = constants_1.BIRD_VISUAL_RANGE / constants_2.SQUARE_SIZE * 2;
      var pOffset = new Vector2D_1.default(0, 0);

      for (x = 0; x < squaresInVisualRange; x++) {
        square = __1.default.instance.terrain.getSquareAtCoord(pOffset.x1 + startingLocation.x, pOffset.x2 + startingLocation.y);

        if (square && square.foodLevel > 0) {
          squareCenter = square.getPixelCenter();

          if (this.bird.position.distance(square.getPixelCenter()) < constants_1.BIRD_VISUAL_RANGE) {
            return squareCenter.clone().sub(this.bird.position);
          }
        }

        this.walkAroundRange(pOffset);
      }

      return null;
    }
  }, {
    key: "perform",
    value: function perform(birdCount) {
      this.value.x1 /= birdCount;
      this.value.x2 = this.bird.energy / constants_1.MAX_BIRD_ENERGY * constants_1.BIRD_HUNGER_LANDING_DESIRE;
      var desireToLand = 1 - this.value.magnitude();

      if (desireToLand > 0.5) {
        var foodSquareVector = this.performFoodSearch();
        if (!foodSquareVector) return null;

        if (foodSquareVector.magnitude() < constants_2.SQUARE_SIZE) {
          this.bird.landed = true;
          return null;
        } else {
          return foodSquareVector.normalize().multiply(this.bird.velocity.magnitude()).sub(this.bird.velocity).multiply(desireToLand);
        }
      } else {
        return null;
      }
    }
  }, {
    key: "accumulate",
    value: function accumulate(bird) {
      if (bird.landed) {
        this.value.x1 += (1 - bird.position.distance(this.bird.position) / constants_1.BIRD_VISUAL_RANGE) * constants_1.BIRD_COMMUNAL_LANDING_DESIRE;
      }
    }
  }]);

  return Hunger;
}(__2.default);

exports.default = Hunger;
},{"../../../Vector2D":"Boids/Vector2D/index.ts","../../..":"Boids/index.ts","..":"Boids/Behavior/BirdBehavior/index.ts","../../../constants":"Boids/constants.ts","../../../Terrain/constants":"Boids/Terrain/constants.ts"}],"Boids/Behavior/SelfBehavior/index.ts":[function(require,module,exports) {
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var SelfBehavior = function SelfBehavior(bird) {
  var _this = this;

  _classCallCheck(this, SelfBehavior);

  this.reset = function () {
    _this.value = 0;
  };

  this.bird = bird;
  this.value = 0;
};

exports.default = SelfBehavior;
},{}],"Boids/Behavior/SelfBehavior/Eating/index.ts":[function(require,module,exports) {
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function () { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var __1 = __importDefault(require(".."));

var constants_1 = require("../../../constants");

var __2 = __importDefault(require("../../.."));

var Eating = /*#__PURE__*/function (_1$default) {
  _inherits(Eating, _1$default);

  var _super = _createSuper(Eating);

  function Eating() {
    _classCallCheck(this, Eating);

    return _super.apply(this, arguments);
  }

  _createClass(Eating, [{
    key: "perform",
    value: function perform(deltaTime) {
      if (this.bird.landed) {
        var square = __2.default.instance.terrain.getSquareAtLocation(this.bird.position);

        if (square && square.foodLevel > 0) {
          var potentialConsumption = constants_1.BIRD_EATING_SPEED * deltaTime;
          var actualConsumption = potentialConsumption;

          if (potentialConsumption > square.foodLevel) {
            actualConsumption = square.foodLevel;
          }

          if (actualConsumption + this.bird.energy > constants_1.MAX_BIRD_ENERGY) {
            actualConsumption = constants_1.MAX_BIRD_ENERGY - this.bird.energy;
          }

          square.foodLevel -= actualConsumption;
          this.bird.energy += actualConsumption;

          if (this.bird.energy >= constants_1.MAX_BIRD_ENERGY) {
            this.bird.landed = false;
          }
        } else {
          this.bird.landed = false;
        }
      }
    }
  }]);

  return Eating;
}(__1.default);

exports.default = Eating;
},{"..":"Boids/Behavior/SelfBehavior/index.ts","../../../constants":"Boids/constants.ts","../../..":"Boids/index.ts"}],"Boids/Behavior/SelfBehavior/Exhaustion/index.ts":[function(require,module,exports) {
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function () { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var __1 = __importDefault(require(".."));

var constants_1 = require("../../../constants");

var Exhaustion = /*#__PURE__*/function (_1$default) {
  _inherits(Exhaustion, _1$default);

  var _super = _createSuper(Exhaustion);

  function Exhaustion() {
    _classCallCheck(this, Exhaustion);

    return _super.apply(this, arguments);
  }

  _createClass(Exhaustion, [{
    key: "perform",
    value: function perform(deltaTime) {
      this.bird.energy -= constants_1.ACCELERATION_ENERGY_COST * this.bird.acceleration.magnitude() * deltaTime * deltaTime + constants_1.LIVING_ENERGY_COST * deltaTime;
    }
  }]);

  return Exhaustion;
}(__1.default);

exports.default = Exhaustion;
},{"..":"Boids/Behavior/SelfBehavior/index.ts","../../../constants":"Boids/constants.ts"}],"Boids/Bird/index.ts":[function(require,module,exports) {
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

var __1 = __importDefault(require("../"));

var constants_1 = require("../constants");

var colors_1 = require("../colors");

var helpers_1 = require("../helpers");

var Cohesion_1 = __importDefault(require("../Behavior/BirdBehavior/Cohesion"));

var Alignment_1 = __importDefault(require("../Behavior/BirdBehavior/Alignment"));

var Separation_1 = __importDefault(require("../Behavior/BirdBehavior/Separation"));

var Hunger_1 = __importDefault(require("../Behavior/BirdBehavior/Hunger"));

var Eating_1 = __importDefault(require("../Behavior/SelfBehavior/Eating"));

var Exhaustion_1 = __importDefault(require("../Behavior/SelfBehavior/Exhaustion"));

var Bird = /*#__PURE__*/function () {
  function Bird(boids, initialX, initialY) {
    _classCallCheck(this, Bird);

    this.boids = boids;
    this.position = new Vector2D_1.default(initialX, initialY);
    var randomAngle = helpers_1.fromDegree(Math.random() * 360);
    this.velocity = new Vector2D_1.default(Math.cos(randomAngle), Math.sin(randomAngle)).normalize().multiply(constants_1.BIRD_SPEED * Math.random());
    this.acceleration = Vector2D_1.default.ZERO();
    this.energy = constants_1.MAX_BIRD_ENERGY * 0.5 + constants_1.MAX_BIRD_ENERGY * Math.random();
    this.birdRules = [new Cohesion_1.default(this), new Alignment_1.default(this), new Separation_1.default(this), new Hunger_1.default(this)];
    this.selfRules = [new Exhaustion_1.default(this), new Eating_1.default(this)];
    this.landed = false;
  }

  _createClass(Bird, [{
    key: "resetAccumulators",
    value: function resetAccumulators() {
      for (var i = 0; i < this.birdRules.length; i++) {
        this.birdRules[i].reset();
      }
    }
  }, {
    key: "performManeuvers",
    value: function performManeuvers(birds) {
      this.resetAccumulators();

      if (!this.landed) {
        var perceivedBirdCount = 0;

        for (var i = 0; i < birds.length; i++) {
          if (!birds[i].landed && birds[i] !== this && birds[i].position.distance(this.position) < constants_1.BIRD_VISUAL_RANGE) {
            perceivedBirdCount += 1;

            for (var r = 0; r < this.birdRules.length; r++) {
              this.birdRules[r].accumulate(birds[i]);
            }
          }
        }

        if (perceivedBirdCount !== 0) {
          var force;

          for (var _i = 0; _i < this.birdRules.length; _i++) {
            force = this.birdRules[_i].perform(perceivedBirdCount);

            if (force) {
              this.acceleration.add(force);
            }
          }
        }
      }

      this.checkVelocity();
    }
  }, {
    key: "performSenses",
    value: function performSenses(deltaTime) {
      for (var i = 0; i < this.selfRules.length; i++) {
        this.selfRules[i].perform(deltaTime);
      }
    }
  }, {
    key: "checkBoundary",
    value: function checkBoundary() {
      if (this.position.x1 < 0) {
        this.position.x1 = __1.default.instance.maxX;
      } else if (this.position.x1 > __1.default.instance.maxX) {
        this.position.x1 = 0;
      }

      if (this.position.x2 < 0) {
        this.position.x2 = __1.default.instance.maxY;
      } else if (this.position.x2 > __1.default.instance.maxY) {
        this.position.x2 = 0;
      }
    }
  }, {
    key: "checkVelocity",
    value: function checkVelocity() {
      if (this.velocity.magnitude() > constants_1.BIRD_SPEED) {
        this.velocity.normalize().multiply(constants_1.BIRD_SPEED);
      }
    }
  }, {
    key: "die",
    value: function die() {
      this.boids.birds.splice(this.boids.birds.indexOf(this), 1);
      this.boids.birdLayer.removeEntity(this);
    }
  }, {
    key: "update",
    value: function update(deltaTime) {
      this.performSenses(deltaTime);
      this.performManeuvers(this.boids.birds);

      if (!this.landed) {
        this.position.add(this.velocity.clone().multiply(deltaTime));
      }

      this.velocity.add(this.acceleration);
      this.acceleration.null();
      this.checkBoundary();

      if (this.energy < 0) {
        this.die();
      }
    }
  }, {
    key: "render",
    value: function render(context) {
      this.rotate(context);
      context.strokeStyle = colors_1.BirdColor;
      context.beginPath();
      context.moveTo(this.position.x1 + constants_1.BIRD_WIDTH / 2, this.position.x2);
      context.lineTo(this.position.x1 - constants_1.BIRD_WIDTH / 2, this.position.x2 + constants_1.BIRD_HEIGHT / 2);
      context.lineTo(this.position.x1 - constants_1.BIRD_WIDTH / 2, this.position.x2 - constants_1.BIRD_HEIGHT / 2);
      context.closePath();
      context.fill();
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
},{"../Vector2D":"Boids/Vector2D/index.ts","../":"Boids/index.ts","../constants":"Boids/constants.ts","../colors":"Boids/colors.ts","../helpers":"Boids/helpers.ts","../Behavior/BirdBehavior/Cohesion":"Boids/Behavior/BirdBehavior/Cohesion/index.ts","../Behavior/BirdBehavior/Alignment":"Boids/Behavior/BirdBehavior/Alignment/index.ts","../Behavior/BirdBehavior/Separation":"Boids/Behavior/BirdBehavior/Separation/index.ts","../Behavior/BirdBehavior/Hunger":"Boids/Behavior/BirdBehavior/Hunger/index.ts","../Behavior/SelfBehavior/Eating":"Boids/Behavior/SelfBehavior/Eating/index.ts","../Behavior/SelfBehavior/Exhaustion":"Boids/Behavior/SelfBehavior/Exhaustion/index.ts"}],"../node_modules/fast-simplex-noise/src/index.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var FastSimplexNoise = function () {
  function FastSimplexNoise(options) {
    if (options === void 0) {
      options = {};
    }

    if (options.hasOwnProperty('amplitude')) {
      if (typeof options.amplitude !== 'number') throw new Error('options.amplitude must be a number');
      this.amplitude = options.amplitude;
    } else this.amplitude = 1.0;

    if (options.hasOwnProperty('frequency')) {
      if (typeof options.frequency !== 'number') throw new Error('options.frequency must be a number');
      this.frequency = options.frequency;
    } else this.frequency = 1.0;

    if (options.hasOwnProperty('octaves')) {
      if (typeof options.octaves !== 'number' || !isFinite(options.octaves) || Math.floor(options.octaves) !== options.octaves) {
        throw new Error('options.octaves must be an integer');
      }

      this.octaves = options.octaves;
    } else this.octaves = 1;

    if (options.hasOwnProperty('persistence')) {
      if (typeof options.persistence !== 'number') throw new Error('options.persistence must be a number');
      this.persistence = options.persistence;
    } else this.persistence = 0.5;

    if (options.hasOwnProperty('random')) {
      if (typeof options.random !== 'function') throw new Error('options.random must be a function');
      this.random = options.random;
    } else this.random = Math.random;

    var min;

    if (options.hasOwnProperty('min')) {
      if (typeof options.min !== 'number') throw new Error('options.min must be a number');
      min = options.min;
    } else min = -1;

    var max;

    if (options.hasOwnProperty('max')) {
      if (typeof options.max !== 'number') throw new Error('options.max must be a number');
      max = options.max;
    } else max = 1;

    if (min >= max) throw new Error("options.min (" + min + ") must be less than options.max (" + max + ")");
    this.scale = min === -1 && max === 1 ? function (value) {
      return value;
    } : function (value) {
      return min + (value + 1) / 2 * (max - min);
    };
    var p = new Uint8Array(256);

    for (var i = 0; i < 256; i++) {
      p[i] = i;
    }

    var n;
    var q;

    for (var i = 255; i > 0; i--) {
      n = Math.floor((i + 1) * this.random());
      q = p[i];
      p[i] = p[n];
      p[n] = q;
    }

    this.perm = new Uint8Array(512);
    this.permMod12 = new Uint8Array(512);

    for (var i = 0; i < 512; i++) {
      this.perm[i] = p[i & 255];
      this.permMod12[i] = this.perm[i] % 12;
    }
  }

  FastSimplexNoise.prototype.cylindrical = function (circumference, coords) {
    switch (coords.length) {
      case 2:
        return this.cylindrical2D(circumference, coords[0], coords[1]);

      case 3:
        return this.cylindrical3D(circumference, coords[0], coords[1], coords[2]);

      default:
        return null;
    }
  };

  FastSimplexNoise.prototype.cylindrical2D = function (circumference, x, y) {
    var nx = x / circumference;
    var r = circumference / (2 * Math.PI);
    var rdx = nx * 2 * Math.PI;
    var a = r * Math.sin(rdx);
    var b = r * Math.cos(rdx);
    return this.scaled3D(a, b, y);
  };

  FastSimplexNoise.prototype.cylindrical3D = function (circumference, x, y, z) {
    var nx = x / circumference;
    var r = circumference / (2 * Math.PI);
    var rdx = nx * 2 * Math.PI;
    var a = r * Math.sin(rdx);
    var b = r * Math.cos(rdx);
    return this.scaled4D(a, b, y, z);
  };

  FastSimplexNoise.prototype.dot = function (gs, coords) {
    return gs.slice(0, Math.min(gs.length, coords.length)).reduce(function (total, g, i) {
      return total + g * coords[i];
    }, 0);
  };

  FastSimplexNoise.prototype.raw = function (coords) {
    switch (coords.length) {
      case 2:
        return this.raw2D(coords[0], coords[1]);

      case 3:
        return this.raw3D(coords[0], coords[1], coords[2]);

      case 4:
        return this.raw4D(coords[0], coords[1], coords[2], coords[3]);

      default:
        return null;
    }
  };

  FastSimplexNoise.prototype.raw2D = function (x, y) {
    var s = (x + y) * 0.5 * (Math.sqrt(3.0) - 1.0);
    var i = Math.floor(x + s);
    var j = Math.floor(y + s);
    var t = (i + j) * FastSimplexNoise.G2;
    var X0 = i - t;
    var Y0 = j - t;
    var x0 = x - X0;
    var y0 = y - Y0;
    var i1 = x0 > y0 ? 1 : 0;
    var j1 = x0 > y0 ? 0 : 1;
    var x1 = x0 - i1 + FastSimplexNoise.G2;
    var y1 = y0 - j1 + FastSimplexNoise.G2;
    var x2 = x0 - 1.0 + 2.0 * FastSimplexNoise.G2;
    var y2 = y0 - 1.0 + 2.0 * FastSimplexNoise.G2;
    var ii = i & 255;
    var jj = j & 255;
    var gi0 = this.permMod12[ii + this.perm[jj]];
    var gi1 = this.permMod12[ii + i1 + this.perm[jj + j1]];
    var gi2 = this.permMod12[ii + 1 + this.perm[jj + 1]];
    var t0 = 0.5 - x0 * x0 - y0 * y0;
    var n0 = t0 < 0 ? 0.0 : Math.pow(t0, 4) * this.dot(FastSimplexNoise.GRAD3D[gi0], [x0, y0]);
    var t1 = 0.5 - x1 * x1 - y1 * y1;
    var n1 = t1 < 0 ? 0.0 : Math.pow(t1, 4) * this.dot(FastSimplexNoise.GRAD3D[gi1], [x1, y1]);
    var t2 = 0.5 - x2 * x2 - y2 * y2;
    var n2 = t2 < 0 ? 0.0 : Math.pow(t2, 4) * this.dot(FastSimplexNoise.GRAD3D[gi2], [x2, y2]);
    return 70.14805770653952 * (n0 + n1 + n2);
  };

  FastSimplexNoise.prototype.raw3D = function (x, y, z) {
    var s = (x + y + z) / 3.0;
    var i = Math.floor(x + s);
    var j = Math.floor(y + s);
    var k = Math.floor(z + s);
    var t = (i + j + k) * FastSimplexNoise.G3;
    var X0 = i - t;
    var Y0 = j - t;
    var Z0 = k - t;
    var x0 = x - X0;
    var y0 = y - Y0;
    var z0 = z - Z0;
    var i1, j1, k1;
    var i2, j2, k2;

    if (x0 >= y0) {
      if (y0 >= z0) {
        i1 = i2 = j2 = 1;
        j1 = k1 = k2 = 0;
      } else if (x0 >= z0) {
        i1 = i2 = k2 = 1;
        j1 = k1 = j2 = 0;
      } else {
        k1 = i2 = k2 = 1;
        i1 = j1 = j2 = 0;
      }
    } else {
      if (y0 < z0) {
        k1 = j2 = k2 = 1;
        i1 = j1 = i2 = 0;
      } else if (x0 < z0) {
        j1 = j2 = k2 = 1;
        i1 = k1 = i2 = 0;
      } else {
        j1 = i2 = j2 = 1;
        i1 = k1 = k2 = 0;
      }
    }

    var x1 = x0 - i1 + FastSimplexNoise.G3;
    var y1 = y0 - j1 + FastSimplexNoise.G3;
    var z1 = z0 - k1 + FastSimplexNoise.G3;
    var x2 = x0 - i2 + 2.0 * FastSimplexNoise.G3;
    var y2 = y0 - j2 + 2.0 * FastSimplexNoise.G3;
    var z2 = z0 - k2 + 2.0 * FastSimplexNoise.G3;
    var x3 = x0 - 1.0 + 3.0 * FastSimplexNoise.G3;
    var y3 = y0 - 1.0 + 3.0 * FastSimplexNoise.G3;
    var z3 = z0 - 1.0 + 3.0 * FastSimplexNoise.G3;
    var ii = i & 255;
    var jj = j & 255;
    var kk = k & 255;
    var gi0 = this.permMod12[ii + this.perm[jj + this.perm[kk]]];
    var gi1 = this.permMod12[ii + i1 + this.perm[jj + j1 + this.perm[kk + k1]]];
    var gi2 = this.permMod12[ii + i2 + this.perm[jj + j2 + this.perm[kk + k2]]];
    var gi3 = this.permMod12[ii + 1 + this.perm[jj + 1 + this.perm[kk + 1]]];
    var t0 = 0.5 - x0 * x0 - y0 * y0 - z0 * z0;
    var n0 = t0 < 0 ? 0.0 : Math.pow(t0, 4) * this.dot(FastSimplexNoise.GRAD3D[gi0], [x0, y0, z0]);
    var t1 = 0.5 - x1 * x1 - y1 * y1 - z1 * z1;
    var n1 = t1 < 0 ? 0.0 : Math.pow(t1, 4) * this.dot(FastSimplexNoise.GRAD3D[gi1], [x1, y1, z1]);
    var t2 = 0.5 - x2 * x2 - y2 * y2 - z2 * z2;
    var n2 = t2 < 0 ? 0.0 : Math.pow(t2, 4) * this.dot(FastSimplexNoise.GRAD3D[gi2], [x2, y2, z2]);
    var t3 = 0.5 - x3 * x3 - y3 * y3 - z3 * z3;
    var n3 = t3 < 0 ? 0.0 : Math.pow(t3, 4) * this.dot(FastSimplexNoise.GRAD3D[gi3], [x3, y3, z3]);
    return 94.68493150681972 * (n0 + n1 + n2 + n3);
  };

  FastSimplexNoise.prototype.raw4D = function (x, y, z, w) {
    var s = (x + y + z + w) * (Math.sqrt(5.0) - 1.0) / 4.0;
    var i = Math.floor(x + s);
    var j = Math.floor(y + s);
    var k = Math.floor(z + s);
    var l = Math.floor(w + s);
    var t = (i + j + k + l) * FastSimplexNoise.G4;
    var X0 = i - t;
    var Y0 = j - t;
    var Z0 = k - t;
    var W0 = l - t;
    var x0 = x - X0;
    var y0 = y - Y0;
    var z0 = z - Z0;
    var w0 = w - W0;
    var rankx = 0;
    var ranky = 0;
    var rankz = 0;
    var rankw = 0;
    if (x0 > y0) rankx++;else ranky++;
    if (x0 > z0) rankx++;else rankz++;
    if (x0 > w0) rankx++;else rankw++;
    if (y0 > z0) ranky++;else rankz++;
    if (y0 > w0) ranky++;else rankw++;
    if (z0 > w0) rankz++;else rankw++;
    var i1 = rankx >= 3 ? 1 : 0;
    var j1 = ranky >= 3 ? 1 : 0;
    var k1 = rankz >= 3 ? 1 : 0;
    var l1 = rankw >= 3 ? 1 : 0;
    var i2 = rankx >= 2 ? 1 : 0;
    var j2 = ranky >= 2 ? 1 : 0;
    var k2 = rankz >= 2 ? 1 : 0;
    var l2 = rankw >= 2 ? 1 : 0;
    var i3 = rankx >= 1 ? 1 : 0;
    var j3 = ranky >= 1 ? 1 : 0;
    var k3 = rankz >= 1 ? 1 : 0;
    var l3 = rankw >= 1 ? 1 : 0;
    var x1 = x0 - i1 + FastSimplexNoise.G4;
    var y1 = y0 - j1 + FastSimplexNoise.G4;
    var z1 = z0 - k1 + FastSimplexNoise.G4;
    var w1 = w0 - l1 + FastSimplexNoise.G4;
    var x2 = x0 - i2 + 2.0 * FastSimplexNoise.G4;
    var y2 = y0 - j2 + 2.0 * FastSimplexNoise.G4;
    var z2 = z0 - k2 + 2.0 * FastSimplexNoise.G4;
    var w2 = w0 - l2 + 2.0 * FastSimplexNoise.G4;
    var x3 = x0 - i3 + 3.0 * FastSimplexNoise.G4;
    var y3 = y0 - j3 + 3.0 * FastSimplexNoise.G4;
    var z3 = z0 - k3 + 3.0 * FastSimplexNoise.G4;
    var w3 = w0 - l3 + 3.0 * FastSimplexNoise.G4;
    var x4 = x0 - 1.0 + 4.0 * FastSimplexNoise.G4;
    var y4 = y0 - 1.0 + 4.0 * FastSimplexNoise.G4;
    var z4 = z0 - 1.0 + 4.0 * FastSimplexNoise.G4;
    var w4 = w0 - 1.0 + 4.0 * FastSimplexNoise.G4;
    var ii = i & 255;
    var jj = j & 255;
    var kk = k & 255;
    var ll = l & 255;
    var gi0 = this.perm[ii + this.perm[jj + this.perm[kk + this.perm[ll]]]] % 32;
    var gi1 = this.perm[ii + i1 + this.perm[jj + j1 + this.perm[kk + k1 + this.perm[ll + l1]]]] % 32;
    var gi2 = this.perm[ii + i2 + this.perm[jj + j2 + this.perm[kk + k2 + this.perm[ll + l2]]]] % 32;
    var gi3 = this.perm[ii + i3 + this.perm[jj + j3 + this.perm[kk + k3 + this.perm[ll + l3]]]] % 32;
    var gi4 = this.perm[ii + 1 + this.perm[jj + 1 + this.perm[kk + 1 + this.perm[ll + 1]]]] % 32;
    var t0 = 0.5 - x0 * x0 - y0 * y0 - z0 * z0 - w0 * w0;
    var n0 = t0 < 0 ? 0.0 : Math.pow(t0, 4) * this.dot(FastSimplexNoise.GRAD4D[gi0], [x0, y0, z0, w0]);
    var t1 = 0.5 - x1 * x1 - y1 * y1 - z1 * z1 - w1 * w1;
    var n1 = t1 < 0 ? 0.0 : Math.pow(t1, 4) * this.dot(FastSimplexNoise.GRAD4D[gi1], [x1, y1, z1, w1]);
    var t2 = 0.5 - x2 * x2 - y2 * y2 - z2 * z2 - w2 * w2;
    var n2 = t2 < 0 ? 0.0 : Math.pow(t2, 4) * this.dot(FastSimplexNoise.GRAD4D[gi2], [x2, y2, z2, w2]);
    var t3 = 0.5 - x3 * x3 - y3 * y3 - z3 * z3 - w3 * w3;
    var n3 = t3 < 0 ? 0.0 : Math.pow(t3, 4) * this.dot(FastSimplexNoise.GRAD4D[gi3], [x3, y3, z3, w3]);
    var t4 = 0.5 - x4 * x4 - y4 * y4 - z4 * z4 - w4 * w4;
    var n4 = t4 < 0 ? 0.0 : Math.pow(t4, 4) * this.dot(FastSimplexNoise.GRAD4D[gi4], [x4, y4, z4, w4]);
    return 72.37855765153665 * (n0 + n1 + n2 + n3 + n4);
  };

  FastSimplexNoise.prototype.scaled = function (coords) {
    switch (coords.length) {
      case 2:
        return this.scaled2D(coords[0], coords[1]);

      case 3:
        return this.scaled3D(coords[0], coords[1], coords[2]);

      case 4:
        return this.scaled4D(coords[0], coords[1], coords[2], coords[3]);

      default:
        return null;
    }
  };

  FastSimplexNoise.prototype.scaled2D = function (x, y) {
    var amplitude = this.amplitude;
    var frequency = this.frequency;
    var maxAmplitude = 0;
    var noise = 0;

    for (var i = 0; i < this.octaves; i++) {
      noise += this.raw2D(x * frequency, y * frequency) * amplitude;
      maxAmplitude += amplitude;
      amplitude *= this.persistence;
      frequency *= 2;
    }

    return this.scale(noise / maxAmplitude);
  };

  FastSimplexNoise.prototype.scaled3D = function (x, y, z) {
    var amplitude = this.amplitude;
    var frequency = this.frequency;
    var maxAmplitude = 0;
    var noise = 0;

    for (var i = 0; i < this.octaves; i++) {
      noise += this.raw3D(x * frequency, y * frequency, z * frequency) * amplitude;
      maxAmplitude += amplitude;
      amplitude *= this.persistence;
      frequency *= 2;
    }

    return this.scale(noise / maxAmplitude);
  };

  FastSimplexNoise.prototype.scaled4D = function (x, y, z, w) {
    var amplitude = this.amplitude;
    var frequency = this.frequency;
    var maxAmplitude = 0;
    var noise = 0;

    for (var i = 0; i < this.octaves; i++) {
      noise += this.raw4D(x * frequency, y * frequency, z * frequency, w * frequency) * amplitude;
      maxAmplitude += amplitude;
      amplitude *= this.persistence;
      frequency *= 2;
    }

    return this.scale(noise / maxAmplitude);
  };

  FastSimplexNoise.prototype.spherical = function (circumference, coords) {
    switch (coords.length) {
      case 3:
        return this.spherical3D(circumference, coords[0], coords[1], coords[2]);

      case 2:
        return this.spherical2D(circumference, coords[0], coords[1]);

      default:
        return null;
    }
  };

  FastSimplexNoise.prototype.spherical2D = function (circumference, x, y) {
    var nx = x / circumference;
    var ny = y / circumference;
    var rdx = nx * 2 * Math.PI;
    var rdy = ny * Math.PI;
    var sinY = Math.sin(rdy + Math.PI);
    var sinRds = 2 * Math.PI;
    var a = sinRds * Math.sin(rdx) * sinY;
    var b = sinRds * Math.cos(rdx) * sinY;
    var d = sinRds * Math.cos(rdy);
    return this.scaled3D(a, b, d);
  };

  FastSimplexNoise.prototype.spherical3D = function (circumference, x, y, z) {
    var nx = x / circumference;
    var ny = y / circumference;
    var rdx = nx * 2 * Math.PI;
    var rdy = ny * Math.PI;
    var sinY = Math.sin(rdy + Math.PI);
    var sinRds = 2 * Math.PI;
    var a = sinRds * Math.sin(rdx) * sinY;
    var b = sinRds * Math.cos(rdx) * sinY;
    var d = sinRds * Math.cos(rdy);
    return this.scaled4D(a, b, d, z);
  };

  FastSimplexNoise.G2 = (3.0 - Math.sqrt(3.0)) / 6.0;
  FastSimplexNoise.G3 = 1.0 / 6.0;
  FastSimplexNoise.G4 = (5.0 - Math.sqrt(5.0)) / 20.0;
  FastSimplexNoise.GRAD3D = [[1, 1, 0], [-1, 1, 0], [1, -1, 0], [-1, -1, 0], [1, 0, 1], [-1, 0, 1], [1, 0, -1], [-1, 0, -1], [0, 1, 1], [0, -1, -1], [0, 1, -1], [0, -1, -1]];
  FastSimplexNoise.GRAD4D = [[0, 1, 1, 1], [0, 1, 1, -1], [0, 1, -1, 1], [0, 1, -1, -1], [0, -1, 1, 1], [0, -1, 1, -1], [0, -1, -1, 1], [0, -1, -1, -1], [1, 0, 1, 1], [1, 0, 1, -1], [1, 0, -1, 1], [1, 0, -1, -1], [-1, 0, 1, 1], [-1, 0, 1, -1], [-1, 0, -1, 1], [-1, 0, -1, -1], [1, 1, 0, 1], [1, 1, 0, -1], [1, -1, 0, 1], [1, -1, 0, -1], [-1, 1, 0, 1], [-1, 1, 0, -1], [-1, -1, 0, 1], [-1, -1, 0, -1], [1, 1, 1, 0], [1, 1, -1, 0], [1, -1, 1, 0], [1, -1, -1, 0], [-1, 1, 1, 0], [-1, 1, -1, 0], [-1, -1, 1, 0], [-1, -1, -1, 0]];
  return FastSimplexNoise;
}();

exports.default = FastSimplexNoise;
},{}],"Boids/Terrain/Square/index.ts":[function(require,module,exports) {
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

var constants_1 = require("../constants");

var colors_1 = require("../../colors");

var types_1 = require("../types");

var Vector2D_1 = __importDefault(require("../../Vector2D"));

var Square = /*#__PURE__*/function () {
  function Square(x, y, type) {
    _classCallCheck(this, Square);

    this.x = x;
    this.y = y;
    this.type = type;
    this.isLandable = types_1.LANDABLE_SQUARE_TYPES.indexOf(this.type) !== -1;
    this.center = new Vector2D_1.default(this.x * constants_1.SQUARE_SIZE + constants_1.SQUARE_SIZE / 2, this.y * constants_1.SQUARE_SIZE + constants_1.SQUARE_SIZE / 2);
    this.foodLevel = constants_1.SQUARE_FOODS.get(this.type) || 0;
  }

  _createClass(Square, [{
    key: "getPixelCenter",
    value: function getPixelCenter() {
      return this.center;
    }
  }, {
    key: "update",
    value: function update(_) {}
  }, {
    key: "render",
    value: function render(context) {
      context.fillStyle = colors_1.SquareColors[this.type];
      context.fillRect(this.x * constants_1.SQUARE_SIZE, this.y * constants_1.SQUARE_SIZE, constants_1.SQUARE_SIZE, constants_1.SQUARE_SIZE);
    }
  }]);

  return Square;
}();

exports.default = Square;
},{"../constants":"Boids/Terrain/constants.ts","../../colors":"Boids/colors.ts","../types":"Boids/Terrain/types.ts","../../Vector2D":"Boids/Vector2D/index.ts"}],"Boids/Terrain/index.ts":[function(require,module,exports) {
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

var typescript_render_engine_1 = require("@zacktherrien/typescript-render-engine");

var src_1 = __importDefault(require("../../../node_modules/fast-simplex-noise/src"));

var Square_1 = __importDefault(require("./Square"));

var constants_1 = require("../constants");

var constants_2 = require("./constants");

var Terrain = /*#__PURE__*/function () {
  function Terrain() {
    _classCallCheck(this, Terrain);

    this.layer = new typescript_render_engine_1.DeferredLayer(constants_2.TERRAIN_UPDATE_RATE, constants_1.LayerIndex.BACKGROUND);
    this.layer.update(constants_2.TERRAIN_UPDATE_RATE);
    this.heightMap = new src_1.default({
      frequency: 0.01,
      max: 1,
      min: 0,
      octaves: 4
    });
    this.humidityMap = new src_1.default({
      frequency: 0.01,
      max: 1,
      min: 0,
      octaves: 8
    });
    this.moistureMap = new src_1.default({
      frequency: 0.01,
      max: 1,
      min: 0,
      octaves: 8
    });
    this.squares = [];
    this.initSquares();
  }

  _createClass(Terrain, [{
    key: "initSquares",
    value: function initSquares() {
      var screenWidth = this.layer.getWidth();
      var screenHeight = this.layer.getHeight();
      var amountOfSquaresInX = Math.ceil(screenWidth / constants_2.SQUARE_SIZE);
      var amountOfSquaresInY = Math.ceil(screenHeight / constants_2.SQUARE_SIZE);
      var currentRow = [];
      var square;

      for (var y = 0; y < amountOfSquaresInY; y++) {
        currentRow = [];

        for (var x = 0; x < amountOfSquaresInX; x++) {
          square = new Square_1.default(x, y, this.getTerrainType(x, y));
          currentRow.push(square);
          this.layer.addEntity(square);
        }

        this.squares.push(currentRow);
      }
    }
  }, {
    key: "getSquareAtCoord",
    value: function getSquareAtCoord(x, y) {
      if (x > this.squares[0].length) {
        return null;
      }

      if (y > this.squares.length) {
        return null;
      }

      if (!this.squares || !this.squares[y] || !this.squares[y][x]) {
        return null;
      }

      return this.squares[y][x];
    }
  }, {
    key: "getSquareAtLocation",
    value: function getSquareAtLocation(position) {
      var row = Math.floor(position.x2 / constants_2.SQUARE_SIZE);
      var col = Math.floor(position.x1 / constants_2.SQUARE_SIZE);

      if (col > this.squares[0].length) {
        return null;
      }

      if (row > this.squares.length) {
        return null;
      }

      if (!this.squares || !this.squares[row] || !this.squares[row][col]) {
        return null;
      }

      return this.squares[row][col];
    }
  }, {
    key: "getTerrainType",
    value: function getTerrainType(x, y) {
      var height = this.heightMap.scaled2D(x, y);
      var humidity = this.humidityMap.scaled2D(x, y);
      var moisture = this.moistureMap.scaled2D(x, y);
      var squareType = this.squareTypeFromHeight(height, humidity, moisture);
      return squareType;
    }
  }, {
    key: "squareTypeFromHeight",
    value: function squareTypeFromHeight(height, humidity, moisture) {
      var foundType = null;
      constants_2.SQUARE_TERRAIN_DEFINITIONS.forEach(function (values, type) {
        if (height >= values.height.min && height <= values.height.max) {
          if (humidity >= values.humidity.min && humidity <= values.humidity.max) {
            if (moisture >= values.moisture.min && moisture <= values.moisture.max) {
              foundType = type;
            }
          }
        }
      });

      if (foundType === null) {
        ;
        ;
        debugger;
        ;
        throw new Error();
      }

      return foundType;
    }
  }]);

  return Terrain;
}();

exports.default = Terrain;
},{"@zacktherrien/typescript-render-engine":"../node_modules/@zacktherrien/typescript-render-engine/dist/index.js","../../../node_modules/fast-simplex-noise/src":"../node_modules/fast-simplex-noise/src/index.ts","./Square":"Boids/Terrain/Square/index.ts","../constants":"Boids/constants.ts","./constants":"Boids/Terrain/constants.ts"}],"Boids/MouseTools/SelectionTool/index.ts":[function(require,module,exports) {
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var SelectionTool = /*#__PURE__*/function () {
  function SelectionTool(initialPosition) {
    _classCallCheck(this, SelectionTool);

    this.initialPosition = initialPosition;
    this.position = initialPosition;
    this.top = 0;
    this.left = 0;
    this.width = 0;
    this.height = 0;
  }

  _createClass(SelectionTool, [{
    key: "getGeometry",
    value: function getGeometry() {
      return {
        top: this.top,
        left: this.left,
        width: this.width,
        height: this.height
      };
    }
  }, {
    key: "updatePosition",
    value: function updatePosition(newPosition) {
      this.position = newPosition;
      this.left = Math.min(this.initialPosition.x1, this.position.x1);
      this.top = Math.min(this.initialPosition.x2, this.position.x2);
      var right = Math.max(this.initialPosition.x1, this.position.x1);
      var bottom = Math.max(this.initialPosition.x2, this.position.x2);
      this.width = right - this.left;
      this.height = bottom - this.top;
    }
  }, {
    key: "render",
    value: function render(context) {
      context.strokeStyle = '#0F0';
      context.strokeRect(this.left, this.top, this.width, this.height);
    }
  }]);

  return SelectionTool;
}();

exports.default = SelectionTool;
},{}],"Boids/MouseTools/index.ts":[function(require,module,exports) {
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

var typescript_render_engine_1 = require("@zacktherrien/typescript-render-engine");

var constants_1 = require("../constants");

var Vector2D_1 = __importDefault(require("../Vector2D"));

var __1 = __importDefault(require(".."));

var SelectionTool_1 = __importDefault(require("./SelectionTool"));

var MouseToolsManager = /*#__PURE__*/function () {
  function MouseToolsManager() {
    _classCallCheck(this, MouseToolsManager);

    this.layer = new typescript_render_engine_1.StaticLayer(constants_1.LayerIndex.TOOLS);
    this.currentTool = null;
    this.initialMouseLocation = Vector2D_1.default.ZERO();
    this.mouseLocation = Vector2D_1.default.ZERO();
    document.addEventListener('mousedown', this.handleMouseDown.bind(this));
    document.addEventListener('mouseup', this.handleMouseUp.bind(this));
    document.addEventListener('mousemove', this.handleMouseMove.bind(this));
    document.addEventListener('contextmenu', function (event) {
      return event.preventDefault();
    });
  }

  _createClass(MouseToolsManager, [{
    key: "chooseTool",
    value: function chooseTool(tool) {
      this.resetTool();
      this.currentTool = tool;
      this.layer.addEntity(this.currentTool);
    }
  }, {
    key: "resetTool",
    value: function resetTool() {
      if (this.currentTool) {
        this.layer.removeEntity(this.currentTool);
        this.layer.allowRenderOnNextFrame();
      }
    }
  }, {
    key: "handleMouseDown",
    value: function handleMouseDown(e) {
      if (e.button !== 0) {
        e.preventDefault();
        e.stopImmediatePropagation();
      }

      this.mouseLocation = new Vector2D_1.default(e.offsetX, e.offsetY);
      this.chooseTool(new SelectionTool_1.default(this.mouseLocation));
    }
  }, {
    key: "handleMouseMove",
    value: function handleMouseMove(e) {
      this.mouseLocation = new Vector2D_1.default(e.offsetX, e.offsetY);

      if (this.currentTool) {
        this.layer.allowRenderOnNextFrame();
        this.currentTool.updatePosition(this.mouseLocation);
      }
    }
  }, {
    key: "handleMouseUp",
    value: function handleMouseUp() {
      var _a;

      if (!this.currentTool) return;

      var _ref = (_a = this.currentTool) === null || _a === void 0 ? void 0 : _a.getGeometry(),
          left = _ref.left,
          top = _ref.top,
          width = _ref.width,
          height = _ref.height;

      var right = left + width;
      var bottom = top + height;

      for (var i = 0; i < __1.default.instance.birds.length; i++) {
        if (__1.default.instance.birds[i].position.x1 < right && __1.default.instance.birds[i].position.x1 > left && __1.default.instance.birds[i].position.x2 < bottom && __1.default.instance.birds[i].position.x2 > top) {
          console.log(__1.default.instance.birds[i]);
        }
      }

      this.resetTool();
    }
  }]);

  return MouseToolsManager;
}();

exports.default = MouseToolsManager;
},{"@zacktherrien/typescript-render-engine":"../node_modules/@zacktherrien/typescript-render-engine/dist/index.js","../constants":"Boids/constants.ts","../Vector2D":"Boids/Vector2D/index.ts","..":"Boids/index.ts","./SelectionTool":"Boids/MouseTools/SelectionTool/index.ts"}],"Boids/index.ts":[function(require,module,exports) {
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var __createBinding = this && this.__createBinding || (Object.create ? function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  Object.defineProperty(o, k2, {
    enumerable: true,
    get: function get() {
      return m[k];
    }
  });
} : function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  o[k2] = m[k];
});

var __setModuleDefault = this && this.__setModuleDefault || (Object.create ? function (o, v) {
  Object.defineProperty(o, "default", {
    enumerable: true,
    value: v
  });
} : function (o, v) {
  o["default"] = v;
});

var __importStar = this && this.__importStar || function (mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) for (var k in mod) {
    if (Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
  }

  __setModuleDefault(result, mod);

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

var Terrain_1 = __importDefault(require("./Terrain"));

var MouseTools_1 = __importDefault(require("./MouseTools"));

var Boids = function Boids() {
  _classCallCheck(this, Boids);

  Boids.instance = this;
  this.mouseTools = new MouseTools_1.default();
  this.terrain = new Terrain_1.default();
  this.birdLayer = new typescript_render_engine_1.DynamicLayer(constants_1.LayerIndex.BIRDS);
  this.maxX = this.birdLayer.getWidth();
  this.maxY = this.birdLayer.getHeight();
  this.birds = [];

  for (var i = 0; i < constants_1.BIRD_COUNT; i++) {
    var bird = new Bird_1.default(this, Math.random() * this.birdLayer.getWidth(), Math.random() * this.birdLayer.getHeight());
    this.birds.push(bird);
    this.birdLayer.addEntity(bird);
  }

  this.engine = new typescript_render_engine_1.default();
  this.engine.registerLayer(this.terrain.layer);
  this.engine.registerLayer(this.mouseTools.layer);
  this.engine.registerLayer(this.birdLayer);
  this.engine.start();
  this.terrain.layer.render();
};

exports.default = Boids;
},{"@zacktherrien/typescript-render-engine":"../node_modules/@zacktherrien/typescript-render-engine/dist/index.js","./constants":"Boids/constants.ts","./Bird":"Boids/Bird/index.ts","./Terrain":"Boids/Terrain/index.ts","./MouseTools":"Boids/MouseTools/index.ts"}],"index.ts":[function(require,module,exports) {
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
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "51111" + '/');

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