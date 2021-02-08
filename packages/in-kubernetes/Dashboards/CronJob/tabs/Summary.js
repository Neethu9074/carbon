/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React, { Fragment } from 'react';
import theme from 'in-themes';

import MissingK8sPermissions from 'in-kubernetes/Dashboards/commonComponents/MissingK8sPermissions';
import ConditionsTableCard from 'in-kubernetes/Dashboards/commonComponents/ConditionsTableCard';
import K8DashboardsMarkerLanes from 'in-kubernetes/Dashboards/K8DashboardsMarkerLanes';
import InfraMetricKpiCard from 'in-new-components/KpiCard/InfraMetricKpiCard';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { getCronJobDashboard } from 'in-kubernetes/navigation/paths';
import { zeroDecimalPlaces } from 'in-services/formatters/number';
import { formatDuration } from 'in-services/formatters/date';
import { Row, Col } from 'in-new-components/layout/Grid';
import Card from 'in-new-components/Card';

export default function Summary({ timeConfig, data: cronJob }) {
  const snapshotId = cronJob.id;
  const { teal800: active } = theme.lib.colors;

  return (
    <Fragment>
      <MissingK8sPermissions resourceSnapshotId={cronJob.id} timeConfig={timeConfig} />

      <Row>
        <Col lg={4}>
          <InfraMetricKpiCard
            title={t('in-kubernetes:dashboards.lastJobDuration')}
            snapshotId={snapshotId}
            metric="last_job_duration"
            formatter={formatDuration}
          />
        </Col>
        <Col lg={4}>
          <InfraMetricKpiCard
            title={t('in-kubernetes:dashboards.lastScheduled')}
            snapshotId={snapshotId}
            metric="last_scheduled_ago"
            formatter={formatDuration}
          />
        </Col>
      </Row>

      <Row>
        <Col lg={8}>
          <Card title={t('in-kubernetes:dashboards.activeJobs')}>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                formatter: zeroDecimalPlaces,
                metrics: ['active_jobs'],
                labels: [t('in-kubernetes:dashboards.activeJobs')],
                type: 'line',
                colors: [active].filter(Boolean)
              }}
              renderPostChartContent={K8DashboardsMarkerLanes}
            />
          </Card>
        </Col>
      </Row>

      <Row>
        <Col lg={12}>
          <ConditionsTableCard
            conditions={cronJob.conditions}
            viewAllHref$={getCronJobDashboard(snapshotId, { tab: '/conditions' })}
          />
        </Col>
      </Row>
    </Fragment>
  );
}
