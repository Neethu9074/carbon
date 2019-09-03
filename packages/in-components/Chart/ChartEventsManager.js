import chartMarkerRender from 'in-components/Chart/renderer/chartMarker';
import getReleases from 'in-events/subscriptions/getReleases';
import { pendingResult } from 'in-services/fixedObjects';
import { timeConfig$ } from 'in-stores/timeline';

export default class ChartEventsManager {
  constructor() {
    this.events$ = timeConfig$
      .flatMap(timeConfig =>
        getReleases({
          timeConfig,
          pagination: {
            page: 1,
            pageSize: 100
          }
        })
      )
      .startWith(pendingResult)
      .map(({ data }) => (data && data.items && data.items.length > 0 ? data.items : []));
  }

  renderEvents(events, config) {
    chartMarkerRender.render(events, config);
  }
}
