import { useEffect, useState, useDebugValue } from 'react';

interface Activity {
  activity: string;
  accessibility: number;
  type: string;
  participants: number;
  price: number;
  key: string;
}

export default function useLoadActivity() {
  const [activity, setActivity] = useState<Activity | null>(null);

  const fetchData = async () => {
    const result = await fetch('https://www.boredapi.com/api/activity');
    if (result.ok) {
      const content = (await result.json()) as Activity;
      setActivity(content);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useDebugValue(activity, (activity) => (activity ? activity.activity : 'not loaded'));

  return { activity, next: fetchData };
}
