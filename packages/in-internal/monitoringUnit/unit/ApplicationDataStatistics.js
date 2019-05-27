import React, { Fragment } from 'react';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { getPhysicalStack } from 'in-internal/components/dataRetrieval';
import { percentage, number } from 'in-services/formatters/number';
import LoadingIndicator from 'in-components/LoadingIndicator';
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
        <DashboardSection title={`Backend Dropped Spans`}>
          <Chart
            snapshotId={dropwizard.get('id')}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              max: 1,
              formatter: percentage.detailed,
              metrics: [`metrics.gauges.KPI.incoming.span_messages.error_rate`],
              labels: ['Backend Dropped Spans'],
              type: 'stackedArea'
            }}
          />
        </DashboardSection>

        <DashboardSection title={`Processed Spans`}>
          <Chart
            snapshotId={dropwizard.get('id')}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              formatter: number.compact,
              metrics: [`metrics.meters.KPI.processing.spans.calls`],
              labels: ['Processed Spans'],
              type: 'stackedArea'
            }}
          />
        </DashboardSection>

        <DashboardSection title={`Dropped Spans due to Configuration`}>
          <Chart
            snapshotId={dropwizard.get('id')}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              formatter: number.compact,
              metrics: [
                `metrics.meters.com.instana.spanprocessing.stream.source.RawSpansSource.dropped-due-to-span-rate-throttler`
              ],
              labels: ['Dropped Spans due to Configuration'],
              type: 'stackedArea'
            }}
          />
        </DashboardSection>
      </Fragment>
    );
  }
);
