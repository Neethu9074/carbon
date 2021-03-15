/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { withSiPrefixThreeDecimalPlaces } from 'in-services/formatters/number';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { emptyList } from 'in-services/fixedImmutables';
import Table from 'in-sdk/components/dashboard/Table';
import { t } from 'in-i18n';

const cols = [
  {
    title: t('in-forge:plugins.redis.dashboard.channel'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.channelName;
      }
    }
  },
  {
    title: t('in-forge:plugins.redis.dashboard.subscriberCount'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return 'pubsub_subscribers.' + row.channelName;
      },
      getContent: withSiPrefixThreeDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function PubSubChannelsTable({ snapshot, timeConfig }) {
  const channels = snapshot.getIn(['data', 'channels'], emptyList);
  if (channels.size === 0) {
    return null;
  }

  const rows = channels.toArray().map(name => {
    return {
      key: name,
      timeConfig,
      channelName: name,
      snapshotId: snapshot.get('id')
    };
  });

  return (
    <Table
      withoutPadding
      cardTitle={t('in-forge:plugins.redis.dashboard.pubSubChannelsWithCount', {
        len: channels.size
      })}
      cols={cols}
      rows={rows}
      getRowDetails={getRowDetails}
    />
  );
}

function getRowDetails(row) {
  return (
    <Chart
      snapshotId={row.snapshotId}
      timeConfig={row.timeConfig}
      y1={{
        formatter: withSiPrefixThreeDecimalPlaces,
        metrics: ['pubsub_subscribers.' + row.channelName],
        labels: [t('in-forge:plugins.redis.dashboard.subscriberCount')],
        type: 'line'
      }}
      renderPostChartContent={PluginDashboardsMarkerLanes}
    />
  );
}
