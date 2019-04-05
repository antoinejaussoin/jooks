import { useState } from 'react';

export default () => {
  const [first, setFirst] = useState('alpha');
  const [second, setSecond] = useState('beta');
  const [third, setThird] = useState(() => 'charlie');
  const update = () => {
    setFirst(first + 'a');
    setSecond(second + 'b');
    setThird(third + 'c');
  };
  return { first, second, third, update };
};
