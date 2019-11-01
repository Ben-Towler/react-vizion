type SearchState = any;
type ResultsState = any;
type Listener = () => void;
type State = {
  widgets: SearchState;
  metadata: any[];
  results: ResultsState | null;
  error: Error | null;
  searching: boolean;
  isSearchStalled: boolean;
};
export default function createStore(initialState: State) {
  let state = initialState;
  const listeners: Listener[] = [];
  return {
    getState() {
      return state;
    },
    setState(nextState: State) {
      state = nextState;
      listeners.forEach(listener => listener());
    },
    subscribe(listener: Listener) {
      listeners.push(listener);
      return function unsubscribe() {
        listeners.splice(listeners.indexOf(listener), 1);
      };
    },
  };
}

export type Store = ReturnType<typeof createStore>;
