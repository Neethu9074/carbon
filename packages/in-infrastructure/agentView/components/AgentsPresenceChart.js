/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { plugins, ID_OF_PROCESSING_STATISTICS } from 'in-forge/constants';
import { modes } from 'in-forge/plugins/instanaAgent/modes';
import { debouncedQuery$ } from 'in-stores/search/query';
import { number } from 'in-services/formatters/number';
import { timeConfig$ } from 'in-stores/timeline';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  {
    timeConfig: timeConfig$,
    query: debouncedQuery$
  },
  function AgentPresenceChart({ timeConfig, query }) {
    // if query is set, we cannot use the processing statistics
    if (!timeConfig || query) {
      return null;
    }

    return (
      <DashboardSection title="Reporting Agents">
        <Chart
          snapshotId={ID_OF_PROCESSING_STATISTICS}
          timeConfig={timeConfig}
          height={120}
          y1={{
            min: 0,
            metrics: [
              `plugin.${plugins.instanaAgent}Mode2`,
              `plugin.${plugins.instanaAgent}Mode1`,
              `plugin.${plugins.instanaAgent}Mode0`
            ],
            labels: [modes[2], modes[1], modes[0]],
            formatter: n => number.compact(Math.ceil(n)),
            type: 'stackedBar',
            aggregation: 'mean',
            minPixelsPerBlock: 5
          }}
        />
      </DashboardSection>
    );
  }
);
