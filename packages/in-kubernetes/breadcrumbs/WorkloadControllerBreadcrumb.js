/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import WithInfrastructureHealthIndicationBehaviour from 'in-components/health/WithHealthIndication/WithInfrastructureHealthIndicationBehaviour';
import Breadcrumb from 'in-components/breadcrumb/Breadcrumb';
import { getIcon } from 'in-kubernetes/utils';
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
  function WorkloadControllerBreadcrumb({
    headerTitle,
    workloadControllerId,
    workloadController,
    workloadControllerType,
    href
  }) {
    return (
      <WithInfrastructureHealthIndicationBehaviour
        snapshotId={workloadControllerId}
        render={healthInfo => (
          <Breadcrumb label={headerTitle} icon={getIcon(workloadControllerType)} href={href} healthInfo={healthInfo}>
            {workloadController && workloadController.name}
          </Breadcrumb>
        )}
      />
    );
  }
);
