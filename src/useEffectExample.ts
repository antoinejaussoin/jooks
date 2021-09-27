import { useEffect, useState } from 'react';

export default function useEffectExample() {
  const [result, setResult] = useState('');
  useEffect(() => {
    const fetchResult = async () => {
      await setTimeout(() => {
        setResult(result + 'x');
      });
    };
    fetchResult();
  }, []);

  return result;
}
