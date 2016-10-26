import React from 'react';

import {zeroDecimalPlaces, bytesTwoDecimalPlaces} from 'in-services/formatters/number';
import {KpiSection, KpiHeading} from 'in-sdk/components/dashboard/KpiSection';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import ChartWithLegend from 'in-components/ChartWithLegend';
import {getLabel} from 'in-sdk/snapshot';

export default function CLRDashboard({snapshot, timeframe}) {
  const snapshotId = snapshot.get('id');

  return (
    <div>
      <KpiSection>
        <KpiHeading>
          {getLabel(snapshot)}
        </KpiHeading>
      </KpiSection>

      <DashboardSection title='Garbage Collections'>
        <ChartWithLegend snapshotId={snapshotId}
                         timeframe={timeframe}
                         margins={{
                           left: 60
                         }}

                         y1={{
                           min: 0,
                           metrics: [
                             'mem.gen0GC',
                             'mem.gen1GC',
                             'mem.gen2GC'
                           ],
                           labels: [
                             'Generation 0',
                             'Generation 1',
                             'Generation 2'
                           ],
                           type: 'stackedArea',
                           formatter: zeroDecimalPlaces
                         }}/>
      </DashboardSection>

      <DashboardSection title='Sizes of Heaps'>
        <ChartWithLegend snapshotId={snapshotId}
                         timeframe={timeframe}
                         margins={{
                           left: 100
                         }}
                         y1={{
                           min: 0,
                           formatter: bytesTwoDecimalPlaces,
                           tooltipFormatter: bytesTwoDecimalPlaces,
                           metrics: [
                             'mem.gen1HeapBytes',
                             'mem.gen2HeapBytes',
                             'mem.loHeapBytes'
                           ],
                           labels: [
                             'Generation 1',
                             'Generation 2',
                             'Large Objects'
                           ],
                           type: 'stackedArea'
                         }}/>
      </DashboardSection>
    </div>
  );
}
