import React from 'react';

import {
  withSiPrefixThreeDecimalPlaces,
  timeByMillisTwoDecimalPlaces,
  withSiPrefixZeroDecimalPlaces
} from 'in-services/formatters/number';
import CustomMetricsV2 from 'in-sdk/components/dashboard/CustomMetricsV2';
import { emptyList } from 'in-services/fixedImmutables';

export default function MicrometerMetrics({ snapshot, timeConfig, titlePrefix }) {
  return <CustomMetricsV2 snapshot={snapshot} timeConfig={timeConfig} titlePrefix={titlePrefix} getRows={getRows} />;
}

function getRows({ snapshot, timeConfig, setPinnedMetrics, pinnedMetrics }) {
  const snapshotId = snapshot.get('id');
  let rows = [];

  rows = rows.concat(
    snapshot
      .getIn(['data', 'micrometer.metrics.gauge'], emptyList)
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
              name: `micrometer.metrics.gauge.${name}`,
              label: 'Value',
              formatter: withSiPrefixThreeDecimalPlaces
            }
          ]
        };
      })
  );

  rows = rows.concat(
    snapshot
      .getIn(['data', 'micrometer.metrics.timeGauge'], emptyList)
      .toArray()
      .map(name => {
        return {
          key: `timegauge${name}`,
          name,
          type: 'time gauge',
          snapshotId,
          timeConfig,
          color: '#D90368',
          setPinnedMetrics,
          pinnedMetrics,
          metrics: [
            {
              name: `micrometer.metrics.timeGauge.${name}`,
              label: 'Value',
              formatter: timeByMillisTwoDecimalPlaces
            }
          ]
        };
      })
  );

  rows = rows.concat(
    snapshot
      .getIn(['data', 'micrometer.metrics.counter'], emptyList)
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
              name: `micrometer.metrics.counter.${name}`,
              label: 'Count',
              formatter: withSiPrefixThreeDecimalPlaces
            }
          ]
        };
      })
  );

  rows = rows.concat(
    snapshot
      .getIn(['data', 'micrometer.metrics.functionCounter'], emptyList)
      .toArray()
      .map(name => {
        return {
          key: `functionCounter${name}`,
          name,
          type: 'function counter',
          snapshotId,
          timeConfig,
          color: '#00CC66',
          setPinnedMetrics,
          pinnedMetrics,
          metrics: [
            {
              name: `micrometer.metrics.functionCounter.${name}`,
              label: 'Count',
              formatter: withSiPrefixThreeDecimalPlaces
            }
          ]
        };
      })
  );

  rows = rows.concat(
    snapshot
      .getIn(['data', 'micrometer.metrics.timer'], emptyList)
      .toArray()
      .map(name => {
        return {
          key: `timer${name}`,
          name,
          type: 'timer',
          snapshotId,
          timeConfig,
          color: '#F75C03',
          setPinnedMetrics,
          pinnedMetrics,
          metrics: [
            {
              name: `micrometer.metrics.timer.${name}`,
              label: 'Value',
              formatter: timeByMillisTwoDecimalPlaces
            }
          ]
        };
      })
  );

  rows = rows.concat(
    snapshot
      .getIn(['data', 'micrometer.metrics.functionTimer'], emptyList)
      .toArray()
      .map(name => {
        return {
          key: `functiontimer${name}`,
          name,
          type: 'function timer',
          snapshotId,
          timeConfig,
          color: '#F75C03',
          setPinnedMetrics,
          pinnedMetrics,
          metrics: [
            {
              name: `micrometer.metrics.functionTimer.${name}`,
              label: 'Value',
              formatter: timeByMillisTwoDecimalPlaces
            }
          ]
        };
      })
  );

  rows = rows.concat(
    snapshot
      .getIn(['data', 'micrometer.metrics.longTaskTimer'], emptyList)
      .toArray()
      .map(name => {
        return {
          key: `longTaskTimer${name}`,
          name,
          type: 'long task timer',
          snapshotId,
          timeConfig,
          color: '#F75C03',
          setPinnedMetrics,
          pinnedMetrics,
          metrics: [
            {
              name: `micrometer.metrics.longTaskTimer.${name}`,
              label: 'Value',
              formatter: withSiPrefixZeroDecimalPlaces
            }
          ]
        };
      })
  );

  rows = rows.concat(
    snapshot
      .getIn(['data', 'micrometer.metrics.distributionSummary'], emptyList)
      .toArray()
      .map(name => {
        return {
          key: `distributionSummary${name}`,
          name,
          type: 'distribution',
          snapshotId,
          timeConfig,
          color: '#f7b320',
          setPinnedMetrics,
          pinnedMetrics,
          metrics: [
            {
              name: `micrometer.metrics.distributionSummary.${name}`,
              label: 'Value',
              formatter: withSiPrefixThreeDecimalPlaces
            }
          ]
        };
      })
  );

  return rows;
}
