import { create } from 'reactive-observables';

import getWebsiteRateMetricAlertsPreview from 'in-websites/eum-alerting/subscriptions/getWebsiteRateMetricAlertsPreview';
import getWebsiteMetricAlertsPreview from 'in-websites/eum-alerting/subscriptions/getWebsiteMetricAlertsPreview';
import alertMarkersRenderer from 'in-new-components/Alerting/Chart/renderer/alertMarkers';
import { alwaysEmptyArray } from 'in-services/fixedStreams';
import { pendingResult } from 'in-services/fixedObjects';

export default class AlertingChartEventsManager {
  constructor() {
    this.signal$ = create();
  }

  getAlertsSubscription(props) {
    if (!props.alertMetricConfiguration) {
      return alwaysEmptyArray;
    }

    const alerts$ = props.isCatalogMetric
      ? getWebsiteMetricAlertsPreview(props.alertMetricConfiguration)
      : getWebsiteRateMetricAlertsPreview(props.alertMetricConfiguration);

    return alerts$.startWith(pendingResult).map(result => (result !== null && result.data ? result.data.alerts : []));
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
