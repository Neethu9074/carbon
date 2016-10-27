import {combineLatest} from 'reactive-observables';

import {isMapView$, isTraceView$, isEventView$, isTableView$} from 'in-stores/navigation/view';
import {createTrackingStore} from 'in-stores/store';

const mapViewSearchContexts = ['entity'];
const tableViewSearchContexts = ['entity'];
const traceViewSearchContexts = ['trace'];
const incidentViewSearchContexts = ['event'];
export default createTrackingStore({
  name: 'in-stores/search/searchContexts',
  observable: combineLatest([isMapView$, isTraceView$, isEventView$, isTableView$])
    .map(([isMapView, isTraceView, isEventView, isTableView]) => {
      if (isMapView) {
        return mapViewSearchContexts;
      } else if (isTableView) {
        return tableViewSearchContexts;
      } else if (isTraceView) {
        return traceViewSearchContexts;
      } else if (isEventView) {
        return incidentViewSearchContexts;
      }
      return [];
    })
    .distinct()
}).observable;
