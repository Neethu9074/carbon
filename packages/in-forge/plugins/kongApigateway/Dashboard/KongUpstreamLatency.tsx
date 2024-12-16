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
import { timeByMillisZeroDecimalPlaces, number } from 'in-services/formatters/number';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import Table from 'in-sdk/components/dashboard/Table';
import { t } from 'in-i18n';

interface LatencyRow {
  key: string;
  snapshotId: string;
  latency: Map<string, number>;
}

interface KongRequestLatencyProps {
  snapshotId: string;
  timeConfig: TimeConfig;
}

const cols = [
  {
    title: t('in-forge:plugins.kongApigateway.service'),
    type: 'string',
    typeArgs: {
      getValue(row: LatencyRow) {
        return row.latency.get('service');
      }
    }
  },
  {
    title: t('in-forge:plugins.kongApigateway.kongLatencyFiftyPercentile'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: LatencyRow) {
        return row.snapshotId;
      },
      getMetricName(row: LatencyRow) {
        return `kongUpstreamLatencyMsBucketService.${row.key}.kongLatencyFiftyPercentile`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.kongApigateway.kongLatencyNinetyPercentile'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: LatencyRow) {
        return row.snapshotId;
      },
      getMetricName(row: LatencyRow) {
        return `kongUpstreamLatencyMsBucketService.${row.key}.kongLatencyNinetyPercentile`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.kongApigateway.kongLatencyNinetyfivePercentile'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: LatencyRow) {
        return row.snapshotId;
      },
      getMetricName(row: LatencyRow) {
        return `kongUpstreamLatencyMsBucketService.${row.key}.kongLatencyNinetyfivePercentile`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.kongApigateway.kongLatencyNinetyninePercentile'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: LatencyRow) {
        return row.snapshotId;
      },
      getMetricName(row: LatencyRow) {
        return `kongUpstreamLatencyMsBucketService.${row.key}.kongLatencyNinetyninePercentile`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

const KongUpstreamLatency = function KongUpstreamLatency({ snapshotId, timeConfig }: KongRequestLatencyProps) {
  const data = useObservable(
    () => getRawPayloadWithTimestamp(snapshotId, 'kongUpstreamLatencyMsBucketService'),
    [snapshotId]
  );

  if (!data) {
    return null;
  }

  const kongUpstreamLatencyMsBucketService = (data as SnapshotData).get('raw_payload');
  const rows: LatencyRow[] = kongUpstreamLatencyMsBucketService
    .keySeq()
    .toArray()
    .map((key: string) => {
      const latency = kongUpstreamLatencyMsBucketService.get(key);
      return {
        key,
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
            `kongUpstreamLatencyMsBucketService.${row.key}.kongLatencyFiftyPercentile`,
            `kongUpstreamLatencyMsBucketService.${row.key}.kongLatencyNinetyPercentile`,
            `kongUpstreamLatencyMsBucketService.${row.key}.kongLatencyNinetyfivePercentile`,
            `kongUpstreamLatencyMsBucketService.${row.key}.kongLatencyNinetyninePercentile`
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
      cardTitle={t('in-forge:plugins.kongApigateway.upstreamLatency', {
        count: rows.length
      })}
      cols={cols}
      rows={rows}
      getRowDetails={getDetails}
    />
  );
};

export default KongUpstreamLatency;
