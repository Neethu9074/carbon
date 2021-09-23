/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';

import { Card } from '@instana/components';

import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import InfraMetricKpiCard from 'in-components/KpiCard/InfraMetricKpiCard';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { number, percentage } from 'in-services/formatters/number';
import { Row, Col } from 'in-components/layout/Grid';
import MessageTable from '../../tables/MessageTable';
import Processors from '../../tables/Processors';
import { t } from 'in-i18n';

export default function Summary({ timeConfig, data: cpc }) {
  const snapshotId = cpc.id;

  if (cpc.dpmEnabled === 'false') {
    return (
      <Fragment>
        <Row>
          <Col lg={4}>
            <InfraMetricKpiCard
              title={t('in-zhmc:dashboards.cpcProcessorUsage')}
              snapshotId={snapshotId}
              metric="cpcProcessorUsage"
              formatter={percentage.detailed}
            />
          </Col>
          <Col lg={4}>
            <InfraMetricKpiCard
              title={t('in-zhmc:dashboards.powerConsumptionWatts')}
              snapshotId={snapshotId}
              metric="powerConsumptionWatts"
              formatter={number.compact}
            />
          </Col>
        </Row>

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
                    'aapSharedProcessorUsage'
                  ],
                  labels: [t('in-zhmc:ifl'), t('in-zhmc:icf'), t('in-zhmc:cbp'), t('in-zhmc:cp'), t('in-zhmc:aap')],
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
                    'aapDedicatedProcessorUsage'
                  ],
                  labels: [t('in-zhmc:ifl'), t('in-zhmc:icf'), t('in-zhmc:cbp'), t('in-zhmc:cp'), t('in-zhmc:aap')],
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
        <MessageTable snapshotId={cpc.id} />
      </Fragment>
    );
  } else {
    return (
      <Fragment>
        <Row>
          <Col lg={4}>
            <InfraMetricKpiCard
              title={t('in-zhmc:dashboards.cpcProcessorUsage')}
              snapshotId={snapshotId}
              metric="processorUsage"
              formatter={percentage.detailed}
            />
          </Col>
          <Col lg={4}>
            <InfraMetricKpiCard
              title={t('in-zhmc:dashboards.powerConsumptionWatts')}
              snapshotId={snapshotId}
              metric="dpmPowerConsumptionWatts"
              formatter={number.compact}
            />
          </Col>
        </Row>

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
        <MessageTable snapshotId={cpc.id} />
      </Fragment>
    );
  }
}
