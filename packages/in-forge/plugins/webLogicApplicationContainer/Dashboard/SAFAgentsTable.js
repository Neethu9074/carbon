/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { yesOrNo } from 'in-services/formatters/boolean';
import { emptyList } from 'in-services/fixedImmutables';
import { number } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';

const cols = [
  {
    title: 'Name',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.key;
      }
    }
  },
  {
    title: 'Paused For Forwarding',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return yesOrNo(row.pausedForForwarding);
      }
    }
  },
  {
    title: 'Paused For Incoming',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return yesOrNo(row.pausedForIncoming);
      }
    }
  },
  {
    title: 'Paused For Receiving',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return yesOrNo(row.pausedForReceiving);
      }
    }
  },
  {
    title: 'Current Messages',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return 'safAgents.' + row.key + '.messagesCurrentCount';
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Pending Messages',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return 'safAgents.' + row.key + '.messagesPendingCount';
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Remotes Endpoints Current',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return 'safAgents.' + row.key + '.remoteEndpointsCurrentCount';
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function SafAgentsTable({ snapshot, timeConfig }) {
  const data = snapshot.get('data');
  const safAgentNames = data.get('safAgentNames', emptyList);
  if (safAgentNames.size === 0) {
    return null;
  }
  const rows = safAgentNames.toArray().map(key => {
    return {
      key,
      snapshotId: snapshot.get('id'),
      pausedForForwarding: data.get('safAgents.' + key + '.pausedForForwarding'),
      pausedForIncoming: data.get('safAgents.' + key + '.pausedForIncoming'),
      pausedForReceiving: data.get('safAgents.' + key + '.pausedForReceiving'),
      timeConfig
    };
  });

  return (
    <Table
      withoutPadding
      cardTitle={`SAF Agents (${rows.length})`}
      cols={cols}
      rows={rows}
      getRowDetails={getRowDetails}
    />
  );
}

function getRowDetails(row) {
  return (
    <div>
      <DashboardSection title="Messages">
        <Chart
          snapshotId={row.snapshotId}
          timeConfig={row.timeConfig}
          y1={{
            formatter: number.compact,
            metrics: [
              'safAgents.' + row.key + '.messagesCurrentCount',
              'safAgents.' + row.key + '.messagesPendingCount'
            ],
            labels: ['Current', 'Pending'],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title="Remote Endpoints">
        <Chart
          snapshotId={row.snapshotId}
          timeConfig={row.timeConfig}
          y1={{
            formatter: number.compact,
            metrics: ['safAgents.' + row.key + '.remoteEndpointsCurrentCount'],
            labels: ['Current'],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
    </div>
  );
}
