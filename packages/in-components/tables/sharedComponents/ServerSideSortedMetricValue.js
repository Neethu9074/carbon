/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { valueMissingPlaceholder } from 'in-new-components/valueMissingPlaceholder';
import MetricValue from 'in-components/MetricValue';

export default function ServerSideSortedMetricValue({ snapshotId, metric, sortedMetricValue, formatter }) {
  if (sortedMetricValue !== false) {
    return sortedMetricValue === null || sortedMetricValue === undefined
      ? valueMissingPlaceholder
      : formatter(sortedMetricValue);
  }
  return <MetricValue snapshotId={snapshotId} metric={metric} formatter={formatter} />;
}
