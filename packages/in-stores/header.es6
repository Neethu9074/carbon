import { createStore } from 'in-stores/store';

const header = createStore({
  name: 'Sticky/stores/header',
  initialValue: []
});

export const header$ = header.observable;

export function push(config) {
  header.applyStateMutation(currentHeader => currentHeader.concat([config]));
}

export function pop() {
  header.applyStateMutation(currentHeader => currentHeader.splice(0, currentHeader.length - 1));
}
