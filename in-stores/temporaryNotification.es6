import { formatDateTime } from 'in-services/formatters/date';
import { focusedMoment$ } from 'in-stores/timeline';
import { createStore } from 'in-stores/store';

const temporaryNotificationStore = createStore({
  name: 'temporaryNotification',
  initialValue: null
});
export const temporaryNotification$ = temporaryNotificationStore.observable.distinct();

export function setTemporaryNotification(notification) {
  temporaryNotificationStore.applyStateMutation(() => notification);
}

export function clearTemporaryNotification() {
  temporaryNotificationStore.applyStateMutation(() => null);
}

// automatically clear temporary notifications after 6 seconds
temporaryNotification$.debounce(3000, { leading: false }).subscribe(notification => {
  if (!notification) {
    return;
  }
  clearTemporaryNotification();
});

// automatically show a message when the focused moment is changed
focusedMoment$.skipFirst().subscribe(focusedMoment => {
  if (!focusedMoment) {
    setTemporaryNotification('Map is now live!');
  } else {
    setTemporaryNotification(`Map is showing the state as of ${formatDateTime(focusedMoment)}.`);
  }
});
