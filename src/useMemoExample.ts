import { useMemo } from 'react';

interface Flags {
  alpha: number;
  beta: number;
}

export default function useMemoExample(spy: () => number, flags: Flags) {
  const memo = useMemo(() => {
    spy();
    return flags.alpha + flags.beta;
  }, [flags.alpha, flags.beta]);
  return memo;
}
