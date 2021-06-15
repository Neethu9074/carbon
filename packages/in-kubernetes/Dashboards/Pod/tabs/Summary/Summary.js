/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';
import { get } from 'lodash';

import { Card } from '@instana/components';

import { zeroDecimalPlaces, twoDecimalPlaces, bytesTwoDecimalPlaces } from 'in-services/formatters/number';
import MissingK8sPermissions from 'in-kubernetes/Dashboards/commonComponents/MissingK8sPermissions';
import ConditionsTableCard from 'in-kubernetes/Dashboards/commonComponents/ConditionsTableCard';
import ContainerStates from 'in-kubernetes/Dashboards/Pod/tabs/Summary/ContainerStates';
import K8DashboardsMarkerLanes from 'in-kubernetes/Dashboards/K8DashboardsMarkerLanes';
import { resourceQuotaBytes, resourceQuotaNumber } from 'in-kubernetes/formatters';
import { valueMissingPlaceholder } from 'in-components/valueMissingPlaceholder';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { getPodDashboard } from 'in-kubernetes/navigation/paths';
import KpiGridRow from 'in-components/KpiGridRow/KpiGridRow';
import { formatDuration } from 'in-services/formatters/date';
import { Row, Col } from 'in-components/layout/Grid';
import KpiCard from 'in-components/KpiCard/KpiCard';
import MetricValue from 'in-components/MetricValue';
import Capitalize from 'in-components/Capitalize';
import theme from 'in-themes';
import { t } from 'in-i18n';

import locals from './Summary.mless';

export default function Summary({ data: pod, timeConfig }) {
  const snapshotId = pod.id;
  const message = get(pod, ['status', 'message']);
  const containerStatuses = get(pod, ['status', 'containerStatuses'], []);
  const { orange800: limits, lime800: requests, lightBlue800: usage } = theme.lib.colors;
  const kpiWidth = 2;

  return (
    <Fragment>
      <MissingK8sPermissions resourceSnapshotId={pod.id} timeConfig={timeConfig} />

      <KpiGridRow sizes={[3, 3, 2, 2, 2]}>
        <KpiCard
          title={t('in-kubernetes:dashboards.status')}
          value={<Capitalize>{get(pod, ['status', 'statusSummary'], valueMissingPlaceholder)}</Capitalize>}
          borderless
          raw
        />
        <KpiCard
          title={t('in-kubernetes:dashboards.phase')}
          value={<Capitalize>{get(pod, ['status', 'phase'], pod.phase)}</Capitalize>}
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
          value={<MetricValue snapshotId={pod.id} metric="restartCount" formatter={zeroDecimalPlaces} />}
          borderless
          raw
        />
        <KpiCard
          title={t('in-kubernetes:dashboards.age')}
          value={pod.age ? formatDuration(pod.age) : valueMissingPlaceholder}
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
            value={<MetricValue snapshotId={pod.id} metric="cpu.total_usage" formatter={twoDecimalPlaces} />}
            raw
          />
        </Col>
        <Col lg={kpiWidth}>
          <KpiCard
            title={t('in-kubernetes:dashboards.cpuRequests')}
            value={<MetricValue snapshotId={pod.id} metric="cpuRequests" formatter={resourceQuotaNumber} />}
            raw
          />
        </Col>
        <Col lg={kpiWidth}>
          <KpiCard
            title={t('in-kubernetes:dashboards.cpuLimits')}
            value={<MetricValue snapshotId={pod.id} metric="cpuLimits" formatter={resourceQuotaNumber} />}
            raw
          />
        </Col>
        <Col lg={kpiWidth}>
          <KpiCard
            title={t('in-kubernetes:dashboards.memoryUsage')}
            value={<MetricValue snapshotId={pod.id} metric="memory.usage" formatter={bytesTwoDecimalPlaces} />}
            raw
          />
        </Col>
        <Col lg={kpiWidth}>
          <KpiCard
            title={t('in-kubernetes:dashboards.memoryRequests')}
            value={<MetricValue snapshotId={pod.id} metric="memoryRequests" formatter={resourceQuotaBytes} />}
            raw
          />
        </Col>
        <Col lg={kpiWidth}>
          <KpiCard
            title={t('in-kubernetes:dashboards.memoryLimits')}
            value={<MetricValue snapshotId={pod.id} metric="memoryLimits" formatter={resourceQuotaBytes} />}
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
          <Card title={t('in-kubernetes:dashboards.containerStatus')} useMaxAvailableHeight>
            <ContainerStates pod={pod} timeConfig={timeConfig} />
          </Card>
        </Col>
      </Row>

      <Row>
        <Col lg={12}>
          <ConditionsTableCard
            conditions={pod.conditions}
            viewAllHref$={getPodDashboard(snapshotId, { tab: '/conditions' })}
          />
        </Col>
      </Row>
    </Fragment>
  );
}
