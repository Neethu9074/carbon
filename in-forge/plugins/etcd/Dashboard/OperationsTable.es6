import React from 'react';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import ChartWithLegend from 'in-components/ChartWithLegend';
import ExpandableTable from 'in-components/ExpandableTable';
import TwoColumnRow from 'in-sdk/components/dashboard/TwoColumnRow';
import {
  zeroDecimalPlaces
} from 'in-services/formatters/number';

export default function OperationsTable({snapshot, timeframe}) {
  const ops = [ 'gets', 'sets', 'create', 'delete', 'update',
                'compare_and_swap', 'compare_and_delete' ];

  return (
    <DashboardSection title='Operations'>
      <ExpandableTable data={ops}
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

function getKey(opName) {
  return opName;
}

function createHeader() {
  return (
    <thead>
      <tr>
        <th>Operation</th>
      </tr>
    </thead>
  );
}

function createRow(operation) {
  return ([
    <td>{operation.replace(/_/g, ' ')}</td>
  ]);
}

function createDetails(operation, i, context) {
  const snapshotId = context.snapshot.get('id');
  const timeframe = context.timeframe;

  return (
    <TwoColumnRow>
        <ChartWithLegend snapshotId={snapshotId}
              timeframe={timeframe}
              margins={{
                left: 80
              }}
              y1={{
                formatter: zeroDecimalPlaces,
                metrics: [
                  'storage.' + operation + '_success'
                ],
                labels: [
                  'Success'
                ],
                type: 'line'
              }}/>

        <ChartWithLegend snapshotId={snapshotId}
              timeframe={timeframe}
              margins={{
                left: 80
              }}
              y1={{
                formatter: zeroDecimalPlaces,
                metrics: [
                  'storage.' + operation + '_fail'
                ],
                labels: [
                  'Fail'
                ],
                type: 'line'
              }}/>
    </TwoColumnRow>
  );
}
