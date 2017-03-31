import React from 'react';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import ChartWithLegend from 'in-components/ChartWithLegend';
import ExpandableTable from 'in-components/ExpandableTable';
import { emptyList } from 'in-services/fixedImmutables';
import { withSiPrefixThreeDecimalPlaces, timeByMillisTwoDecimalPlaces } from 'in-services/formatters/number';
import Mtd from 'in-components/Mtd';

const rateFormatter = d => withSiPrefixThreeDecimalPlaces(d) + ' / sec';

export default function MetersTable({ snapshot, timeframe }) {
  const timers = snapshot.getIn(['data', 'metrics.timers'], emptyList);

  if (timers.size === 0) {
    return null;
  }

  return (
    <DashboardSection title="Timers">
      <ExpandableTable
        data={timers}
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

function getKey(timer) {
  return timer;
}

function createHeader() {
  return (
    <thead>
      <tr>
        <th>Name</th>
        <th>Rate</th>
        <th>Mean</th>
      </tr>
    </thead>
  );
}

function createRow(timer, index, context) {
  return [
    <td>{timer}</td>,
    <Mtd metric={'metrics.timers.' + timer + '.rate'} snapshot={context.snapshot} formatter={rateFormatter} />,
    <Mtd
      metric={'metrics.timers.' + timer + '.mean'}
      snapshot={context.snapshot}
      formatter={timeByMillisTwoDecimalPlaces}
    />
  ];
}

function createDetails(timer, index, context) {
  return (
    <ChartWithLegend
      snapshotId={context.snapshot.get('id')}
      timeframe={context.timeframe}
      margins={{
        left: 90,
        right: 90
      }}
      y1={{
        formatter: rateFormatter,
        metrics: ['metrics.timers.' + timer + '.rate'],
        labels: ['rate'],
        type: 'line'
      }}
      y2={{
        formatter: timeByMillisTwoDecimalPlaces,
        metrics: [
          'metrics.timers.' + timer + '.mean',
          'metrics.timers.' + timer + '.50th',
          'metrics.timers.' + timer + '.99th'
        ],
        labels: ['mean', '50th', '99th'],
        type: 'line'
      }}
    />
  );
}
