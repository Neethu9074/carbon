/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
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

interface WarehouseUsageRow {
  key: string;
  snapshotId: string;
}

interface WarehouseUsageProps {
  snapshotId: string;
  timeConfig: TimeConfig;
}

const cols = [
  {
    title: t('in-forge:plugins.snowflake.dashboard.warehouseName'),
    type: 'string',
    typeArgs: {
      getValue(row: WarehouseUsageRow) {
        return row.key;
      }
    }
  },
  {
    title: t('in-forge:plugins.snowflake.dashboard.compute'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: WarehouseUsageRow) {
        return row.snapshotId;
      },
      getMetricName(row: WarehouseUsageRow) {
        return `credit.warehouse_usage.${row.key}.compute`;
      },
      getContent: number.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.snowflake.dashboard.cloudServices'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: WarehouseUsageRow) {
        return row.snapshotId;
      },
      getMetricName(row: WarehouseUsageRow) {
        return `credit.warehouse_usage.${row.key}.cloud_services`;
      },
      getContent: number.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.snowflake.dashboard.total'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: WarehouseUsageRow) {
        return row.snapshotId;
      },
      getMetricName(row: WarehouseUsageRow) {
        return `credit.warehouse_usage.${row.key}.total`;
      },
      getContent: number.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

const WarehouseUsage = function WarehouseUsage({ snapshotId, timeConfig }: WarehouseUsageProps) {
  const data = useObservable(
    () => getRawPayloadWithTimestamp(snapshotId, 'credit.warehouses', timeConfig),
    [snapshotId, timeConfig]
  );

  if (!data) {
    return null;
  }

  const warehouseNames = (data as SnapshotData).get('raw_payload');
  const rows: WarehouseUsageRow[] = warehouseNames
    .keySeq()
    .toArray()
    .map((index: number) => {
      const key = warehouseNames.get(index);
      return {
        key,
        snapshotId
      };
    });

  if (rows.length === 0) {
    return null;
  }

  function getDetails(row: WarehouseUsageRow) {
    return (
      <div>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            formatter: number.detailed,
            metrics: [
              `credit.warehouse_usage.${row.key}.compute`,
              `credit.warehouse_usage.${row.key}.cloud_services`,
              `credit.warehouse_usage.${row.key}.total`
            ],
            labels: [
              t('in-forge:plugins.snowflake.dashboard.compute'),
              t('in-forge:plugins.snowflake.dashboard.cloudServices'),
              t('in-forge:plugins.snowflake.dashboard.total')
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
      cardTitle={t('in-forge:plugins.snowflake.dashboard.warehouseUsage', {
        count: rows.length
      })}
      cols={cols}
      rows={rows}
      getRowDetails={getDetails}
    />
  );
};

export default WarehouseUsage;
