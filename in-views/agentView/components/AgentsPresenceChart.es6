import React from 'react';

import { plugins, ID_OF_PROCESSING_STATISTICS } from 'in-forge/constants';
import { number } from 'in-services/formatters/number';
import { timeframe$ } from 'in-stores/timeline';
import connectTo from 'in-hoc/connectTo';
import Chart from 'in-components/Chart';

import './AgentsPresenceChart.less';

const block = 'in-agent-view-table-reporting-chart';

export default connectTo(
  {
    timeframe: timeframe$
  },
  function AgentPresenceChart({ timeframe }) {
    if (!timeframe) {
      return null;
    }

    return (
      <div className={block}>
        <Chart
          snapshotId={ID_OF_PROCESSING_STATISTICS}
          timeframe={timeframe}
          margins={{
            left: 40
          }}
          y1={{
            min: 0,
            metrics: [`plugin.${plugins.instanaAgent}`],
            labels: ['Agents'],
            type: 'line',
            formatter: number.compact
          }}
        />
      </div>
    );
  }
);
