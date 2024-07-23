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
import { number } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import { t } from 'in-i18n';

interface TotalConnectionsProps {
  snapshotId: string;
  timeConfig: TimeConfig;
}

interface TotalConnectionRow {
  key: string;
  snapshotId: string;
  timeConfig: string;
  totalConnection: Map<string, number>;
}

const cols = [
  {
    title: t('in-forge:plugins.kongApigateway.state'),
    type: 'string',
    typeArgs: {
      getValue(row: TotalConnectionRow) {
        return row.totalConnection.get('state');
      }
    }
  },
  {
    title: t('in-forge:plugins.kongApigateway.subsystem'),
    type: 'string',
    typeArgs: {
      getValue(row: TotalConnectionRow) {
        return row.totalConnection.get('subsystem');
      }
    }
  },
  {
    title: t('in-forge:plugins.kongApigateway.totalConnections'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: TotalConnectionRow) {
        return row.snapshotId;
      },
      getMetricName(row: TotalConnectionRow) {
        return `nginxConnectionsTotal.${row.key}.connections`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

const TotalConnections: React.FC<TotalConnectionsProps> = ({ snapshotId, timeConfig }) => {
  const data = useObservable(() => getRawPayloadWithTimestamp(snapshotId, 'nginxConnectionsTotal'), [snapshotId]);

  if (!data) {
    return null;
  }

  const nginxHttpCurrentConnection = (data as SnapshotData).get('raw_payload');

  const rows: TotalConnectionRow[] = nginxHttpCurrentConnection
    .keySeq()
    .toArray()
    .map((key: string) => {
      const totalConnection = nginxHttpCurrentConnection.get(key);
      return {
        key: String(key),
        snapshotId,
        timeConfig,
        totalConnection
      };
    });

  if (rows.length === 0) {
    return null;
  }

  function getDetails(row: TotalConnectionRow) {
    return (
      <Chart
        snapshotId={snapshotId}
        timeConfig={timeConfig}
        y1={{
          min: 0,
          formatter: number.compact,
          metrics: [`nginxConnectionsTotal.${row.key}.connections`],
          labels: [t('in-forge:plugins.kongApigateway.totalConnections')],
          type: 'line'
        }}
      />
    );
  }

  return (
    <Table
      withoutPadding
      cardTitle={t('in-forge:plugins.kongApigateway.dashboard.totalConnections')}
      cols={cols}
      rows={rows}
      getRowDetails={getDetails}
    />
  );
};

export default TotalConnections;
