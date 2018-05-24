import React from 'react';

import { percentageTwoDecimalPlaces, bytesZeroDecimalPlaces } from 'in-services/formatters/number';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Columize from 'in-sdk/components/dashboard/Columize';
import Chart from 'in-components/Chart';
import Table from 'in-sdk/components/dashboard/Table';
import { number } from 'in-services/formatters/number';

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
    <DashboardSection title={`Instances (${rows.length})`}>
      <Table cols={cols} rows={rows} getRowDetails={getRowDetails} />
    </DashboardSection>
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
        />
      </DashboardSection>
    </Columize>
  );
}
