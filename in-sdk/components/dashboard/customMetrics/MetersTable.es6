import React from 'react';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import ChartWithLegend from 'in-components/ChartWithLegend';
import ExpandableTable from 'in-components/ExpandableTable';
import { emptyList } from 'in-services/fixedImmutables';
import { withSiPrefixThreeDecimalPlaces } from 'in-services/formatters/number';
import Mtd from 'in-components/Mtd';

const rateFormatter = d => withSiPrefixThreeDecimalPlaces(d) + ' / sec';

export default function MetersTable({ snapshot, timeframe }) {
  const meters = snapshot.getIn(['data', 'metrics.meters'], emptyList);

  if (meters.size === 0) {
    return null;
  }

  return (
    <DashboardSection title="Meters">
      <ExpandableTable
        data={meters}
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
        <th>Rate</th>
      </tr>
    </thead>
  );
}

function createRow(meter, index, context) {
  return [
    <td>{meter}</td>,
    <Mtd metric={'metrics.meters.' + meter} snapshot={context.snapshot} formatter={rateFormatter} />
  ];
}

function createDetails(meter, index, context) {
  return (
    <ChartWithLegend
      snapshotId={context.snapshot.get('id')}
      timeframe={context.timeframe}
      margins={{
        left: 90
      }}
      y1={{
        formatter: rateFormatter,
        metrics: ['metrics.meters.' + meter],
        labels: [meter + ' rate'],
        type: 'line'
      }}
    />
  );
}
