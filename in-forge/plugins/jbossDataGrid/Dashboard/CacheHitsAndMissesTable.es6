import React from 'react';

import { zeroDecimalPlaces, percentageZeroDecimalPlaces } from 'in-services/formatters/number';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import ChartWithLegend from 'in-components/ChartWithLegend';
import ExpandableTable from 'in-components/ExpandableTable';
import { emptyMap } from 'in-services/fixedImmutables';
import Mtd from 'in-components/Mtd';

export default function CacheStatisticsTable({ snapshot, timeframe }) {
  const caches = snapshot
    .getIn(['data', 'caches'], emptyMap)
    .filter(cacheInfo => cacheInfo.get('statisticsEnabled') === true);

  if (caches.size === 0) {
    return null;
  }

  return (
    <DashboardSection title="Cache Hits And Misses">
      <ExpandableTable
        data={caches}
        getKey={getKey}
        createHeader={createHeader}
        createRow={createRow}
        context={{
          snapshot,
          timeframe
        }}
        createDetails={createDetails}
      />
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
        <th>Hit Ratio</th>
        <th>Hits</th>
        <th>Misses</th>
        <th>Remove Hits</th>
        <th>Remove Misses</th>
      </tr>
    </thead>
  );
}

function createRow(cacheInfo, cacheName, context) {
  return [
    <td>{cacheName}</td>,
    <Mtd
      metric={'cachesStatistics.' + cacheName + '.hitRatio'}
      snapshot={context.snapshot}
      formatter={percentageZeroDecimalPlaces}
    />,
    <Mtd
      metric={'cachesStatistics.' + cacheName + '.hits'}
      snapshot={context.snapshot}
      formatter={zeroDecimalPlaces}
    />,
    <Mtd
      metric={'cachesStatistics.' + cacheName + '.misses'}
      snapshot={context.snapshot}
      formatter={zeroDecimalPlaces}
    />,
    <Mtd
      metric={'cachesStatistics.' + cacheName + '.removeHits'}
      snapshot={context.snapshot}
      formatter={zeroDecimalPlaces}
    />,
    <Mtd
      metric={'cachesStatistics.' + cacheName + '.removeMisses'}
      snapshot={context.snapshot}
      formatter={zeroDecimalPlaces}
    />
  ];
}

function createDetails(cacheInfo, cacheName, context) {
  return (
    <div>
      <ChartWithLegend
        snapshotId={context.snapshot.get('id')}
        timeframe={context.timeframe}
        margins={{
          left: 80
        }}
        y1={{
          formatter: percentageZeroDecimalPlaces,
          metrics: ['cachesStatistics.' + cacheName + '.hitRatio'],
          labels: ['Hit Ratio'],
          type: 'line'
        }}
      />
      <ChartWithLegend
        snapshotId={context.snapshot.get('id')}
        timeframe={context.timeframe}
        margins={{
          left: 80
        }}
        y1={{
          formatter: zeroDecimalPlaces,
          metrics: [
            'cachesStatistics.' + cacheName + '.hits',
            'cachesStatistics.' + cacheName + '.misses',
            'cachesStatistics.' + cacheName + '.removeHits',
            'cachesStatistics.' + cacheName + '.removeMisses'
          ],
          labels: ['Hits', 'Misses', 'Remove Hits', 'Remove Misses'],
          type: 'line'
        }}
      />
    </div>
  );
}
