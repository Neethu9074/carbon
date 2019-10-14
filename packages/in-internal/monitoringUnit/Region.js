import React, { Fragment } from 'react';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { number } from 'in-services/formatters/number';
import { timeConfig$ } from 'in-stores/time/config';
import { ID_OF_REGION } from 'in-forge/constants';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  {
    timeConfig: timeConfig$
  },
  function Region({ timeConfig }) {
    return (
      <Fragment>
        <DashboardSection title="Units">
          <Chart
            snapshotId={ID_OF_REGION}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              formatter: number.compact,
              metrics: ['units'],
              labels: ['Units'],
              type: 'stackedArea'
            }}
          />
        </DashboardSection>

        <DashboardSection title="Entities">
          <Chart
            snapshotId={ID_OF_REGION}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              formatter: number.compact,
              metrics: ['entities'],
              labels: ['Entities'],
              type: 'stackedArea'
            }}
            y2={{
              min: 0,
              formatter: number.compact,
              metrics: ['hosts', 'processes'],
              labels: ['Hosts', 'Processes'],
              type: 'line'
            }}
          />
        </DashboardSection>

        <DashboardSection title="Spans">
          <Chart
            snapshotId={ID_OF_REGION}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              formatter: number.compact,
              metrics: ['acceptedSpans', 'processedSpans'],
              labels: ['Accepted Spans', 'Processed Spans'],
              type: 'line'
            }}
          />
        </DashboardSection>

        <DashboardSection title="Beacons">
          <Chart
            snapshotId={ID_OF_REGION}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              formatter: number.compact,
              metrics: ['acceptedBeacons', 'processedBeacons'],
              labels: ['Accepted Beacons', 'Processed Beacons'],
              type: 'line'
            }}
          />
        </DashboardSection>
      </Fragment>
    );
  }
);
