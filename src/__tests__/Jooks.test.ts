import 'jest';
import init from '../Jooks';

describe('Testing Jooks wrapper', () => {
  const jooks = init(args => args);

  it('It should pass arguments to hooks', () => {
    expect(jooks.run('foo')).toEqual('foo');
  });
});
