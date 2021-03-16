/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { emptyMap } from 'in-services/fixedImmutables';
import { number } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import { t } from 'in-i18n';

const cols = [
  {
    title: t('in-forge:plugins.tomcatAppContainer.titleName'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.datasource.get('name');
      }
    }
  },
  {
    title: t('in-forge:plugins.tomcatAppContainer.titleContext'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.datasource.get('context');
      }
    }
  },
  {
    title: t('in-forge:plugins.tomcatAppContainer.titleURL'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.datasource.get('url');
      }
    }
  },
  {
    title: t('in-forge:plugins.tomcatAppContainer.titleActive'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `datasources.${row.key}.active`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.tomcatAppContainer.titleMax'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.datasource.get('max');
      },
      getContent(value) {
        return value == null || value === -1 ? 'unlimited' : number.compact(value);
      }
    }
  }
];

export default function DataSourcesTable({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  const rows = snapshot
    .getIn(['data', 'datasource-config'], emptyMap)
    .map((datasource, id) => {
      return {
        key: id,
        datasource,
        timeConfig,
        snapshotId
      };
    })
    .valueSeq()
    .toArray();

  if (rows.length === 0) {
    return null;
  }

  return (
    <Table
      withoutPadding
      cardTitle={t('in-forge:plugins.tomcatAppContainer.titleDataSourcesCount', { len: rows.length })}
      cols={cols}
      rows={rows}
      getRowDetails={getRowDetails}
    />
  );
}

function getRowDetails(row) {
  return (
    <Chart
      snapshotId={row.snapshotId}
      timeConfig={row.timeConfig}
      y1={{
        metrics: ['datasources.' + row.key + '.active'],
        labels: [t('in-forge:plugins.tomcatAppContainer.labelActiveConnections')],
        type: 'line'
      }}
      renderPostChartContent={PluginDashboardsMarkerLanes}
    />
  );
}
