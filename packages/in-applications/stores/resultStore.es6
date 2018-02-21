import { createStore } from 'in-stores/store';

const resultStore = createStore({
  name: 'app2.0/resultStore',
  initialValue: null
});

export function setResult(result) {
  resultStore.mutateTo(result);
}
