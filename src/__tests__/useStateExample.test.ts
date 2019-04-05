import 'jest';
import init from '../Jooks'; // In your code, do: import init from 'jooks';
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
