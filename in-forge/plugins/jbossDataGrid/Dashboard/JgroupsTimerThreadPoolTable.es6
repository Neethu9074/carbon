import React from 'react';

import {zeroDecimalPlaces} from 'in-services/formatters/number';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import ChartWithLegend from 'in-components/ChartWithLegend';
import ExpandableTable from 'in-components/ExpandableTable';
import {emptyMap} from 'in-services/fixedImmutables';
import Mtd from 'in-components/Mtd';


export default function ClusterUDPStatisticsTable({snapshot, timeframe}) {
  const clusters = snapshot.getIn(['data', 'clusters'], emptyMap)
    .filter(clusterInfo => clusterInfo.get('udpStats') === true);

  if (clusters.size === 0) {
    return null;
  }

  return (
    <DashboardSection title='JGroups Cluster UDP Statistics'>
      <ExpandableTable data={clusters}
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


function getKey(cacheInfo, cacheName) {
  return cacheName;
}


function createHeader() {
  return (
    <thead>
      <tr>
        <th>Cluster name</th>
        <th>Timer Threads Size</th>
        <th>Timer Queue Size</th>
        <th>Timer Tasks Size</th>
      </tr>
    </thead>
  );
}


function createRow(clusterInfo, clusterName, context) {
  return ([
    <td>{clusterName}</td>,
    <Mtd metric={'clustersUDPStatistics.' + clusterName + '.timerThreadsSize'}
         snapshot={context.snapshot} formatter={zeroDecimalPlaces} />,
    <Mtd metric={'clustersUDPStatistics.' + clusterName + '.timerQueueSize'}
         snapshot={context.snapshot} formatter={zeroDecimalPlaces} />,
    <Mtd metric={'clustersUDPStatistics.' + clusterName + '.timerTasks'}
         snapshot={context.snapshot} formatter={zeroDecimalPlaces} />
  ]);
}


function createDetails(clusterInfo, clusterName, context) {
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
                           'clustersUDPStatistics.' + clusterName + '.timerThreadsSize',
                           'clustersUDPStatistics.' + clusterName + '.timerQueueSize',
                           'clustersUDPStatistics.' + clusterName + '.timerTasks'
                         ],
                         labels: [
                           'Timer Threads Size',
                           'Timer Queue Size',
                           'Timer Tasks Size'
                         ],
                         type: 'line'
                       }} />
    </div>
  );
}
