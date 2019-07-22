import 'jest';
import init from '../Jooks'; // In your code, do: import init from 'jooks';
import useMemoExample from '../useMemoExample';

const spy = jest.fn();
const flags = {
  alpha: 2,
  beta: 3,
};

describe('Testing useState hook', () => {
  const jooks = init(useMemoExample);
  beforeEach(() => {
    spy.mockReset();
  });

  it('It should give the correct initial values', () => {
    const value = jooks.run(spy, flags);
    expect(value).toBe(5);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('It should compute the value only once if nothing else changes', () => {
    const value = jooks.run(spy, flags);
    expect(value).toBe(5);
    const value2 = jooks.run(spy, flags); // Effectively re-running the hook
    expect(value2).toBe(5);
    // It should have called the memoized function only once, not twice
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('It should compute the value again if a dependency changes', () => {
    const value = jooks.run(spy, flags);
    expect(value).toBe(5);
    const value2 = jooks.run(spy, flags); // Effectively re-running the hook
    expect(value2).toBe(5);
    // It should have called the memoized function only once, not twice at this point
    expect(spy).toHaveBeenCalledTimes(1);
    flags.alpha = 3; // Changing the dependency value
    const value3 = jooks.run(spy, flags); // Effectively re-running the hook
    expect(value3).toBe(6);
    // Since the dependency changed, it should have called the memoized function again
    expect(spy).toHaveBeenCalledTimes(2);
  });
});
