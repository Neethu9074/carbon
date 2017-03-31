import { generateUniqueShortId } from 'in-services/util/id';
import { createStore } from 'in-stores/store';

const store = createStore({
  name: 'configurationView/subview/GenericServiceExtractionConfiguration/stores/notification',
  initialValue: null
});

export const notification$ = store.observable;

export function showNofitication({ children, duration }) {
  store.mutateTo({
    id: generateUniqueShortId(),
    children,
    duration
  });
}

export function clearNotification() {
  store.mutateTo(null);
}
