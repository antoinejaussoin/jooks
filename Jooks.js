"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.init = exports.Jooks = void 0;
var react_1 = __importDefault(require("react"));
var lodash_isequal_1 = __importDefault(require("lodash.isequal"));
var Jooks = /** @class */ (function () {
    function Jooks(hookFunction, verbose) {
        var _this = this;
        if (verbose === void 0) { verbose = false; }
        this.hookFunction = hookFunction;
        this.verbose = verbose;
        /**
         * Executes your hook, and returns the result
         */
        this.run = (function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            // This weird TypeScript hack ensures that the "run" function has the
            // exact same signature as your hook.
            _this._renderArgs = __spreadArray([], args, true);
            return _this.render.apply(_this, args);
        });
        this.contextValues = new Map();
        this.stateStore = new HookStore('useState');
        this.effectStore = new HookStore('useEffect');
        this.layoutEffectStore = new HookStore('useLayoutEffect');
        this.callbackStore = new HookStore('useCallback');
        this.debugStore = new HookStore('useDebugValue');
        this.refStore = new HookStore('useRef');
        this.memoStore = new HookStore('useMemo');
        this.reducerStore = new HookStore('useReducer');
        this.contextStore = new HookStoreBase('useContext');
        this.cleanupFunctions = [];
        this._renderArgs = [];
    }
    /**
     * This should be run before each test.
     * This is automatically called by the init function exposed by the library.
     * You should not have to run it yourself.
     */
    Jooks.prototype.setup = function () {
        if (this.verbose) {
            console.log('Setup Mock');
        }
        this.stateStore.setup(this.mockUseState.bind(this));
        this.effectStore.setup(this.mockUseEffect.bind(this));
        this.layoutEffectStore.setup(this.mockUseLayoutEffect.bind(this));
        this.callbackStore.setup(this.mockUseCallback.bind(this));
        this.debugStore.setup(this.mockUseDebugValue.bind(this));
        this.refStore.setup(this.mockUseRef.bind(this));
        this.memoStore.setup(this.mockUseMemo.bind(this));
        this.reducerStore.setup(this.mockUseReducer.bind(this));
        this.contextStore.setup(this.mockUseContext.bind(this));
        this._renderArgs = [];
    };
    /**
     * This should be run after each test.
     * This is automatically called by the init function exposed by the library.
     * You should not have to run it yourself.
     */
    Jooks.prototype.cleanup = function () {
        if (this.verbose) {
            console.log('Cleanup Mock');
        }
        this.stateStore.restore();
        this.effectStore.restore();
        this.layoutEffectStore.restore();
        this.callbackStore.restore();
        this.debugStore.restore();
        this.refStore.restore();
        this.memoStore.restore();
        this.reducerStore.restore();
        this.contextStore.restore();
    };
    /**
     * Use this to simulate a component "mounting", which means calling all its useEffect on componentDidMount.
     * Make sure effects are not taking more than 1 event-loop to execute, or more than 1ms, by mocking any API call.
     * If they are taking longer, you can increase the wait time to a given time in millisecond.
     * @param wait wait time in millisecond. Defaults to 1.
     */
    Jooks.prototype.mount = function (wait) {
        if (wait === void 0) { wait = 1; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.render.apply(this, this._renderArgs);
                        this.fireEffects();
                        return [4 /*yield*/, this.wait(wait)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Jooks.prototype.unmount = function (wait) {
        if (wait === void 0) { wait = 1; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.fireEffectsCleanup();
                        return [4 /*yield*/, this.wait(wait)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Use this to wait for Effects to be executed. Remember to mock all your API calls so that the asyncronous
     * effects are not taking more than 1 event-loop to execute, or more than 1ms.
     * @param wait wait time in millisecond. Defaults to 1.
     */
    Jooks.prototype.wait = function (wait) {
        if (wait === void 0) { wait = 1; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.fireEffects();
                return [2 /*return*/, new Promise(function (resolve) { return setTimeout(resolve, wait); })];
            });
        });
    };
    /**
     * Allows setting some value to a Context before the hook is run. You need to do this if your hook
     * contains any useContext call.
     * @param context React Context to set value to
     * @param value Value you want to give the Context
     */
    Jooks.prototype.setContext = function (context, value) {
        if (this.verbose) {
            console.log('Setting context', context.displayName, 'to', value);
        }
        this.contextValues.set(context, value);
    };
    /**
     * Reset all Context values. Don't forget to call setContext again after that.
     */
    Jooks.prototype.resetContext = function () {
        this.contextValues.clear();
    };
    Jooks.prototype.mockUseDebugValue = function (value, formatter) {
        if (this.verbose) {
            console.log('Debug Value: ', formatter ? formatter(value) : value);
        }
    };
    Jooks.prototype.mockUseReducer = function (reducer, initialState, initializer) {
        var _this = this;
        if (this.verbose) {
            console.log('Entering useReducer', this.reducerStore.current);
        }
        if (!this.reducerStore.current) {
            if (this.verbose) {
                console.log('New reducer: ', initialState);
            }
            var actualInitialState = initializer ? initializer(initialState) : initialState;
            this.reducerStore.current = {
                initialState: actualInitialState,
                reducer: reducer,
                currentState: actualInitialState,
            };
        }
        else {
            if (this.verbose) {
                console.log('Existing reducer: ', this.reducerStore.current.currentState);
            }
            this.reducerStore.current = __assign(__assign({}, this.reducerStore.current), { initialState: initialState, reducer: reducer });
        }
        var current = this.reducerStore.current;
        var dispatch = function (action) {
            if (_this.verbose) {
                console.log('Dispatching ', action, current.currentState);
            }
            current.currentState = current.reducer(current.currentState, action);
            if (_this.verbose) {
                console.log(' ==> Modified to ', current.currentState);
            }
        };
        this.reducerStore.next();
        return [current.currentState, dispatch];
    };
    Jooks.prototype.mockUseCallback = function (callback, deps) {
        var existingCallback = this.callbackStore.current;
        if (existingCallback && deps !== undefined) {
            if (this.verbose) {
                console.log('A callback already exists at this pointer ', this.callbackStore.pointer);
            }
            var areDepsEqual = (0, lodash_isequal_1.default)(deps, existingCallback.deps);
            if (this.verbose) {
                console.log('Did the CB dependencies change?', areDepsEqual, deps, existingCallback.deps);
            }
            if (areDepsEqual) {
                if (this.verbose) {
                    console.log('No, they are the same, returning cached');
                }
                this.callbackStore.next();
                return existingCallback.callback;
            }
        }
        if (this.verbose) {
            console.log('Yes, they differ, replacing the callback');
        }
        this.callbackStore.current = {
            callback: callback,
            deps: deps,
        };
        this.callbackStore.next();
        return callback;
    };
    Jooks.prototype.mockUseState = function (defaultValue) {
        var _this = this;
        var localPointer = this.stateStore.pointer;
        var isFunction = function (arg) { return typeof arg === 'function'; };
        var setState = function (v) {
            if (isFunction(v)) {
                var newState = v(_this.stateStore.store[localPointer]);
                if (_this.verbose) {
                    console.log('Set state to ', newState, ' pointer ', localPointer);
                }
                _this.stateStore.store[localPointer] = newState;
                return;
            }
            if (_this.verbose) {
                console.log('Set state to ', v, ' pointer ', localPointer);
            }
            _this.stateStore.store[localPointer] = v;
        };
        if (this.stateStore.current === undefined) {
            var computedDefault = typeof defaultValue === 'function' ? defaultValue() : defaultValue;
            if (this.verbose) {
                console.log('Set default to ', computedDefault, ' pointer ', localPointer);
            }
            this.stateStore.current = computedDefault;
        }
        var result = [this.stateStore.current, setState];
        this.stateStore.next();
        return result;
    };
    Jooks.prototype.mockUseEffect = function (effect, deps) {
        var existingEffect = this.effectStore.current;
        if (existingEffect && deps !== undefined) {
            if (this.verbose) {
                console.log('An effect already exists at this pointer ', this.effectStore.pointer);
            }
            var areDepsEqual = (0, lodash_isequal_1.default)(deps, existingEffect.deps);
            if (this.verbose) {
                console.log('Did the dependencies change?', areDepsEqual, deps, existingEffect.deps);
            }
            if (areDepsEqual) {
                if (this.verbose) {
                    console.log('No, they are the same, skipping');
                }
                this.effectStore.next();
                return;
            }
            if (this.verbose) {
                console.log('Yes, they differ, replacing the effect');
            }
        }
        if (this.verbose) {
            console.log('Storing new effect at ', this.effectStore.pointer);
        }
        this.effectStore.current = {
            effect: effect,
            deps: deps,
            hasRun: false,
        };
        this.effectStore.next();
    };
    Jooks.prototype.mockUseLayoutEffect = function (effect, deps) {
        var existingEffect = this.layoutEffectStore.current;
        if (existingEffect && deps !== undefined) {
            if (this.verbose) {
                console.log('A layout effect already exists at this pointer ', this.layoutEffectStore.pointer);
            }
            var areDepsEqual = (0, lodash_isequal_1.default)(deps, existingEffect.deps);
            if (this.verbose) {
                console.log('Did the dependencies change?', areDepsEqual, deps, existingEffect.deps);
            }
            if (areDepsEqual) {
                if (this.verbose) {
                    console.log('No, they are the same, skipping');
                }
                this.layoutEffectStore.next();
                return;
            }
            if (this.verbose) {
                console.log('Yes, they differ, replacing the layout effect');
            }
        }
        if (this.verbose) {
            console.log('Storing new effect at ', this.layoutEffectStore.pointer);
        }
        this.layoutEffectStore.current = {
            effect: effect,
            deps: deps,
            hasRun: false,
        };
        this.layoutEffectStore.next();
    };
    Jooks.prototype.mockUseRef = function (initialValue) {
        var existingRef = this.refStore.current;
        var returnValue;
        if (existingRef) {
            if (this.verbose) {
                console.log('A ref already exists at this pointer ', this.refStore.pointer);
            }
            returnValue = existingRef;
        }
        else {
            if (this.verbose) {
                console.log('Initialise the ref value ', this.refStore.pointer);
            }
            this.refStore.current = initialValue;
            returnValue = initialValue;
        }
        this.refStore.next();
        return { current: returnValue };
    };
    Jooks.prototype.mockUseMemo = function (factory, deps) {
        var existingMemo = this.memoStore.current;
        if (existingMemo && deps !== undefined) {
            if (this.verbose) {
                console.log('A memo already exists at this pointer ', this.memoStore.pointer);
            }
            var areDepsEqual = (0, lodash_isequal_1.default)(deps, existingMemo.deps);
            if (this.verbose) {
                console.log('Did the dependencies change?', areDepsEqual, deps, existingMemo.deps);
            }
            if (areDepsEqual) {
                if (this.verbose) {
                    console.log('No, they are the same, skipping');
                }
                var returnValue = this.memoStore.current.value;
                this.memoStore.next();
                return returnValue;
            }
            if (this.verbose) {
                console.log('Yes, they differ, replacing the memo and recomputing');
            }
        }
        if (this.verbose) {
            console.log('Storing new effect at ', this.memoStore.pointer);
        }
        var value = factory();
        this.memoStore.current = {
            factory: factory,
            deps: deps,
            value: value,
        };
        this.memoStore.next();
        return value;
    };
    Jooks.prototype.mockUseContext = function (context) {
        if (!this.contextValues.has(context)) {
            throw Error("You forgot to set the context for context ".concat(context.displayName, " to useContext"));
        }
        var contextValue = this.contextValues.get(context);
        if (this.verbose) {
            console.log('Getting value from context', context.displayName, ':', contextValue);
        }
        return contextValue;
    };
    Jooks.prototype.render = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this.stateStore.start();
        this.effectStore.start();
        this.layoutEffectStore.start();
        this.callbackStore.start();
        this.debugStore.start();
        this.refStore.start();
        this.memoStore.start();
        this.reducerStore.start();
        return this.hookFunction.apply(this, args);
    };
    Jooks.prototype.fireEffects = function () {
        var _this = this;
        this.render.apply(this, this._renderArgs);
        if (this.verbose) {
            console.log('Looking for effects to fire', this.effectStore.store, this.layoutEffectStore.store);
        }
        this.effectStore.store.forEach(function (effect) {
            if (!effect.hasRun) {
                if (_this.verbose) {
                    console.log('Firing effect: ', effect);
                }
                var cleanup = effect.effect();
                if (isFunction(cleanup)) {
                    _this.cleanupFunctions[_this.effectStore.pointer] = cleanup;
                    if (_this.verbose) {
                        console.log('Storing cleanup function for ', _this.cleanupFunctions.length);
                    }
                }
                effect.hasRun = true;
                _this.render.apply(_this, _this._renderArgs);
            }
        });
        this.layoutEffectStore.store.forEach(function (effect) {
            if (!effect.hasRun) {
                if (_this.verbose) {
                    console.log('Firing layout effect: ', effect);
                }
                var cleanup = effect.effect();
                if (isFunction(cleanup)) {
                    _this.cleanupFunctions[_this.effectStore.pointer + 10000] = cleanup;
                    if (_this.verbose) {
                        console.log('Storing cleanup function for ', effect);
                    }
                }
                effect.hasRun = true;
                _this.render.apply(_this, _this._renderArgs);
            }
        });
    };
    Jooks.prototype.fireEffectsCleanup = function () {
        var _this = this;
        if (this.verbose) {
            console.log('Looking for effects to clean', this.cleanupFunctions);
        }
        this.cleanupFunctions.forEach(function (cleanupFunction) {
            if (_this.verbose) {
                console.log('Cleaning effect: ', cleanupFunction);
            }
            cleanupFunction();
        });
    };
    return Jooks;
}());
exports.Jooks = Jooks;
function init(hook, verbose) {
    var mock = new Jooks(hook, verbose);
    beforeEach(function () { return mock.setup(); });
    afterEach(function () { return mock.cleanup(); });
    return mock;
}
exports.init = init;
exports.default = init;
var HookStoreBase = /** @class */ (function () {
    function HookStoreBase(property) {
        this._property = property;
        this._original = react_1.default[property];
    }
    HookStoreBase.prototype.setup = function (mockFunction) {
        react_1.default[this._property] = mockFunction;
    };
    HookStoreBase.prototype.restore = function () {
        react_1.default[this._property] = this._original;
    };
    return HookStoreBase;
}());
var HookStore = /** @class */ (function (_super) {
    __extends(HookStore, _super);
    function HookStore(property) {
        var _this = _super.call(this, property) || this;
        _this._pointer = 0;
        _this._store = [];
        return _this;
    }
    HookStore.prototype.reset = function () {
        this._pointer = 0;
        this._store = [];
    };
    HookStore.prototype.setup = function (mockFunction) {
        this.reset();
        _super.prototype.setup.call(this, mockFunction);
    };
    HookStore.prototype.start = function () {
        this._pointer = 0;
    };
    Object.defineProperty(HookStore.prototype, "pointer", {
        get: function () {
            return this._pointer;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(HookStore.prototype, "current", {
        get: function () {
            return this._store[this._pointer];
        },
        set: function (value) {
            this._store[this._pointer] = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(HookStore.prototype, "store", {
        get: function () {
            return this._store;
        },
        enumerable: false,
        configurable: true
    });
    HookStore.prototype.next = function () {
        this._pointer += 1;
    };
    return HookStore;
}(HookStoreBase));
function isFunction(value) {
    return typeof value === 'function';
}
