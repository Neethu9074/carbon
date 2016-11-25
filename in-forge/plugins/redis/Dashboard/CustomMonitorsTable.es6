import React from 'react';

import {withSiPrefixThreeDecimalPlaces} from 'in-services/formatters/number';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import ChartWithLegend from 'in-components/ChartWithLegend';
import ExpandableTable from 'in-components/ExpandableTable';
import {emptyList} from 'in-services/fixedImmutables';
import Mtd from 'in-components/Mtd';


export default function CustomMonitorsTable({snapshot, timeframe}) {
  const monitors = snapshot.getIn(['data', 'monitor'], emptyList);
  if (monitors.size === 0) {
    return null;
  }

  return (
    <DashboardSection title='Custom Monitors'>
      <ExpandableTable data={monitors}
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

function getKey(monitorName) {
  return monitorName;
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

function createRow(monitorName, index, context) {
  return ([
    <td>
      {monitorName}
    </td>,
    <Mtd metric={'monitor.' + monitorName}
         snapshot={context.snapshot}
         formatter={withSiPrefixThreeDecimalPlaces} />
  ]);
}

function createDetails(monitorName, index, context) {
  return (
    <ChartWithLegend snapshotId={context.snapshot.get('id')}
                     timeframe={context.timeframe}
                     margins={{
                       left: 90
                     }}
                     y1={{
                       formatter: withSiPrefixThreeDecimalPlaces,
                       metrics: ['monitor.' + monitorName],
                       labels: [monitorName],
                       type: 'line'
                     }} />
  );
}
