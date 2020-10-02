import React from 'react';

import UsageTimeConfigContextModification from 'in-amp/components/UsageTimeConfigContextModification';
import UnifiedMetricsChart from 'in-custom-dashboards/widgets/Chart/UnifiedMetricsChart';
import { formatDate, formatDateTime } from 'in-services/formatters/date';

export default function UsageChart({ windowSize, showAggregatedMetrics, y1, y2 }) {
  const thirtyDays = 1000 * 60 * 60 * 24 * 30;

  const defaultProps = {
    aggregation: 'MEAN',
    source: 'USAGE',
    showAggregatedMetrics,
    unit: y1.unit,
    tenant: y1.tenant
  };

  let tooltipTimeFormatter = formatDateTime;
  if (windowSize >= thirtyDays) {
    tooltipTimeFormatter = formatDate;
  }

  return (
    <UsageTimeConfigContextModification windowSize={windowSize}>
      <UnifiedMetricsChart
        shareMaxAxisDomain
        automaticallySize={false}
        tooltipTimeFormatter={tooltipTimeFormatter}
        config={{
          y1: {
            ...y1,
            metrics: y1.metrics.map((metric, i) => ({
              label: y1.labels[i],
              metric,
              ...defaultProps
            })),
            formatter: 'number.compact'
          },
          y2: {
            ...y2,
            metrics: y2.metrics.map((metric, i) => ({
              label: y2.labels[i],
              metric,
              ...defaultProps
            })),
            formatter: 'number.compact'
          },
          type: 'TIME_SERIES',
          granularity: getGranularity(windowSize)
        }}
      />
    </UsageTimeConfigContextModification>
  );
}

function getGranularity(windowSize) {
  const oneHour = 1000 * 60 * 60;
  const oneDay = oneHour * 24;
  return windowSize > oneDay * 7 ? oneDay : oneHour;
}
