import { useContext } from 'react';
import { Context2, Context3 } from './ExampleContext';

export default function useContextExampleDeux() {
  const { ping: ping2 } = useContext(Context3);
  const { ping: ping1 } = useContext(Context2);

  return ping1 + ':' + ping2;
}
