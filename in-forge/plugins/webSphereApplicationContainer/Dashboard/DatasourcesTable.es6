import React from 'react';

import { zeroDecimalPlaces, msZeroDecimalPlaces } from 'in-services/formatters/number';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import ChartWithLegend from 'in-components/ChartWithLegend';
import ExpandableTable from 'in-components/ExpandableTable';
import { emptyList } from 'in-services/fixedImmutables';
import Mtd from 'in-components/Mtd';

export default function DatasourcesTable({ snapshot, timeframe }) {
  const datasources = snapshot.getIn(['data', 'datasourceNames'], emptyList).sort();
  if (datasources.size === 0) {
    return null;
  }

  return (
    <DashboardSection title="Datasources">
      <ExpandableTable
        data={datasources}
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

function getKey(datasource) {
  return datasource;
}

function createHeader() {
  return (
    <thead>
      <tr>
        <th>Name</th>
        <th>Pool Size</th>
        <th>Free Connections in Pool</th>
        <th>Threads Waiting for Connection</th>
        <th>Average Waiting Time</th>
      </tr>
    </thead>
  );
}

function createRow(datasource, i, context) {
  return [
    <td>{datasource}</td>,
    <Mtd
      metric={'datasources.' + datasource + '.poolSize'}
      formatter={zeroDecimalPlaces}
      snapshot={context.snapshot}
    />,
    <Mtd
      metric={'datasources.' + datasource + '.freePoolSize'}
      formatter={zeroDecimalPlaces}
      snapshot={context.snapshot}
    />,
    <Mtd
      metric={'datasources.' + datasource + '.waitingThreadCount'}
      formatter={zeroDecimalPlaces}
      snapshot={context.snapshot}
    />,
    <Mtd
      metric={'datasources.' + datasource + '.averageWaitTime'}
      formatter={msZeroDecimalPlaces}
      snapshot={context.snapshot}
    />
  ];
}

function createDetails(datasource, i, context) {
  return (
    <div>
      <ChartWithLegend
        snapshotId={context.snapshot.get('id')}
        timeframe={context.timeframe}
        margins={{
          left: 80
        }}
        y1={{
          formatter: zeroDecimalPlaces,
          metrics: ['datasources.' + datasource + '.poolSize', 'datasources.' + datasource + '.freePoolSize'],
          labels: ['Pool Size', 'Free Connections in Pool'],
          type: 'line'
        }}
      />
      <ChartWithLegend
        snapshotId={context.snapshot.get('id')}
        timeframe={context.timeframe}
        margins={{
          left: 80,
          right: 40
        }}
        y1={{
          formatter: zeroDecimalPlaces,
          metrics: ['datasources.' + datasource + '.waitingThreadCount'],
          labels: ['Threads Waiting for Connection'],
          type: 'line'
        }}
        y2={{
          formatter: msZeroDecimalPlaces,
          metrics: ['datasources.' + datasource + '.averageWaitTime'],
          labels: ['Average Waiting Time'],
          type: 'line'
        }}
      />
    </div>
  );
}
