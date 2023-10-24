/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';

import { Card } from '@instana/components';

import {
  LogsChartInteractionWrapper,
  andQuery,
  kubernetesClusterTagEquals,
  kubernetesNamespaceTagEquals,
  tagEquals
} from 'in-kubernetes/Dashboards/commonComponents/LogsChartInteractionWrapper';
import MissingK8sPermissions from 'in-kubernetes/Dashboards/commonComponents/MissingK8sPermissions';
import { twoDecimalPlaces, bytesTwoDecimalPlaces } from 'in-services/formatters/number';
import K8DashboardsMarkerLanes from 'in-kubernetes/Dashboards/K8DashboardsMarkerLanes';
import { resourceQuotaBytes, resourceQuotaNumber } from 'in-kubernetes/formatters';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import InfraMetricKpiCard from 'in-components/KpiCard/InfraMetricKpiCard';
import Endpoints from 'in-kubernetes/Dashboards/Service/tabs/Endpoints';
import KpiGridRow from 'in-components/KpiGridRow/KpiGridRow';
import { formatDuration } from 'in-services/formatters/date';
import { Row, Col } from 'in-components/layout/Grid';
import KpiCard from 'in-components/KpiCard/KpiCard';
import oldTheme from 'in-themes';
import { t } from 'in-i18n';

export default function SummaryWithoutTimeShift({ timeConfig, data: service }) {
  const snapshotId = service.id;

  const limits = oldTheme.lib.colors.chart.threeColorPalette[0];
  const requests = oldTheme.lib.colors.chart.threeColorPalette[1];
  const usage = oldTheme.lib.colors.chart.threeColorPalette[2];

  const clusterTag = kubernetesClusterTagEquals(service.clusterName);
  const nsTag = kubernetesNamespaceTagEquals(service.namespace);
  const uidTag = tagEquals('kubernetes.service.uid', service.uid);

  return (
    <Fragment>
      <MissingK8sPermissions resourceSnapshotId={service.id} timeConfig={timeConfig} />

      <KpiGridRow sizes={[4, 4, 4]}>
        <KpiCard title={t('in-kubernetes:dashboards.type')} value={service.type} raw borderless />
        <KpiCard title={t('in-kubernetes:dashboards.location')} value={service.location} raw borderless />
        <KpiCard
          title={t('in-kubernetes:dashboards.age')}
          value={service.age}
          renderValue={formatDuration}
          raw
          borderless
        />
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
          <LogsChartInteractionWrapper
            tagFilterExpression={andQuery(clusterTag, nsTag, uidTag)}
            timeConfig={timeConfig}
          />
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
