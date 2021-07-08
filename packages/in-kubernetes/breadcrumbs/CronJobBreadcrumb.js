/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import WithInfrastructureHealthIndicationBehaviour from 'in-components/health/WithHealthIndication/WithInfrastructureHealthIndicationBehaviour';
import getKubernetesCronJob from 'in-subscription/kubernetes/getKubernetesCronJob';
import Breadcrumb from 'in-components/breadcrumb/Breadcrumb';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

export default connectTo(
  ({ cronJobId, timeConfig }) => ({
    cronJob: getKubernetesCronJob({
      id: cronJobId,
      timeConfig
    }).map(result => result?.data)
  }),
  CronJobBreadcrumb
);

function CronJobBreadcrumb(props) {
  const { cronJobId, cronJob, href$ } = props;
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
