import React from 'react';

import { withSiPrefixThreeDecimalPlaces } from 'in-services/formatters/number';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import ChartWithLegend from 'in-components/ChartWithLegend';
import ExpandableTable from 'in-components/ExpandableTable';
import { emptyList } from 'in-services/fixedImmutables';
import Mtd from 'in-components/Mtd';

export default function JmxMetricsTable({ snapshot, timeframe }) {
  const jmxMetrics = snapshot.getIn(['data', 'jmx'], emptyList);

  if (jmxMetrics.size === 0) {
    return null;
  }

  return (
    <DashboardSection title="Custom JMX Metrics">
      <ExpandableTable
        data={jmxMetrics}
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

function getKey(pool, poolName) {
  return poolName;
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

function createRow(jmxMetric, i, context) {
  return [
    <td>{jmxMetric}</td>,
    <Mtd metric={'jmx.' + jmxMetric} snapshot={context.snapshot} formatter={withSiPrefixThreeDecimalPlaces} />
  ];
}

function createDetails(jmxMetric, i, context) {
  return (
    <ChartWithLegend
      snapshotId={context.snapshot.get('id')}
      timeframe={context.timeframe}
      margins={{
        left: 90
      }}
      y1={{
        formatter: withSiPrefixThreeDecimalPlaces,
        metrics: ['jmx.' + jmxMetric],
        labels: [jmxMetric],
        type: 'line'
      }}
    />
  );
}
