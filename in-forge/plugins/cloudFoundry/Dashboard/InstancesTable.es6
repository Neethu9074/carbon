import React from 'react';

import { percentageTwoDecimalPlaces, bytesZeroDecimalPlaces } from 'in-services/formatters/number';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import ExpandableTable from 'in-components/ExpandableTable';
import ChartWithLegend from 'in-components/ChartWithLegend';
import TwoColumnRow from 'in-sdk/components/dashboard/TwoColumnRow';

export default function InstancesTable({ snapshot, timeframe, instances }) {
  return (
    <DashboardSection title="Instances">
      <ExpandableTable
        data={instances}
        getKey={getKey}
        createHeader={createHeader}
        createRow={createRow}
        context={{
          snapshot,
          timeframe
        }}
        createDetails={createDetails}
      />
    </DashboardSection>
  );
}

function getKey(instanceId) {
  return instanceId;
}

function createHeader() {
  return (
    <thead>
      <tr>
        <th>Name</th>
        <th>State</th>
        <th>Host</th>
        <th>Port</th>
      </tr>
    </thead>
  );
}

function createRow(instanceId, i, context) {
  const data = context.snapshot.get('data');
  return [
    <td>{data.get('instances_data.' + instanceId + '.name')}</td>,
    <td>{data.get('instances_data.' + instanceId + '.state')}</td>,
    <td>{data.get('instances_data.' + instanceId + '.host')}</td>,
    <td>{data.get('instances_data.' + instanceId + '.port')}</td>
  ];
}

function createDetails(instanceId, i, context) {
  const snapshotId = context.snapshot.get('id');
  return (
    <TwoColumnRow>
      <DashboardSection title="CPU">
        <ChartWithLegend
          snapshotId={snapshotId}
          timeframe={context.timeframe}
          margins={{
            left: 60
          }}
          y1={{
            formatter: percentageTwoDecimalPlaces,
            tooltipFormatter: percentageTwoDecimalPlaces,
            metrics: ['instances_metrics.' + instanceId + '.cpu'],
            labels: ['CPU'],
            type: 'stackedArea'
          }}
        />
      </DashboardSection>
      <DashboardSection title="Memory">
        <ChartWithLegend
          snapshotId={snapshotId}
          timeframe={context.timeframe}
          margins={{
            left: 60
          }}
          y1={{
            formatter: bytesZeroDecimalPlaces,
            tooltipFormatter: bytesZeroDecimalPlaces,
            metrics: ['instances_metrics.' + instanceId + '.disk', 'instances_metrics.' + instanceId + '.memory'],
            labels: ['Disk', 'Memory'],
            type: 'line'
          }}
        />
      </DashboardSection>
    </TwoColumnRow>
  );
}
