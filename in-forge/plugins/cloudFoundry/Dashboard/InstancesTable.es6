import React from 'react';

import { percentageTwoDecimalPlaces, bytesZeroDecimalPlaces } from 'in-services/formatters/number';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import TwoColumnRow from 'in-sdk/components/dashboard/TwoColumnRow';
import ChartWithLegend from 'in-components/ChartWithLegend';
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
    title: 'Post',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.data.get('instances_data.' + row.key + '.post');
      }
    }
  }
];

export default function InstancesTable({ snapshot, timeframe, instances }) {
  const rows = instances.map(instance => {
    return {
      key: instance,
      snapshotId: snapshot.get('id'),
      data: snapshot.get('data'),
      timeframe
    };
  });

  return (
    <DashboardSection title={`Instances (${rows.length})`}>
      <Table cols={cols} rows={rows} getRowDetails={getRowDetails} />
    </DashboardSection>
  );
}

function getRowDetails(row) {
  return (
    <TwoColumnRow>
      <DashboardSection title="CPU">
        <ChartWithLegend
          snapshotId={row.snapshotId}
          timeframe={row.timeframe}
          margins={{
            left: 60
          }}
          y1={{
            formatter: percentageTwoDecimalPlaces,
            tooltipFormatter: percentageTwoDecimalPlaces,
            metrics: ['instances_metrics.' + row.key + '.cpu'],
            labels: ['CPU'],
            type: 'stackedArea'
          }}
        />
      </DashboardSection>
      <DashboardSection title="Memory">
        <ChartWithLegend
          snapshotId={row.snapshotId}
          timeframe={row.timeframe}
          margins={{
            left: 60
          }}
          y1={{
            formatter: bytesZeroDecimalPlaces,
            tooltipFormatter: bytesZeroDecimalPlaces,
            metrics: ['instances_metrics.' + row.key + '.disk', 'instances_metrics.' + row.key + '.memory'],
            labels: ['Disk', 'Memory'],
            type: 'line'
          }}
        />
      </DashboardSection>
    </TwoColumnRow>
  );
}
