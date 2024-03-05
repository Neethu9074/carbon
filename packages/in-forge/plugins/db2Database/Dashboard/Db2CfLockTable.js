/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import { getRawPayloadWithTimestamp } from 'in-stores/snapshot';
import { kiloBytes } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

let snapshotProps = {};
const cols = [
  {
    title: t('in-forge:plugins.db2Database.lockHostId'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.key;
      }
    }
  },
  {
    title: t('in-forge:plugins.db2Database.lockHostName'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.value;
      }
    }
  },
  {
    title: t('in-forge:plugins.db2Database.currentCfLockSize'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `db2cflock.${row.key}.currentCfLockSize`;
      },
      getContent: kiloBytes.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.db2Database.configuredCfLockSize'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `db2cflock.${row.key}.configuredCfLockSize`;
      },
      getContent: kiloBytes.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.db2Database.targetedCfLockSize'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `db2cflock.${row.key}.targetedCfLockSize`;
      },
      getContent: kiloBytes.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

function Db2CfLockTable({ data, keys }) {
  if (!data) {
    return null;
  }
  if (!keys) {
    return null;
  }

  const { snapshot, snapshotId, timeConfig } = snapshotProps;
  const statements = data.get('raw_payload', []);
  const rows = keys
    .get('raw_payload', [])
    .toArray()
    .map(key => {
      return {
        key: key,
        snapshotId,
        timeConfig,
        snapshot,
        value: statements.get(key)
      };
    });

  if (rows.length === 0) {
    return null;
  }

  return (
    <Table
      withoutPadding
      cardTitle={t('in-forge:plugins.db2Database.dashboard.purescaleLockTable')}
      cols={cols}
      rows={rows}
      getRowDetails={getDetails}
    />
  );
}

export default connectTo(props => {
  snapshotProps = props;
  return {
    data: getRawPayloadWithTimestamp(props.snapshotId, 'db2cflock_extracted'),
    keys: getRawPayloadWithTimestamp(props.snapshotId, 'db2CfLockId')
  };
}, Db2CfLockTable);

function getDetails(row) {
  return (
    <div>
      <Chart
        snapshotId={row.snapshotId}
        timeConfig={row.timeConfig}
        y1={{
          min: 0,
          formatter: kiloBytes.detailed,
          metrics: [
            'db2cflock.' + row.key + '.currentCfLockSize',
            'db2cflock.' + row.key + '.configuredCfLockSize',
            'db2cflock.' + row.key + '.targetedCfLockSize'
          ],
          labels: [
            t('in-forge:plugins.db2Database.currentCfLockSize'),
            t('in-forge:plugins.db2Database.configuredCfLockSize'),
            t('in-forge:plugins.db2Database.targetedCfLockSize')
          ],
          type: 'line'
        }}
        renderPostChartContent={PluginDashboardsMarkerLanes}
      />
    </div>
  );
}
