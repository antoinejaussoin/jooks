import { useRef } from 'react';

export default function useRefExample() {
  const container1 = useRef({ foo: 'bar' });
  const container2 = useRef({ ping: 'pong' });
  return {
    alpha: container1.current,
    beta: container2.current,
  };
}
