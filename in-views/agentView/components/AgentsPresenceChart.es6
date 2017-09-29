import React from 'react';

import { plugins, ID_OF_PROCESSING_STATISTICS } from 'in-forge/constants';
import DashboardTile from 'in-sdk/components/dashboard/DashboardTile';
import { number } from 'in-services/formatters/number';
import { timeframe$ } from 'in-stores/timeline';
import connectTo from 'in-hoc/connectTo';
import Chart from 'in-components/Chart';

export default connectTo(
  {
    timeframe: timeframe$
  },
  function AgentPresenceChart({ timeframe }) {
    if (!timeframe) {
      return null;
    }

    return (
      <DashboardTile title="Reporting Agents">
        <Chart
          snapshotId={ID_OF_PROCESSING_STATISTICS}
          timeframe={timeframe}
          withoutLegend
          margins={{
            left: 40
          }}
          height={120}
          y1={{
            min: 0,
            metrics: [`plugin.${plugins.instanaAgent}`],
            labels: ['Agents'],
            formatter: n => number.compact(Math.ceil(n)),
            type: 'bar',
            aggregation: 'mean',
            minPixelPerBlock: 2
          }}
        />
      </DashboardTile>
    );
  }
);
