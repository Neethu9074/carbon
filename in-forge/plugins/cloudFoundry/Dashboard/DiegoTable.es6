import React from 'react';

import { zeroDecimalPlaces, bytesZeroDecimalPlaces } from 'in-services/formatters/number';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import TwoColumnRow from 'in-sdk/components/dashboard/TwoColumnRow';
import Chart from 'in-components/Chart'
import Table from 'in-sdk/components/dashboard/Table';

const cols = [
  {
    title: 'Component',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.key;
      }
    }
  }
];

export default function DiegoTable({ snapshot, timeframe }) {
  const diegoComponents = ['auctioneer', 'stager', 'fileserver'];

  const rows = diegoComponents.map(component => {
    return {
      key: component,
      snapshotId: snapshot.get('id'),
      timeframe
    };
  });

  return (
    <DashboardSection title={`Diego (${rows.length})`}>
      <Table cols={cols} rows={rows} getRowDetails={getRowDetails} />
    </DashboardSection>
  );
}

function getRowDetails(row) {
  if (row.key === 'auctioneer') {
    return auctioneerCharts(row);
  } else if (row.key === 'stager') {
    return stagerCharts(row);
  } else {
    return fileserverCharts(row);
  }
}

function auctioneerCharts(row) {
  const snapshotId = row.snapshotId;
  return (
    <TwoColumnRow>
      <DashboardSection title="Routines">
        <Chart
          snapshotId={snapshotId}
          timeframe={row.timeframe}
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
        <Chart
          snapshotId={snapshotId}
          timeframe={row.timeframe}
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

function stagerCharts(row) {
  const snapshotId = row.snapshotId;
  return (
    <div>
      <TwoColumnRow>
        <DashboardSection title="Routines">
          <Chart
            snapshotId={snapshotId}
            timeframe={row.timeframe}
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
          <Chart
            snapshotId={snapshotId}
            timeframe={row.timeframe}
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
        <Chart
          snapshotId={snapshotId}
          timeframe={row.timeframe}
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

function fileserverCharts(row) {
  const snapshotId = row.snapshotId;
  return (
    <TwoColumnRow>
      <DashboardSection title="Routines">
        <Chart
          snapshotId={snapshotId}
          timeframe={row.timeframe}
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
        <Chart
          snapshotId={snapshotId}
          timeframe={row.timeframe}
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
