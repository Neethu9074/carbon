import React from 'react';

import {
  zeroDecimalPlaces,
  percentageZeroDecimalPlaces
} from 'in-services/formatters/number';

import DashboardNotification from 'in-components/DashboardNotification';
import ChartWithLegend from 'in-components/ChartWithLegend';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';

const hitRateFormatter = d => d < 0 ? 'No activity' : percentageZeroDecimalPlaces(d);

export default function VarnishDashboard({snapshot, timeframe}) {
  const data = snapshot.get('data');
  const snapshotId = snapshot.get('id');
  const sensorConnectionStatus = data.get('sensorConnectionStatus', 'OK');
  if (sensorConnectionStatus !== 'OK') {
    return (
      <DashboardNotification type='info'>
        {sensorConnectionStatus}
      </DashboardNotification>);
  }
  return (
    <div>
      <DashboardSection title='Client'>
        <ChartWithLegend snapshotId={snapshotId}
                         timeframe={timeframe}
                         margins={{
                           left: 80
                         }}
                         y1={{
                           metrics: [
                             'sess_conn',
                             'client_req',
                             'sess_dropped'
                           ],
                           labels: [
                             'Accepted client connections',
                             'Received client requests',
                             'Connections dropped due to a full queue'
                           ],
                           formatter: zeroDecimalPlaces,
                           type: 'line'
                         }}/>
      </DashboardSection>
      <DashboardSection title='Cache'>
        <ChartWithLegend snapshotId={snapshotId}
                        timeframe={timeframe}
                        margins={{
                          left: 80
                        }}
                        y1={{
                          min: 0,
                              metrics: [
                            'cache_hit',
                            'cache_miss',
                            'cache_hitpass'
                          ],
                              labels: [
                            'Cache Hits',
                            'Cache Misses',
                            'Hits pass file'
                          ],
                          type: 'line',
                          formatter: zeroDecimalPlaces
                        }}
                        y2={{
                          min: 0,
                          max: 1,
                          metrics: [
                            'cache_hit_rate'
                          ],
                          labels: [
                            'Cache hit rate'
                          ],
                          type: 'line',
                          formatter: hitRateFormatter
                        }}/>
      </DashboardSection>
      <DashboardSection title='Cached objects'>
        <ChartWithLegend snapshotId={snapshotId}
                        timeframe={timeframe}
                        margins={{
                          left: 80
                        }}
                        y1={{
                          min: 0,
                          metrics: [
                            'n_expired',
                            'n_lru_nuked'
                          ],
                          labels: [
                            'Expired objects',
                            'Nuked Objects'
                          ],
                          type: 'line',
                          formatter: zeroDecimalPlaces
                        }}/>
      </DashboardSection>
      <DashboardSection title='Threads'>
        <ChartWithLegend snapshotId={snapshotId}
                        timeframe={timeframe}
                        margins={{
                          left: 80
                        }}
                        y1={{
                          min: 0,
                          metrics: [
                            'threads',
                            'threads_created',
                            'threads_failed',
                            'threads_limited',
                            'thread_queue_len',
                            'sess_queued'
                          ],
                          labels: [
                            'Threads',
                            'Created',
                            'Failed',
                            'Limited',
                            'Queue',
                            'Queued requests'
                          ],
                          type: 'line',
                          formatter: zeroDecimalPlaces
                        }}/>
      </DashboardSection>
      <DashboardSection title='Backend'>
        <ChartWithLegend snapshotId={snapshotId}
                        timeframe={timeframe}
                        margins={{
                          left: 80
                        }}
                        y1={{
                          min: 0,
                          metrics: [
                            'backend_conn',
                            'backend_recycle',
                            'backend_reuse',
                            'backend_fail',
                            'backend_unhealthy',
                            'backend_busy',
                            'backend_req'
                          ],
                          labels: [
                            'Connections',
                            'Recycled',
                            'Reused',
                            'Idle closed',
                            'Unhealthy',
                            'Busy',
                            'Requests'
                          ],
                          type: 'line',
                          formatter: zeroDecimalPlaces
                        }}/>
      </DashboardSection>
    </div>
  );
}
