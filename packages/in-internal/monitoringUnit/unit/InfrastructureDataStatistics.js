import React, { Fragment } from 'react';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { getPhysicalStack } from 'in-internal/components/dataRetrieval';
import { number, percentage } from 'in-services/formatters/number';
import LoadingIndicator from 'in-components/LoadingIndicator';
import { timeConfig$ } from 'in-stores/time/config';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  ({ tenant, unit }) => ({
    timeConfig: timeConfig$,
    fillers: timeConfig$.flatMap(timeConfig =>
      getPhysicalStack({
        searchQuery: `${tenant}-${unit}-filler`,
        timeConfig,
        restrictResultEntityType: 'dropwizardApplicationContainer'
      })
    )
  }),
  function InfrastructureDataStatistics({ timeConfig, fillers }) {
    if (!fillers) {
      return <LoadingIndicator type="dark" />;
    }

    if (fillers.length < 1) {
      return <div>Statistics provider not found.</div>;
    }

    const dropwizard = fillers[0].dropwizardApplicationContainer;

    return (
      <Fragment>
        <DashboardSection title={`Number of Entities`}>
          <Chart
            snapshotId={dropwizard.get('id')}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              formatter: number.compact,
              metrics: [
                `metrics.gauges.com.instana.filler.service.snapshot.OnlineSnapshotsLimit.online-snapshots-count`
              ],
              labels: ['Number of Entities'],
              type: 'stackedArea'
            }}
          />
        </DashboardSection>

        <DashboardSection title={`Number of Entities`}>
          <Chart
            snapshotId={dropwizard.get('id')}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              max: 1,
              formatter: percentage.detailed,
              metrics: [
                `metrics.gauges.com.instana.filler.service.snapshot.OnlineSnapshotsLimit.online-snapshots-usage`
              ],
              labels: ['Entity Usage'],
              type: 'stackedArea'
            }}
          />
        </DashboardSection>

        <DashboardSection title={`Processed Agent Messages`}>
          <Chart
            snapshotId={dropwizard.get('id')}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              formatter: number.compact,
              metrics: [`metrics.meters.com.instana.filler.raw-entity.processed`],
              labels: ['Processed Agent Messages'],
              type: 'stackedArea'
            }}
          />
        </DashboardSection>

        <DashboardSection title={`Dropped Agent Messages`}>
          <Chart
            snapshotId={dropwizard.get('id')}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              formatter: number.compact,
              metrics: [`metrics.meters.com.instana.filler.raw-entity.dropped`],
              labels: ['Dropped Agent Messages'],
              type: 'stackedArea'
            }}
          />
        </DashboardSection>
      </Fragment>
    );
  }
);
