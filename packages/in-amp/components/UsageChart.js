import React from 'react';

import UnifiedMetricsChart from 'in-custom-dashboards/widgets/Chart/UnifiedMetricsChart';
import useTimeConfig from 'in-hooks/useTimeConfig';

export default function UsageChart({ showAggregatedMetrics, y1, y2 }) {
  const defaultProps = {
    aggregation: 'MEAN',
    source: 'USAGE',
    showAggregatedMetrics
  };

  const timeConfig = useTimeConfig();
  return (
    <UnifiedMetricsChart
      shareMaxAxisDomain
      automaticallySize={false}
      config={{
        y1: {
          ...y1,
          metrics: y1.metrics.map((metric, i) => ({
            label: y1.labels[i],
            metric,
            unit: y1.unit,
            tenant: y1.tenant,
            ...defaultProps
          })),
          formatter: 'number.compact'
        },
        y2: {
          ...y2,
          metrics: y2.metrics.map((metric, i) => ({
            label: y2.labels[i],
            metric,
            unit: y1.unit,
            tenant: y1.tenant,
            ...defaultProps
          })),
          formatter: 'number.compact'
        },
        type: 'TIME_SERIES',
        granularity: getGranularity(timeConfig.windowSize)
      }}
    />
  );
}

function getGranularity(windowSize) {
  const oneHour = 1000 * 60 * 60;
  return windowSize > oneHour * 24 * 7 ? oneHour * 24 : oneHour;
}
