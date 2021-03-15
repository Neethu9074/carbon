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
import { t } from 'in-i18n';

export default connectTo(
  {
    timeConfig: timeConfig$
  },
  function Region({ timeConfig }) {
    return (
      <Fragment>
        <DashboardSection title={t('in-internal:monitoringUnit.region.units')}>
          <Chart
            snapshotId={ID_OF_REGION}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              formatter: number.compact,
              metrics: ['units'],
              labels: [t('in-internal:monitoringUnit.region.units')],
              type: 'stackedArea'
            }}
          />
        </DashboardSection>

        <Row>
          <Col lg={6}>
            <DashboardSection title={t('in-internal:monitoringUnit.region.infraEntityMonitor')}>
              <Chart
                snapshotId={ID_OF_REGION}
                timeConfig={timeConfig}
                y1={{
                  min: 0,
                  formatter: number.compact,
                  metrics: ['entities'],
                  labels: [t('in-internal:monitoringUnit.region.entities')],
                  type: 'stackedArea'
                }}
                y2={{
                  min: 0,
                  formatter: number.compact,
                  metrics: ['hosts', 'processes', 'containers'],
                  labels: [
                    t('in-internal:monitoringUnit.region.hosts'),
                    t('in-internal:monitoringUnit.region.processes'),
                    t('in-internal:monitoringUnit.region.containers')
                  ],
                  type: 'line'
                }}
              />
            </DashboardSection>
          </Col>
          <Col lg={6}>
            <DashboardSection title={t('in-internal:monitoringUnit.region.infraMetricMonitoring')}>
              <Chart
                snapshotId={ID_OF_REGION}
                timeConfig={timeConfig}
                y1={{
                  min: 0,
                  formatter: number.compact,
                  metrics: ['metrics'],
                  labels: [t('in-internal:monitoringUnit.region.metrics')],
                  type: 'stackedArea'
                }}
              />
            </DashboardSection>
          </Col>
        </Row>

        <DashboardSection title={t('in-internal:monitoringUnit.region.appMonitoring')}>
          <Chart
            snapshotId={ID_OF_REGION}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              formatter: number.compact,
              metrics: ['acceptedSpans', 'processedSpans'],
              labels: [
                t('in-internal:monitoringUnit.region.acceptedSpans'),
                t('in-internal:monitoringUnit.region.processedSpans')
              ],
              type: 'line'
            }}
          />
        </DashboardSection>

        <Row>
          <Col lg={6}>
            <DashboardSection title={t('in-internal:monitoringUnit.region.websiteMonitoring')}>
              <Chart
                snapshotId={ID_OF_REGION}
                timeConfig={timeConfig}
                y1={{
                  min: 0,
                  formatter: number.compact,
                  metrics: ['acceptedBeacons', 'processedBeacons'],
                  labels: [
                    t('in-internal:monitoringUnit.region.acceptedBeacons'),
                    t('in-internal:monitoringUnit.region.processedBeacons')
                  ],
                  type: 'line'
                }}
              />
            </DashboardSection>
          </Col>
          <Col lg={6}>
            <DashboardSection title={t('in-internal:monitoringUnit.region.mobileAppMonitoring')}>
              <Chart
                snapshotId={ID_OF_REGION}
                timeConfig={timeConfig}
                y1={{
                  min: 0,
                  formatter: number.compact,
                  metrics: ['acceptedMobileBeacons', 'processedMobileBeacons'],
                  labels: [
                    t('in-internal:monitoringUnit.region.acceptedBeacons'),
                    t('in-internal:monitoringUnit.region.processedBeacons')
                  ],
                  type: 'line'
                }}
              />
            </DashboardSection>
          </Col>
        </Row>

        <DashboardSection title={t('in-internal:monitoringUnit.region.profileMonitoring')}>
          <Chart
            snapshotId={ID_OF_REGION}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              formatter: number.compact,
              metrics: ['acceptedProfiles'],
              labels: [t('in-internal:monitoringUnit.region.acceptedProfiles')],
              type: 'line'
            }}
          />
        </DashboardSection>
      </Fragment>
    );
  }
);
