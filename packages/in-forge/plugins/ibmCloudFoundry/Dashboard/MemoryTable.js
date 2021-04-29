/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { Range } from 'immutable';
import React from 'react';

import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { bytes } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import { getRawPayload } from 'in-stores/snapshot';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

const cols = [
  {
    title: t('in-forge:plugins.ibmCloudFoundry.instanceID'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.name;
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmCloudFoundry.used'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `instances.${row.name}.app_memory_bytes_used`;
      },
      getContent: bytes.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmCloudFoundry.total'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `instances.${row.name}.app_memory_bytes_total`;
      },
      getContent: bytes.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default connectTo(
  props => {
    return {
      instanceCount: getRawPayload(props.snapshot.get('id'), 'instanceCount')
    };
  },
  function MemoryTable({ snapshot, timeConfig, instanceCount }) {
    if (!instanceCount || instanceCount < 1) {
      return null;
    }

    const rows = Range(1, instanceCount + 1)
      .toArray()
      .map(instanceNumber => {
        return {
          key: String(instanceNumber),
          name: String(instanceNumber),
          instanceNumber,
          timeConfig,
          snapshotId: snapshot.get('id')
        };
      });

    return (
      <Table
        withoutPadding
        cardTitle={t('in-forge:plugins.ibmCloudFoundry.titleMemory')}
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
        formatter: bytes.detailed,
        metrics: [
          'instances.' + row.name + '.app_memory_bytes_used',
          'instances.' + row.name + '.app_memory_bytes_total'
        ],
        labels: [t('in-forge:plugins.ibmCloudFoundry.used'), t('in-forge:plugins.ibmCloudFoundry.total')],
        type: 'line'
      }}
      renderPostChartContent={PluginDashboardsMarkerLanes}
    />
  );
}
