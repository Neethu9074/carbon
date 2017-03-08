import {expanded$} from 'in-stores/search/searchBarExpanded';
import {createTrackingStore} from 'in-stores/store';

export const headerHeight$ = createTrackingStore({
  name: 'header/height',
  observable: expanded$.map(expanded => expanded ? 76 : 40)
}).observable;
