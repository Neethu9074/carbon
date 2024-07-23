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
        return `kongRequestLatencyMsBucketService.${row.key}.kongLatencyFiftyPercentile`;
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
        return `kongRequestLatencyMsBucketService.${row.key}.kongLatencyNinetyPercentile`;
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
        return `kongRequestLatencyMsBucketService.${row.key}.kongLatencyNinetyfivePercentile`;
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
        return `kongRequestLatencyMsBucketService.${row.key}.kongLatencyNinetyninePercentile`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

const KongRequestLatency = function KongKongRequestLatency({ snapshotId, timeConfig }: KongRequestLatencyProps) {
  const data = useObservable(
    () => getRawPayloadWithTimestamp(snapshotId, 'kongRequestLatencyMsBucketService'),
    [snapshotId]
  );

  if (!data) {
    return null;
  }

  const kongRequestLatencyMsBucketService = (data as SnapshotData).get('raw_payload');
  const rows: LatencyRow[] = kongRequestLatencyMsBucketService
    .keySeq()
    .toArray()
    .map((key: string) => {
      const latency = kongRequestLatencyMsBucketService.get(key);
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
      <div>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            formatter: timeByMillisZeroDecimalPlaces,
            metrics: [
              `kongRequestLatencyMsBucketService.${row.key}.kongLatencyFiftyPercentile`,
              `kongRequestLatencyMsBucketService.${row.key}.kongLatencyNinetyPercentile`,
              `kongRequestLatencyMsBucketService.${row.key}.kongLatencyNinetyfivePercentile`,
              `kongRequestLatencyMsBucketService.${row.key}.kongLatencyNinetyninePercentile`
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
      </div>
    );
  }

  return (
    <Table
      withoutPadding
      cardTitle={t('in-forge:plugins.kongApigateway.requestLatency', {
        count: rows.length
      })}
      cols={cols}
      rows={rows}
      getRowDetails={getDetails}
    />
  );
};

export default KongRequestLatency;
