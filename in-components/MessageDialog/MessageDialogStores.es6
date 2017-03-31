import createMessageObservable from 'in-services/subscription/message';
import { createStore } from 'in-stores/store';

/*
*/
const messageStore = createStore({
  name: 'messageStore',
  initialValue: null
});

export const message$ = messageStore.observable;

export function clearMessage() {
  messageStore.applyStateMutation(() => null);
}

export function init() {
  createMessageObservable().subscribe(msg => messageStore.applyStateMutation(() => msg));
}
