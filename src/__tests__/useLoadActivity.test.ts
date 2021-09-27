import { GlobalWithFetchMock } from 'jest-fetch-mock';
import 'jest';
import init from '../Jooks'; // In your code, do: import init from 'jooks';
import useLoadActivity from '../useLoadActivity';
// This library helps you with testing fetch, but you can use other methods to achieve the same thing

// This is a TypeScript specific way of mocking the fetch function.
// See the jest-fetch-mock documentation for more information.
const customGlobal: GlobalWithFetchMock = global as unknown as GlobalWithFetchMock;

describe('Testing a custom hook', () => {
  const jooks = init(() => useLoadActivity());
  beforeEach(() => {
    customGlobal.fetch.mockResponses(
      // On the first call, the endpoint will return Foo
      [JSON.stringify({ activity: 'Foo' }), { status: 200 }],
      // And Bar on the second call
      [JSON.stringify({ activity: 'Bar' }), { status: 200 }],
    );
  });
  afterEach(() => {
    customGlobal.fetch.mockClear();
  });

  it('Should load activities properly', async () => {
    // By default, before it has a change to load anything, the hook
    // will return a null
    let result = jooks.run();
    expect(result.activity).toBeNull();
    // Then we wait for the component to "mount", essentially giving
    // it time to resolve the effect and load the data
    await jooks.mount();
    result = jooks.run(); // We run the hook again to update the result
    expect(result.activity).not.toBeNull();
    expect(result.activity!.activity).toBe('Foo');
    // Then we call the next() callback
    await result.next();
    result = jooks.run(); // We run the hook again to update the result
    expect(result.activity).not.toBeNull();
    expect(result.activity!.activity).toBe('Bar');
  });
});
