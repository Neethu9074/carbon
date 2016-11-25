import React from 'react';

import EndpointBreakdownTable from
'in-forge/plugins/springbootApplicationContainer/Dashboard/EndpointBreakdownTable.es6';
import {KpiSection, KpiHeading, KpiKeyValue} from 'in-sdk/components/dashboard/KpiSection';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import ChartWithLegend from 'in-components/ChartWithLegend';
import MetricValue from 'in-components/MetricValue';
import {getLabel} from 'in-sdk/snapshot';


export default function SpringbootDashboard({snapshot, timeframe}) {
  const httpSessionsMax = snapshot.getIn(['data', 'httpsessionsMax']);
  const snapshotId = snapshot.get('id');

  return (
    <div>
      <KpiSection>
        <KpiHeading>
          {getLabel(snapshot)}
        </KpiHeading>
        <KpiKeyValue label='All Requests'>
          <MetricValue snapshotId={snapshotId}
                       metric='metrics.requests' />
        </KpiKeyValue>
        <KpiKeyValue label='Active Sessions'>
          <MetricValue snapshotId={snapshotId}
                       metric='metrics.httpsessions.active' />
        </KpiKeyValue>
      </KpiSection>

      <DashboardSection title='Request Count'>
        <ChartWithLegend snapshotId={snapshotId}
                         timeframe={timeframe}
                         margins={{
                           left: 80
                         }}
                         y1={{
                          metrics: [
                            'metrics.requests',
                            'metrics.statusCode.1xx',
                            'metrics.statusCode.2xx',
                            'metrics.statusCode.3xx',
                            'metrics.statusCode.4xx',
                            'metrics.statusCode.5xx'
                          ],
                          labels: [
                            'All Requests',
                            'Requests with Status Code 1xx',
                            'Requests with Status Code 2xx',
                            'Requests with Status Code 3xx',
                            'Requests with Status Code 4xx',
                            'Requests with Status Code 5xx'
                          ],
                          type: 'line'
                         }} />
      </DashboardSection>
      {httpSessionsMax ?
        <DashboardSection title='HTTP Sessions Active'>
          <ChartWithLegend snapshotId={snapshotId}
                           timeframe={timeframe}
                           margins={{
                               left: 80
                             }}
                           y1={{
                               metrics: [
                                'metrics.httpsessions.active'
                               ],
                               labels: [
                                'Active Sessions'
                               ],
                               type: 'line'
                             }} />
        </DashboardSection>
        : null}
      <EndpointBreakdownTable snapshot={snapshot}
                              timeframe={timeframe} />
    </div>
  );
}
