import React from 'react';

import { emptyList } from 'in-services/fixedImmutables';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import ChartWithLegend from 'in-components/ChartWithLegend';
import ExpandableTable from 'in-components/ExpandableTable';
import {
  withSiMultiplyPrefixZeroDecimalPlaces,
  bytesTwoDecimalPlaces,
  zeroDecimalPlaces
} from 'in-services/formatters/number';
import Mtd from 'in-components/Mtd';

export default function IndicesTable({ snapshot, timeframe }) {
  const indices = snapshot.getIn(['data', 'index.names'], emptyList);

  if (indices.size === 0) {
    return null;
  }

  return (
    <DashboardSection title={`Indices (${indices.size})`}>
      <ExpandableTable
        data={indices}
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

function getKey(indexName) {
  return indexName;
}

function createHeader() {
  return (
    <thead>
      <tr>
        <th>Index</th>
        <th>Documents</th>
        <th>Deleted</th>
        <th>Size</th>
      </tr>
    </thead>
  );
}

function createRow(indexName, i, context) {
  return [
    <td>{indexName}</td>,
    <Mtd
      metric={'index.' + indexName + '.document_count'}
      formatter={withSiMultiplyPrefixZeroDecimalPlaces}
      snapshot={context.snapshot}
    />,
    <Mtd
      metric={'index.' + indexName + '.deleted_count'}
      formatter={withSiMultiplyPrefixZeroDecimalPlaces}
      snapshot={context.snapshot}
    />,
    <Mtd metric={'index.' + indexName + '.size'} snapshot={context.snapshot} formatter={bytesTwoDecimalPlaces} />
  ];
}

function createDetails(indexName, i, context) {
  return (
    <ChartWithLegend
      snapshotId={context.snapshot.get('id')}
      timeframe={context.timeframe}
      margins={{
        left: 80,
        right: 80
      }}
      y1={{
        metrics: ['index.' + indexName + '.document_count', 'index.' + indexName + '.deleted_count'],
        labels: ['Documents', 'Deletions'],
        formatter: withSiMultiplyPrefixZeroDecimalPlaces,
        tooltipFormatter: zeroDecimalPlaces,
        type: 'line'
      }}
      y2={{
        metrics: ['index.' + indexName + '.size'],
        labels: ['Size'],
        formatter: bytesTwoDecimalPlaces,
        type: 'line'
      }}
    />
  );
}
