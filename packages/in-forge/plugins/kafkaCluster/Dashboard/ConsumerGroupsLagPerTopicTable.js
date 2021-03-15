/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { zeroDecimalPlaces } from 'in-services/formatters/number';
import { emptyList } from 'in-services/fixedImmutables';
import Table from 'in-sdk/components/dashboard/Table';
import { t } from 'in-i18n';

const cols = [
  {
    title: t('in-forge:plugins.kafkaCluster.consumerGroup'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.consumerGroup;
      }
    }
  },
  {
    title: t('in-forge:plugins.kafkaCluster.topic'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.topic;
      }
    }
  },
  {
    title: t('in-forge:plugins.kafkaCluster.messagesLag'),
    type: 'sparkChart',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `broker.lagData.data.${row.key}.lag`;
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function ConsumerGroupsLagPerTopicTable({ snapshot, timeConfig }) {
  let rows = snapshot.getIn(['data', 'broker.lagData.itemsNames'], emptyList);
  const snapshotId = snapshot.get('id');

  rows = rows.toArray().map(row => {
    let [consumerGroup, topic] = row.split('#');
    return {
      key: row,
      consumerGroup,
      topic,
      snapshotId,
      timeConfig
    };
  });

  return (
    <Table
      withoutPadding
      cardTitle={t('in-forge:plugins.kafkaCluster.consumerGroupsLagPerTopicWithCount', { len: rows.length })}
      cols={cols}
      rows={rows}
      getRowDetails={getDetails}
    />
  );
}

function getDetails(row) {
  return (
    <Chart
      snapshotId={row.snapshotId}
      timeConfig={row.timeConfig}
      y1={{
        formatter: zeroDecimalPlaces,
        tooltipFormatter: zeroDecimalPlaces,
        metrics: [`broker.lagData.data.${row.key}.lag`],
        labels: [t('in-forge:plugins.kafkaCluster.messagesLag')],
        type: 'line'
      }}
      renderPostChartContent={PluginDashboardsMarkerLanes}
    />
  );
}
