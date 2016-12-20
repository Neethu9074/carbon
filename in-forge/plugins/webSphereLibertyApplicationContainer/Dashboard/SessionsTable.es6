import React from 'react';

import {zeroDecimalPlaces} from 'in-services/formatters/number';
import {emptyList} from 'in-services/fixedImmutables';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import ChartWithLegend from 'in-components/ChartWithLegend';
import ExpandableTable from 'in-components/ExpandableTable';
import Mtd from 'in-components/Mtd';


export default function ConnectionPoolsTable({snapshot, timeframe}) {
  const sessionNames = snapshot.getIn(['data', 'sessionStatsNames'], emptyList).sort();
  if (sessionNames.size === 0) {
    return null;
  }

  return (
    <DashboardSection title='Sessions'>
      <ExpandableTable data={sessionNames}
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

function getKey(sessionName) {
  return sessionName;
}

function createHeader() {
  return (
    <thead>
      <tr>
        <th>Session Name</th>
        <th>Live Sessions</th>
        <th>Active Sessions</th>
        <th>Sessions Created</th>
        <th>Sessions Invalidated</th>
        <th>Sessions Invalidated by a Timeout</th>
      </tr>
    </thead>
  );
}

function createRow(sessionName, i, context) {
  return ([
    <td>{sessionName}</td>,
    <Mtd metric={'sessions.' + sessionName + '.live'}
         formatter={zeroDecimalPlaces}
         snapshot={context.snapshot} />,
    <Mtd metric={'sessions.' + sessionName + '.active'}
         formatter={zeroDecimalPlaces}
         snapshot={context.snapshot} />,
    <Mtd metric={'sessions.' + sessionName + '.created'}
         formatter={zeroDecimalPlaces}
         snapshot={context.snapshot} />,
    <Mtd metric={'sessions.' + sessionName + '.invalidated'}
         formatter={zeroDecimalPlaces}
         snapshot={context.snapshot} />,
    <Mtd metric={'sessions.' + sessionName + '.invalidatedByTimeout'}
         formatter={zeroDecimalPlaces}
         snapshot={context.snapshot} />
  ]);
}

function createDetails(sessionName, i, context) {
  return (
    <div>
      <ChartWithLegend snapshotId={context.snapshot.get('id')}
                       timeframe={context.timeframe}
                       margins={{
                         left: 80
                       }}
                       y1={{
                         formatter: zeroDecimalPlaces,
                         metrics: [
                           'sessions.' + sessionName + '.live',
                           'sessions.' + sessionName + '.active',
                           'sessions.' + sessionName + '.created',
                           'sessions.' + sessionName + '.invalidated',
                           'sessions.' + sessionName + '.invalidatedByTimeout'
                         ],
                         labels: [
                           'Live Sessions',
                           'Active Sessions',
                           'Sessions Created',
                           'Sessions Invalidated',
                           'Sessions Invalidated by a Timeout'
                         ],
                         type: 'line'
                       }} />
    </div>
  );
}
