import 'jest';
import init from '../Jooks'; // In your code, do: import init from 'jooks';
import useReducerExample from '../useReducerExample';

describe('Testing useState hook', () => {
  // Initialising the Jooks wrapper
  const jooks = init(() => useReducerExample());

  it('It should give the correct initial values', () => {
    // Run your Hook function
    const { user } = jooks.run();

    // And then test the result
    expect(user.name).toBe('Bob Dylan');
    expect(user.age).toBe(21);
  });

  it('It should update the state on dispatch', () => {
    // Run your Hook function
    let { user, rename, increaseAge } = jooks.run();

    // Rename
    rename('Bobby');
    ({ user, rename, increaseAge } = jooks.run());
    expect(user.name).toBe('Bobby');
    expect(user.age).toBe(21);

    // Increase age
    increaseAge();
    ({ user, rename, increaseAge } = jooks.run());
    expect(user.name).toBe('Bobby');
    expect(user.age).toBe(22);
  });
});
