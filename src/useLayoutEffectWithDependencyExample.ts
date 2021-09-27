import { useLayoutEffect, useState } from 'react';

export default function useLayoutEffectWithDependencyExample() {
  const [result, setResult] = useState('');
  const [someOtherDependency, setSomeOtherDependency] = useState(0);
  useLayoutEffect(() => {
    setTimeout(() => {
      setResult((prev) => prev + 'x');
    });
  }, [someOtherDependency]);

  return { result, setSomeOtherDependency };
}
