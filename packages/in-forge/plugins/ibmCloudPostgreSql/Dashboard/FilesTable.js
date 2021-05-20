/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { bytes } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import { getRawPayload } from 'in-stores/snapshot';
import connectTo from 'in-hoc/connectTo';
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
    title: t('in-forge:plugins.ibmCloudPostgreSql.walUsedBytes'),
    type: 'sparkChart',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `members.${row.name}.wal_used_bytes`;
      },
      getContent: bytes.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmCloudPostgreSql.tempBytesCount'),
    type: 'sparkChart',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `members.${row.name}.temp_bytes_count`;
      },
      getContent: bytes.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default connectTo(
  props => {
    return {
      member_ids: getRawPayload(props.snapshot.get('id'), 'member_ids')
    };
  },
  function FilesTable({ snapshot, timeConfig, member_ids }) {
    if (!member_ids || member_ids.isEmpty()) {
      return null;
    }

    const rows = member_ids.toArray().map(member => {
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
        cardTitle={t('in-forge:plugins.ibmCloudPostgreSql.files')}
        cols={cols}
        rows={rows}
        getRowDetails={getDetails}
        maxItemsPerPage={10}
      />
    );
  }
);

function getDetails(row) {
  return (
    <DashboardSection>
      <Chart
        snapshotId={row.snapshotId}
        timeConfig={row.timeConfig}
        y1={{
          min: 0,
          formatter: bytes.detailed,
          metrics: ['members.' + row.name + '.wal_used_bytes', 'members.' + row.name + '.temp_bytes_count'],
          labels: [
            t('in-forge:plugins.ibmCloudPostgreSql.walUsedBytes'),
            t('in-forge:plugins.ibmCloudPostgreSql.tempBytesCount')
          ],
          type: 'line'
        }}
        renderPostChartContent={PluginDashboardsMarkerLanes}
      />
    </DashboardSection>
  );
}
