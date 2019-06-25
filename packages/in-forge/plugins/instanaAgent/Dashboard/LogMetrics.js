import React from 'react';

import CustomMetricsV2 from 'in-sdk/components/dashboard/CustomMetricsV2/CustomMetricsV2';

export default function LogMetrics({ snapshot, timeConfig }) {
  return (
    <CustomMetricsV2
      snapshot={snapshot}
      timeConfig={timeConfig}
      titlePrefix="Log Counts"
      countersSnapshotLocation={['data', 'log.counts.byMessage']}
      countersMetricPrefix={'log.counts.byMessage.'}
      metricIdExtractor={key => key}
      metricNameExtractor={(key, value) => value}
    />
  );
}
