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

interface Row {
  key: string;
  snapshotId: string;
  totalRequests: Map<string, any>;
}

interface SnapshotMapProps {
  snapshotId: string;
  timeConfig: TimeConfig;
}

const cols = [
  {
    title: t('in-forge:plugins.kongApigateway.subsystem'),
    type: 'string',
    typeArgs: {
      getValue(row: Row) {
        return row.totalRequests.get('subsystem');
      }
    }
  },
  {
    title: t('in-forge:plugins.kongApigateway.totalNumberofRequests'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: Row) {
        return row.snapshotId;
      },
      getMetricName(row: Row) {
        return `kongNginxRequestsTotal.${row.key}.requests`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

const TotalRequest = ({ snapshotId, timeConfig }: SnapshotMapProps) => {
  const data = useObservable(() => getRawPayloadWithTimestamp(snapshotId, 'kongNginxRequestsTotal'), [snapshotId]);

  if (!data) {
    return null;
  }

  const kongNginxRequestsTotal = (data as SnapshotData).get('raw_payload');
  const rows: Row[] = kongNginxRequestsTotal
    .keySeq()
    .toArray()
    .map((key: string) => {
      const totalRequests = kongNginxRequestsTotal.get(key);
      return {
        key,
        snapshotId,
        timeConfig,
        totalRequests
      };
    });

  if (rows.length === 0) {
    return null;
  }

  function getDetails(row: Row) {
    return (
      <Chart
        snapshotId={snapshotId}
        timeConfig={timeConfig}
        y1={{
          min: 0,
          formatter: number.compact,
          metrics: [`kongNginxRequestsTotal.${row.key}.requests`],
          labels: [t('in-forge:plugins.kongApigateway.totalNumberofRequests')],
          type: 'line'
        }}
      />
    );
  }

  return (
    <Table
      withoutPadding
      cardTitle={t('in-forge:plugins.kongApigateway.nginxTotalRequests')}
      cols={cols}
      rows={rows}
      getRowDetails={getDetails}
    />
  );
};

export default TotalRequest;
