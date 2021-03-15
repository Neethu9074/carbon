/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import rpt from 'prop-types';

import { noop } from 'in-services/util/function';

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
