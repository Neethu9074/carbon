/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import { zeroDecimalPlaces, bytesZeroDecimalPlaces, bytesTwoDecimalPlaces } from 'in-services/formatters/number';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import Columize from 'in-sdk/components/dashboard/Columize';
import { emptyList } from 'in-services/fixedImmutables';
import { number } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';

const cols = [
  {
    title: t('in-forge:plugins.sparkStandalone.titleState'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.worker.get('state');
      }
    }
  },
  {
    title: t('in-forge:plugins.sparkStandalone.titleHost'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.worker.get('host');
      }
    }
  },
  {
    title: t('in-forge:plugins.sparkStandalone.titlePort'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.worker.get('port');
      },
      getContent: number.compact
    }
  },
  {
    title: t('in-forge:plugins.sparkStandalone.labelUsedCores'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return 'workers.metrics.' + row.key + '.cores';
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.sparkStandalone.labelTotalCores'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.worker.get('cores');
      },
      getContent: zeroDecimalPlaces
    }
  },
  {
    title: t('in-forge:plugins.sparkStandalone.labelUsedMemory'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return 'workers.metrics.' + row.key + '.memory';
      },
      getContent: bytesTwoDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.sparkStandalone.labelTotalMemory'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.worker.get('memory');
      },
      getContent: bytesTwoDecimalPlaces
    }
  }
];

export default function WorkersTable({ snapshot, timeConfig }) {
  const workers = snapshot.getIn(['data', 'workers.workerList'], emptyList);
  if (workers.size === 0) {
    return null;
  }

  const rows = workers
    .map(worker => {
      return {
        key: worker.get('id'),
        worker,
        timeConfig,
        snapshotId: snapshot.get('id')
      };
    })
    .toArray();

  return (
    <Table
      withoutPadding
      cardTitle={t('in-forge:plugins.sparkStandalone.titleWorkers')}
      cols={cols}
      rows={rows}
      getRowDetails={getDetails}
    />
  );
}

function getDetails(row) {
  const id = row.worker.get('id');
  return (
    <div>
      <Columize>
        <Chart
          snapshotId={row.snapshotId}
          timeConfig={row.timeConfig}
          y1={{
            formatter: bytesZeroDecimalPlaces,
            tooltipFormatter: bytesTwoDecimalPlaces,
            metrics: ['workers.metrics.' + id + '.memoryUsed', 'workers.metrics.' + id + '.memory'],
            labels: [
              t('in-forge:plugins.sparkStandalone.labelMemoryUsed'),
              t('in-forge:plugins.sparkStandalone.labelMemoryTotal')
            ],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
        <Chart
          snapshotId={row.snapshotId}
          timeConfig={row.timeConfig}
          y1={{
            formatter: zeroDecimalPlaces,
            metrics: ['workers.metrics.' + id + '.coresUsed', 'workers.metrics.' + id + '.cores'],
            labels: [
              t('in-forge:plugins.sparkStandalone.labelCoresUsed'),
              t('in-forge:plugins.sparkStandalone.labelCoresTotal')
            ],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </Columize>
    </div>
  );
}
