import { useLayoutEffect, useState } from 'react';

export default () => {
  const [result, setResult] = useState('');
  const [someOtherDependency, setSomeOtherDependency] = useState(0);
  useLayoutEffect(() => {
    const fetchResult = async () => {
      await setTimeout(() => {
        setResult(result + 'x');
      });
    };
    fetchResult();
  }, [someOtherDependency]);

  return { result, setSomeOtherDependency };
};
