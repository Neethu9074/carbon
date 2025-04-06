/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';

import { TimeConfig } from '@instana/types';
import { Card } from '@instana/components';

// @ts-expect-error Module needs to be translated to TS
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import { number, percentage } from 'in-services/formatters/number';
import { Row, Col } from 'in-components/layout/Grid';
import { t } from 'in-i18n';

interface EnvironmentalProps {
  timeConfig: TimeConfig;
  data: {
    id: string;
    dpmEnabled: string;
  };
}

export default function Environmental({ timeConfig, data: cpc }: EnvironmentalProps): JSX.Element {
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
                labels: [t('in-zhmc:totalHeatLoad'), t('in-zhmc:heatLoadForcedAir'), t('in-zhmc:heatLoadWater')],
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
                metrics: ['envTemperatureCelsius', 'dewPointCelsius', 'exhaustTemperatureCelsius'],
                labels: [t('in-zhmc:temperature'), t('in-zhmc:dewPoint'), t('in-zhmc:exhaustTemperature')],
                formatter: number.detailed,
                type: 'line'
              }}
              y2={{
                min: 0,
                metrics: ['humidity'],
                labels: [t('in-zhmc:humidity')],
                formatter: percentage.detailed,
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
          <Card title={t('in-zhmc:dashboards.powerConsumptionWatts')} useMaxAvailableHeight>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                metrics: [
                  'envPowerConsumptionWatts',
                  'partitionPowerConsumption',
                  'infraPowerConsumption',
                  'unassignedPowerConsumption'
                ],
                labels: [
                  t('in-zhmc:powerConsumption'),
                  t('in-zhmc:partitionPowerConsumption'),
                  t('in-zhmc:infraPowerConsumption'),
                  t('in-zhmc:unassignedPowerConsumption')
                ],
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
