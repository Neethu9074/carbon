import {combineLatest} from 'reactive-observables';

import {isMapView$, isTraceView$, isEventView$} from 'in-stores/navigation/view';
import {createTrackingStore} from 'in-stores/store';

const mapViewSearchContexts = ['entity'];
const traceViewSearchContexts = ['trace'];
const incidentViewSearchContexts = ['event'];
export default createTrackingStore({
  name: 'in-stores/search/searchContexts',
  observable: combineLatest([isMapView$, isTraceView$, isEventView$])
    .map(([isMapView, isTraceView, isEventView]) => {
      if (isMapView) {
        return mapViewSearchContexts;
      } else if (isTraceView) {
        return traceViewSearchContexts;
      } else if (isEventView) {
        return incidentViewSearchContexts;
      }
      return [];
    })
    .distinct()
}).observable;
