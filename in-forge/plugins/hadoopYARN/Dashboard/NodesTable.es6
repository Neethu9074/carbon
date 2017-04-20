import React from 'react';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import TwoColumnRow from 'in-sdk/components/dashboard/TwoColumnRow';
import ChartWithLegend from 'in-components/ChartWithLegend';
import ExpandableTable from 'in-components/ExpandableTable';
import Mtd from 'in-components/Mtd';
import { zeroDecimalPlaces, bytesZeroDecimalPlaces, bytesTwoDecimalPlaces } from 'in-services/formatters/number';
import { formatDateTime } from 'in-services/formatters/date';
import { emptyList } from 'in-services/fixedImmutables';

export default function Table({ snapshot, timeframe }) {
  const nodes = snapshot.getIn(['data', 'nodes.nodeList'], emptyList);
  if (nodes.size === 0) {
    return null;
  }

  return (
    <DashboardSection title="Nodes">
      <ExpandableTable
        data={nodes}
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

function getKey(node) {
  return node.get('id');
}

function createHeader() {
  return (
    <thead>
      <tr>
        <th>Labels</th>
        <th>State</th>
        <th>Rack</th>
        <th>Http Address</th>
        <th>Last Health Update</th>
        <th>Health Report</th>
        <th>Containers Running</th>
        <th>Memory Available</th>
        <th>Virtual Cores Available</th>
      </tr>
    </thead>
  );
}

function createRow(node, i, context) {
  const id = node.get('id');
  return [
    <td>{node.get('labels', emptyList).join(', ')}</td>,
    <td>{node.get('state')}</td>,
    <td>{node.get('rack')}</td>,
    <td>{node.get('httpAddress')}</td>,
    <td>{formatDateTime(node.get('lastHealthUpdate'))}</td>,
    <td>{node.get('healthReport')}</td>,
    <Mtd metric={'nodes.' + id + '.containers'} formatter={zeroDecimalPlaces} snapshot={context.snapshot} />,
    <Mtd metric={'nodes.' + id + '.memoryAvailable'} formatter={bytesZeroDecimalPlaces} snapshot={context.snapshot} />,
    <Mtd metric={'nodes.' + id + '.virtualCoresAvailable'} formatter={zeroDecimalPlaces} snapshot={context.snapshot} />
  ];
}

function createDetails(node, i, context) {
  const id = node.get('id');
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
          metrics: ['nodes.' + id + '.containers'],
          labels: ['Containers Running'],
          type: 'stackedArea'
        }}
      />
      <TwoColumnRow>
        <ChartWithLegend
          snapshotId={context.snapshot.get('id')}
          timeframe={context.timeframe}
          margins={{
            left: 80
          }}
          y1={{
            formatter: bytesZeroDecimalPlaces,
            tooltipFormatter: bytesTwoDecimalPlaces,
            metrics: ['nodes.' + id + '.memoryUsed', 'nodes.' + id + '.memoryAvailable'],
            labels: ['Memory Used', 'Memory Available'],
            type: 'stackedArea'
          }}
        />
        <ChartWithLegend
          snapshotId={context.snapshot.get('id')}
          timeframe={context.timeframe}
          margins={{
            left: 80
          }}
          y1={{
            formatter: zeroDecimalPlaces,
            metrics: ['nodes.' + id + '.virtualCoresUsed', 'nodes.' + id + '.virtualCoresAvailable'],
            labels: ['Virtual Cores Used', 'Virtual Cores Available'],
            type: 'stackedArea'
          }}
        />
      </TwoColumnRow>
    </div>
  );
}
