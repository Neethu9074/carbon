import React from 'react';

import getIBMMQChannelsForQueueManager from 'in-subscription/iBMMQQueueManager/getIBMMQChannelsForQueueManager';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { zeroDecimalPlaces } from 'in-services/formatters/number';
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
        return row.snapshot.getIn(['data', 'channelName']);
      }
    }
  },
  {
    title: 'Status',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.snapshot.getIn(['data', 'channelStatus']);
      }
    }
  },
  {
    title: 'In Doubt',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.snapshot.getIn(['data', 'channelInDoubt']);
      }
    }
  },
  {
    title: 'Substate',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.snapshot.getIn(['data', 'channelSubStatus']);
      }
    }
  },
  {
    title: 'Connection Name',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.snapshot.getIn(['data', 'connectionName']);
      }
    }
  },
  {
    title: 'Remote Queue Manager',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.snapshot.getIn(['data', 'remoteQM']);
      }
    }
  },
  {
    title: 'Last Message Date/Time',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.snapshot.getIn(['data', 'lastMessage']);
      }
    }
  },
  {
    title: 'Start Date/Time',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.snapshot.getIn(['data', 'startDateTime']);
      }
    }
  }
];

export default connectTo(
  props => ({
    channels: timeConfig$
      .flatMap(timeConfig => getIBMMQChannelsForQueueManager({ snapshotId: props.snapshot.get('id'), timeConfig }))
      .flatMap(getSnapshots)
  }),
  function QueuesUsageTable({ channels, timeConfig }) {
    if (channels == null || channels.length === 0) {
      return null;
    }

    const rows = channels.map(channel => {
      const id = channel.get('id');
      return {
        key: id,
        snapshotId: id,
        snapshot: channel,
        timeConfig
      };
    });

    return (
      <Table
        withoutPadding
        cardTitle={`Channels (${rows.length})`}
        cols={cols}
        rows={rows}
        getRowDetails={getDetails}
      />
    );
  }
);

function getDetails(row) {
  return (
    <div>
      <DashboardSection title="Messages">
        <Chart
          snapshotId={row.snapshotId}
          timeConfig={row.timeConfig}
          y1={{
            formatter: zeroDecimalPlaces,
            tooltipFormatter: zeroDecimalPlaces,
            metrics: [`messagesSent`, `messagesAvailable`],
            labels: ['Sent/Received', 'Available'],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title="Sequence Number">
        <Chart
          snapshotId={row.snapshotId}
          timeConfig={row.timeConfig}
          y1={{
            formatter: zeroDecimalPlaces,
            tooltipFormatter: zeroDecimalPlaces,
            metrics: [`sequenceNumberCurrent`, `sequenceNumberLast`],
            labels: ['Current', 'Last'],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title="Buffers">
        <Chart
          snapshotId={row.snapshotId}
          timeConfig={row.timeConfig}
          y1={{
            formatter: zeroDecimalPlaces,
            tooltipFormatter: zeroDecimalPlaces,
            metrics: [`buffersSent`, `buffersReceived`],
            labels: ['Sent', 'Received'],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
    </div>
  );
}
