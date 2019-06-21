import { useEffect } from 'react';

interface Subscription {
  connect: () => void;
  disconnect: () => void;
}

export default (subscription: Subscription) => {
  useEffect(() => {
    subscription.connect();
    return () => {
      subscription.disconnect();
    };
  }, [subscription]);

  return 'foo';
};
