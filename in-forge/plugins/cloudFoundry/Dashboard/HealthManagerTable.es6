import React from 'react';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import ExpandableTable from 'in-components/ExpandableTable';
import ChartWithLegend from 'in-components/ChartWithLegend';
import TwoColumnRow from 'in-sdk/components/dashboard/TwoColumnRow';
import Mtd from 'in-components/Mtd';

import { zeroDecimalPlaces, bytesZeroDecimalPlaces } from 'in-services/formatters/number';

export default function HealthManagerTable({ snapshot, timeframe }) {
  const hmComponents = [''];

  return (
    <DashboardSection title="Health Manager">
      <ExpandableTable
        data={hmComponents}
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
        <th>Routines</th>
        <th>Allocated</th>
        <th>Allocated Heap</th>
        <th>Allocated Stack</th>
        <th>Crashed indices</th>
        <th>Crashed instances</th>
        <th>Missing indices</th>
        <th>Running instances</th>
      </tr>
    </thead>
  );
}

function createRow(componentId, i, context) {
  return [
    <Mtd metric={'hm.hm_api_num_go_routines'} snapshot={context.snapshot} formatter={zeroDecimalPlaces} />,
    <Mtd metric={'hm.hm_api_bytes_allocated'} snapshot={context.snapshot} formatter={bytesZeroDecimalPlaces} />,
    <Mtd metric={'hm.hm_api_bytes_allocated_heap'} snapshot={context.snapshot} formatter={bytesZeroDecimalPlaces} />,
    <Mtd metric={'hm.hm_api_bytes_allocated_stack'} snapshot={context.snapshot} formatter={bytesZeroDecimalPlaces} />,
    <Mtd metric={'hm.hm_analyzer_num_crashed_indices'} snapshot={context.snapshot} formatter={zeroDecimalPlaces} />,
    <Mtd metric={'hm.hm_analyzer_num_crashed_instances'} snapshot={context.snapshot} formatter={zeroDecimalPlaces} />,
    <Mtd metric={'hm.hm_analyzer_num_missing_indices'} snapshot={context.snapshot} formatter={zeroDecimalPlaces} />,
    <Mtd metric={'hm.hm_analyzer_num_running_instances'} snapshot={context.snapshot} formatter={zeroDecimalPlaces} />
  ];
}

function createDetails(componentId, i, context) {
  const snapshotId = context.snapshot.get('id');
  return (
    <div>
      <TwoColumnRow>
        <DashboardSection title="Routines">
          <ChartWithLegend
            snapshotId={snapshotId}
            timeframe={context.timeframe}
            margins={{
              left: 60
            }}
            y1={{
              formatter: zeroDecimalPlaces,
              tooltipFormatter: zeroDecimalPlaces,
              metrics: ['hm.hm_api_num_go_routines'],
              labels: ['Go routines'],
              type: 'line'
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
              metrics: [
                'hm.hm_api_bytes_allocated',
                'hm.hm_api_bytes_allocated_heap',
                'hm.hm_api_bytes_allocated_stack'
              ],
              labels: ['Allocated', 'Allocated Heap', 'Allocated Stack'],
              type: 'line'
            }}
          />
        </DashboardSection>
      </TwoColumnRow>
      <DashboardSection title="Health Manager Analyzer">
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
              'hm.hm_analyzer_num_crashed_indices',
              'hm.hm_analyzer_num_crashed_instances',
              'hm.hm_analyzer_num_missing_indices',
              'hm.hm_analyzer_num_running_instances'
            ],
            labels: ['Crashed indices', 'Crashed instances', 'Missing indices', 'Running instances'],
            type: 'line'
          }}
        />
      </DashboardSection>
    </div>
  );
}
