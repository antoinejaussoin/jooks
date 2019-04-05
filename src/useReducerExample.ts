import { useReducer } from 'react';

interface State {
  name: string;
  age: number;
}

interface Action {
  type: string;
  payload?: any;
}

const initialState: State = {
  name: 'Bob',
  age: 21,
};

function reducer(state: State, action: Action) {
  switch (action.type) {
    case 'rename':
      return {
        ...state,
        name: action.payload,
      };
    case 'age':
      return {
        ...state,
        age: state.age + 1,
      };
    default:
      return state;
  }
}

// This is an initialisation function, modifying the initial state
const init = (state: State) => ({
  ...state,
  name: state.name + ' Dylan',
});

const useReducerExample = () => {
  const [state, dispatch] = useReducer(reducer, initialState, init);
  const rename = (name: string) =>
    dispatch({
      type: 'rename',
      payload: name,
    });
  const increaseAge = () =>
    dispatch({
      type: 'age',
    });
  return { user: state, rename, increaseAge };
};

export default useReducerExample;
