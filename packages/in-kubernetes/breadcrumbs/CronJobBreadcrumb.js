/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import WithInfrastructureHealthIndicationBehaviour from 'in-components/health/WithHealthIndication/WithInfrastructureHealthIndicationBehaviour';
import Breadcrumb from 'in-components/breadcrumb/Breadcrumb';
import { t } from 'in-i18n';

export default function CronJobBreadcrumb({ cronJobId, cronJob, href$ }) {
  return (
    <WithInfrastructureHealthIndicationBehaviour
      snapshotId={cronJobId}
      render={healthInfo => (
        <Breadcrumb
          label={t('in-kubernetes:breadcrumbs.cronJob')}
          icon="lib_kubernetes_workload"
          snapshotId={cronJobId}
          href$={href$}
          healthInfo={healthInfo}
        >
          {cronJob && cronJob.name}
        </Breadcrumb>
      )}
    />
  );
}
