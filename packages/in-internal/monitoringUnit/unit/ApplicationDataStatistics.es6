import React, { Fragment } from 'react';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { getPhysicalStack } from 'in-internal/components/dataRetrieval';
import LoadingIndicator from 'in-components/LoadingIndicator';
import { percentage } from 'in-services/formatters/number';
import { timeConfig$ } from 'in-stores/time/config';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  ({ tenant, unit }) => ({
    timeConfig: timeConfig$,
    appdataProcessors: timeConfig$.flatMap(timeConfig =>
      getPhysicalStack({
        searchQuery: `${tenant}-${unit}-appdata-processor`,
        timeConfig,
        restrictResultEntityType: 'dropwizardApplicationContainer'
      })
    )
  }),
  function ApplicationDataStatistics({ timeConfig, appdataProcessors }) {
    if (!appdataProcessors) {
      return <LoadingIndicator type="dark" />;
    }

    if (appdataProcessors.length < 1) {
      return <div>Statistics provider not found.</div>;
    }

    const dropwizard = appdataProcessors[0].dropwizardApplicationContainer;

    return (
      <Fragment>
        <DashboardSection title={`Dropped Spans`}>
          <Chart
            snapshotId={dropwizard.get('id')}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              formatter: percentage.detailed,
              metrics: [`metrics.gauges.KPI.incoming.span_messages.error_rate`],
              labels: ['Dropped Spans'],
              type: 'stackedArea'
            }}
          />
        </DashboardSection>
      </Fragment>
    );
  }
);
