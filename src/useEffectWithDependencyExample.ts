import { useEffect, useState } from 'react';

export default function useEffectWithDependencyExample() {
  const [result, setResult] = useState('');
  const [someOtherDependency, setSomeOtherDependency] = useState(0);
  useEffect(() => {
    const fetchResult = async () => {
      await setTimeout(() => {
        setResult(result + 'x');
      });
    };
    fetchResult();
  }, [someOtherDependency]);

  return { result, setSomeOtherDependency };
}
