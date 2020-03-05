import { create } from 'reactive-observables';

import alertMarkersRenderer from 'in-new-components/Alerting/Chart/renderer/alertMarkers';
import { alwaysEmptyArray } from 'in-services/fixedStreams';
import { pendingResult } from 'in-services/fixedObjects';

export default class AlertingChartEventsManager {
  constructor() {
    this.signal$ = create();
  }

  getAlertsSubscription(props) {
    if (!props.alertsPreviewEnabled) {
      return alwaysEmptyArray;
    }

    const {
      threshold: { baseline, type }
    } = props.alertMetricConfiguration;

    if (type === 'historicBaseline' && baseline.length === 0) {
      return alwaysEmptyArray;
    }

    return props
      .getAlertsPreview(props.alertMetricConfiguration)
      .startWith(pendingResult)
      .map(result => (result !== null && result.data ? result.data.alerts : []));
  }

  get alertEvents$() {
    return this.signal$.flatMap(this.getAlertsSubscription);
  }

  refetchAlerts(props) {
    this.signal$.emit(props);
  }

  renderEvents(events, config) {
    alertMarkersRenderer.render(events, config);
  }
}
