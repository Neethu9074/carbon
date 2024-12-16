/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { List } from 'immutable';
import React from 'react';

import { TimeConfig } from '@instana/types';

import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import Columize from 'in-sdk/components/dashboard/Columize';
import { SnapshotData } from 'in-stores/snapshot/snapshot';
import { number } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { t } from 'in-i18n';

interface HikariDatasourceRow {
  key: string;
  timeConfig: TimeConfig;
  snapshotId: string;
  snapshot: SnapshotData;
}

const cols = [
  {
    title: t('in-forge:plugins.springbootAppContainer.datasources.name'),
    type: 'string',
    typeArgs: {
      getValue({ key }: HikariDatasourceRow) {
        return key;
      }
    }
  },
  {
    title: t('in-forge:plugins.springbootAppContainer.hikariDatasources.poolName'),
    type: 'string',
    typeArgs: {
      getValue({ key, snapshot }: HikariDatasourceRow) {
        return snapshot.getIn(['data', `hikariCPDatasources.${key}.poolName`]);
      }
    }
  },
  {
    title: t('in-forge:plugins.springbootAppContainer.datasources.active'),
    type: 'metric',
    typeArgs: {
      getSnapshotId({ snapshotId }: HikariDatasourceRow) {
        return snapshotId;
      },
      getMetricName({ key }: HikariDatasourceRow) {
        return `hikariCPDatasources.${key}.active`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.springbootAppContainer.datasources.idle'),
    type: 'metric',
    typeArgs: {
      getSnapshotId({ snapshotId }: HikariDatasourceRow) {
        return snapshotId;
      },
      getMetricName({ key }: HikariDatasourceRow) {
        return `hikariCPDatasources.${key}.idle`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.springbootAppContainer.datasources.min'),
    type: 'metric',
    typeArgs: {
      getSnapshotId({ snapshotId }: HikariDatasourceRow) {
        return snapshotId;
      },
      getMetricName({ key }: HikariDatasourceRow) {
        return `hikariCPDatasources.${key}.min`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.springbootAppContainer.datasources.max'),
    type: 'metric',
    typeArgs: {
      getSnapshotId({ snapshotId }: HikariDatasourceRow) {
        return snapshotId;
      },
      getMetricName({ key }: HikariDatasourceRow) {
        return `hikariCPDatasources.${key}.max`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.springbootAppContainer.datasources.connectionTimeout'),
    type: 'number',
    typeArgs: {
      getValue({ key, snapshot }: HikariDatasourceRow) {
        return snapshot.getIn(['data', `hikariCPDatasources.${key}.connTimeout`]);
      },
      getContent: number.compact
    }
  }
];

export default function HikariDatasourcesTable({ snapshot }: { snapshot: SnapshotData }) {
  const timeConfig = useTimeConfig();
  const hikariCPDatasourceNames = snapshot.getIn(['data', 'hikariCPDatasourceNames'], List());
  if (hikariCPDatasourceNames.size === 0) {
    return null;
  }
  const rows = hikariCPDatasourceNames.toArray().map((key: string) => {
    return {
      key,
      timeConfig,
      snapshotId: snapshot.get('id'),
      snapshot
    };
  });

  return (
    <Table
      withoutPadding
      cardTitle={t('in-forge:plugins.springbootAppContainer.hikariDatasources.hikariDatasourcesWithCount', {
        len: rows.length
      })}
      rows={rows}
      cols={cols}
      getRowDetails={getRowDetails}
    />
  );
}

function getRowDetails({ key, snapshotId, timeConfig }: HikariDatasourceRow) {
  return (
    <div>
      <Columize>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: [
              `hikariCPDatasources.${key}.total`,
              `hikariCPDatasources.${key}.active`,
              `hikariCPDatasources.${key}.idle`
            ],
            labels: [
              t('in-forge:plugins.springbootAppContainer.hikariDatasources.total'),
              t('in-forge:plugins.springbootAppContainer.datasources.active'),
              t('in-forge:plugins.springbootAppContainer.datasources.idle')
            ],
            type: 'line',
            formatter: number.compact
          }}
        />
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: [
              `hikariCPDatasources.${key}.acquire`,
              `hikariCPDatasources.${key}.creation`,
              `hikariCPDatasources.${key}.usage`,
              `hikariCPDatasources.${key}.timeout`,
              `hikariCPDatasources.${key}.pending`
            ],
            labels: [
              t('in-forge:plugins.springbootAppContainer.hikariDatasources.acquisitions'),
              t('in-forge:plugins.springbootAppContainer.hikariDatasources.creations'),
              t('in-forge:plugins.springbootAppContainer.hikariDatasources.usage'),
              t('in-forge:plugins.springbootAppContainer.hikariDatasources.timeouts'),
              t('in-forge:plugins.springbootAppContainer.hikariDatasources.pending')
            ],
            type: 'line',
            formatter: number.compact
          }}
        />
      </Columize>
    </div>
  );
}
