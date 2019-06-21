import React from 'react';
import 'jest';
export declare class Jooks<R> {
    private hookFunction;
    private verbose;
    private stateStore;
    private effectStore;
    private layoutEffectStore;
    private callbackStore;
    private contextStore;
    private debugStore;
    private refStore;
    private memoStore;
    private reducerStore;
    private cleanupFunctions;
    constructor(hookFunction: () => R, verbose?: boolean);
    /**
     * This should be run before each test.
     * This is automatically called by the init function exposed by the library.
     * You should not have to run it yourself.
     */
    setup(): void;
    /**
     * This should be run after each test.
     * This is automatically called by the init function exposed by the library.
     * You should not have to run it yourself.
     */
    cleanup(): void;
    /**
     * Use this to simulate a component "mounting", which means calling all its useEffect on componentDidMount.
     * Make sure effects are not taking more than 1 event-loop to execute, or more than 1ms, by mocking any API call.
     * If they are taking longer, you can increase the wait time to a given time in millisecond.
     * @param wait wait time in millisecond. Defaults to 1.
     */
    mount(wait?: number): Promise<R>;
    unmount(wait?: number): Promise<void>;
    /**
     * Executes your hook, and returns the result
     */
    run(): R;
    /**
     * Use this to wait for Effects to be executed. Remember to mock all your API calls so that the asyncronous
     * effects are not taking more than 1 event-loop to execute, or more than 1ms.
     * @param wait wait time in millisecond. Defaults to 1.
     */
    wait(wait?: number): Promise<unknown>;
    /**
     * Allows setting some value to a Context before the hook is run. You need to do this if your hook
     * contains any useContext call.
     * @param context React Context to set value to
     * @param value Value you want to give the Context
     */
    setContext<T>(context: React.Context<T>, value: T): void;
    /**
     * Reset all Context values. Don't forget to call setContext again after that.
     */
    resetContext(): void;
    private mockUseDebugValue;
    private mockUseReducer;
    private mockUseCallback;
    private mockUseState;
    private mockUseEffect;
    private mockUseLayoutEffect;
    private mockUseRef;
    private mockUseMemo;
    private mockUseContext;
    private render;
    private fireEffects;
    private fireEffectsCleanup;
}
export declare function init<T>(hook: () => T, verbose?: boolean): Jooks<T>;
export default init;
