import React from 'react';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import ChartWithLegend from 'in-components/ChartWithLegend';
import ExpandableTable from 'in-components/ExpandableTable';
import {emptyMap} from 'in-services/fixedImmutables';
import Mtd from 'in-components/Mtd';

export default function ExecutorsTable({snapshot, timeframe}) {
  const executors = snapshot.getIn(['data', 'executor-config'], emptyMap);
  if (executors.size === 0) {
    return null;
  }

  return (
    <DashboardSection title='Executors'>
      <ExpandableTable data={executors}
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

function getKey(executor, executorName) {
  return executorName;
}

function createHeader() {
  return (
    <thead>
      <tr>
        <th></th>
        <th colSpan='2'>Threads</th>
        <th></th>
      </tr>
      <tr>
        <th>Executor</th>
        <th>Current</th>
        <th>Max</th>
        <th>Queue Size</th>
      </tr>
    </thead>
  );
}

function createRow(executor, name, context) {
  return ([
    <td>{name}</td>,
    <Mtd metric={'executors.' + name + '.active'}
         snapshot={context.snapshot} />,
    <td>{executor.getIn(['maxThreads'])}</td>,
    <Mtd metric={'executors.' + name + '.queueSize'}
         snapshot={context.snapshot} />
  ]);
}

function createDetails(executor, name, context) {
  return (
    <ChartWithLegend snapshotId={context.snapshot.get('id')}
           timeframe={context.timeframe}
           margins={{
             left: 80
           }}
           y1={{
             metrics: [
               'executors.' + name + '.active',
               'executors.' + name + '.queueSize'
             ],
             labels: [
               name + ' Active Threads',
               name + ' Queue Size'
             ],
             type: 'line'
           }}/>
  );
}
