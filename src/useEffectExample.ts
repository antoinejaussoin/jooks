import { useEffect, useState } from 'react';

export default function useEffectExample() {
  const [result, setResult] = useState('');
  useEffect(() => {
    setTimeout(() => {
      setResult((prev) => prev + 'x');
    });
  }, []);

  return result;
}
