import React from 'react';

import {
  msZeroDecimalPlaces,
  zeroDecimalPlaces
} from 'in-services/formatters/number';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import ChartWithLegend from 'in-components/ChartWithLegend';
import ExpandableTable from 'in-components/ExpandableTable';
import {emptyMap} from 'in-services/fixedImmutables';
import Mtd from 'in-components/Mtd';


export default function CacheStatisticsTable({snapshot, timeframe}) {
  const caches = snapshot.getIn(['data', 'caches'], emptyMap)
    .filter(cacheInfo => cacheInfo.get('statisticsEnabled') === true);

  if (caches.size === 0) {
    return null;
  }

  return (
    <DashboardSection title='Cache Latency and Throughput'>
      <ExpandableTable data={caches}
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
      <th>Cache Name</th>
      <th>Average Read Time</th>
      <th>Average Write Time</th>
      <th>Average Remove Time</th>
      <th>Throughput (ops/sec)</th>
    </tr>
    </thead>
  );
}


function createRow(cacheInfo, cacheName, context) {
  return ([
    <td>{cacheName}</td>,
    <Mtd metric={'cachesStatistics.' + cacheName + '.averageReadTime'}
         snapshot={context.snapshot} formatter={msZeroDecimalPlaces} />,
    <Mtd metric={'cachesStatistics.' + cacheName + '.averageRemoveTime'}
         snapshot={context.snapshot} formatter={msZeroDecimalPlaces} />,
    <Mtd metric={'cachesStatistics.' + cacheName + '.averageWriteTime'}
         snapshot={context.snapshot} formatter={msZeroDecimalPlaces} />,
    <Mtd metric={'cachesStatistics.' + cacheName + '.throughput'}
         snapshot={context.snapshot} formatter={zeroDecimalPlaces} />
  ]);
}


function createDetails(cacheInfo, cacheName, context) {
  return (
    <div>
      <ChartWithLegend snapshotId={context.snapshot.get('id')}
                       timeframe={context.timeframe}
                       margins={{
                         left: 80
                       }}
                       y1={{
                         formatter: msZeroDecimalPlaces,
                         metrics: [
                           'cachesStatistics.' + cacheName + '.averageReadTime',
                           'cachesStatistics.' + cacheName + '.averageRemoveTime',
                           'cachesStatistics.' + cacheName + '.averageWriteTime'
                         ],
                         labels: [
                           'Average Read Time',
                           'Average Remove Time',
                           'Average Write Time'
                         ],
                         type: 'line'
                       }} />
      <ChartWithLegend snapshotId={context.snapshot.get('id')}
                       timeframe={context.timeframe}
                       margins={{
                         left: 80
                       }}
                       y1={{
                         formatter: zeroDecimalPlaces,
                         metrics: [
                           'cachesStatistics.' + cacheName + '.throughput'
                         ],
                         labels: [
                           'Throughput (ops/sec)'
                         ],
                         type: 'line'
                       }} />
    </div>
  );
}
