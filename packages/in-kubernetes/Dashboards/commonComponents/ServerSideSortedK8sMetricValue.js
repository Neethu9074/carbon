/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import ServerSideSortedMetricValue from 'in-components/tables/sharedComponents/ServerSideSortedMetricValue';

export default function ServerSideSortedK8sMetricValue({ snapshotId, metric, sortedMetricValue, formatter }) {
  return (
    <ServerSideSortedMetricValue
      snapshotId={snapshotId}
      metric={metric}
      sortedMetricValue={sortedMetricValue}
      formatter={formatter}
      minRollup={10000}
    />
  );
}
