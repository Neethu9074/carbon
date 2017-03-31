import React from 'react';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import ExpandableTable from 'in-components/ExpandableTable';
import ChartWithLegend from 'in-components/ChartWithLegend';
import Mtd from 'in-components/Mtd';

import { zeroDecimalPlaces } from 'in-services/formatters/number';

export default function CloudControllerTable({ snapshot, timeframe }) {
  const ccComponents = [''];

  return (
    <DashboardSection title="Cloud Controller">
      <ExpandableTable
        data={ccComponents}
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

function getKey(componentId) {
  return componentId;
}

function createHeader() {
  return (
    <thead>
      <tr>
        <th>Requests completed</th>
        <th>Requests outstanding</th>
        <th>Total users</th>
        <th>Thread count</th>
        <th>Total failed jobs</th>
      </tr>
    </thead>
  );
}

function createRow(componentId, i, context) {
  return [
    <Mtd metric={'cloud_controller.cc_requests_completed'} snapshot={context.snapshot} formatter={zeroDecimalPlaces} />,
    <Mtd
      metric={'cloud_controller.cc_requests_outstanding'}
      snapshot={context.snapshot}
      formatter={zeroDecimalPlaces}
    />,
    <Mtd metric={'cloud_controller.cc_total_users'} snapshot={context.snapshot} formatter={zeroDecimalPlaces} />,
    <Mtd metric={'cloud_controller.cc_thread_count'} snapshot={context.snapshot} formatter={zeroDecimalPlaces} />,
    <Mtd
      metric={'cloud_controller.cc_total_failed_job_count'}
      snapshot={context.snapshot}
      formatter={zeroDecimalPlaces}
    />
  ];
}

function createDetails(componentId, i, context) {
  const snapshotId = context.snapshot.get('id');

  return (
    <div>
      <DashboardSection title="Requests">
        <ChartWithLegend
          snapshotId={snapshotId}
          timeframe={context.timeframe}
          margins={{
            left: 60
          }}
          y1={{
            formatter: zeroDecimalPlaces,
            tooltipFormatter: zeroDecimalPlaces,
            metrics: ['cloud_controller.cc_requests_completed', 'cloud_controller.cc_requests_outstanding'],
            labels: ['Requests completed', 'Requests outstanding'],
            type: 'line'
          }}
        />
      </DashboardSection>
      <DashboardSection title="Statistics">
        <ChartWithLegend
          snapshotId={snapshotId}
          timeframe={context.timeframe}
          margins={{
            left: 60
          }}
          y1={{
            formatter: zeroDecimalPlaces,
            tooltipFormatter: zeroDecimalPlaces,
            metrics: [
              'cloud_controller.cc_total_users',
              'cloud_controller.cc_thread_count',
              'cloud_controller.cc_total_failed_job_count'
            ],
            labels: ['Total users', 'Thread count', 'Total failed jobs'],
            type: 'line'
          }}
        />
      </DashboardSection>
    </div>
  );
}
