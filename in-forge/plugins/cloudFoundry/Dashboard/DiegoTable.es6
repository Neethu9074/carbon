import React from 'react';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import ExpandableTable from 'in-components/ExpandableTable';
import ChartWithLegend from 'in-components/ChartWithLegend';
import TwoColumnRow from 'in-sdk/components/dashboard/TwoColumnRow';

import { zeroDecimalPlaces, bytesZeroDecimalPlaces } from 'in-services/formatters/number';

export default function DiegoTable({ snapshot, timeframe }) {
  const diegoComponents = ['auctioneer', 'stager', 'fileserver'];

  return (
    <DashboardSection title="Diego">
      <ExpandableTable
        data={diegoComponents}
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
        <th>Component</th>
      </tr>
    </thead>
  );
}

function createRow(componentId) {
  return [<td>{componentId}</td>];
}

function createDetails(componentId, i, context) {
  if (componentId === 'auctioneer') {
    return auctioneerCharts(context);
  } else if (componentId === 'stager') {
    return stagerCharts(context);
  } else {
    return fileserverCharts(context);
  }
}

function auctioneerCharts(context) {
  const snapshotId = context.snapshot.get('id');
  return (
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
            metrics: ['diego.auctioneer_num_go_routines'],
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
              'diego.auctioneer_bytes_allocated',
              'diego.auctioneer_bytes_allocated_heap',
              'diego.auctioneer_bytes_allocated_stack'
            ],
            labels: ['Allocated', 'Allocated Heap', 'Allocated Stack'],
            type: 'line'
          }}
        />
      </DashboardSection>
    </TwoColumnRow>
  );
}

function stagerCharts(context) {
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
              metrics: ['diego.stager_num_go_routines'],
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
                'diego.stager_bytes_allocated',
                'diego.stager_bytes_allocated_heap',
                'diego.stager_bytes_allocated_stack'
              ],
              labels: ['Allocated', 'Allocated Heap', 'Allocated Stack'],
              type: 'line'
            }}
          />
        </DashboardSection>
      </TwoColumnRow>
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
            metrics: ['diego.stager_staging_req_failed', 'diego.stager_staging_req_succeeded'],
            labels: ['Requests failed', 'Requests succeeded'],
            type: 'line'
          }}
        />
      </DashboardSection>
    </div>
  );
}

function fileserverCharts(context) {
  const snapshotId = context.snapshot.get('id');
  return (
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
            metrics: ['diego.fs_num_go_routines'],
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
            metrics: ['diego.fs_bytes_allocated', 'diego.fs_bytes_allocated_heap', 'diego.fs_bytes_allocated_stack'],
            labels: ['Allocated', 'Allocated Heap', 'Allocated Stack'],
            type: 'line'
          }}
        />
      </DashboardSection>
    </TwoColumnRow>
  );
}
