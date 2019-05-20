import React from 'react';

import { withSiPrefixThreeDecimalPlaces } from 'in-services/formatters/number';
import CustomMetricsV2 from 'in-sdk/components/dashboard/CustomMetricsV2';
import { emptyList } from 'in-services/fixedImmutables';

export default function PrometheusCustomMetrics({ snapshot, timeConfig, titlePrefix }) {
  return <CustomMetricsV2 snapshot={snapshot} timeConfig={timeConfig} titlePrefix={titlePrefix} getRows={getRows} />;
}

function getRows({ snapshot, timeConfig, setPinnedMetrics, pinnedMetrics }) {
  const snapshotId = snapshot.get('id');
  let rows = [];

  rows = rows.concat(
    snapshot
      .getIn(['data', 'metrics.counters'], emptyList)
      .toArray()
      .map(name => {
        return {
          key: `counter${name}`,
          name,
          type: 'counter',
          snapshotId,
          timeConfig,
          color: '#00CC66',
          setPinnedMetrics,
          pinnedMetrics,
          metrics: [
            {
              name: `metrics.counters.${name}`,
              label: 'Value',
              formatter: withSiPrefixThreeDecimalPlaces
            }
          ]
        };
      })
  );

  rows = rows.concat(
    snapshot
      .getIn(['data', 'metrics.gauges'], emptyList)
      .toArray()
      .map(name => {
        return {
          key: `gauge${name}`,
          name,
          type: 'gauge',
          snapshotId,
          timeConfig,
          color: '#D90368',
          setPinnedMetrics,
          pinnedMetrics,
          metrics: [
            {
              name: `metrics.gauges.${name}`,
              label: 'Value',
              formatter: withSiPrefixThreeDecimalPlaces
            }
          ]
        };
      })
  );

  rows = rows.concat(
    snapshot
      .getIn(['data', 'metrics.histograms'], emptyList)
      .toArray()
      .map(name => {
        return {
          key: `histogram${name}`,
          name,
          type: 'histogram',
          snapshotId,
          timeConfig,
          color: '#F1C40F',
          setPinnedMetrics,
          pinnedMetrics,
          metrics: [
            {
              name: `metrics.histograms.${name}`,
              label: 'Value',
              formatter: withSiPrefixThreeDecimalPlaces
            }
          ]
        };
      })
  );

  rows = rows.concat(
    snapshot
      .getIn(['data', 'metrics.summaries'], emptyList)
      .toArray()
      .map(name => {
        return {
          key: `summary${name}`,
          name,
          type: 'summary',
          snapshotId,
          timeConfig,
          color: '#F75C03',
          setPinnedMetrics,
          pinnedMetrics,
          metrics: [
            {
              name: `metrics.summaries.${name}`,
              label: 'Value',
              formatter: withSiPrefixThreeDecimalPlaces
            }
          ]
        };
      })
  );

  return rows;
}
