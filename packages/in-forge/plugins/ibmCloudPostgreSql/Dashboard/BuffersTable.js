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
    title: t('in-forge:plugins.ibmCloudPostgreSql.buffersBackendRate'),
    type: 'sparkChart',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `members.${row.name}.buffers_backend_rate`;
      },
      getContent: number.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmCloudPostgreSql.buffersCheckpointRate'),
    type: 'sparkChart',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `members.${row.name}.buffers_checkpoint_rate`;
      },
      getContent: number.detailed,
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
  function BuffersTable({ snapshot, timeConfig, member_ids }) {
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
        cardTitle={t('in-forge:plugins.ibmCloudPostgreSql.buffers')}
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
    <Columize>
      <DashboardSection title={t('in-forge:plugins.ibmCloudPostgreSql.rate')}>
        <Chart
          snapshotId={row.snapshotId}
          timeConfig={row.timeConfig}
          y1={{
            min: 0,
            formatter: number,
            metrics: [
              'members.' + row.name + '.buffers_backend_rate',
              'members.' + row.name + '.buffers_checkpoint_rate'
            ],
            labels: [
              t('in-forge:plugins.ibmCloudPostgreSql.backend'),
              t('in-forge:plugins.ibmCloudPostgreSql.checkpoint')
            ],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
    </Columize>
  );
}
