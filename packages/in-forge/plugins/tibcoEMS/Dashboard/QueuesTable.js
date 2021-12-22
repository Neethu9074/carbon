/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import { number, bytesTwoDecimalPlaces } from 'in-services/formatters/number';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { getRawPayloadWithTimestamp } from 'in-stores/snapshot';
import Columize from 'in-sdk/components/dashboard/Columize';
import Table from 'in-sdk/components/dashboard/Table';
import { just } from '@instana/observables';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

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
    title: t('in-forge:plugins.tibcoEMS.titleReceivers'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return 'queues.' + row.key + '.receiverCount';
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
        return 'queues.' + row.key + '.inMessagesCount';
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
        return 'queues.' + row.key + '.outMessagesCount';
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
        return 'queues.' + row.key + '.inMessages';
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
        return 'queues.' + row.key + '.outMessages';
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
      data: getRawPayloadWithTimestamp(props.snapshot.get('id'), 'queueNames'),
      snapshot: just(props.snapshot),
      timeConfig: just(props.timeConfig)
    };
  },
  function QueuesTable({ data, snapshot, timeConfig }) {
    if (!data || !data.get('raw_payload')) {
      return null;
    }

    const queueNames = data.get('raw_payload');
    if (queueNames.size === 0) {
      return null;
    }

    const rows = queueNames.toArray().map(key => {
      return {
        key,
        snapshotId: snapshot.get('id'),
        timeConfig
      };
    });

    return (
      <Table
        withoutPadding
        cardTitle={t('in-forge:plugins.tibcoEMS.titleQueuesCount', { len: rows.length })}
        cols={cols}
        rows={rows}
        getRowDetails={getRowDetails}
      />
    );
  }
);

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
              metrics: ['queues.' + row.key + '.pendingMessagesCount'],
              labels: [t('in-forge:plugins.tibcoEMS.labelCount')],
              type: 'line'
            }}
            y2={{
              formatter: bytesTwoDecimalPlaces,
              metrics: ['queues.' + row.key + '.pendingMessagesSize'],
              labels: [t('in-forge:plugins.tibcoEMS.labelSize')],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.tibcoEMS.titleReceivers')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: number.detailed,
              metrics: ['queues.' + row.key + '.receiverCount'],
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
            metrics: ['queues.' + row.key + '.inMessagesCount', 'queues.' + row.key + '.outMessagesCount'],
            labels: [
              t('in-forge:plugins.tibcoEMS.labelInMessagesCount'),
              t('in-forge:plugins.tibcoEMS.labelOutMessagesCount')
            ],
            type: 'line'
          }}
          y2={{
            formatter: number.detailed,
            metrics: ['queues.' + row.key + '.inMessages', 'queues.' + row.key + '.outMessages'],
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
