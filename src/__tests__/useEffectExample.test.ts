import 'jest';
import useEffectSimple from '../useEffectExample';
import useEffectWithDependency from '../useEffectWithDependencyExample';
import init from '../Jooks'; // In your code, do: import init from 'jooks';

describe('Testing useEffect hook', () => {
  const jooks = init(() => useEffectSimple());
  it('It should give the correct initial values', () => {
    expect(jooks.run()).toBe('');
  });

  it('It should be calling the fake endpoint and update the value', async () => {
    await jooks.mount();
    expect(jooks.run()).toBe('x');
  });

  it('It should be calling the fake endpoint and update the value but only once', async () => {
    await jooks.mount();
    expect(jooks.run()).toBe('x');
    await jooks.wait();
    expect(jooks.run()).toBe('x');
  });
});

describe('Testing useEffect hook with dependency', () => {
  const jooks = init(() => useEffectWithDependency());
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
