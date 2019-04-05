// This tests and fixes an infinite loop bug
import 'jest';
import { useState, useEffect } from 'react';
import init from '../Jooks';

const useInfiniteLoop = (input: string) => {
  const [toggle, setToggle] = useState('');

  useEffect(() => {
    someAsyncFn();
  }, [input]);

  const someAsyncFn = async () => {
    setToggle('ok');
  };
  return toggle;
};

describe('Infinite loop bug', () => {
  const jooks = init(() => useInfiniteLoop('foo'));

  it('Should not cause an infinite loop', async () => {
    await jooks.mount();
    const result = jooks.run();
    expect(result).toBe('ok');
  });
});
