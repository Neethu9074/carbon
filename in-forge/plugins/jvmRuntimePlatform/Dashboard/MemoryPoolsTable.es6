import React from 'react';

import {bytesZeroDecimalPlaces, bytesTwoDecimalPlaces} from 'in-services/formatters/number';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import ChartWithLegend from 'in-components/ChartWithLegend';
import ExpandableTable from 'in-components/ExpandableTable';
import {emptyMap} from 'in-services/fixedImmutables';
import {getMaxValue} from 'in-sdk/metrics';
import Mtd from 'in-components/Mtd';


export default function MemoryPoolsTable({snapshot, timeframe}) {
  const memoryPools = snapshot.getIn(['data', 'jvm.pools'], emptyMap);

  if (memoryPools.size === 0) {
    return null;
  }

  return (
    <DashboardSection title='Memory Pools'>
      <ExpandableTable data={memoryPools}
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


function getKey(pool, poolName) {
  return poolName;
}


function createHeader() {
  return (
    <thead>
      <tr>
        <th>Pool</th>
        <th>Initial</th>
        <th>Maximum</th>
        <th>Used</th>
      </tr>
    </thead>
  );
}


function createRow(pool, poolName, context) {
  return ([
    <td>{poolName}</td>,
    <td>{bytesTwoDecimalPlaces(pool.get('initial'))}</td>,
    <td>{formatMax(pool.get('max'))}</td>,
    <Mtd metric={'pools.' + poolName}
         snapshot={context.snapshot}
         formatter={bytesTwoDecimalPlaces} />
  ]);
}


function formatMax(bytes) {
  return bytes === -1 ? 'unlimited' : bytesTwoDecimalPlaces(bytes);
}


function createDetails(pool, poolName, context) {
  return (
    <ChartWithLegend snapshotId={context.snapshot.get('id')}
           timeframe={context.timeframe}
           margins={{
             left: 80
           }}
           y1={{
             max: getMaxValue(
               'pools.' + poolName,
               context.snapshot
             ),
             formatter: bytesZeroDecimalPlaces,
             tooltipFormatter: bytesTwoDecimalPlaces,
             metrics: [
               'pools.' + poolName
             ],
             labels: [
               poolName + ' Usage'
             ],
             type: 'line'
           }} />
  );
}
