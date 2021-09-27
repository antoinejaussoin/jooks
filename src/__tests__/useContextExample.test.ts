import 'jest';
import useContextExample from '../useContextExample';
import useContextExampleDeux from '../useContextExampleDeux';
import { Context1, Context2, Context3 } from '../ExampleContext';
import init from '../Jooks'; // In your code, do: import init from 'jooks';

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

describe('Testing useContext hook with two contexts sharing the same properties', () => {
  const jooks = init(() => useContextExampleDeux());

  beforeEach(() => {
    // First you need to set all contexts, in the same order they are called, for every test.
    jooks.setContext(Context2, { ping: 'pong' });
    jooks.setContext(Context3, { ping: 'boom' });
  });

  it('It should give the correct values', () => {
    // Then you can run your hook normally and expect that `useContext`
    // will return the value you set in the beforeEach
    const foo = jooks.run();
    expect(foo).toBe('pong:boom');
  });

  it('It should give the correct values when set within the test', () => {
    // If you want to change that context for a specific test, you can always reset the context values
    // and set new ones.
    jooks.resetContext();
    jooks.setContext(Context2, { ping: 'buz' });
    jooks.setContext(Context3, { ping: 'pang' });
    const foo = jooks.run();
    expect(foo).toBe('buz:pang');
  });
});
