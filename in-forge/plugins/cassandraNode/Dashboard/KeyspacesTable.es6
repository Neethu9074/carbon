import React from 'react';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import ChartWithLegend from 'in-components/ChartWithLegend';
import ExpandableTable from 'in-components/ExpandableTable';
import { emptyList } from 'in-services/fixedImmutables';
import { timeByMicroTwoDecimalPlaces, bytesZeroDecimalPlaces } from 'in-services/formatters/number';
import Mtd from 'in-components/Mtd';

const muSecondsFormatter = muSeconds => muSeconds + ' µs';

export default function KeyspacesTable({ snapshot, timeframe }) {
  const keyspaces = snapshot.getIn(['data', 'keyspaces'], emptyList).sort();

  return (
    <DashboardSection title="Keyspaces">
      <ExpandableTable
        data={keyspaces}
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

function getKey(keyspace) {
  return keyspace;
}

function createHeader() {
  return (
    <thead>
      <tr>
        <th>Keyspace</th>
        <th>Reads</th>
        <th>Avg. Read Latency</th>
        <th>Writes</th>
        <th>Avg. Write Latency</th>
        <th>SSTables</th>
        <th>Disk Space</th>
      </tr>
    </thead>
  );
}

function createRow(keyspace, index, context) {
  return [
    <td>{keyspace}</td>,
    <Mtd metric={'keyspace.' + keyspace + '.reads'} snapshot={context.snapshot} />,
    <Mtd metric={'keyspace.' + keyspace + '.readLatency'} snapshot={context.snapshot} formatter={muSecondsFormatter} />,
    <Mtd metric={'keyspace.' + keyspace + '.writes'} snapshot={context.snapshot} />,
    <Mtd
      metric={'keyspace.' + keyspace + '.writeLatency'}
      snapshot={context.snapshot}
      formatter={muSecondsFormatter}
    />,
    <Mtd metric={'keyspace.' + keyspace + '.ssTables'} snapshot={context.snapshot} />,
    <Mtd metric={'keyspace.' + keyspace + '.diskSize'} snapshot={context.snapshot} formatter={bytesZeroDecimalPlaces} />
  ];
}

function createDetails(keyspace, index, context) {
  return (
    <ChartWithLegend
      snapshotId={context.snapshot.get('id')}
      timeframe={context.timeframe}
      margins={{
        left: 80,
        right: 80
      }}
      y1={{
        min: 0,
        formatter: timeByMicroTwoDecimalPlaces,
        metrics: ['keyspace.' + keyspace + '.readLatency', 'keyspace.' + keyspace + '.writeLatency'],
        labels: ['Average Read Latency', 'Average Write Latency'],
        type: 'line'
      }}
      y2={{
        min: 0,
        metrics: ['keyspace.' + keyspace + '.reads', 'keyspace.' + keyspace + '.writes'],
        labels: ['Reads', 'Writes'],
        type: 'line'
      }}
    />
  );
}
