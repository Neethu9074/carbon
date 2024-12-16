/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import WithInfrastructureHealthIndicationBehaviour from 'in-components/health/WithHealthIndication/WithInfrastructureHealthIndicationBehaviour';
import getKubernetesCronJob from 'in-kubernetes/subscriptions/getKubernetesCronJob';
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
  const { cronJobId, cronJob, href } = props;

  return (
    <WithInfrastructureHealthIndicationBehaviour
      snapshotId={cronJobId}
      render={healthInfo => (
        <Breadcrumb
          label={t('in-kubernetes:breadcrumbs.cronJob')}
          icon="lib_infra_kubernetesCronJob"
          snapshotId={cronJobId}
          href={href}
          healthInfo={healthInfo}
        >
          {cronJob && cronJob.name}
        </Breadcrumb>
      )}
    />
  );
}
