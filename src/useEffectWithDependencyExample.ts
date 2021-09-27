import { useEffect, useState } from 'react';

export default function useEffectWithDependencyExample() {
  const [result, setResult] = useState('');
  const [someOtherDependency, setSomeOtherDependency] = useState(0);

  useEffect(() => {
    setTimeout(() => {
      setResult((prev) => prev + 'x');
    });
  }, [someOtherDependency]);

  return { result, setSomeOtherDependency };
}
