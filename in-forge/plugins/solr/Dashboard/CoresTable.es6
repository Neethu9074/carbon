import React from 'react';

import {
  zeroDecimalPlaces,
  twoDecimalPlaces,
  percentageZeroDecimalPlaces,
  msZeroDecimalPlaces
} from 'in-services/formatters/number';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import ChartWithLegend from 'in-components/ChartWithLegend';
import ExpandableTable from 'in-components/ExpandableTable';
import { emptyList } from 'in-services/fixedImmutables';
import TwoColumnRow from 'in-sdk/components/dashboard/TwoColumnRow';
import Mtd from 'in-components/Mtd';

export default function CoresTable({ snapshot, timeframe }) {
  const coreNames = snapshot.getIn(['data', 'core_names'], emptyList).sort();
  if (coreNames.size === 0) {
    return null;
  }

  return (
    <DashboardSection title="Cores">
      <ExpandableTable
        data={coreNames}
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

function getKey(coreName) {
  return coreName;
}

function createHeader() {
  return (
    <thead>
      <tr>
        <th>Core</th>
        <th>Requests</th>
        <th>Request Time</th>
        <th>Cache Hit Rate</th>
        <th>Evictions</th>
        <th>Errors</th>
      </tr>
    </thead>
  );
}

function createRow(core, index, context) {
  return [
    <td>{core}</td>,
    <Mtd metric={'core_stats.' + core + '.avg_requests'} snapshot={context.snapshot} formatter={zeroDecimalPlaces} />,
    <Mtd
      metric={'core_stats.' + core + '.avg_time_request'}
      snapshot={context.snapshot}
      formatter={msZeroDecimalPlaces}
    />,
    <Mtd
      metric={'core_stats.' + core + '.hitratio'}
      snapshot={context.snapshot}
      formatter={percentageZeroDecimalPlaces}
    />,
    <Mtd metric={'core_stats.' + core + '.evictions'} snapshot={context.snapshot} formatter={zeroDecimalPlaces} />,
    <Mtd metric={'core_stats.' + core + '.errors'} snapshot={context.snapshot} formatter={zeroDecimalPlaces} />
  ];
}

function createDetails(core, i, context) {
  const snapshotId = context.snapshot.get('id');
  const timeframe = context.timeframe;

  return (
    <div>
      <TwoColumnRow>
        <DashboardSection title="Requests">
          <ChartWithLegend
            snapshotId={snapshotId}
            timeframe={timeframe}
            margins={{
              left: 80
            }}
            y1={{
              min: 0,
              metrics: ['core_stats.' + core + '.avg_requests'],
              labels: ['Average Requests'],
              type: 'line',
              formatter: zeroDecimalPlaces
            }}
          />
        </DashboardSection>
        <DashboardSection title="Request Time">
          <ChartWithLegend
            snapshotId={snapshotId}
            timeframe={timeframe}
            margins={{
              left: 80
            }}
            y1={{
              min: 0,
              metrics: ['core_stats.' + core + '.avg_time_request'],
              labels: ['Average Request Time'],
              type: 'line',
              formatter: msZeroDecimalPlaces
            }}
          />
        </DashboardSection>
      </TwoColumnRow>

      <TwoColumnRow>
        <DashboardSection title="Cache Lookups">
          <ChartWithLegend
            snapshotId={snapshotId}
            timeframe={timeframe}
            margins={{
              left: 80
            }}
            y1={{
              min: 0,
              metrics: ['core_stats.' + core + '.lookups'],
              labels: ['Lookups'],
              type: 'line',
              formatter: twoDecimalPlaces
            }}
          />
        </DashboardSection>
        <DashboardSection title="Cache Hit Rate">
          <ChartWithLegend
            snapshotId={snapshotId}
            timeframe={timeframe}
            margins={{
              left: 80
            }}
            y1={{
              min: 0,
              metrics: ['core_stats.' + core + '.hitratio'],
              labels: ['Hit-rate'],
              type: 'line',
              formatter: percentageZeroDecimalPlaces
            }}
          />
        </DashboardSection>
      </TwoColumnRow>

      <TwoColumnRow>
        <DashboardSection title="Insertions">
          <ChartWithLegend
            snapshotId={snapshotId}
            timeframe={timeframe}
            margins={{
              left: 80
            }}
            y1={{
              min: 0,
              metrics: ['core_stats.' + core + '.inserts'],
              labels: ['Inserts'],
              type: 'line',
              formatter: zeroDecimalPlaces
            }}
          />
        </DashboardSection>
        <DashboardSection title="Evictions">
          <ChartWithLegend
            snapshotId={snapshotId}
            timeframe={timeframe}
            margins={{
              left: 80
            }}
            y1={{
              min: 0,
              metrics: ['core_stats.' + core + '.evictions'],
              labels: ['Evictions'],
              type: 'line',
              formatter: zeroDecimalPlaces
            }}
          />
        </DashboardSection>
      </TwoColumnRow>

      <TwoColumnRow>
        <DashboardSection title="Errors">
          <ChartWithLegend
            snapshotId={snapshotId}
            timeframe={timeframe}
            margins={{
              left: 80
            }}
            y1={{
              min: 0,
              metrics: ['core_stats.' + core + '.errors'],
              labels: ['Errors'],
              type: 'line',
              formatter: zeroDecimalPlaces
            }}
          />
        </DashboardSection>
        <DashboardSection title="Timeouts">
          <ChartWithLegend
            snapshotId={snapshotId}
            timeframe={timeframe}
            margins={{
              left: 80
            }}
            y1={{
              min: 0,
              metrics: ['core_stats.' + core + '.timeouts'],
              labels: ['Timeouts'],
              type: 'line',
              formatter: zeroDecimalPlaces
            }}
          />
        </DashboardSection>
      </TwoColumnRow>

      <DashboardSection title="Documents">
        <ChartWithLegend
          snapshotId={snapshotId}
          timeframe={timeframe}
          margins={{
            left: 80
          }}
          y1={{
            min: 0,
            metrics: ['core_stats.' + core + '.docs_added', 'core_stats.' + core + '.docs_pending'],
            labels: ['Documents added', 'Documents pending'],
            type: 'line',
            formatter: zeroDecimalPlaces
          }}
        />
      </DashboardSection>
    </div>
  );
}
