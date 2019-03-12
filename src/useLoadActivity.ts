import React, { useEffect, useState } from 'react';

interface Activity {
  activity: string;
  accessibility: number;
  type: string;
  participants: number;
  price: number;
  key: string;
}

export default () => {
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

  return { activity, next: fetchData };
};
