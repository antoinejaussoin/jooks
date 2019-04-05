import { useRef } from 'react';

const useRefExample = () => {
  const container1 = useRef({ foo: 'bar' });
  const container2 = useRef({ ping: 'pong' });
  return {
    alpha: container1.current,
    beta: container2.current,
  };
};

export default useRefExample;
