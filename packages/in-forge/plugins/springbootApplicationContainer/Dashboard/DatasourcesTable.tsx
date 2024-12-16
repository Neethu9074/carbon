/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { List } from 'immutable';
import React from 'react';

import { TimeConfig } from '@instana/types';

import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import { SnapshotData } from 'in-stores/snapshot/snapshot';
import { number } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { t } from 'in-i18n';

interface DatasourceRow {
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
      getValue({ key }: DatasourceRow) {
        return key;
      }
    }
  },
  {
    title: t('in-forge:plugins.springbootAppContainer.datasources.active'),
    type: 'metric',
    typeArgs: {
      getSnapshotId({ snapshotId }: DatasourceRow) {
        return snapshotId;
      },
      getMetricName({ key }: DatasourceRow) {
        return `datasources.${key}.active`;
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
      getSnapshotId({ snapshotId }: DatasourceRow) {
        return snapshotId;
      },
      getMetricName({ key }: DatasourceRow) {
        return `datasources.${key}.idle`;
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
      getSnapshotId({ snapshotId }: DatasourceRow) {
        return snapshotId;
      },
      getMetricName({ key }: DatasourceRow) {
        return `datasources.${key}.min`;
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
      getSnapshotId({ snapshotId }: DatasourceRow) {
        return snapshotId;
      },
      getMetricName({ key }: DatasourceRow) {
        return `datasources.${key}.max`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function DatasourcesTable({ snapshot }: { snapshot: SnapshotData }) {
  const timeConfig = useTimeConfig();
  const datasourceNames = snapshot.getIn(['data', 'datasourceNames'], List());
  if (datasourceNames.size === 0) {
    return null;
  }
  const rows = datasourceNames.toArray().map((key: string) => {
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
      cardTitle={t('in-forge:plugins.springbootAppContainer.datasources.datasourcesWithCount', { len: rows.length })}
      rows={rows}
      cols={cols}
      getRowDetails={getRowDetails}
    />
  );
}

function getRowDetails({ key, snapshotId, timeConfig }: DatasourceRow) {
  return (
    <div>
      <Chart
        snapshotId={snapshotId}
        timeConfig={timeConfig}
        y1={{
          metrics: [`datasources.${key}.active`, `datasources.${key}.idle`],
          labels: [
            t('in-forge:plugins.springbootAppContainer.datasources.active'),
            t('in-forge:plugins.springbootAppContainer.datasources.idle')
          ],
          type: 'line',
          formatter: number.compact
        }}
      />
    </div>
  );
}
