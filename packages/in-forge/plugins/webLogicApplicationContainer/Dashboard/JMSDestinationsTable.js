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
    title: t('in-forge:plugins.webLogicAppContainer.titleName'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.key;
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
        return 'jmsDestinations.' + row.key + '.messagesCurrentCount';
      },
      getContent: zeroDecimalPlaces,
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
        return 'jmsDestinations.' + row.key + '.messagesPendingCount';
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.webLogicAppContainer.titleReceivedMessages'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return 'jmsDestinations.' + row.key + '.messagesReceivedCount';
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function JMSDestinationsTable({ snapshot, timeConfig }) {
  const jmsDestinationNames = snapshot.getIn(['data', 'jmsDestinationNames'], emptyList);
  if (jmsDestinationNames.size === 0) {
    return null;
  }

  const rows = jmsDestinationNames.toArray().map(key => {
    return {
      key,
      snapshotId: snapshot.get('id'),
      timeConfig
    };
  });

  return (
    <Table
      withoutPadding
      cardTitle={t('in-forge:plugins.webLogicAppContainer.titleJMSDestinationsCount', {
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
      <Chart
        snapshotId={row.snapshotId}
        timeConfig={row.timeConfig}
        y1={{
          formatter: zeroDecimalPlaces,
          metrics: [
            'jmsDestinations.' + row.key + '.messagesCurrentCount',
            'jmsDestinations.' + row.key + '.messagesPendingCount',
            'jmsDestinations.' + row.key + '.messagesReceivedCount'
          ],
          labels: [
            t('in-forge:plugins.webLogicAppContainer.titleCurrentMessages'),
            t('in-forge:plugins.webLogicAppContainer.titlePendingMessages'),
            t('in-forge:plugins.webLogicAppContainer.titleReceivedMessages')
          ],
          type: 'line'
        }}
        renderPostChartContent={PluginDashboardsMarkerLanes}
      />
    </div>
  );
}
