import React from 'react';

import {twoDecimalPlaces} from 'in-services/formatters/number';
import {KpiSection, KpiHeading} from 'in-sdk/components/dashboard/KpiSection';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import TwoColumnRow from 'in-sdk/components/dashboard/TwoColumnRow';
import ChartWithLegend from 'in-components/ChartWithLegend';
import {getLabel} from 'in-sdk/snapshot';


export default function RubyDashboard({snapshot, timeframe}) {
  return (
    <div>
      <KpiSection>
        <KpiHeading>
          {getLabel(snapshot)}
        </KpiHeading>
      </KpiSection>

      <TwoColumnRow>
        <DashboardSection title='GC Activity'>
          {renderGcMetrics(snapshot, timeframe)}
        </DashboardSection>
      </TwoColumnRow>
    </div>
  );
}

function renderGcMetrics(snapshot, timeframe) {
    return (
      <ChartWithLegend snapshotId={snapshot.get('id')}
                       timeframe={timeframe}
                       margins={{
                         left: 60,
                         right: 60
                       }}

                       y1={{
                         min: 0,
                         formatter: twoDecimalPlaces,
                         metrics: [
                           'gc.minorGcs',
                           'gc.majorGcs'
                         ],
                         labels: [
                           '#Minor GCs',
                           '#Major GCs'
                         ],
                         type: 'point'
                       }}/>
    );
}

