import React from 'react';

import { bytesTwoDecimalPlaces, percentageTwoDecimalPlaces } from 'in-services/formatters/number';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import ChartWithLegend from 'in-components/ChartWithLegend';
import ExpandableTable from 'in-components/ExpandableTable';
import { emptyMap } from 'in-services/fixedImmutables';
import Mtd from 'in-components/Mtd';

export default function DatasourcesTable({ snapshot, timeframe }) {
  const tablespaces = snapshot.getIn(['data', 'tablespaces'], emptyMap).sortBy((value, key) => key);
  if (tablespaces.size === 0) {
    return null;
  }

  return (
    <DashboardSection title="Tablespace Usage">
      <ExpandableTable
        data={tablespaces}
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

function getKey(tablespaceData, tablespace) {
  return tablespace;
}

function createHeader() {
  return (
    <thead>
      <tr>
        <th>Name</th>
        <th>Used Space</th>
        <th>Used Percent</th>
        <th>Maximum Tablespace Size</th>
        <th>Autoextensible</th>
      </tr>
    </thead>
  );
}

function createRow(tablespaceData, tablespace, context) {
  return [
    <td>{tablespace}</td>,
    <Mtd
      metric={'stats.tablespaceStats.' + tablespace + '.usedSpace'}
      formatter={bytesTwoDecimalPlaces}
      snapshot={context.snapshot}
    />,
    <Mtd
      metric={'stats.tablespaceStats.' + tablespace + '.usedPercent'}
      formatter={percentageTwoDecimalPlaces}
      snapshot={context.snapshot}
    />,
    <td>{bytesTwoDecimalPlaces(tablespaceData.get('maxSize'))}</td>,
    <td>{tablespaceData.get('autoextensible')}</td>
  ];
}

function createDetails(tablespaceData, tablespace, context) {
  return (
    <div>
      <ChartWithLegend
        snapshotId={context.snapshot.get('id')}
        timeframe={context.timeframe}
        margins={{
          left: 80
        }}
        y1={{
          formatter: bytesTwoDecimalPlaces,
          metrics: ['stats.tablespaceStats.' + tablespace + '.usedSpace'],
          labels: ['Used Space'],
          type: 'area'
        }}
      />
      <ChartWithLegend
        snapshotId={context.snapshot.get('id')}
        timeframe={context.timeframe}
        margins={{
          left: 80
        }}
        y1={{
          min: 0,
          max: 1,
          formatter: percentageTwoDecimalPlaces,
          metrics: ['stats.tablespaceStats.' + tablespace + '.usedPercent'],
          labels: ['Used Percent'],
          type: 'area'
        }}
      />
    </div>
  );
}
