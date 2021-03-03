/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import { number, bytesTwoDecimalPlaces } from 'in-services/formatters/number';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import Columize from 'in-sdk/components/dashboard/Columize';
import { emptyMap } from 'in-services/fixedImmutables';
import Table from 'in-sdk/components/dashboard/Table';

const cols = [
  {
    title: t('in-forge:plugins.tibcoEMS.titleName'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.key;
      }
    }
  },
  {
    title: t('in-forge:plugins.tibcoEMS.titleSubscribers'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return 'topics.' + row.key + '.subscriberCount';
      },
      getContent: number.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.tibcoEMS.titleInMessages'),
    type: 'sparkChart',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return 'topics.' + row.key + '.inMessagesCount';
      },
      getContent: number.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.tibcoEMS.titleOutMessages'),
    type: 'sparkChart',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return 'topics.' + row.key + '.outMessagesCount';
      },
      getContent: number.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.tibcoEMS.labelInMessagesRate'),
    type: 'sparkChart',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return 'topics.' + row.key + '.inMessages';
      },
      getContent: number.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.tibcoEMS.labelOutMessagesRate'),
    type: 'sparkChart',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return 'topics.' + row.key + '.outMessages';
      },
      getContent: number.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function TopicsTable({ snapshot, timeConfig }) {
  const topicNames = snapshot.getIn(['data', 'topicNames'], emptyMap);
  if (topicNames.size === 0) {
    return null;
  }
  const rows = topicNames.toArray().map(key => {
    return {
      key,
      snapshotId: snapshot.get('id'),
      timeConfig
    };
  });

  return (
    <Table
      withoutPadding
      cardTitle={t('in-forge:plugins.tibcoEMS.titleTopicsCount', { count: rows.length })}
      cols={cols}
      rows={rows}
      getRowDetails={getRowDetails}
    />
  );
}

function getRowDetails(row) {
  const snapshotId = row.snapshotId;
  const timeConfig = row.timeConfig;

  return (
    <div>
      <Columize>
        <DashboardSection title={t('in-forge:plugins.tibcoEMS.titlePendingMessages')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: number.detailed,
              metrics: ['topics.' + row.key + '.pendingMessagesCount'],
              labels: [t('in-forge:plugins.tibcoEMS.labelCount')],
              type: 'line'
            }}
            y2={{
              formatter: bytesTwoDecimalPlaces,
              metrics: ['topics.' + row.key + '.pendingMessagesSize'],
              labels: [t('in-forge:plugins.tibcoEMS.labelSize')],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.tibcoEMS.titleSubscribers')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: number.detailed,
              metrics: ['topics.' + row.key + '.subscriberCount'],
              labels: [t('in-forge:plugins.tibcoEMS.labelCount')],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>

      <DashboardSection title={t('in-forge:plugins.tibcoEMS.titleMessages')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            formatter: number.detailed,
            metrics: ['topics.' + row.key + '.inMessagesCount', 'topics.' + row.key + '.outMessagesCount'],
            labels: [
              t('in-forge:plugins.tibcoEMS.labelInMessagesCount'),
              t('in-forge:plugins.tibcoEMS.labelOutMessagesCount')
            ],
            type: 'line'
          }}
          y2={{
            formatter: number.detailed,
            metrics: ['topics.' + row.key + '.inMessages', 'topics.' + row.key + '.outMessages'],
            labels: [
              t('in-forge:plugins.tibcoEMS.labelInMessagesRate'),
              t('in-forge:plugins.tibcoEMS.labelOutMessagesRate')
            ],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
    </div>
  );
}
