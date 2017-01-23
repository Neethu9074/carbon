import {createTrackingStore} from 'in-stores/store';
import {rawQuery$} from 'in-stores/search/rawQuery';

export const filtered$ = createTrackingStore({
  name: 'search/filtered',
  observable: rawQuery$
    .map(rawQuery => !!rawQuery)
    .distinct()
}).observable;
