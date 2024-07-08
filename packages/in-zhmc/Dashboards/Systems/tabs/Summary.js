/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';

import { Card } from '@instana/components';

import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import InfraMetricKpiCard from 'in-components/KpiCard/InfraMetricKpiCard';
import { number, percentage } from 'in-services/formatters/number';
import KpiGridRow from 'in-components/KpiGridRow/KpiGridRow';
import { Row, Col } from 'in-components/layout/Grid';
import KpiCard from 'in-components/KpiCard/KpiCard';
import Processors from '../../tables/Processors';
import { t } from 'in-i18n';

export default function Summary({ timeConfig, data: cpc }) {
  const snapshotId = cpc.id;
  if (cpc.dpmEnabled === 'false') {
    return (
      <Fragment>
        <KpiGridRow sizes={[2, 2, 2, 4]}>
          <KpiCard title={t('in-zhmc:hmcVersion')} value={cpc.hmcVersion} raw borderless />
          <KpiCard title={t('in-zhmc:apiVersion')} value={cpc.apiVersion} raw borderless />
          <InfraMetricKpiCard
            title={t('in-zhmc:dashboards.cpcProcessorUsage')}
            snapshotId={snapshotId}
            metric="cpcProcessorUsage"
            formatter={percentage.detailed}
          />
          <InfraMetricKpiCard
            title={t('in-zhmc:dashboards.powerConsumptionWatts')}
            snapshotId={snapshotId}
            metric="powerConsumptionWatts"
            formatter={number.compact}
          />
        </KpiGridRow>
        {cpc.hmcVersion == '2.14.0' || cpc.hmcVersion == '2.15.0' ? (
          <Row verticallyStretchColumns>
            <Col lg={4}>
              <Card title={t('in-zhmc:dashboards.all')} useMaxAvailableHeight>
                <Chart
                  snapshotId={snapshotId}
                  timeConfig={timeConfig}
                  y1={{
                    min: 0,
                    metrics: [
                      'iipAllProcessorUsage',
                      'iflAllProcessorUsage',
                      'icfAllProcessorUsage',
                      'cbpAllProcessorUsage',
                      'cpAllProcessorUsage'
                    ],
                    labels: [t('in-zhmc:iip'), t('in-zhmc:ifl'), t('in-zhmc:icf'), t('in-zhmc:cbp'), t('in-zhmc:cp')],
                    formatter: percentage.detailed,
                    type: 'line'
                  }}
                  renderPostChartContent={PluginDashboardsMarkerLanes}
                />
              </Card>
            </Col>
            <Col lg={4}>
              <Card title={t('in-zhmc:dashboards.shared')} useMaxAvailableHeight>
                <Chart
                  snapshotId={snapshotId}
                  timeConfig={timeConfig}
                  y1={{
                    min: 0,
                    metrics: [
                      'iflSharedProcessorUsage',
                      'icfSharedProcessorUsage',
                      'cbpSharedProcessorUsage',
                      'cpSharedProcessorUsage',
                      'aapSharedProcessorUsage',
                      'iipSharedProcessorUsage',
                      'allSharedProcessorUsage'
                    ],
                    labels: [
                      t('in-zhmc:ifl'),
                      t('in-zhmc:icf'),
                      t('in-zhmc:cbp'),
                      t('in-zhmc:cp'),
                      t('in-zhmc:aap'),
                      t('in-zhmc:iip'),
                      t('in-zhmc:allProc')
                    ],
                    formatter: percentage.detailed,
                    type: 'line'
                  }}
                  renderPostChartContent={PluginDashboardsMarkerLanes}
                />
              </Card>
            </Col>
            <Col lg={4}>
              <Card title={t('in-zhmc:dashboards.dedicated')} useMaxAvailableHeight>
                <Chart
                  snapshotId={snapshotId}
                  timeConfig={timeConfig}
                  y1={{
                    min: 0,
                    metrics: [
                      'iflDedicatedProcessorUsage',
                      'icfDedicatedProcessorUsage',
                      'cbpDedicatedProcessorUsage',
                      'cpDedicatedProcessorUsage',
                      'aapDedicatedProcessorUsage',
                      'iipDedicatedProcessorUsage',
                      'allDedicatedProcessorUsage'
                    ],
                    labels: [
                      t('in-zhmc:ifl'),
                      t('in-zhmc:icf'),
                      t('in-zhmc:cbp'),
                      t('in-zhmc:cp'),
                      t('in-zhmc:aap'),
                      t('in-zhmc:iip'),
                      t('in-zhmc:allProc')
                    ],
                    formatter: percentage.detailed,
                    type: 'line'
                  }}
                  renderPostChartContent={PluginDashboardsMarkerLanes}
                />
              </Card>
            </Col>
          </Row>
        ) : (
          <Row verticallyStretchColumns>
            <Col lg={4}>
              <Card title={t('in-zhmc:dashboards.all')} useMaxAvailableHeight>
                <Chart
                  snapshotId={snapshotId}
                  timeConfig={timeConfig}
                  y1={{
                    min: 0,
                    metrics: [
                      'iipAllProcessorUsage',
                      'iflAllProcessorUsage',
                      'icfAllProcessorUsage',
                      'cpAllProcessorUsage'
                    ],
                    labels: [t('in-zhmc:iip'), t('in-zhmc:ifl'), t('in-zhmc:icf'), t('in-zhmc:cp')],
                    formatter: percentage.detailed,
                    type: 'line'
                  }}
                  renderPostChartContent={PluginDashboardsMarkerLanes}
                />
              </Card>
            </Col>
            <Col lg={4}>
              <Card title={t('in-zhmc:dashboards.shared')} useMaxAvailableHeight>
                <Chart
                  snapshotId={snapshotId}
                  timeConfig={timeConfig}
                  y1={{
                    min: 0,
                    metrics: [
                      'iflSharedProcessorUsage',
                      'icfSharedProcessorUsage',
                      'cpSharedProcessorUsage',
                      'aapSharedProcessorUsage',
                      'iipSharedProcessorUsage',
                      'allSharedProcessorUsage'
                    ],
                    labels: [
                      t('in-zhmc:ifl'),
                      t('in-zhmc:icf'),
                      t('in-zhmc:cp'),
                      t('in-zhmc:aap'),
                      t('in-zhmc:iip'),
                      t('in-zhmc:allProc')
                    ],
                    formatter: percentage.detailed,
                    type: 'line'
                  }}
                  renderPostChartContent={PluginDashboardsMarkerLanes}
                />
              </Card>
            </Col>
            <Col lg={4}>
              <Card title={t('in-zhmc:dashboards.dedicated')} useMaxAvailableHeight>
                <Chart
                  snapshotId={snapshotId}
                  timeConfig={timeConfig}
                  y1={{
                    min: 0,
                    metrics: [
                      'iflDedicatedProcessorUsage',
                      'icfDedicatedProcessorUsage',
                      'cpDedicatedProcessorUsage',
                      'aapDedicatedProcessorUsage',
                      'iipDedicatedProcessorUsage',
                      'allDedicatedProcessorUsage'
                    ],
                    labels: [
                      t('in-zhmc:ifl'),
                      t('in-zhmc:icf'),
                      t('in-zhmc:cp'),
                      t('in-zhmc:aap'),
                      t('in-zhmc:iip'),
                      t('in-zhmc:allProc')
                    ],
                    formatter: percentage.detailed,
                    type: 'line'
                  }}
                  renderPostChartContent={PluginDashboardsMarkerLanes}
                />
              </Card>
            </Col>
          </Row>
        )}
        <Row />
        <Processors data={cpc} timeConfig={timeConfig} />
      </Fragment>
    );
  } else {
    return (
      <Fragment>
        <KpiGridRow sizes={[2, 2, 2, 4]}>
          <KpiCard title={t('in-zhmc:hmcVersion')} value={cpc.hmcVersion} raw borderless />
          <KpiCard title={t('in-zhmc:apiVersion')} value={cpc.apiVersion} raw borderless />
          <InfraMetricKpiCard
            title={t('in-zhmc:dashboards.cpcProcessorUsage')}
            snapshotId={snapshotId}
            metric="processorUsage"
            formatter={percentage.detailed}
          />
          <InfraMetricKpiCard
            title={t('in-zhmc:dashboards.powerConsumptionWatts')}
            snapshotId={snapshotId}
            metric="dpmPowerConsumptionWatts"
            formatter={number.compact}
          />
        </KpiGridRow>

        <Row verticallyStretchColumns>
          <Col lg={6}>
            <Card title={t('in-zhmc:dashboards.all')} useMaxAvailableHeight>
              <Chart
                snapshotId={snapshotId}
                timeConfig={timeConfig}
                y1={{
                  min: 0,
                  metrics: ['dpmCpAllProcessorUsage', 'dpmIflAllProcessorUsage'],
                  labels: [t('in-zhmc:cp'), t('in-zhmc:ifl')],
                  formatter: percentage.detailed,
                  type: 'line'
                }}
                renderPostChartContent={PluginDashboardsMarkerLanes}
              />
            </Card>
          </Col>
          <Col lg={6}>
            <Card title={t('in-zhmc:dashboards.shared')} useMaxAvailableHeight>
              <Chart
                snapshotId={snapshotId}
                timeConfig={timeConfig}
                y1={{
                  min: 0,
                  metrics: ['dpmCpSharedProcessorUsage', 'dpmIflSharedProcessorUsage', 'dpmAllSharedProcessorUsage'],
                  labels: [t('in-zhmc:cp'), t('in-zhmc:ifl'), 'All'],
                  formatter: percentage.detailed,
                  type: 'line'
                }}
                renderPostChartContent={PluginDashboardsMarkerLanes}
              />
            </Card>
          </Col>
        </Row>
        <Row />
        <Processors data={cpc} timeConfig={timeConfig} />
      </Fragment>
    );
  }
}
