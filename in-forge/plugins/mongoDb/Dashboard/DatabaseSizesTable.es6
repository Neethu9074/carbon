import React from 'react';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import ChartWithLegend from 'in-components/ChartWithLegend';
import ExpandableTable from 'in-components/ExpandableTable';
import Mtd from 'in-components/Mtd';
import {bytesZeroDecimalPlaces, bytesTwoDecimalPlaces} from 'in-services/formatters/number';
import {emptyList} from 'in-services/fixedImmutables';


export default function Table({snapshot, timeframe}) {
  const dbs = snapshot.getIn(['data', 'databases'], emptyList).sort();
  if (dbs.size === 0) {
    return null;
  }

  return (
    <DashboardSection title='Database Sizes'>
      <ExpandableTable data={dbs}
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

function getKey(db) {
  return db;
}

function createHeader() {
  return (
    <thead>
      <tr>
        <th>Name</th>
        <th>Database Size</th>
      </tr>
    </thead>
  );
}

function createRow(db, i, context) {
  return ([
    <td>{db}</td>,
    <Mtd metric={'dbs.' + db}
         formatter={bytesZeroDecimalPlaces}
         snapshot={context.snapshot} />
  ]);
}

function createDetails(db, i, context) {
  return (
    <div>
      <ChartWithLegend snapshotId={context.snapshot.get('id')}
                       timeframe={context.timeframe}
                       margins={{
                         left: 80
                       }}
                       y1={{
                         formatter: bytesZeroDecimalPlaces,
                         tooltipFormatter: bytesTwoDecimalPlaces,
                         metrics: [
                           'dbs.' + db
                         ],
                         labels: [
                           'Database Size'
                         ],
                         type: 'line'
                       }} />
    </div>
  );
}
