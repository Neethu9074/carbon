/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import { getRawPayloadWithTimestamp } from 'in-stores/snapshot';
import { kiloBytes } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import { formatSql } from 'in-forge/tracing/jdbc/sql';
import connectTo from 'in-hoc/connectTo';
import Code from 'in-components/Code';
import { t } from 'in-i18n';

let snapshotProps = {};
const cols = [
  {
    title: t('in-forge:plugins.db2Database.pkgHostId'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.key;
      }
    }
  },
  {
    title: t('in-forge:plugins.db2Database.numExcecutionPkg'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `pkgCache.${row.key}.numExcecutionPkg`;
      },
      getContent: kiloBytes.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.db2Database.reclaimWaitTimePkg'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `pkgCache.${row.key}.reclaimWaitTimePkg`;
      },
      getContent: kiloBytes.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.db2Database.avgExcecutionTimePkg'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `pkgCache.${row.key}.avgExcecutionTimePkg`;
      },
      getContent: kiloBytes.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

function PkgCacheTable({ data, keys }) {
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
      cardTitle={t('in-forge:plugins.db2Database.dashboard.pureScalePkgCacheTable')}
      cols={cols}
      rows={rows}
      getRowDetails={getDetails}
    />
  );
}

export default connectTo(props => {
  snapshotProps = props;
  return {
    data: getRawPayloadWithTimestamp(props.snapshotId, 'pkgCache_extracted'),
    keys: getRawPayloadWithTimestamp(props.snapshotId, 'pkgCacheId')
  };
}, PkgCacheTable);

function extractQuery(row) {
  return row.value ? formatSql(row.value) : t('in-forge:plugins.db2Database.errorMessage');
}

function getDetails(row) {
  return (
    <div>
      <Code code={extractQuery(row)} lang="sql" softWrap />
      <Chart
        snapshotId={row.snapshotId}
        timeConfig={row.timeConfig}
        y1={{
          min: 0,
          formatter: kiloBytes.detailed,
          metrics: [
            'pkgCache.' + row.key + '.numExcecutionPkg',
            'pkgCache.' + row.key + '.reclaimWaitTimePkg',
            'pkgCache.' + row.key + '.avgExcecutionTimePkg'
          ],
          labels: [
            t('in-forge:plugins.db2Database.numExcecutionPkg'),
            t('in-forge:plugins.db2Database.reclaimWaitTimePkg'),
            t('in-forge:plugins.db2Database.avgExcecutionTimePkg')
          ],
          type: 'line'
        }}
        renderPostChartContent={PluginDashboardsMarkerLanes}
      />
    </div>
  );
}
