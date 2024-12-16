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
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import { bytesTwoDecimalPlaces } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import { t } from 'in-i18n';

interface LatencyRow {
  key: string;
  snapshotId: string;
  latency: Map<string, number>;
}

interface KongLatencyProps {
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
    title: t('in-forge:plugins.kongApigateway.route'),
    type: 'string',
    typeArgs: {
      getValue(row: LatencyRow) {
        return row.latency.get('route');
      }
    }
  },
  {
    title: t('in-forge:plugins.kongApigateway.consumer'),
    type: 'string',
    typeArgs: {
      getValue(row: LatencyRow) {
        return row.latency.get('consumer');
      }
    }
  },
  {
    title: t('in-forge:plugins.kongApigateway.ingressBytes'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: LatencyRow) {
        return row.snapshotId;
      },
      getMetricName(row: LatencyRow) {
        return `kongBandwidthBytes.${row.key}.ingress`;
      },
      getContent: bytesTwoDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.kongApigateway.egressBytes'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: LatencyRow) {
        return row.snapshotId;
      },
      getMetricName(row: LatencyRow) {
        return `kongBandwidthBytes.${row.key}.egress`;
      },
      getContent: bytesTwoDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

const BandWidth = function KongKongLatency({ snapshotId, timeConfig }: KongLatencyProps) {
  const data = useObservable(() => getRawPayloadWithTimestamp(snapshotId, 'kongBandwidthBytes'), [snapshotId]);

  if (!data) {
    return null;
  }

  const kongBandwidthBytes = (data as SnapshotData).get('raw_payload');
  const rows: LatencyRow[] = kongBandwidthBytes
    .keySeq()
    .toArray()
    .map((key: string) => {
      const latency = kongBandwidthBytes.get(key);
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
            formatter: bytesTwoDecimalPlaces,
            metrics: [`kongBandwidthBytes.${row.key}.ingress`, `kongBandwidthBytes.${row.key}.egress`],
            labels: [t('in-forge:plugins.kongApigateway.ingress'), t('in-forge:plugins.kongApigateway.egress')],
            type: 'line'
          }}
        />
      </div>
    );
  }

  return (
    <Table
      withoutPadding
      cardTitle={t('in-forge:plugins.kongApigateway.kongBandwidth', {
        count: rows.length
      })}
      cols={cols}
      rows={rows}
      getRowDetails={getDetails}
    />
  );
};

export default BandWidth;
