import './App.css';
import useLoadActivity from './useLoadActivity';

// This is an example of a hook that works in real-life
export default function App() {
  const { activity, next } = useLoadActivity();
  if (activity) {
    return (
      <div className="app">
        <div className="card">
          <h1>{activity.activity}</h1>
          <p>
            You'll need {activity.participants} person
            {activity.participants > 1 ? 's' : ''} to do that with you
          </p>
          <button onClick={next}>Next!!</button>
        </div>
      </div>
    );
  }
  return <div>Loading...</div>;
}
