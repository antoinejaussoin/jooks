import 'jest';
import useLayoutEffectWithDependency from '../useLayoutEffectWithDependencyExample';
import init from '../Jooks'; // In your code, do: import init from 'jooks';

describe('Testing useLayoutEffect hook with dependency', () => {
  const jooks = init(() => useLayoutEffectWithDependency());
  it('It should give the correct initial values', () => {
    expect(jooks.run().result).toBe('');
  });

  it('It should be calling the fake endpoint and update the value', async () => {
    await jooks.mount();
    expect(jooks.run().result).toBe('x');
  });

  it('It should be calling the fake endpoint and update the value but only once if the dependency doesnt change', async () => {
    await jooks.mount();
    expect(jooks.run().result).toBe('x');
    await jooks.wait();
    expect(jooks.run().result).toBe('x');
  });

  it('It should be calling the fake endpoint again and update the value twice if the dependency changes', async () => {
    expect(jooks.run().result).toBe('');
    await jooks.mount();
    expect(jooks.run().result).toBe('x');
    jooks.run().setSomeOtherDependency(1);
    await jooks.wait();
    expect(jooks.run().result).toBe('xx');
  });
});
