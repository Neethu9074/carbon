/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { get } from 'lodash';
import React from 'react';

import { Card } from '@instana/components';

import { LogsChartInteractionWrapper } from 'in-kubernetes/Dashboards/commonComponents/LogsChartInteractionWrapper';
import { bytesTwoDecimalPlaces, twoDecimalPlaces, zeroDecimalPlaces } from 'in-services/formatters/number';
import MissingK8sPermissions from 'in-kubernetes/Dashboards/commonComponents/MissingK8sPermissions';
import ConditionsTableCard from 'in-kubernetes/Dashboards/commonComponents/ConditionsTableCard';
import ContainerStates from 'in-kubernetes/Dashboards/Pod/tabs/Summary/ContainerStates';
import K8DashboardsMarkerLanes from 'in-kubernetes/Dashboards/K8DashboardsMarkerLanes';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import { resourceQuotaBytes, resourceQuotaNumber } from 'in-kubernetes/formatters';
import { useGetK8sEntityUid } from 'in-kubernetes/Dashboards/useGetK8sEntityUid';
import { k8sPodAndServiceChart } from 'in-kubernetes/components/K8sChartColors';
import { usePodDashboard } from 'in-kubernetes/navigation/paths';
import KpiGridRow from 'in-components/KpiGridRow/KpiGridRow';
import { formatDuration } from 'in-services/formatters/date';
import { capitalizeValue } from 'in-components/Capitalize';
import KpiCard from 'in-components/KpiCard/KpiCard';
import MetricValue from 'in-components/MetricValue';
import { Col, Row } from 'in-components/layout/Grid';
import { t } from 'in-i18n';

import locals from './Summary.mless';

export default function SummaryWithoutTimeShift({ data: pod, timeConfig }) {
  const snapshotId = pod.id;
  const message = get(pod, ['status', 'message']);
  const containerStatuses = get(pod, ['status', 'containerStatuses'], []);

  const { limits, requests, usage } = k8sPodAndServiceChart;

  const kpiWidth = 2;

  const { tagFilterExpression: logsChartQuery } = useGetK8sEntityUid('kubernetes.pod', snapshotId, timeConfig);
  const viewAllHref = usePodDashboard(snapshotId, { tab: '/conditions' });

  return (
    <>
      <MissingK8sPermissions resourceSnapshotId={pod.id} timeConfig={timeConfig} />
      <KpiGridRow sizes={[3, 3, 2, 2, 2]}>
        <KpiCard
          title={t('in-kubernetes:dashboards.status')}
          value={get(pod, ['status', 'statusSummary'])}
          renderValue={capitalizeValue}
          borderless
          raw
        />
        <KpiCard
          title={t('in-kubernetes:dashboards.phase')}
          value={get(pod, ['status', 'phase'], pod.phase)}
          renderValue={capitalizeValue}
          borderless
          raw
        />
        <KpiCard
          title={t('in-kubernetes:dashboards.readySummary')}
          value={`${containerStatuses.filter(c => c.ready).length}/${containerStatuses.length}`}
          borderless
          raw
        />
        <KpiCard
          title={t('in-kubernetes:dashboards.restarts')}
          value={pod.id}
          renderValue={podId => <MetricValue snapshotId={podId} metric="restartCount" formatter={zeroDecimalPlaces} />}
          borderless
          raw
        />
        <KpiCard
          title={t('in-kubernetes:dashboards.age')}
          value={pod.age}
          renderValue={formatDuration}
          borderless
          raw
        />
      </KpiGridRow>
      {message && (
        <Row>
          <Col lg={12}>
            <KpiCard
              title={t('in-kubernetes:dashboards.statusMessage')}
              valuesClassName={locals.message}
              value={message}
              raw
            />
          </Col>
        </Row>
      )}
      <Row>
        <Col lg={kpiWidth}>
          <KpiCard
            title={t('in-kubernetes:dashboards.cpuUsage')}
            value={pod.id}
            renderValue={podId => (
              <MetricValue snapshotId={podId} metric="cpu.total_usage" formatter={twoDecimalPlaces} />
            )}
            raw
          />
        </Col>
        <Col lg={kpiWidth}>
          <KpiCard
            title={t('in-kubernetes:dashboards.cpuRequests')}
            value={pod.id}
            renderValue={podId => (
              <MetricValue snapshotId={podId} metric="cpuRequests" formatter={resourceQuotaNumber} />
            )}
            raw
          />
        </Col>
        <Col lg={kpiWidth}>
          <KpiCard
            title={t('in-kubernetes:dashboards.cpuLimits')}
            value={pod.id}
            renderValue={podId => <MetricValue snapshotId={podId} metric="cpuLimits" formatter={resourceQuotaNumber} />}
            raw
          />
        </Col>
        <Col lg={kpiWidth}>
          <KpiCard
            title={t('in-kubernetes:dashboards.memoryUsage')}
            value={pod.id}
            renderValue={podId => (
              <MetricValue snapshotId={podId} metric="memory.usage" formatter={bytesTwoDecimalPlaces} />
            )}
            raw
          />
        </Col>
        <Col lg={kpiWidth}>
          <KpiCard
            title={t('in-kubernetes:dashboards.memoryRequests')}
            value={pod.id}
            renderValue={podId => (
              <MetricValue snapshotId={podId} metric="memoryRequests" formatter={resourceQuotaBytes} />
            )}
            raw
          />
        </Col>
        <Col lg={kpiWidth}>
          <KpiCard
            title={t('in-kubernetes:dashboards.memoryLimits')}
            value={pod.id}
            renderValue={podId => (
              <MetricValue snapshotId={podId} metric="memoryLimits" formatter={resourceQuotaBytes} />
            )}
            raw
          />
        </Col>
      </Row>
      <Row>
        <Col lg={6}>
          <Card title={t('in-kubernetes:dashboards.cpuResources')}>
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
          <Card title={t('in-kubernetes:dashboards.memoryResources')}>
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
          <Card title={t('in-kubernetes:dashboards.containerStatus')} useMaxAvailableHeight>
            <ContainerStates pod={pod} timeConfig={timeConfig} />
          </Card>
        </Col>
      </Row>
      <Row>
        <Col lg={12}>
          <ConditionsTableCard conditions={pod.conditions} viewAllHref={viewAllHref} />
        </Col>
      </Row>
    </>
  );
}
