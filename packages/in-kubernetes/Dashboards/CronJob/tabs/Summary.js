/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';

import MissingK8sPermissions from 'in-kubernetes/Dashboards/commonComponents/MissingK8sPermissions';
import InfraMetricKpiCard from 'in-components/KpiCard/InfraMetricKpiCard';
import { formatDuration } from 'in-services/formatters/date';
import { Row, Col } from 'in-components/layout/Grid';
import KpiCard from 'in-components/KpiCard/KpiCard';
import Jobs from '../JobList';
import { t } from 'in-i18n';

export default function Summary({ timeConfig, data: cronJob }) {
  const snapshotId = cronJob.id;
  return (
    <Fragment>
      <MissingK8sPermissions resourceSnapshotId={cronJob.id} timeConfig={timeConfig} />

      <Row>
        <Col lg={4}>
          <KpiCard title={t('in-kubernetes:dashboards.schedule')} renderValue={() => <span>{cronJob.schedule}</span>} />
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
          <Jobs timeConfig={timeConfig} cronJobId={cronJob.id} />
        </Col>
      </Row>
    </Fragment>
  );
}
