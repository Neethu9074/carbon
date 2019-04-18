import React from 'react';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { plugins, ID_OF_PROCESSING_STATISTICS } from 'in-forge/constants';
import { number } from 'in-services/formatters/number';
import { timeConfig$ } from 'in-stores/timeline';
import connectTo from 'in-hoc/connectTo';
import Chart from 'in-components/Chart';

export default connectTo(
  {
    timeConfig: timeConfig$
  },
  function AgentPresenceChart({ timeConfig }) {
    if (!timeConfig) {
      return null;
    }

    return (
      <DashboardSection title="Reporting Agents">
        <Chart
          snapshotId={ID_OF_PROCESSING_STATISTICS}
          timeConfig={timeConfig}
          withoutLegend
          height={120}
          y1={{
            min: 0,
            metrics: [`plugin.${plugins.instanaAgent}`],
            labels: ['Agents'],
            formatter: n => number.compact(Math.ceil(n)),
            type: 'bar',
            aggregation: 'mean',
            minPixelsPerBlock: 5
          }}
        />
      </DashboardSection>
    );
  }
);
