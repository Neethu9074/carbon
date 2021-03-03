/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { combineLatest } from '@instana/observables';
import { t } from 'in-i18n';
import React from 'react';

import { zeroDecimalPlaces, twoDecimalPlacesPerSecond } from 'in-services/formatters/number';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { getClusterMembers } from 'in-stores/clusterMembers';
import Table from 'in-sdk/components/dashboard/Table';
import { getSnapshot } from 'in-stores/snapshot';
import connectTo from 'in-hoc/connectTo';

const cols = [
  {
    title: t('in-forge:plugins.kafkaConnectConnector.name'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.taskName;
      }
    }
  },
  {
    title: t('in-forge:plugins.kafkaConnectConnector.status'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.status;
      }
    }
  },
  {
    title: t('in-forge:plugins.kafkaConnectConnector.runningRatio'),
    type: 'sparkChart',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName() {
        return 'runningRatio';
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.kafkaConnectConnector.pausedRatio'),
    type: 'sparkChart',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName() {
        return 'pauseRatio';
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default connectTo(
  props => {
    return {
      tasks: getClusterMembers(props.connectorId)
        // Always start with an empty set to avoid inconsistent view,
        // displaying running components for a previously selected snapshot.
        .flatMap(nodeIds => combineLatest(nodeIds.toArray().map(id => getSnapshot(id))))
        .throttle(1000)
    };
  },
  function TasksTable({ tasks, timeConfig, connectorType }) {
    if (tasks == null || tasks.length === 0) {
      return null;
    }

    const rows = tasks.map(task => {
      const taskName = task.getIn(['data', 'taskId']);
      const status = task.getIn(['data', 'status']);
      const id = task.get('id');
      return {
        key: id,
        snapshotId: id,
        snapshot: task,
        taskName: taskName,
        status: status,
        connectorType: connectorType,
        timeConfig
      };
    });

    return (
      <Table
        withoutPadding
        cardTitle={t('in-forge:plugins.kafkaConnectConnector.tasksWithCount', { len: rows.length })}
        cols={cols}
        rows={rows}
        getRowDetails={getDetails}
      />
    );
  }
);

function getDetails(row) {
  if (row.connectorType === 'sink') {
    return (
      <div>
        <Chart
          snapshotId={row.snapshotId}
          timeConfig={row.timeConfig}
          y1={{
            formatter: zeroDecimalPlaces,
            tooltipFormatter: zeroDecimalPlaces,
            metrics: [`partitionCount`],
            labels: [t('in-forge:plugins.kafkaConnectConnector.partitionCount')],
            type: 'line'
          }}
          y2={{
            formatter: twoDecimalPlacesPerSecond,
            tooltipFormatter: twoDecimalPlacesPerSecond,
            metrics: [`sinkRecordReadRate`, `sinkRecordSendRate`],
            labels: [
              t('in-forge:plugins.kafkaConnectConnector.recordReadRate'),
              t('in-forge:plugins.kafkaConnectConnector.recordSendRate')
            ],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </div>
    );
  }
  if (row.connectorType === 'source') {
    return (
      <div>
        <Chart
          snapshotId={row.snapshotId}
          timeConfig={row.timeConfig}
          y1={{
            formatter: twoDecimalPlacesPerSecond,
            tooltipFormatter: twoDecimalPlacesPerSecond,
            metrics: [`sourceRecordPollRate`, `sourceRecordWriteRate`],
            labels: [
              t('in-forge:plugins.kafkaConnectConnector.recordPollRate'),
              t('in-forge:plugins.kafkaConnectConnector.recordWriteRate')
            ],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </div>
    );
  }
}
