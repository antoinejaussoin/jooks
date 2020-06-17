import { useState } from 'react';

export default () => {
  const [first, setFirst] = useState('alpha');
  const [second, setSecond] = useState('beta');
  const [third, setThird] = useState(() => 'charlie');
  const [fourth, setFourth] = useState([1, 2]);
  const update = () => {
    setFirst(first + 'a');
    setSecond(second + 'b');
    setThird(third + 'c');
    setFourth((previousState) => [...previousState, 3]);
  };
  return { first, second, third, fourth, update };
};
