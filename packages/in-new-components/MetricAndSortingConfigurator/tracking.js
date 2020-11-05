import { noop } from 'in-services/util/function';

import rpt from 'prop-types';

export class MetricConfiguratorTracking {
  constructor({ onMetricAdded = noop, onMetricRemoved = noop, onMetricAggregationChanged = noop }) {
    this.onMetricAdded = onMetricAdded;
    this.onMetricRemoved = onMetricRemoved;
    this.onMetricAggregationChanged = onMetricAggregationChanged;
  }

  static propTypes = {
    onMetricAdded: rpt.func,
    onMetricRemoved: rpt.func,
    onMetricAggregationChanged: rpt.func
  };
}
