/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import Columize from 'in-sdk/components/dashboard/Columize';
import { number } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import { t } from 'in-i18n';

const cols = [
  {
    title: t('in-forge:plugins.ibmCloudPostgreSql.titleMemberID'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.name;
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmCloudPostgreSql.tuplesInsertedRate'),
    type: 'sparkChart',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `members.${row.name}.tuples_inserted_rate`;
      },
      getContent: number.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmCloudPostgreSql.tuplesDeletedRate'),
    type: 'sparkChart',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `members.${row.name}.tuples_deleted_rate`;
      },
      getContent: number.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmCloudPostgreSql.tuplesFetchedRate'),
    type: 'sparkChart',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `members.${row.name}.tuples_fetched_rate`;
      },
      getContent: number.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmCloudPostgreSql.tuplesReturnedRate'),
    type: 'sparkChart',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `members.${row.name}.tuples_returned_rate`;
      },
      getContent: number.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function TuplesTable({ snapshot, timeConfig, memberIds }) {
  if (!memberIds || memberIds.isEmpty()) {
    return null;
  }

  const rows = memberIds.toArray().map(member => {
    return {
      key: member,
      name: member,
      snapshotId: snapshot.get('id'),
      timeConfig
    };
  });

  if (rows.length === 0) {
    return null;
  }

  return (
    <Table
      withoutPadding
      cardTitle={t('in-forge:plugins.ibmCloudPostgreSql.tuples')}
      cols={cols}
      rows={rows}
      getRowDetails={getDetails}
      maxItemsPerPage={10}
    />
  );
}

function getDetails(row) {
  return (
    <Columize>
      <DashboardSection title={t('in-forge:plugins.ibmCloudPostgreSql.count')}>
        <Chart
          snapshotId={row.snapshotId}
          timeConfig={row.timeConfig}
          y1={{
            min: 0,
            formatter: number,
            metrics: [
              'members.' + row.name + '.tuples_inserted_count',
              'members.' + row.name + '.tuples_deleted_count',
              'members.' + row.name + '.tuples_fetched_count'
            ],
            labels: [
              t('in-forge:plugins.ibmCloudPostgreSql.inserted'),
              t('in-forge:plugins.ibmCloudPostgreSql.deleted'),
              t('in-forge:plugins.ibmCloudPostgreSql.fetched')
            ],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.ibmCloudPostgreSql.rate')}>
        <Chart
          snapshotId={row.snapshotId}
          timeConfig={row.timeConfig}
          y1={{
            min: 0,
            formatter: number,
            metrics: [
              'members.' + row.name + '.tuples_inserted_rate',
              'members.' + row.name + '.tuples_deleted_rate',
              'members.' + row.name + '.tuples_fetched_rate',
              'members.' + row.name + '.tuples_returned_rate'
            ],
            labels: [
              t('in-forge:plugins.ibmCloudPostgreSql.inserted'),
              t('in-forge:plugins.ibmCloudPostgreSql.deleted'),
              t('in-forge:plugins.ibmCloudPostgreSql.fetched'),
              t('in-forge:plugins.ibmCloudPostgreSql.returned')
            ],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
    </Columize>
  );
}
