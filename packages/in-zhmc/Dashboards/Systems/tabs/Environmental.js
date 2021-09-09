/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';

import { Card } from '@instana/components';

import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { number } from 'in-services/formatters/number';
import { Row, Col } from 'in-components/layout/Grid';
import { t } from 'in-i18n';

export default function Environmental({ timeConfig, data: cpc }) {
  const snapshotId = cpc.id;
  return (
    <Fragment>
      <Row verticallyStretchColumns>
        <Col lg={6}>
          <Card title={t('in-zhmc:dashboards.heatLoad')} useMaxAvailableHeight>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                metrics: ['heatLoad', 'heatLoadForcedAir', 'heatLoadWater'],
                labels: [t('in-zhmc:heatLoad'), t('in-zhmc:heatLoadForcedAir'), t('in-zhmc:heatLoadWater')],
                formatter: number.detailed,
                type: 'line'
              }}
              renderPostChartContent={PluginDashboardsMarkerLanes}
            />
          </Card>
        </Col>
        <Col lg={6}>
          <Card title={t('in-zhmc:dashboards.environmental')} useMaxAvailableHeight>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                metrics: ['envTemperatureCelsius', 'dewPointCelsius', 'humidity', 'exhaustTemperatureCelsius'],
                labels: [
                  t('in-zhmc:temperature'),
                  t('in-zhmc:dewPoint'),
                  t('in-zhmc:humidity'),
                  t('in-zhmc:exhaustTemperature')
                ],
                formatter: number.detailed,
                type: 'line'
              }}
              renderPostChartContent={PluginDashboardsMarkerLanes}
            />
          </Card>
        </Col>
      </Row>
      <Row verticallyStretchColumns>
        {cpc.dpmEnabled === 'true' ? (
          <Col lg={6}>
            <Card title={t('in-zhmc:dashboards.temperature')} useMaxAvailableHeight>
              <Chart
                snapshotId={snapshotId}
                timeConfig={timeConfig}
                y1={{
                  min: 0,
                  metrics: ['dpmTemperatureCelsius'],
                  labels: [t('in-zhmc:temperature')],
                  formatter: number.detailed,
                  type: 'line'
                }}
                renderPostChartContent={PluginDashboardsMarkerLanes}
              />
            </Card>
          </Col>
        ) : (
          <Col lg={6}>
            <Card title={t('in-zhmc:dashboards.temperature')} useMaxAvailableHeight>
              <Chart
                snapshotId={snapshotId}
                timeConfig={timeConfig}
                y1={{
                  min: 0,
                  metrics: ['temperatureCelsius'],
                  labels: [t('in-zhmc:temperature')],
                  formatter: number.detailed,
                  type: 'line'
                }}
                renderPostChartContent={PluginDashboardsMarkerLanes}
              />
            </Card>
          </Col>
        )}

        <Col lg={6}>
          <Card title={t('in-zhmc:powerConsumptionWatts')} useMaxAvailableHeight>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                metrics: ['envPowerConsumptionWatts'],
                labels: [t('in-zhmc:powerConsumptionWatts')],
                formatter: number.detailed,
                type: 'line'
              }}
              renderPostChartContent={PluginDashboardsMarkerLanes}
            />
          </Card>
        </Col>
      </Row>
    </Fragment>
  );
}
