import {createTrackingStore} from 'in-stores/store';
import {rawQuery$} from 'in-stores/search/search';

export const filtered$ = createTrackingStore({
  name: 'search/filtered',
  observable: rawQuery$
    .map(rawQuery => !!rawQuery)
    .distinct()
}).observable;
