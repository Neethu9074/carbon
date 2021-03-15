/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import globalHighlightConfig from 'in-components/Chart/components/ContextMenu/actions/globalHighlight';
import UsageTimeConfigContextModification from 'in-amp/components/UsageTimeConfigContextModification';
import UnifiedMetricsChart from 'in-custom-dashboards/widgets/Chart/UnifiedMetricsChart';
import zoomInConfig from 'in-components/Chart/components/ContextMenu/actions/zoomIn';
import { formatDate, formatDateTime } from 'in-services/formatters/date';
import { days, hours } from 'in-services/time';

export default function UsageChart({ windowSize, showAggregatedMetrics, y1, y2 }) {
  const defaultProps = {
    aggregation: 'MEAN',
    source: 'USAGE',
    showAggregatedMetrics,
    unit: y1.unit,
    tenant: y1.tenant
  };

  let tooltipTimeFormatter = formatDateTime;
  if (windowSize >= days.toMillis(30)) {
    tooltipTimeFormatter = formatDate;
  }

  return (
    <UsageTimeConfigContextModification windowSize={windowSize}>
      <UnifiedMetricsChart
        shareMaxAxisDomain
        automaticallySize={false}
        tooltipTimeFormatter={tooltipTimeFormatter}
        excludedContextMenuActions={[zoomInConfig.name, globalHighlightConfig.name]}
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
  return windowSize > days.toMillis(7) ? days.toMillis(1) : hours.toMillis(1);
}
