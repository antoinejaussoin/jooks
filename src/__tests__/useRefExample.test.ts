import 'jest';
import init from '../Jooks'; // In your code, do: import init from 'jooks';
import useRefExample from '../useRefExample';

describe('Testing useRef hook', () => {
  const jooks = init(() => useRefExample());
  it('It should give the correct initial values', () => {
    const result = jooks.run();
    expect(result).not.toBeNull();
    expect(result.alpha.foo).toBe('bar');
    expect(result.beta.ping).toBe('pong');
  });

  it('It should continue giving the same object instance over and over again', () => {
    const result = jooks.run();
    expect(result).not.toBeNull();
    expect(result.alpha.foo).toBe('bar');
    result.alpha.foo = 'baz';
    const result2 = jooks.run();
    expect(result2.alpha.foo).toBe('baz');
    expect(result2.beta.ping).toBe('pong');
    expect(result2.alpha).toBe(result.alpha);
    expect(result2.beta).toBe(result.beta);
  });
});
