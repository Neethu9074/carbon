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

interface TotalHttpRequestProps {
  snapshotId: string;
  timeConfig: TimeConfig;
}

interface Row {
  key: string;
  snapshotId: string;
  timeConfig: string;
  totalHttpRequest: Map<string, any>;
}

const cols = [
  {
    title: t('in-forge:plugins.kongApigateway.service'),
    type: 'string',
    typeArgs: {
      getValue(row: Row) {
        return row.totalHttpRequest.get('service');
      }
    }
  },
  {
    title: t('in-forge:plugins.kongApigateway.route'),
    type: 'string',
    typeArgs: {
      getValue(row: Row) {
        return row.totalHttpRequest.get('route');
      }
    }
  },
  {
    title: t('in-forge:plugins.kongApigateway.code'),
    type: 'string',
    typeArgs: {
      getValue(row: Row) {
        return row.totalHttpRequest.get('code');
      }
    }
  },
  {
    title: t('in-forge:plugins.kongApigateway.source'),
    type: 'string',
    typeArgs: {
      getValue(row: Row) {
        return row.totalHttpRequest.get('source');
      }
    }
  },
  {
    title: t('in-forge:plugins.kongApigateway.consumer'),
    type: 'string',
    typeArgs: {
      getValue(row: Row) {
        return row.totalHttpRequest.get('consumer');
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
        return `kongHttpRequestsTotal.${row.key}.requests`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

const TotalHttpRequest = ({ snapshotId, timeConfig }: TotalHttpRequestProps) => {
  const data = useObservable(() => getRawPayloadWithTimestamp(snapshotId, 'kongHttpRequestsTotal'), [snapshotId]);

  if (!data) {
    return null;
  }

  const kongHttpRequestsTotal = (data as SnapshotData).get('raw_payload');
  const rows: Row[] = kongHttpRequestsTotal
    .keySeq()
    .toArray()
    .map((key: string) => {
      const totalHttpRequest = kongHttpRequestsTotal.get(key);
      return {
        key,
        snapshotId,
        timeConfig,
        totalHttpRequest
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
          metrics: ['kongHttpRequestsTotal.' + row.key + '.requests'],
          labels: [t('in-forge:plugins.kongApigateway.totalNumberofRequests')],
          type: 'line'
        }}
      />
    );
  }
  return (
    <Table
      withoutPadding
      cardTitle={t('in-forge:plugins.kongApigateway.totalHttpRequests', {
        count: rows.length
      })}
      cols={cols}
      rows={rows}
      getRowDetails={getDetails}
    />
  );
};

export default TotalHttpRequest;
