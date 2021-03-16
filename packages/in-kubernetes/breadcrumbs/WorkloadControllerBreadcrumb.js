/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import WithInfrastructureHealthIndicationBehaviour from 'in-components/health/WithHealthIndication/WithInfrastructureHealthIndicationBehaviour';
import Breadcrumb from 'in-components/breadcrumb/Breadcrumb';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  props => ({
    workloadController: props
      .workloadControllerSubscriptionName({
        id: props.workloadControllerId,
        timeConfig: props.timeConfig
      })
      .map(result => (result.data ? result.data : null))
  }),
  function WorkloadControllerBreadcrumb({ headerTitle, workloadControllerId, workloadController, href$ }) {
    return (
      <WithInfrastructureHealthIndicationBehaviour
        snapshotId={workloadControllerId}
        render={healthInfo => (
          <Breadcrumb label={headerTitle} icon="lib_kubernetes_workload" href$={href$} healthInfo={healthInfo}>
            {workloadController && workloadController.name}
          </Breadcrumb>
        )}
      />
    );
  }
);
