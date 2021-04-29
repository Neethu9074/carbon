/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import Table from 'in-sdk/components/dashboard/Table';
import { bytes } from 'in-services/formatters/number';
import { getRawPayload } from 'in-stores/snapshot';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

const cols = [
  {
    title: t('in-forge:plugins.ibmCloudEventStream.topic'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.topicName;
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmCloudEventStream.topicBytesIn'),
    type: 'sparkChart',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `topics.${row.topicName}.instance_topic_bytes_in_per_second`;
      },
      getContent: bytes.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmCloudEventStream.topicBytesOut'),
    type: 'sparkChart',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `topics.${row.topicName}.instance_topic_bytes_out_per_second`;
      },
      getContent: bytes.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default connectTo(
  props => {
    return {
      topics: getRawPayload(props.snapshot.get('id'), 'topicNames')
    };
  },
  function TopicsTable({ snapshot, timeConfig, topics }) {
    if (!topics || topics.isEmpty()) {
      return null;
    }

    const rows = topics.toArray().map(topicName => {
      return {
        key: topicName,
        topicName,
        snapshotId: snapshot.get('id'),
        timeConfig
      };
    });
    if (rows.length === 0) {
      return null;
    }
    return (
      <Table
        withoutPadding
        cardTitle={t('in-forge:plugins.ibmCloudEventStream.topicBytes')}
        cols={cols}
        rows={rows}
        getRowDetails={getDetails}
        maxItemsPerPage={10}
      />
    );
  }
);

function getDetails(row) {
  return (
    <Chart
      snapshotId={row.snapshotId}
      timeConfig={row.timeConfig}
      y1={{
        min: 0,
        formatter: bytes.compact,
        metrics: [
          'topics.' + row.topicName + '.instance_topic_bytes_in_per_second',
          'topics.' + row.topicName + '.instance_topic_bytes_out_per_second'
        ],
        labels: [t('in-forge:plugins.ibmCloudEventStream.in'), t('in-forge:plugins.ibmCloudEventStream.out')],
        type: 'line'
      }}
      renderPostChartContent={PluginDashboardsMarkerLanes}
    />
  );
}
