import React from 'react';

import {
  zeroDecimalPlaces,
  twoDecimalPlaces,
  percentageZeroDecimalPlaces,
  msZeroDecimalPlaces} from 'in-services/formatters/number';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import ChartWithLegend from 'in-components/ChartWithLegend';
import ExpandableTable from 'in-components/ExpandableTable';
import {emptyList} from 'in-services/fixedImmutables';
import TwoColumnRow from 'in-sdk/components/dashboard/TwoColumnRow';

export default function CoresTable({snapshot, timeframe}) {
  const coreNames = snapshot.getIn(['data', 'core_names'], emptyList).sort();
  if (coreNames.size === 0) {
    return null;
  }

  return (
    <DashboardSection title='Cores'>
      <ExpandableTable data={coreNames}
                       getKey={getKey}
                       createHeader={createHeader}
                       createRow={createRow}
                       context={{
                         snapshot,
                         timeframe
                       }}
                       createDetails={createDetails} />
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
        <th>Cores</th>
      </tr>
    </thead>
  );
}

function createRow(core) {
  return ([
    <td>{core}</td>
  ]);
}

function createDetails(core, i, context) {
  const snapshotId = context.snapshot.get('id');
  const timeframe = context.timeframe;

  return (
    <div>
      <DashboardSection title='Requests'>
        <TwoColumnRow>
          <ChartWithLegend snapshotId={snapshotId}
                           timeframe={timeframe}
                           margins={{
                              left: 80
                           }}
                           y1={{
                           min: 0,
                           metrics: [
                            'core_stats.' + core + '.avg_requests'
                           ],
                           labels: [
                            'Average Requests'
                           ],
                           type: 'line',
                           formatter: zeroDecimalPlaces
                         }}/>
          <ChartWithLegend snapshotId={snapshotId}
                           timeframe={timeframe}
                           margins={{
                              left: 80
                           }}
                           y1={{
                           min: 0,
                           metrics: [
                            'core_stats.' + core + '.avg_time_request'
                           ],
                           labels: [
                            'Average Request Time'
                           ],
                           type: 'line',
                           formatter: msZeroDecimalPlaces
                         }}/>
        </TwoColumnRow>
      </DashboardSection>
      <DashboardSection title='Cache'>
        <TwoColumnRow>
          <ChartWithLegend snapshotId={snapshotId}
                           timeframe={timeframe}
                           margins={{
                              left: 80
                           }}
                           y1={{
                           min: 0,
                           metrics: [
                            'core_stats.' + core + '.lookups'
                           ],
                           labels: [
                            'Lookups'
                           ],
                           type: 'line',
                           formatter: twoDecimalPlaces
                         }}/>
          <ChartWithLegend snapshotId={snapshotId}
                           timeframe={timeframe}
                           margins={{
                              left: 80
                           }}
                           y1={{
                           min: 0,
                           metrics: [
                            'core_stats.' + core + '.hitratio'
                           ],
                           labels: [
                            'Hit-rate'
                           ],
                           type: 'line',
                           formatter: percentageZeroDecimalPlaces
                         }}/>
        </TwoColumnRow>
        <TwoColumnRow>
          <ChartWithLegend snapshotId={snapshotId}
                           timeframe={timeframe}
                           margins={{
                              left: 80
                           }}
                           y1={{
                           min: 0,
                           metrics: [
                            'core_stats.' + core + '.inserts'
                           ],
                           labels: [
                            'Inserts'
                           ],
                           type: 'line',
                           formatter: zeroDecimalPlaces
                         }}/>
          <ChartWithLegend snapshotId={snapshotId}
                           timeframe={timeframe}
                           margins={{
                              left: 80
                           }}
                           y1={{
                           min: 0,
                           metrics: [
                            'core_stats.' + core + '.evictions'
                           ],
                           labels: [
                            'Evictions'
                           ],
                           type: 'line',
                           formatter: zeroDecimalPlaces
                         }}/>
        </TwoColumnRow>
      </DashboardSection>
      <DashboardSection title='Performance'>
        <TwoColumnRow>
          <ChartWithLegend snapshotId={snapshotId}
                           timeframe={timeframe}
                           margins={{
                              left: 80
                           }}
                           y1={{
                           min: 0,
                           metrics: [
                            'core_stats.' + core + '.errors'
                           ],
                           labels: [
                            'Errors'
                           ],
                           type: 'line',
                           formatter: zeroDecimalPlaces
                         }}/>
          <ChartWithLegend snapshotId={snapshotId}
                           timeframe={timeframe}
                           margins={{
                              left: 80
                           }}
                           y1={{
                           min: 0,
                           metrics: [
                            'core_stats.' + core + '.timeouts'
                           ],
                           labels: [
                            'Timeouts'
                           ],
                           type: 'line',
                           formatter: zeroDecimalPlaces
                         }}/>
        </TwoColumnRow>
      </DashboardSection>
      <DashboardSection title='Documents'>
        <ChartWithLegend snapshotId={snapshotId}
                         timeframe={timeframe}
                         margins={{
                            left: 80
                         }}
                         y1={{
                         min: 0,
                         metrics: [
                          'core_stats.' + core + '.docs_added',
                          'core_stats.' + core + '.docs_pending'
                         ],
                         labels: [
                          'Documents added',
                          'Documents pending'
                         ],
                         type: 'line',
                         formatter: zeroDecimalPlaces
                       }}/>
      </DashboardSection>
    </div>
  );
}
