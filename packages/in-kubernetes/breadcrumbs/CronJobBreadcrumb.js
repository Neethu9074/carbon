import React from 'react';

import WithInfrastructureHealthIndicationBehaviour from 'in-components/health/WithHealthIndication/WithInfrastructureHealthIndicationBehaviour';
import Breadcrumb from 'in-components/breadcrumb/Breadcrumb';

export default function CronJobBreadcrumb({ cronJobId, cronJob, href$ }) {
  return (
    <WithInfrastructureHealthIndicationBehaviour
      snapshotId={cronJobId}
      render={healthInfo => (
        <Breadcrumb
          label="CronJob"
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
