import { createTrackingStore } from 'in-stores/store';
import { query$ } from 'in-stores/search/query';

export const filtered$ = createTrackingStore({
  name: 'search/filtered',
  observable: query$.map(rawQuery => !!rawQuery).distinct()
}).observable;
