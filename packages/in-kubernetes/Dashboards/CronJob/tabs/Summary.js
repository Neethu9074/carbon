/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';

import MissingK8sPermissions from 'in-kubernetes/Dashboards/commonComponents/MissingK8sPermissions';
import InfraMetricKpiCard from 'in-components/KpiCard/InfraMetricKpiCard';
import { podId as matrixPodId } from 'in-kubernetes/navigation/matrix';
import { cronJobDashboard } from 'in-kubernetes/navigation/paths';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import { formatDuration } from 'in-services/formatters/date';
import { Jobs } from 'in-kubernetes/Dashboards/CronJob/Jobs';
import { Row, Col } from 'in-components/layout/Grid';
import KpiCard from 'in-components/KpiCard/KpiCard';
import { t } from 'in-i18n';

export default function Summary({ timeConfig, data: cronJob, location }) {
  const snapshotId = cronJob.id;
  const podId = getMatrixParameter(location, cronJobDashboard, matrixPodId);

  return (
    <Fragment>
      <MissingK8sPermissions resourceSnapshotId={cronJob.id} timeConfig={timeConfig} />

      <Row>
        <Col lg={4}>
          <KpiCard
            title={t('in-kubernetes:dashboards.schedule')}
            value={cronJob.schedule}
            renderValue={value => <span>{value}</span>}
            raw
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
        <Col lg={4}>
          <InfraMetricKpiCard
            title={t('in-kubernetes:dashboards.lastJobDuration')}
            snapshotId={snapshotId}
            metric="last_job_duration"
            formatter={formatDuration}
          />
        </Col>
      </Row>

      <Row>
        <Col lg={12}>
          <Jobs timeConfig={timeConfig} cronJobId={cronJob.id} podId={podId} />
        </Col>
      </Row>
    </Fragment>
  );
}
