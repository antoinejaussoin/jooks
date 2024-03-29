import React from 'react';
import isEqual from 'lodash.isequal';

/* tslint:disable */

interface EffectItem {
  effect: Function;
  deps: ReadonlyArray<any> | undefined;
  hasRun: boolean;
}
interface CallbackItem {
  callback: Function;
  deps: ReadonlyArray<any> | undefined;
}

interface MemoItem {
  factory: () => any;
  deps: ReadonlyArray<any> | undefined;
  value: any;
}

interface ReducerItem {
  reducer: (state: any, action: any) => any;
  initialState: any;
  currentState: any;
}

export class Jooks<F extends Function> {
  private contextValues: Map<React.Context<any>, any>;

  private stateStore: HookStore<any>;
  private effectStore: HookStore<EffectItem>;
  private layoutEffectStore: HookStore<EffectItem>;
  private callbackStore: HookStore<CallbackItem>;
  private debugStore: HookStore<void>;
  private refStore: HookStore<any>;
  private memoStore: HookStore<MemoItem>;
  private reducerStore: HookStore<ReducerItem>;
  private contextStore: HookStoreBase;
  private cleanupFunctions: Function[];

  private _renderArgs: any[];

  constructor(private hookFunction: F, private verbose: boolean = false) {
    this.contextValues = new Map<React.Context<any>, any>();

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
  public setup() {
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
  }

  /**
   * This should be run after each test.
   * This is automatically called by the init function exposed by the library.
   * You should not have to run it yourself.
   */
  public cleanup() {
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
  }

  /**
   * Use this to simulate a component "mounting", which means calling all its useEffect on componentDidMount.
   * Make sure effects are not taking more than 1 event-loop to execute, or more than 1ms, by mocking any API call.
   * If they are taking longer, you can increase the wait time to a given time in millisecond.
   * @param wait wait time in millisecond. Defaults to 1.
   */
  public async mount(wait: number = 1): Promise<void> {
    this.render(...this._renderArgs);
    this.fireEffects();
    await this.wait(wait);
  }

  public async unmount(wait: number = 1) {
    this.fireEffectsCleanup();
    await this.wait(wait);
  }

  /**
   * Executes your hook, and returns the result
   */
  public run = ((...args: any[]) => {
    // This weird TypeScript hack ensures that the "run" function has the
    // exact same signature as your hook.
    this._renderArgs = [...args];
    return this.render(...args);
  }) as unknown as F;

  /**
   * Use this to wait for Effects to be executed. Remember to mock all your API calls so that the asyncronous
   * effects are not taking more than 1 event-loop to execute, or more than 1ms.
   * @param wait wait time in millisecond. Defaults to 1.
   */
  public async wait(wait: number = 1) {
    this.fireEffects();
    return new Promise((resolve) => setTimeout(resolve, wait));
  }

  /**
   * Allows setting some value to a Context before the hook is run. You need to do this if your hook
   * contains any useContext call.
   * @param context React Context to set value to
   * @param value Value you want to give the Context
   */
  public setContext<T>(context: React.Context<T>, value: T) {
    if (this.verbose) {
      console.log('Setting context', context.displayName, 'to', value);
    }
    this.contextValues.set(context, value);
  }

  /**
   * Reset all Context values. Don't forget to call setContext again after that.
   */
  public resetContext() {
    this.contextValues.clear();
  }

  private mockUseDebugValue<T>(value: T, formatter?: (value: T) => any) {
    if (this.verbose) {
      console.log('Debug Value: ', formatter ? formatter(value) : value);
    }
  }

  private mockUseReducer<R extends React.Reducer<any, any>>(
    reducer: R,
    initialState: React.ReducerState<R>,
    initializer?: any,
  ): [React.ReducerState<R>, React.Dispatch<React.ReducerAction<R>>] {
    if (this.verbose) {
      console.log('Entering useReducer', this.reducerStore.current);
    }
    if (!this.reducerStore.current) {
      if (this.verbose) {
        console.log('New reducer: ', initialState);
      }
      const actualInitialState = initializer ? initializer(initialState) : initialState;
      this.reducerStore.current = {
        initialState: actualInitialState,
        reducer,
        currentState: actualInitialState,
      };
    } else {
      if (this.verbose) {
        console.log('Existing reducer: ', this.reducerStore.current.currentState);
      }
      this.reducerStore.current = {
        ...this.reducerStore.current,
        initialState,
        reducer,
      };
    }
    const current = this.reducerStore.current;
    const dispatch = (action: any) => {
      if (this.verbose) {
        console.log('Dispatching ', action, current.currentState);
      }
      current.currentState = current.reducer(current.currentState, action);
      if (this.verbose) {
        console.log(' ==> Modified to ', current.currentState);
      }
    };
    this.reducerStore.next();
    return [current.currentState, dispatch];
  }

  private mockUseCallback(callback: Function, deps?: ReadonlyArray<any> | undefined): Function {
    const existingCallback = this.callbackStore.current;
    if (existingCallback && deps !== undefined) {
      if (this.verbose) {
        console.log('A callback already exists at this pointer ', this.callbackStore.pointer);
      }
      const areDepsEqual = isEqual(deps, existingCallback.deps);
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
      callback,
      deps,
    };
    this.callbackStore.next();
    return callback;
  }

  private mockUseState<T>(defaultValue: T | (() => T)) {
    const localPointer = this.stateStore.pointer;

    const isFunction = (arg: any): arg is Function => typeof arg === 'function';

    const setState = (v: T | ((previousValue: T) => void)) => {
      if (isFunction(v)) {
        const newState = v(this.stateStore.store[localPointer]);
        if (this.verbose) {
          console.log('Set state to ', newState, ' pointer ', localPointer);
        }
        this.stateStore.store[localPointer] = newState;
        return;
      }
      if (this.verbose) {
        console.log('Set state to ', v, ' pointer ', localPointer);
      }
      this.stateStore.store[localPointer] = v;
    };
    if (this.stateStore.current === undefined) {
      const computedDefault = typeof defaultValue === 'function' ? (defaultValue as () => T)() : defaultValue;
      if (this.verbose) {
        console.log('Set default to ', computedDefault, ' pointer ', localPointer);
      }
      this.stateStore.current = computedDefault;
    }
    const result = [this.stateStore.current, setState];
    this.stateStore.next();
    return result;
  }

  private mockUseEffect(effect: Function, deps?: ReadonlyArray<any> | undefined) {
    const existingEffect = this.effectStore.current;
    if (existingEffect && deps !== undefined) {
      if (this.verbose) {
        console.log('An effect already exists at this pointer ', this.effectStore.pointer);
      }
      const areDepsEqual = isEqual(deps, existingEffect.deps);
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
      effect,
      deps,
      hasRun: false,
    };
    this.effectStore.next();
  }

  private mockUseLayoutEffect(effect: Function, deps?: ReadonlyArray<any> | undefined) {
    const existingEffect = this.layoutEffectStore.current;
    if (existingEffect && deps !== undefined) {
      if (this.verbose) {
        console.log('A layout effect already exists at this pointer ', this.layoutEffectStore.pointer);
      }
      const areDepsEqual = isEqual(deps, existingEffect.deps);
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
      effect,
      deps,
      hasRun: false,
    };
    this.layoutEffectStore.next();
  }

  private mockUseRef<T>(initialValue: T) {
    const existingRef = this.refStore.current;
    let returnValue: T;
    if (existingRef) {
      if (this.verbose) {
        console.log('A ref already exists at this pointer ', this.refStore.pointer);
      }
      returnValue = existingRef;
    } else {
      if (this.verbose) {
        console.log('Initialise the ref value ', this.refStore.pointer);
      }
      this.refStore.current = initialValue;
      returnValue = initialValue;
    }
    this.refStore.next();
    return { current: returnValue };
  }

  private mockUseMemo<T>(factory: () => T, deps?: ReadonlyArray<any> | undefined): T {
    const existingMemo = this.memoStore.current;
    if (existingMemo && deps !== undefined) {
      if (this.verbose) {
        console.log('A memo already exists at this pointer ', this.memoStore.pointer);
      }
      const areDepsEqual = isEqual(deps, existingMemo.deps);
      if (this.verbose) {
        console.log('Did the dependencies change?', areDepsEqual, deps, existingMemo.deps);
      }
      if (areDepsEqual) {
        if (this.verbose) {
          console.log('No, they are the same, skipping');
        }
        const returnValue = this.memoStore.current.value;
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
    const value = factory();
    this.memoStore.current = {
      factory,
      deps,
      value,
    };
    this.memoStore.next();
    return value;
  }

  private mockUseContext<T>(context: React.Context<T>): T | null {
    if (!this.contextValues.has(context)) {
      throw Error(`You forgot to set the context for context ${context.displayName} to useContext`);
    }
    const contextValue = this.contextValues.get(context);
    if (this.verbose) {
      console.log('Getting value from context', context.displayName, ':', contextValue);
    }
    return contextValue;
  }

  private render(...args: any[]): any {
    this.stateStore.start();
    this.effectStore.start();
    this.layoutEffectStore.start();
    this.callbackStore.start();
    this.debugStore.start();
    this.refStore.start();
    this.memoStore.start();
    this.reducerStore.start();
    return this.hookFunction(...args);
  }

  private fireEffects() {
    this.render(...this._renderArgs);
    if (this.verbose) {
      console.log('Looking for effects to fire', this.effectStore.store, this.layoutEffectStore.store);
    }
    this.effectStore.store.forEach((effect) => {
      if (!effect.hasRun) {
        if (this.verbose) {
          console.log('Firing effect: ', effect);
        }
        const cleanup = effect.effect();
        if (isFunction(cleanup)) {
          this.cleanupFunctions[this.effectStore.pointer] = cleanup;
          if (this.verbose) {
            console.log('Storing cleanup function for ', this.cleanupFunctions.length);
          }
        }
        effect.hasRun = true;
        this.render(...this._renderArgs);
      }
    });
    this.layoutEffectStore.store.forEach((effect) => {
      if (!effect.hasRun) {
        if (this.verbose) {
          console.log('Firing layout effect: ', effect);
        }
        const cleanup = effect.effect();
        if (isFunction(cleanup)) {
          this.cleanupFunctions[this.effectStore.pointer + 10000] = cleanup;
          if (this.verbose) {
            console.log('Storing cleanup function for ', effect);
          }
        }
        effect.hasRun = true;
        this.render(...this._renderArgs);
      }
    });
  }

  private fireEffectsCleanup() {
    if (this.verbose) {
      console.log('Looking for effects to clean', this.cleanupFunctions);
    }
    this.cleanupFunctions.forEach((cleanupFunction) => {
      if (this.verbose) {
        console.log('Cleaning effect: ', cleanupFunction);
      }
      cleanupFunction();
    });
  }
}

export function init<F extends Function>(hook: F, verbose?: boolean) {
  const mock = new Jooks(hook, verbose);
  beforeEach(() => mock.setup());
  afterEach(() => mock.cleanup());
  return mock;
}

export default init;

class HookStoreBase {
  protected _original: any;
  protected _property: string;

  constructor(property: string) {
    this._property = property;
    this._original = (React as any)[property];
  }

  public setup(mockFunction: Function) {
    (React as any)[this._property] = mockFunction;
  }

  public restore() {
    (React as any)[this._property] = this._original;
  }
}

class HookStore<T> extends HookStoreBase {
  private _pointer: number;
  private _store: T[];
  constructor(property: string) {
    super(property);
    this._pointer = 0;
    this._store = [];
  }

  public reset() {
    this._pointer = 0;
    this._store = [];
  }

  public setup(mockFunction: Function) {
    this.reset();
    super.setup(mockFunction);
  }

  public start() {
    this._pointer = 0;
  }

  public get pointer() {
    return this._pointer;
  }

  public set current(value: T) {
    this._store[this._pointer] = value;
  }

  public get current(): T {
    return this._store[this._pointer];
  }

  public get store(): T[] {
    return this._store;
  }

  public next() {
    this._pointer += 1;
  }
}

function isFunction(value: unknown) {
  return typeof value === 'function';
}
