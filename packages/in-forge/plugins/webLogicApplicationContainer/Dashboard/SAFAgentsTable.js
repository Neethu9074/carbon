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
import { t } from 'in-i18n';

const cols = [
  {
    title: t('in-forge:plugins.webLogicAppContainer.titleName'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.key;
      }
    }
  },
  {
    title: t('in-forge:plugins.webLogicAppContainer.titlePausedForForwarding'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return yesOrNo(row.pausedForForwarding);
      }
    }
  },
  {
    title: t('in-forge:plugins.webLogicAppContainer.titlePausedForIncoming'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return yesOrNo(row.pausedForIncoming);
      }
    }
  },
  {
    title: t('in-forge:plugins.webLogicAppContainer.titlePausedForReceiving'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return yesOrNo(row.pausedForReceiving);
      }
    }
  },
  {
    title: t('in-forge:plugins.webLogicAppContainer.titleCurrentMessages'),
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
    title: t('in-forge:plugins.webLogicAppContainer.titlePendingMessages'),
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
    title: t('in-forge:plugins.webLogicAppContainer.titleRemotesEndpointsCurrent'),
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
      cardTitle={t('in-forge:plugins.webLogicAppContainer.titleSAFAgentsCount', {
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
      <DashboardSection title={t('in-forge:plugins.webLogicAppContainer.titleMessages')}>
        <Chart
          snapshotId={row.snapshotId}
          timeConfig={row.timeConfig}
          y1={{
            formatter: number.compact,
            metrics: [
              'safAgents.' + row.key + '.messagesCurrentCount',
              'safAgents.' + row.key + '.messagesPendingCount'
            ],
            labels: [
              t('in-forge:plugins.webLogicAppContainer.labelCurrent'),
              t('in-forge:plugins.webLogicAppContainer.labelPending')
            ],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.webLogicAppContainer.titleRemoteEndpoints')}>
        <Chart
          snapshotId={row.snapshotId}
          timeConfig={row.timeConfig}
          y1={{
            formatter: number.compact,
            metrics: ['safAgents.' + row.key + '.remoteEndpointsCurrentCount'],
            labels: [t('in-forge:plugins.webLogicAppContainer.labelCurrent')],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
    </div>
  );
}
