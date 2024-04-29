/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { Card } from '@instana/components';

import { LogsChartInteractionWrapper } from 'in-kubernetes/Dashboards/commonComponents/LogsChartInteractionWrapper';
import MissingK8sPermissions from 'in-kubernetes/Dashboards/commonComponents/MissingK8sPermissions';
import K8DashboardsMarkerLanes from 'in-kubernetes/Dashboards/K8DashboardsMarkerLanes';
import { bytesTwoDecimalPlaces, twoDecimalPlaces } from 'in-services/formatters/number';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import { resourceQuotaBytes, resourceQuotaNumber } from 'in-kubernetes/formatters';
import { useGetK8sEntityUid } from 'in-kubernetes/Dashboards/useGetK8sEntityUid';
import { k8sPodAndServiceChart } from 'in-kubernetes/components/K8sChartColors';
import InfraMetricKpiCard from 'in-components/KpiCard/InfraMetricKpiCard';
import Endpoints from 'in-kubernetes/Dashboards/Service/tabs/Endpoints';
import KpiGridRow from 'in-components/KpiGridRow/KpiGridRow';
import { formatDuration } from 'in-services/formatters/date';
import KpiCard from 'in-components/KpiCard/KpiCard';
import { Col, Row } from 'in-components/layout/Grid';
import { t } from 'in-i18n';

export default function SummaryWithoutTimeShift({ timeConfig, data: service }) {
  const snapshotId = service.id;
  const { limits, requests, usage } = k8sPodAndServiceChart;
  const { tagFilterExpression: logsChartQuery } = useGetK8sEntityUid('kubernetes.service', snapshotId, timeConfig);

  return (
    <>
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
          <LogsChartInteractionWrapper tagFilterExpression={logsChartQuery} timeConfig={timeConfig} />
        </Col>
      </Row>
      <Row>
        <Col lg={12}>
          <Endpoints timeConfig={timeConfig} service={service} />
        </Col>
      </Row>
    </>
  );
}
