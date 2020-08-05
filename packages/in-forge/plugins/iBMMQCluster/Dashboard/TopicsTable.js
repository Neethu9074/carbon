import React from 'react';

import getIBMMQTopicsForCluster from 'in-subscription/iBMMQCluster/getIBMMQTopicsForCluster';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { zeroDecimalPlaces } from 'in-services/formatters/number';
import Columize from 'in-sdk/components/dashboard/Columize';
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
        return row.topicName;
      }
    }
  },
  {
    title: 'Queue Manager',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.qmName;
      }
    }
  },
  {
    title: 'Cluster',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.clusterName;
      }
    }
  },
  {
    title: 'Type',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.topicType;
      }
    }
  },
  {
    title: 'Alternated at',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.topicAlternatedAt;
      }
    }
  },
  {
    title: 'Messages Count',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.key;
      },
      getMetricName() {
        return 'messagesCount';
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Publish Count',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.key;
      },
      getMetricName() {
        return 'publishCount';
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Subscription Count',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.key;
      },
      getMetricName() {
        return 'subscriptionCount';
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default connectTo(
  props => ({
    topics: timeConfig$
      .flatMap(timeConfig => getIBMMQTopicsForCluster({ snapshotId: props.snapshot.get('id'), timeConfig }))
      .flatMap(getSnapshots)
  }),

  function TopicsTable({ topics, timeConfig }) {
    if (topics == null || topics.length === 0) {
      return null;
    }

    const rows = topics.map(topic => {
      return {
        key: topic.get('id'),
        topicName: topic.getIn(['data', 'topicName']),
        qmName: topic.getIn(['data', 'qmName']),
        clusterName: topic.getIn(['data', 'clusterName']),
        topicType: topic.getIn(['data', 'topicType']),
        topicAlternatedAt: topic.getIn(['data', 'topicAlternatedAt']),
        topic,
        timeConfig
      };
    });

    return (
      <Table withoutPadding cardTitle={`Topics (${rows.length})`} cols={cols} rows={rows} getRowDetails={getDetails} />
    );
  }
);

function getDetails(row) {
  return (
    <div>
      <Chart
        snapshotId={row.key}
        timeConfig={row.timeConfig}
        y1={{
          formatter: zeroDecimalPlaces,
          tooltipFormatter: zeroDecimalPlaces,
          metrics: [`messagesCount`],
          labels: ['Messages Count'],
          type: 'line'
        }}
        renderPostChartContent={PluginDashboardsMarkerLanes}
      />

      <Columize>
        <div>
          <Chart
            snapshotId={row.key}
            timeConfig={row.timeConfig}
            y1={{
              formatter: zeroDecimalPlaces,
              tooltipFormatter: zeroDecimalPlaces,
              metrics: [`publishCount`],
              labels: ['Publish Count'],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </div>
        <div>
          <Chart
            snapshotId={row.key}
            timeConfig={row.timeConfig}
            y1={{
              formatter: zeroDecimalPlaces,
              tooltipFormatter: zeroDecimalPlaces,
              metrics: [`subscriptionCount`],
              labels: ['Subscription Count'],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </div>
      </Columize>
    </div>
  );
}
