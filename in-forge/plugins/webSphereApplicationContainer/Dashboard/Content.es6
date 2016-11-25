import React from 'react';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import {zeroDecimalPlaces} from 'in-services/formatters/number';
import ChartWithLegend from 'in-components/ChartWithLegend';

import DatasourcesTable from './DatasourcesTable';
import WebModulesTable from './WebModulesTable';


export default function WebSphereDashboard({snapshot, timeframe}) {
  return (
    <div>
      <DashboardSection title='Web Container Thread Pool'>
        <ChartWithLegend snapshotId={snapshot.get('id')}
                         timeframe={timeframe}
                         margins={{
                           left: 80
                         }}
                         y1={{
                           formatter: zeroDecimalPlaces,
                           metrics: [
                             'threadPools.webContainer.activeThreads',
                             'threadPools.webContainer.poolSize'
                           ],
                           labels: [
                             'Active Threads',
                             'Pool Size'
                           ],
                           type: 'line'
                         }} />
      </DashboardSection>
      <WebModulesTable snapshot={snapshot}
                       timeframe={timeframe} />
      <DatasourcesTable snapshot={snapshot}
                        timeframe={timeframe} />
    </div>
  );
}
