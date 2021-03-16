/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { zeroDecimalPlaces } from 'in-services/formatters/number';
import { emptyList } from 'in-services/fixedImmutables';
import Table from 'in-sdk/components/dashboard/Table';
import { t } from 'in-i18n';

const cols = [
  {
    title: t('in-forge:plugins.pingDirectory.dashboard.dbName'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.key;
      }
    }
  },
  {
    title: t('in-forge:plugins.pingDirectory.dashboard.dbOpenRecords'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `recent_changes.data.${row.key}.database_open_record_count`;
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.pingDirectory.dashboard.addEntry'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `recent_changes.data.${row.key}.add_entry_count`;
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.pingDirectory.dashboard.addEntry'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `recent_changes.data.${row.key}.add_entry_count`;
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.pingDirectory.dashboard.modifyEntry'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `recent_changes.data.${row.key}.modify_entry_count`;
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.pingDirectory.dashboard.deleteEntry'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `recent_changes.data.${row.key}.delete_entry_count`;
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.pingDirectory.dashboard.renameEntry'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `recent_changes.data.${row.key}.rename_entry_count`;
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.pingDirectory.dashboard.changedEntry'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `recent_changes.data.${row.key}.changed_entry_count`;
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function RecentChangesTable({ snapshot, timeConfig }) {
  const databases = snapshot.getIn(['data', 'recent_changes.names'], emptyList);
  const rows = databases.toArray().map(database => {
    return {
      key: database,
      snapshotId: snapshot.get('id'),
      timeConfig
    };
  });
  if (!rows) {
    return null;
  }
  return (
    <Table
      withoutPadding
      cardTitle={t('in-forge:plugins.pingDirectory.dashboard.recentChangesPerDatabaseWithCount', {
        len: rows.length
      })}
      cols={cols}
      rows={rows}
      getRowDetails={getRowDetails}
    />
  );
}

function getRowDetails(row) {
  return (
    <div>
      <Chart
        snapshotId={row.snapshotId}
        timeConfig={row.timeConfig}
        y1={{
          metrics: [
            'recent_changes.data.' + row.key + '.database_open_record_count',
            'recent_changes.data.' + row.key + '.add_entry_count',
            'recent_changes.data.' + row.key + '.modify_entry_count',
            'recent_changes.data.' + row.key + '.delete_entry_count',
            'recent_changes.data.' + row.key + '.rename_entry_count',
            'recent_changes.data.' + row.key + '.changed_entry_count'
          ],
          labels: [
            t('in-forge:plugins.pingDirectory.dashboard.dbOpenRecords'),
            t('in-forge:plugins.pingDirectory.dashboard.addEntry'),
            t('in-forge:plugins.pingDirectory.dashboard.modifyEntry'),
            t('in-forge:plugins.pingDirectory.dashboard.deleteEntry'),
            t('in-forge:plugins.pingDirectory.dashboard.renameEntry'),
            t('in-forge:plugins.pingDirectory.dashboard.changedEntry')
          ],
          type: 'line'
        }}
        renderPostChartContent={PluginDashboardsMarkerLanes}
      />
    </div>
  );
}
