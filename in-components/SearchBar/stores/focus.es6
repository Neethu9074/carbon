import { createStore } from 'in-stores/store';

const focusStore = createStore({
  name: 'in-components/SearchBar/stores/focus',
  initialValue: false
});

export const isFocused$ = focusStore.observable.distinct().nextFrame();

export function setFocused(focused) {
  focusStore.applyStateMutation(() => focused);
}
