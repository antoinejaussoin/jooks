import { useContext } from 'react';
import { Context1, Context2 } from './ExampleContext';

export default function useContextExample() {
  const { foo } = useContext(Context1);
  const { ping } = useContext(Context2);
  return foo + ':' + ping;
}
