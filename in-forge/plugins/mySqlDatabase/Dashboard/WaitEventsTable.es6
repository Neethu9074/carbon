import React from 'react';

import {msTwoDecimalPlaces} from 'in-services/formatters/number';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import ChartWithLegend from 'in-components/ChartWithLegend';
import ExpandableTable from 'in-components/ExpandableTable';
import {emptyList} from 'in-services/fixedImmutables';
import Mtd from 'in-components/Mtd';

const msFormatter = d => d < 0 ? 'No activity' : msTwoDecimalPlaces(d);

export default function WaitEventsTable({snapshot, timeframe}) {
  const waitEvents = snapshot.getIn(['data', 'wait_event_names'], emptyList).toArray().sort();

  if (waitEvents.length === 0) {
    return null;
  }

  return (
    <DashboardSection title='Wait Events'>
      <ExpandableTable data={waitEvents}
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

function getKey(name) {
  return name;
}

function createHeader() {
  return (
    <thead>
      <tr>
        <th>Name</th>
        <th>Time</th>
      </tr>
    </thead>
  );
}

function createRow(name, index, context) {
  return ([
    <td>{name}</td>,
    <Mtd metric={`wait.${name}`}
         snapshot={context.snapshot}
         formatter={msFormatter}/>
  ]);
}

function createDetails(name, index, context) {
  return (
    <div>
      <ChartWithLegend snapshotId={context.snapshot.get('id')}
                       timeframe={context.timeframe}
                       margins={{
                         left: 80
                       }}
                       y1={{
                         min: 0,
                         metrics: [`wait.${name}`],
                         labels: ['Time'],
                         type: 'line',
                         formatter: msFormatter
                     }}/>
    </div>
  );
}
