import React from 'react';

import getIBMMQQueuesForQueueManager from 'in-subscription/iBMMQQueueManager/getIBMMQQueuesForQueueManager';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { zeroDecimalPlaces, seconds } from 'in-services/formatters/number';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import Table from 'in-sdk/components/dashboard/Table';
import { timeConfig$ } from 'in-stores/time/config';
import { getSnapshots } from 'in-stores/snapshot';
import connectTo from 'in-hoc/connectTo';

const cols = [
  {
    title: 'Name',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.snapshot.getIn(['data', 'queueName']);
      }
    }
  },
  {
    title: 'Type',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.snapshot.getIn(['data', 'queueType']);
      }
    }
  },
  {
    title: 'Created At',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.snapshot.getIn(['data', 'queueCreated']);
      }
    }
  },
  {
    title: 'Alternated At',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.snapshot.getIn(['data', 'queueAlternated']);
      }
    }
  },
  {
    title: 'Inhibit Put',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.snapshot.getIn(['data', 'inhibitPut']);
      }
    }
  },
  {
    title: 'Inhibit Get',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.snapshot.getIn(['data', 'inhibitGet']);
      }
    }
  },
  {
    title: 'Delivery Sequence',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.snapshot.getIn(['data', 'queueDelivery']);
      }
    }
  },
  {
    title: 'Default Binding',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.snapshot.getIn(['data', 'queueDefaultBinding']);
      }
    }
  },
  {
    title: 'Usage',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.snapshot.getIn(['data', 'queueUsage']);
      }
    }
  },
  {
    title: 'Monitoring',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.snapshot.getIn(['data', 'queueMonitoring']);
      }
    }
  }
];

export default connectTo(
  props => ({
    queues: timeConfig$
      .flatMap(timeConfig => getIBMMQQueuesForQueueManager({ snapshotId: props.snapshot.get('id'), timeConfig }))
      .flatMap(getSnapshots)
  }),
  function QueuesTable({ queues, timeConfig }) {
    if (queues == null || queues.length === 0) {
      return null;
    }

    const rows = queues.map(queue => {
      const id = queue.get('id');
      return {
        key: id,
        snapshotId: id,
        snapshot: queue,
        timeConfig
      };
    });

    return (
      <Table withoutPadding cardTitle={`Queues (${rows.length})`} cols={cols} rows={rows} getRowDetails={getDetails} />
    );
  }
);

function getDetails(row) {
  return (
    <div>
      <DashboardSection title="Depth">
        <Chart
          snapshotId={row.snapshotId}
          timeConfig={row.timeConfig}
          y1={{
            formatter: zeroDecimalPlaces,
            tooltipFormatter: zeroDecimalPlaces,
            metrics: [`maxQueueDepth`, `queueDepth`],
            labels: ['Max', 'Current'],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title="Messages">
        <Chart
          snapshotId={row.snapshotId}
          timeConfig={row.timeConfig}
          y1={{
            formatter: zeroDecimalPlaces,
            tooltipFormatter: zeroDecimalPlaces,
            metrics: [`messagesIn`, `messagesOut`, `uncommittedMessages`],
            labels: ['In', 'Out', 'Uncommiited'],
            type: 'line'
          }}
          y2={{
            formatter: zeroDecimalPlaces,
            tooltipFormatter: zeroDecimalPlaces,
            metrics: [`oldestMessage`, `onQueueMessageTime`],
            labels: ['Oldest', 'On Queue'],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title="Reset">
        <Chart
          snapshotId={row.snapshotId}
          timeConfig={row.timeConfig}
          y1={{
            formatter: seconds.fixedCompact,
            tooltipFormatter: seconds.fixedCompact,
            metrics: [`lastResetTime`],
            labels: ['Last'],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title="Calls">
        <Chart
          snapshotId={row.snapshotId}
          timeConfig={row.timeConfig}
          y1={{
            formatter: zeroDecimalPlaces,
            tooltipFormatter: zeroDecimalPlaces,
            metrics: [`openInputCount`, `openOutputCount`],
            labels: ['Open Input Count', 'Open Output Count'],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
    </div>
  );
}
