import React from 'react';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import ChartWithLegend from 'in-components/ChartWithLegend';
import ExpandableTable from 'in-components/ExpandableTable';
import { emptyList } from 'in-services/fixedImmutables';
import { withSiPrefixThreeDecimalPlaces } from 'in-services/formatters/number';
import Mtd from 'in-components/Mtd';

export default function Gauges({ snapshot, timeframe }) {
  const gauges = snapshot.getIn(['data', 'metrics.gauges'], emptyList);

  if (gauges.size === 0) {
    return null;
  }

  return (
    <DashboardSection title="Gauges">
      <ExpandableTable
        data={gauges}
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

function getKey(gauge) {
  return gauge;
}

function createHeader() {
  return (
    <thead>
      <tr>
        <th>Name</th>
        <th>Value</th>
      </tr>
    </thead>
  );
}

function createRow(gauge, index, context) {
  return [
    <td>{gauge}</td>,
    <Mtd metric={'metrics.gauges.' + gauge} snapshot={context.snapshot} formatter={withSiPrefixThreeDecimalPlaces} />
  ];
}

function createDetails(gauge, index, context) {
  return (
    <ChartWithLegend
      snapshotId={context.snapshot.get('id')}
      timeframe={context.timeframe}
      margins={{
        left: 90
      }}
      y1={{
        formatter: withSiPrefixThreeDecimalPlaces,
        metrics: ['metrics.gauges.' + gauge],
        labels: [gauge],
        type: 'line'
      }}
    />
  );
}
