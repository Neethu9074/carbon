import {combineLatest} from 'reactive-observables';

import {isMapView$, isTraceView$} from 'in-stores/navigation/view';
import {createTrackingStore} from 'in-stores/store';

const mapViewSearchContexts = ['entity'];
const traceViewSearchContexts = ['trace'];
export default createTrackingStore({
  name: 'in-stores/search/searchContexts',
  observable: combineLatest([isMapView$, isTraceView$])
    .map(([isMapView, isTraceView]) => {
      if (isMapView) {
        return mapViewSearchContexts;
      } else if (isTraceView) {
        return traceViewSearchContexts;
      }
      return [];
    })
    .distinct()
}).observable;
