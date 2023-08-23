/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { useObservable } from '@instana/hooks';
import { TimeConfig } from '@instana/types';

// @ts-expect-error needs TS migration
import { SnapshotData, getRawPayloadWithTimestamp } from 'in-stores/snapshot';
import { number, timeByMillisZeroDecimalPlaces } from 'in-services/formatters/number';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import Table from 'in-sdk/components/dashboard/Table';
import { t } from 'in-i18n';

interface LatencyRow {
  key: string;
  snapshotId: string;
  latency: Map<string, number>;
}

interface KongUpstreamLatencyRouteProps {
  snapshotId: string;
  timeConfig: TimeConfig;
}

const cols = [
  {
    title: t('in-forge:plugins.kongApigateway.route'),
    type: 'string',
    typeArgs: {
      getValue(row: LatencyRow) {
        return row.latency.get('route');
      }
    }
  },
  {
    title: t('in-forge:plugins.kongApigateway.kongLatencyFiftyPercentile'),
    type: 'number',
    typeArgs: {
      getValue(row: LatencyRow) {
        return row.latency.get('kongLatencyFiftyPercentile');
      },
      getContent: number.compact
    }
  },
  {
    title: t('in-forge:plugins.kongApigateway.kongLatencyNinetyPercentile'),
    type: 'number',
    typeArgs: {
      getValue(row: LatencyRow) {
        return row.latency.get('kongLatencyNinetyPercentile');
      },
      getContent: number.compact
    }
  },
  {
    title: t('in-forge:plugins.kongApigateway.kongLatencyNinetyfivePercentile'),
    type: 'number',
    typeArgs: {
      getValue(row: LatencyRow) {
        return row.latency.get('kongLatencyNinetyfivePercentile');
      },
      getContent: number.compact
    }
  },
  {
    title: t('in-forge:plugins.kongApigateway.kongLatencyNinetyninePercentile'),
    type: 'number',
    typeArgs: {
      getValue(row: LatencyRow) {
        return row.latency.get('kongLatencyNinetyninePercentile');
      },
      getContent: number.compact
    }
  }
];

const KongUpstreamLatencyRoute = function KongUpstreamLatencyRoute({
  snapshotId,
  timeConfig
}: KongUpstreamLatencyRouteProps) {
  const data = useObservable(
    () => getRawPayloadWithTimestamp(snapshotId, 'kongUpstreamLatencyMsBucketRoute'),
    [snapshotId]
  );

  if (!data) {
    return null;
  }

  const kongUpstreamLatencyMsBucketRoute = (data as SnapshotData).get('raw_payload');
  const rows: LatencyRow[] = kongUpstreamLatencyMsBucketRoute
    .keySeq()
    .toArray()
    .map((key: string) => {
      const latency = kongUpstreamLatencyMsBucketRoute.get(key);
      return {
        key: String(key),
        snapshotId,
        timeConfig,
        latency
      };
    });

  if (rows.length === 0) {
    return null;
  }
  function getDetails(row: LatencyRow) {
    return (
      <Chart
        snapshotId={snapshotId}
        timeConfig={timeConfig}
        y1={{
          min: 0,
          formatter: timeByMillisZeroDecimalPlaces,
          metrics: [
            `kongUpstreamLatencyMsBucketRoute.${row.key}.kongLatencyFiftyPercentile`,
            `kongUpstreamLatencyMsBucketRoute.${row.key}.kongLatencyNinetyPercentile`,
            `kongUpstreamLatencyMsBucketRoute.${row.key}.kongLatencyNinetyfivePercentile`,
            `kongUpstreamLatencyMsBucketRoute.${row.key}.kongLatencyNinetyninePercentile`
          ],
          labels: [
            t('in-forge:plugins.kongApigateway.kongLatencyFiftyPercentile'),
            t('in-forge:plugins.kongApigateway.kongLatencyNinetyPercentile'),
            t('in-forge:plugins.kongApigateway.kongLatencyNinetyfivePercentile'),
            t('in-forge:plugins.kongApigateway.kongLatencyNinetyninePercentile')
          ],
          type: 'line'
        }}
      />
    );
  }

  return (
    <Table
      withoutPadding
      cardTitle={t('in-forge:plugins.kongApigateway.upstreamLatencyRoute')}
      cols={cols}
      rows={rows}
      getRowDetails={getDetails}
    />
  );
};

export default KongUpstreamLatencyRoute;
