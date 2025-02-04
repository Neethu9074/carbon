/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { KubernetesCronJob, TimeConfig } from '@instana/types';

// @ts-expect-error needs ts migration
import MissingK8sPermissions from 'in-kubernetes/Dashboards/commonComponents/MissingK8sPermissions';
// @ts-expect-error needs ts migration
import InfraMetricKpiCard from 'in-components/KpiCard/InfraMetricKpiCard';
import { podId as matrixPodId } from 'in-kubernetes/navigation/matrix';
import { cronJobDashboard } from 'in-kubernetes/navigation/paths';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import Jobs from 'in-kubernetes/Dashboards/CronJob/Jobs/Jobs';
import { formatDuration } from 'in-services/formatters/date';
import { Location } from 'in-stores/navigation/types';
import { Row, Col } from 'in-components/layout/Grid';
import KpiCard from 'in-components/KpiCard/KpiCard';
import { t } from 'in-i18n';

interface SummaryProps {
  timeConfig: TimeConfig;
  location: Location;
  data: KubernetesCronJob;
}

export default function Summary({ timeConfig, data: cronJob, location }: SummaryProps) {
  const snapshotId = cronJob.id;
  const podId = getMatrixParameter(location, cronJobDashboard, matrixPodId);

  return (
    <>
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
    </>
  );
}
