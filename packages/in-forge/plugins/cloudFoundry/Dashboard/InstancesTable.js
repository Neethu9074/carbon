/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { percentageTwoDecimalPlaces, bytesZeroDecimalPlaces } from 'in-services/formatters/number';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import Columize from 'in-sdk/components/dashboard/Columize';
import { number } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';

const cols = [
  {
    title: 'Name',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.data.get('instances_data.' + row.key + '.name');
      }
    }
  },
  {
    title: 'State',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.data.get('instances_data.' + row.key + '.state');
      }
    }
  },
  {
    title: 'Host',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.data.get('instances_data.' + row.key + '.host');
      }
    }
  },
  {
    title: 'Port',
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.data.get('instances_data.' + row.key + '.port');
      },
      getContent: number.compact
    }
  }
];

export default function InstancesTable({ snapshot, timeConfig, instances }) {
  const rows = instances.map(instance => {
    return {
      key: instance,
      snapshotId: snapshot.get('id'),
      data: snapshot.get('data'),
      timeConfig
    };
  });

  return (
    <Table
      withoutPadding
      cardTitle={`Instances (${rows.length})`}
      cols={cols}
      rows={rows}
      getRowDetails={getRowDetails}
    />
  );
}

function getRowDetails(row) {
  return (
    <Columize>
      <DashboardSection title="CPU">
        <Chart
          snapshotId={row.snapshotId}
          timeConfig={row.timeConfig}
          y1={{
            formatter: percentageTwoDecimalPlaces,
            tooltipFormatter: percentageTwoDecimalPlaces,
            metrics: ['instances_metrics.' + row.key + '.cpu'],
            labels: ['CPU'],
            type: 'stackedArea'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title="Memory">
        <Chart
          snapshotId={row.snapshotId}
          timeConfig={row.timeConfig}
          y1={{
            formatter: bytesZeroDecimalPlaces,
            tooltipFormatter: bytesZeroDecimalPlaces,
            metrics: ['instances_metrics.' + row.key + '.disk', 'instances_metrics.' + row.key + '.memory'],
            labels: ['Disk', 'Memory'],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
    </Columize>
  );
}
