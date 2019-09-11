import { getMatrixParameter, setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { mutateUrl, navigationParameters$ } from 'in-stores/navigation';
import { eventsPath } from 'in-events/navigation/paths';
import { createTrackingStore } from 'in-stores/store';

export const eventFilter$ = createTrackingStore({
  name: 'eventView/eventFilter',
  observable: navigationParameters$.map(location => getMatrixParameter(location, eventsPath, 'view') || null).distinct()
}).observable;

export function setEventTypeFilter(filter) {
  mutateUrl(location => setOrDeleteMatrixKey(location, eventsPath, 'view', filter));
}
