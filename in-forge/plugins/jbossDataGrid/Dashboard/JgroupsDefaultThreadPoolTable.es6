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
    <DashboardSection title='JGroups Default Thread Pool Statistics'>
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
        <th>Incoming Messages Threads Size</th>
        <th>Incoming Messages Active Threads Size</th>
        <th>Incoming Messages Queue Size</th>
      </tr>
    </thead>
  );
}


function createRow(clusterInfo, clusterName, context) {
  return ([
    <td>{clusterName}</td>,
    <Mtd metric={'clustersUDPStatistics.' + clusterName + '.defaultThreadsSize'}
         snapshot={context.snapshot} formatter={zeroDecimalPlaces} />,
    <Mtd metric={'clustersUDPStatistics.' + clusterName + '.defaultActiveThreadsSize'}
         snapshot={context.snapshot} formatter={zeroDecimalPlaces} />,
    <Mtd metric={'clustersUDPStatistics.' + clusterName + '.defaultQueueSize'}
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
                           'clustersUDPStatistics.' + clusterName + '.defaultThreadsSize',
                           'clustersUDPStatistics.' + clusterName + '.defaultActiveThreadsSize',
                           'clustersUDPStatistics.' + clusterName + '.defaultQueueSize'
                         ],
                         labels: [
                           'Incoming Messages Threads Size',
                           'Incoming Messages Active Threads Size',
                           'Incoming Messages Queue Size'
                         ],
                         type: 'line'
                       }} />
    </div>
  );
}
