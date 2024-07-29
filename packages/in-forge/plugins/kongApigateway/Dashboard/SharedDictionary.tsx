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
import { percentage, bytesTwoDecimalPlaces } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import { t } from 'in-i18n';

interface Row {
  key: string;
  snapshotId: string;
  timeConfig: string;
  sharedDictionary: Map<string, unknown>;
}

interface SharedDictionaryProps {
  snapshotId: string;
  timeConfig: TimeConfig;
}

const cols = [
  {
    title: t('in-forge:plugins.kongApigateway.sharedDictionary'),
    type: 'string',
    typeArgs: {
      getValue(row: Row) {
        return row.sharedDictionary.get('sharedDict');
      }
    }
  },
  {
    title: t('in-forge:plugins.kongApigateway.subsystem'),
    type: 'string',
    typeArgs: {
      getValue(row: Row) {
        return row.sharedDictionary.get('subsystem');
      }
    }
  },
  {
    title: t('in-forge:plugins.kongApigateway.totalCapacity'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: Row) {
        return row.snapshotId;
      },
      getMetricName(row: Row) {
        return `memoryLuaSharedDictBytes.${row.key}.totalBytes`;
      },
      getContent: bytesTwoDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.kongApigateway.allocatedBytes'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: Row) {
        return row.snapshotId;
      },
      getMetricName(row: Row) {
        return `memoryLuaSharedDictBytes.${row.key}.allocatedBytes`;
      },
      getContent: bytesTwoDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.kongApigateway.allocatedBytesPercent'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: Row) {
        return row.snapshotId;
      },
      getMetricName(row: Row) {
        return `memoryLuaSharedDictBytes.${row.key}.percentage`;
      },
      getContent: percentage.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

const SharedDictionary = ({ snapshotId, timeConfig }: SharedDictionaryProps) => {
  const data = useObservable(() => getRawPayloadWithTimestamp(snapshotId, 'memoryLuaSharedDictBytes'), [snapshotId]);
  if (!data) {
    return null;
  }
  const memoryLuaSharedDictByte = (data as SnapshotData).get('raw_payload');
  const rows: Row[] = memoryLuaSharedDictByte
    .keySeq()
    .toArray()
    .map((key: string) => ({
      key,
      snapshotId,
      timeConfig,
      sharedDictionary: memoryLuaSharedDictByte.get(key)
    }));

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
          formatter: percentage.detailed,
          metrics: [`memoryLuaSharedDictBytes.${row.key}.percentage`],
          labels: [t('in-forge:plugins.kongApigateway.allocatedBytesPercent')],
          type: 'line'
        }}
      />
    );
  }

  return (
    <Table
      withoutPadding
      cardTitle={t('in-forge:plugins.kongApigateway.dashboard.sharedDictionaryAllocated')}
      cols={cols}
      rows={rows}
      getRowDetails={getDetails}
    />
  );
};

export default SharedDictionary;
