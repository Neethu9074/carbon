/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';

import { Card } from '@instana/components';

import MissingK8sPermissions from 'in-kubernetes/Dashboards/commonComponents/MissingK8sPermissions';
import { twoDecimalPlaces, bytesTwoDecimalPlaces } from 'in-services/formatters/number';
import K8DashboardsMarkerLanes from 'in-kubernetes/Dashboards/K8DashboardsMarkerLanes';
import { resourceQuotaBytes, resourceQuotaNumber } from 'in-kubernetes/formatters';
import InfraMetricKpiCard from 'in-components/KpiCard/InfraMetricKpiCard';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import Endpoints from 'in-kubernetes/Dashboards/Service/tabs/Endpoints';
import KpiGridRow from 'in-components/KpiGridRow/KpiGridRow';
import { formatDuration } from 'in-services/formatters/date';
import { Row, Col } from 'in-components/layout/Grid';
import KpiCard from 'in-components/KpiCard/KpiCard';
import theme from 'in-themes';
import { t } from 'in-i18n';

export default function Summary({ timeConfig, data: service }) {
  const snapshotId = service.id;
  const { orange800: limits, lime800: requests, lightBlue800: usage } = theme.lib.colors;

  return (
    <Fragment>
      <MissingK8sPermissions resourceSnapshotId={service.id} timeConfig={timeConfig} />

      <KpiGridRow sizes={[4, 4, 4]}>
        <KpiCard title={t('in-kubernetes:dashboards.type')} value={service.type} raw borderless />
        <KpiCard title={t('in-kubernetes:dashboards.location')} value={service.location} raw borderless />
        <KpiCard title={t('in-kubernetes:dashboards.age')} value={formatDuration(service.age)} raw borderless />
      </KpiGridRow>

      <Row>
        <Col lg={2}>
          <InfraMetricKpiCard
            title={t('in-kubernetes:dashboards.cpuUsage')}
            snapshotId={snapshotId}
            metric="cpu.total_usage"
            formatter={twoDecimalPlaces}
          />
        </Col>
        <Col lg={2}>
          <InfraMetricKpiCard
            title={t('in-kubernetes:dashboards.cpuRequests')}
            snapshotId={snapshotId}
            metric="cpuRequests"
            formatter={resourceQuotaNumber}
          />
        </Col>
        <Col lg={2}>
          <InfraMetricKpiCard
            title={t('in-kubernetes:dashboards.cpuLimits')}
            snapshotId={snapshotId}
            metric="cpuLimits"
            formatter={resourceQuotaNumber}
          />
        </Col>
        <Col lg={2}>
          <InfraMetricKpiCard
            title={t('in-kubernetes:dashboards.memoryUsage')}
            snapshotId={snapshotId}
            metric="memory.usage"
            formatter={bytesTwoDecimalPlaces}
          />
        </Col>
        <Col lg={2}>
          <InfraMetricKpiCard
            title={t('in-kubernetes:dashboards.memoryRequests')}
            snapshotId={snapshotId}
            metric="memoryRequests"
            formatter={resourceQuotaBytes}
          />
        </Col>
        <Col lg={2}>
          <InfraMetricKpiCard
            title={t('in-kubernetes:dashboards.memoryLimits')}
            snapshotId={snapshotId}
            metric="memoryLimits"
            formatter={resourceQuotaBytes}
          />
        </Col>
      </Row>

      <Row verticallyStretchColumns>
        <Col lg={6}>
          <Card title={t('in-kubernetes:dashboards.cpuResources')} useMaxAvailableHeight>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                formatter: resourceQuotaNumber,
                metrics: ['cpu.total_usage', 'cpuRequests', 'cpuLimits'],
                labels: [
                  t('in-kubernetes:dashboards.usage'),
                  t('in-kubernetes:dashboards.requests'),
                  t('in-kubernetes:dashboards.limits')
                ],
                type: 'line',
                colors: [usage, requests, limits]
              }}
              renderPostChartContent={K8DashboardsMarkerLanes}
              minRollup={10000}
            />
          </Card>
        </Col>
        <Col lg={6}>
          <Card title={t('in-kubernetes:dashboards.memoryResources')} useMaxAvailableHeight>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                formatter: resourceQuotaBytes,
                metrics: ['memory.usage', 'memoryRequests', 'memoryLimits'],
                labels: [
                  t('in-kubernetes:dashboards.usage'),
                  t('in-kubernetes:dashboards.requests'),
                  t('in-kubernetes:dashboards.limits')
                ],
                type: 'line',
                colors: [usage, requests, limits]
              }}
              renderPostChartContent={K8DashboardsMarkerLanes}
              minRollup={10000}
            />
          </Card>
        </Col>
      </Row>

      <Row>
        <Col lg={12}>
          <Endpoints timeConfig={timeConfig} service={service} />
        </Col>
      </Row>
    </Fragment>
  );
}
