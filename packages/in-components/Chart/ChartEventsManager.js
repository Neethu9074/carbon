import chartMarkerRender from 'in-components/Chart/renderer/chartMarker';
import getReleases from 'in-events/subscriptions/getReleases';
import { releasesEnabled } from 'in-services/featureFlags';
import { pendingResult } from 'in-services/fixedObjects';
import { always } from 'in-services/fixedStreams';
import { timeConfig$ } from 'in-stores/timeline';

export default class ChartEventsManager {
  constructor() {
    this.events$ = releasesEnabled
      ? timeConfig$
          .flatMap(timeConfig =>
            getReleases({
              timeConfig,
              pagination: {
                page: 1,
                pageSize: 1
              }
            })
          )
          .startWith(pendingResult)
          .map(({ data }) => (data && data.items && data.items.length > 0 ? data.items : []))
      : always([]);
  }

  renderEvents(events, config) {
    chartMarkerRender.render(events, config);
  }
}
