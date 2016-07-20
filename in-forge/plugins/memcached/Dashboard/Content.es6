import irpt from 'react-immutable-proptypes';
import React from 'react';

import {
  bytesZeroDecimalPlaces,
  zeroDecimalPlaces,
  percentageZeroDecimalPlaces
} from 'in-services/formatters/number';
import DashboardSection from 'in-components/DashboardSection';
import ChartWithLegend from 'in-components/ChartWithLegend';
import {timeframeShape} from 'in-stores/timeline';

const chartHeight = 200;

export default function MemcachedDashboard({snapshot, timeframe}) {
  const snapshotId = snapshot.get('id');
  const maxBytes = snapshot.getIn(['data', 'limit_maxbytes']);

  return (
    <div>
      <DashboardSection title='Commands'>
        <ChartWithLegend snapshotId={snapshotId}
                         timeframe={timeframe}
                         height={chartHeight}
                         margins={{
                           left: 80
                         }}
                         y1={{
                           metrics: [
                             'cmd_get',
                             'cmd_set'
                           ],
                           labels: [
                             'Gets',
                             'Sets'
                           ],
                           type: 'line',
                           formatter: zeroDecimalPlaces
                         }}/>
      </DashboardSection>
      <DashboardSection title='Reads/Writes'>
        <ChartWithLegend snapshotId={snapshotId}
                         timeframe={timeframe}
                         height={chartHeight}
                         margins={{
                           left: 80
                         }}
                         y1={{
                           metrics: [
                             'bytes_read',
                             'bytes_write'
                           ],
                           labels: [
                             'Bytes reads',
                             'Bytes writes'
                           ],
                           type: 'line',
                           formatter: bytesZeroDecimalPlaces
                         }}/>
      </DashboardSection>
      <DashboardSection title='Get Hits/Misses'>
        <ChartWithLegend snapshotId={snapshotId}
                         timeframe={timeframe}
                         height={chartHeight}
                         margins={{
                           left: 80,
                           right: 60
                         }}
                         y1={{
                           metrics: [
                             'get_hits',
                             'get_misses'
                           ],
                           labels: [
                             'Get hits',
                             'Get misses'
                           ],
                           type: 'line',
                           formatter: zeroDecimalPlaces
                         }}
                         y2={{
                           min: 0,
                           metrics: [
                             'get_hit_rate'
                           ],
                           labels: [
                             'Get hit ratio'
                           ],
                           type: 'line',
                           formatter: percentageZeroDecimalPlaces
                         }}/>
      </DashboardSection>
      <DashboardSection title='Delete Hits/Misses'>
        <ChartWithLegend snapshotId={snapshotId}
                         timeframe={timeframe}
                         height={chartHeight}
                         margins={{
                           left: 80,
                           right: 60
                         }}
                         y1={{
                           metrics: [
                             'delete_hits',
                             'delete_misses'
                           ],
                           labels: [
                             'Delete hits',
                             'Delete misses'
                           ],
                           type: 'line',
                           formatter: zeroDecimalPlaces
                         }}
                         y2={{
                           min: 0,
                           metrics: [
                             'delete_hit_rate'
                           ],
                           labels: [
                             'Delete hit ratio'
                           ],
                           type: 'line',
                           formatter: percentageZeroDecimalPlaces
                         }}/>
      </DashboardSection>
      <DashboardSection title='Flush command'>
        <ChartWithLegend snapshotId={snapshotId}
                         timeframe={timeframe}
                         height={chartHeight}
                         margins={{
                           left: 80
                         }}
                         y1={{
                           metrics: [
                             'cmd_flush'
                           ],
                           labels: [
                             'Flush'
                           ],
                           type: 'line',
                           formatter: zeroDecimalPlaces
                         }}/>
      </DashboardSection>
      <DashboardSection title='Evictions'>
        <ChartWithLegend snapshotId={snapshotId}
                         timeframe={timeframe}
                         height={chartHeight}
                         margins={{
                           left: 80
                         }}
                         y1={{
                           metrics: [
                             'evictions'
                           ],
                           labels: [
                             'Evictions'
                           ],
                           type: 'line',
                           formatter: zeroDecimalPlaces
                         }}/>
      </DashboardSection>
      <DashboardSection title='Used bytes'>
        <ChartWithLegend snapshotId={snapshotId}
                         timeframe={timeframe}
                         height={chartHeight}
                         margins={{
                           left: 80
                         }}
                         y1={{
                           max: maxBytes,
                           metrics: [
                             'bytes'
                           ],
                           labels: [
                             'Used bytes'
                           ],
                           type: 'line',
                           formatter: bytesZeroDecimalPlaces
                         }}/>
      </DashboardSection>
      <DashboardSection title='Connections'>
        <ChartWithLegend snapshotId={snapshotId}
                         timeframe={timeframe}
                         height={chartHeight}
                         margins={{
                           left: 80
                         }}
                         y1={{
                           min: 0,
                           metrics: [
                             'conn_connected',
                             'conn_queued',
                             'conn_yields'
                           ],
                           labels: [
                             'Connected',
                             'Queued',
                             'Yields'
                           ],
                           type: 'line',
                           formatter: zeroDecimalPlaces
                         }}/>
      </DashboardSection>
    </div>
  );
}

MemcachedDashboard.propTypes = {
  snapshot: irpt.map.isRequired,
  timeframe: timeframeShape
};
