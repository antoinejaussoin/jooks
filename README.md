# Jooks (Jest ❤ + Hooks 🤘🏻)

> If you're going through hell testing React Hooks, keep going.
> (_Churchill_)

[![Version](https://img.shields.io/npm/v/jooks.svg)]()
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-green.svg)](https://github.com/antoinejaussoin/jooks/pulls)

## What are Custom React Hooks

[React Hooks](https://reactjs.org/docs/hooks-faq.html) are a new API added to React from version 16.8.

They are great, and make proper separation of concern and re-using logic across components very easy and enjoyable.

**One problem**: they are f\*ing hard to test.

Let's start with a definition first: Custom React Hooks (CRH) are functions, starting with `use` (by convention), that are themselves using React's Hooks (`useState`, `useEffect` and so on). They are standalone, and not part of a component.

## Why this library?

Custom React Hooks are very hard to test. There are a [few](https://medium.com/@dawchihliou/testing-react-hooks-6d3ae95cd838) [articles](https://blog.logrocket.com/a-quick-guide-to-testing-react-hooks-fa584c415407) [dedicated](https://medium.com/@rossirsa/testing-react-hooks-%EF%B8%8F-f0466fd41cbf) to this, but they all come down to the same solution: **instantiating a fake component** that is using the hook, and testing that the hook is working through that component.

The premise of this testing library is that this is **slow**, **hard to setup**, and fails when you use `useEffect` in an asynchronous manner.

## The solution

So the solution to that, that this library brings, is to **completely mock the React Hooks API**, and replace it by fake implementations (that you control).

That way you can **test your hooks in isolation**, and you don't need the overhead of instantiating React Components and a DOM just to test a small function.

## Prerequisites

This library works with Jest.

## Current capabilities

Currently, the library supports most of React's basic hooks:

- [useState](https://github.com/antoinejaussoin/jooks/blob/master/src/__tests__/useStateExample.test.ts)
- [useEffect](https://github.com/antoinejaussoin/jooks/blob/master/src/__tests__/useEffectExample.test.ts)
- [useContext](https://github.com/antoinejaussoin/jooks/blob/master/src/__tests__/useContextExample.test.ts)
- [useReducer](https://github.com/antoinejaussoin/jooks/blob/master/src/__tests__/useReducerExample.test.ts)
- useCallback
- [useMemo](https://github.com/antoinejaussoin/jooks/blob/master/src/__tests__/useMemoExample.test.ts)
- [useRef](https://github.com/antoinejaussoin/jooks/blob/master/src/__tests__/useRefExample.test.ts)
- ~~useImperativeHandle~~ (Coming Soon!)
- [useLayoutEffect](https://github.com/antoinejaussoin/jooks/blob/master/src/__tests__/useLayoutEffectWithDependencyExample.test.ts)
- useDebugValue

## Installation

`yarn add jooks`

## Examples

### Simple example with useState only

Let's take this very simple hook:

```javascript
const useStateOnlyExample = () => {
  const [first, setFirst] = useState('alpha');
  const [second, setSecond] = useState('beta');
  const [third, setThird] = useState(() => 'charlie'); // Notice the delayed execution
  const update = () => {
    setFirst(first + 'a');
    setSecond(second + 'b');
    setThird(third + 'c');
  };
  return { first, second, third, update };
};
```

To test this (mostly useless) CRH, here is what you need to do:

```javascript
import 'jest';
import init from 'jooks';
import useStateOnlyExample from '../useStateExample';

describe('Testing useState hook', () => {
  // Initialising the Jooks wrapper
  const jooks = init(() => useStateOnlyExample());

  it('It should give the correct initial values', () => {
    // Run your Hook function
    const { first, second } = jooks.run();

    // And then test the result
    expect(first).toBe('alpha');
    expect(second).toBe('beta');
  });

  it('It should update the values properly', () => {
    // Run your Hook function
    let { first, second, third, update } = jooks.run();
    expect(first).toBe('alpha');
    expect(second).toBe('beta');
    expect(third).toBe('charlie');

    // Call the callback
    update();

    // Run the Hook again to get the new values
    ({ first, second, third } = jooks.run());
    expect(first).toBe('alphaa');
    expect(second).toBe('betab');
    expect(third).toBe('charliec');
  });
});
```

As you can see, testing the hook was mostly painless.

### A more complicated example involving useEffect

This hook is a more real-world example. It fetches data (once), stores it into the state, and returns that data.

It also provides a callback to fetch another set of data.

The example is using TypeScript, but this would of course work with vanilla JavaScript.

```javascript
import { useEffect, useState } from "react";

interface Activity {
  activity: string;
  accessibility: number;
  type: string;
  participants: number;
  price: number;
  key: string;
}

export default () => {
  const [activity, setActivity] = useState<Activity | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const result = await fetch("https://www.boredapi.com/api/activity");
      if (result.ok) {
        const content = (await result.json()) as Activity;
        setActivity(content);
      }
    };
    fetchData();
  }, []);

  return { activity, next: fetchData };
};
```

The problem with that example, is that it would be impossible to test with other techniques, because of the asynchronous content of the `useEffect` function.
It acts in a "fire and forget" way, [which means that wrapping the call in `act()`](https://reactjs.org/blog/2019/02/06/react-v16.8.0.html#testing-hooks) is not going to work: `act()` is synchronous, and the asynchronous function inside will resolve outside of it at a later point, resulting in an error in the console.

So how do I test that with Jooks?

```javascript
import 'jest';
import init from 'jooks';
import useLoadActivity from '../useLoadActivity';
// This library helps you with testing fetch, but you can use other methods to achieve the same thing
import { GlobalWithFetchMock } from 'jest-fetch-mock';

// This is a TypeScript specific way of mocking the fetch function.
// See the jest-fetch-mock documentation for more information.
const customGlobal: GlobalWithFetchMock = global as GlobalWithFetchMock;
customGlobal.fetch = require('jest-fetch-mock');
customGlobal.fetchMock = customGlobal.fetch;

describe('Testing a custom hook', () => {
  const jooks = init(() => useLoadActivity());
  beforeEach(() => {
    customGlobal.fetch.mockResponses(
      // On the first call, the endpoint will return Foo
      [JSON.stringify({ activity: 'Foo' }), { status: 200 }],
      // And Bar on the second call
      [JSON.stringify({ activity: 'Bar' }), { status: 200 }]
    );
  });
  afterEach(() => {
    customGlobal.fetch.mockClear();
  });

  it('Should load activities properly', async () => {
    // By default, before it has a change to load anything, the hook
    // will return a null
    expect(jooks.run().activity).toBeNull();
    // Then we wait for the component to "mount", essentially giving
    // it time to resolve the effect and load the data
    await jooks.mount();
    expect(jooks.run().activity).not.toBeNull();
    expect(jooks.run().activity!.activity).toBe('Foo');
    // Then we call the next() callback
    await jooks.run().next();
    expect(jooks.run().activity).not.toBeNull();
    expect(jooks.run().activity!.activity).toBe('Bar');
  });
});

```

### How to work with useContext

When working with `useContext`, you need to set that context first, in your test.

Since Hooks rely on the order they are called, you can safely call `setContext` on your jooks wrapper, once per `useContext` call, in the same order.

Let's see an example:

```javascript
import { useContext } from 'react';
import { Context1, Context2 } from './ExampleContext';

const useContextExample = () => {
  const { foo } = useContext(Context1);
  const { ping } = useContext(Context2);
  return foo + ':' + ping;
};

export default useContextExample;
```

And the test:

```javascript
import 'jest';
import useContextExample from '../useContextExample';
import { Context1, Context2 } from '../ExampleContext';
import init from 'jooks';

describe('Testing useContext hook', () => {
  const jooks = init(() => useContextExample());

  beforeEach(() => {
    // First you need to set all contexts, in the same order they are called, for every test.
    jooks.setContext(Context1, { foo: 'baz' });
    jooks.setContext(Context2, { ping: 'pung' });
  });

  it('It should give the correct values', () => {
    // Then you can run your hook normally and expect that `useContext`
    // will return the value you set in the beforeEach
    const foo = jooks.run();
    expect(foo).toBe('baz:pung');
  });

  it('It should give the correct values when set within the test', () => {
    // If you want to change that context for a specific test, you can always reset the context values
    // and set new ones.
    jooks.resetContext();
    jooks.setContext(Context1, { foo: 'buz' });
    jooks.setContext(Context2, { ping: 'pang' });
    const foo = jooks.run();
    expect(foo).toBe('buz:pang');
  });
});
```

### Custom hooks with arguments

Hooks often rely on passed-in arguments to compute a value, for example:

```javascript
import { useContext } from 'react';
import { Context1 } from './ExampleContext';

const useContextWithArgsExample = bar => {
  const { foo } = useContext(Context1);
  return foo + ':' + bar;
};

export default useContextWithArgsExample;
```

To test these, we can simply pass in the argument when we call `.run()`:

```javascript
import 'jest';
import useContextWithArgsExample from '../useContextWithArgsExample';
import { Context1 } from '../ExampleContext';
import init from 'jooks';

describe('Testing useContextWithArgsExample hook', () => {
  const jooks = init(useContextWithArgsExample);

  beforeEach(() => {
    jooks.setContext(Context1, { foo: 'baz' });
  });

  it('It should give the correct values', () => {
    // Here it should compute the hook's return value based on what you passed in
    const foo = jooks.run('bar');
    expect(foo).toBe('baz:bar');
  });
});
```

## API

The library exposes 3 things:

- The default export is an initialisation function, as shown in the examples above, hidding the complexity away. This is Jest-specific.
- `Jooks` class: this is the class that contains the logic and wraps your hook. It is independent from any testing framework so it could be used with other testing frameworks.

### `function init<T>(hook: (...args: any[]) => T, verbose?: boolean)` (default export)

This function is meant to be called within your test's `describe` function.
It takes one compulsory argument, and one optional flag:

- `hook`: This is a function that calls your hook, or the hook function itself
- `verbose` (optional): Whether to enable the verbose mode, logging information to the console, for debugging purpose.

```javascript
const jooks = init(() => useContextExample(someVariable));
// or
const jooks = init(useContextExample);
```

or, to enable the verbose mode;

```javascript
const jooks = init(() => useContextExample(), true);
// or
const jooks = init(useContextExample, true);
```

#### Two ways to initialise Jooks

As see above, you have two ways of initialising a hook :

In the first one, you instantiate your hook on initialisation, with function arguments that are not going to change for the rest of the test:

```javascript
const jooks = init(() => useContextExample(someVariable));
jooks.run();
```

Alternatively, you can specify the Hook function directly, and provide its argument on each `run()` call, like so:

```javascript
const jooks = init(useContextExample);
jooks.run(someVariable);
```

### Jooks

This is the object you get on the third parameter of the describe function.

It exposes 3 methods that you should care about:

- `async mount(wait: number = 1): Promise<R>`: ensure your hook ran all its effect "on mount"
- `run(...hooksParams?)`: this runs your hook function and returns the result. This is usually what you are testing.
- `async wait(wait: number = 1)`: if you are expecting an asynchronous effect to fire, call this to wait until it's resolved

An additional 2 methods are dedicated to Context:

- `setContext<T>(context: React.Context<T>, value: T)`: Allows you to set the context before it's used with `useContext`.
- `resetContext()`: Resets all previously set contexts

There are 2 other public method that you shouldn't use if you are using the init function as described above.

- `setup`: this is to be run before every test. This is done automatically if you are using the init function.
- `cleanup`: this is to be run after every test. This is done automatically if you are using the init function.

#### async mount(wait: number = 1): Promise<void>

Use this function at the beginning of a test to wait for `useEffect` to fire.

A classic way of using this is: testing that the default values are fine, then wait for the API call that will populates with real data from the backend.

If for some reason the effect doesn't resolve quickly enough, you can increase the timeout time using the optional parameter: `await mount(5);`.

```javascript
it("Should load activities properly", async () => {
  // By default, before it has a change to load anything, the hook
  // will return a null
  expect(jooks.run().activity).toBeNull();
  // Then we wait for the component to "mount", essentially giving it time to resolve the
  // effect and load the data
  await jooks.mount();
  expect(jooks.run().activity).not.toBeNull();
  expect(jooks.run().activity!.activity).toBe("Foo");
});
```

#### run(...hooksParams?)

This function runs your hook function. Use this to test the hook output.

#### async wait(wait: number = 1)

If you know that a change you make (say calling one of the hook callbacks) is going to result in an async callback or useEffect to be called, use this to wait until the effect has resolved. You can extend the wait time, but the default (1) should be enough if you properly mock your API calls. It will fire all effects and then wait.

#### setContext<T>(context: React.Context<T>, value: T)

This is only necessary when your Hook uses `useContext`. You need to call this as many times you have a `useContext` call, and in the same order. First, provide your context object, and then it's value.

## Future

- Making Jooks compatible with other testing frameworks
- Allowing a better control on the Hook's internal state

## FAQ

- Why Jooks? it's a mix of Jest and Hooks.
- Can I use this? Since it's a testing library (and not a piece of code that's going to production), yes go ahead. The API is likely to change a bit before being stable though, so you might want to pin down your version.
- There must be a Medium article about that? [Yes, there is.](https://medium.com/@jantoine/another-take-on-testing-custom-react-hooks-4461458935d4)

## Thanks

- Thanks to [@bronter](https://github.com/bronter) for suggesting and implementing the ability to specify a hook function parameters on `run()` instead of just during initialisation.
- Thanks to [@jjd314](https://github.com/jjd314) for [implementing a fix](https://github.com/antoinejaussoin/jooks/pull/6) around saving run() arguments
- Thanks to [@hjvvoorthuijsen](https://github.com/hjvvoorthuijsen) for improving the `setState` mock and [allowing the use of a callback function](https://github.com/antoinejaussoin/jooks/pull/9).

## Can I contribute?

Yes please! MR welcome.
