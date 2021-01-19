/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React, { Fragment } from 'react';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { Row, Col } from 'in-new-components/layout/Grid';
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

        <Row>
          <Col lg={6}>
            <DashboardSection title="Infrastructure Entity Monitoring">
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
                  metrics: ['hosts', 'processes', 'containers'],
                  labels: ['Hosts', 'Processes', 'Containers'],
                  type: 'line'
                }}
              />
            </DashboardSection>
          </Col>
          <Col lg={6}>
            <DashboardSection title="Infrastructure Metric Monitoring">
              <Chart
                snapshotId={ID_OF_REGION}
                timeConfig={timeConfig}
                y1={{
                  min: 0,
                  formatter: number.compact,
                  metrics: ['metrics'],
                  labels: ['Metrics'],
                  type: 'stackedArea'
                }}
              />
            </DashboardSection>
          </Col>
        </Row>

        <DashboardSection title="Application Monitoring">
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

        <Row>
          <Col lg={6}>
            <DashboardSection title="Website Monitoring">
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
          </Col>
          <Col lg={6}>
            <DashboardSection title="Mobile App Monitoring">
              <Chart
                snapshotId={ID_OF_REGION}
                timeConfig={timeConfig}
                y1={{
                  min: 0,
                  formatter: number.compact,
                  metrics: ['acceptedMobileBeacons', 'processedMobileBeacons'],
                  labels: ['Accepted Beacons', 'Processed Beacons'],
                  type: 'line'
                }}
              />
            </DashboardSection>
          </Col>
        </Row>

        <DashboardSection title="Profile Monitoring">
          <Chart
            snapshotId={ID_OF_REGION}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              formatter: number.compact,
              metrics: ['acceptedProfiles'],
              labels: ['Accepted Profiles'],
              type: 'line'
            }}
          />
        </DashboardSection>
      </Fragment>
    );
  }
);
