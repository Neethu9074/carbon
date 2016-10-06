import {combineLatest} from 'reactive-observables';

import {isMapView$, isTraceView$, isIncidentView$} from 'in-stores/navigation/view';
import {createTrackingStore} from 'in-stores/store';

const mapViewSearchContexts = ['entity'];
const traceViewSearchContexts = ['trace'];
const incidentViewSearchContexts = ['event'];
export default createTrackingStore({
  name: 'in-stores/search/searchContexts',
  observable: combineLatest([isMapView$, isTraceView$, isIncidentView$])
    .map(([isMapView, isTraceView, isIncidentView]) => {
      if (isMapView) {
        return mapViewSearchContexts;
      } else if (isTraceView) {
        return traceViewSearchContexts;
      } else if (isIncidentView) {
        return incidentViewSearchContexts;
      }
      return [];
    })
    .distinct()
}).observable;
