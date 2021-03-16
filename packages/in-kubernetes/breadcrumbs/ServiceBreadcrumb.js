/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import WithInfrastructureHealthIndicationBehaviour from 'in-components/health/WithHealthIndication/WithInfrastructureHealthIndicationBehaviour';
import getKubernetesService from 'in-subscription/kubernetes/getKubernetesService';
import Breadcrumb from 'in-components/breadcrumb/Breadcrumb';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

export default connectTo(
  props => ({
    service: getKubernetesService({
      id: props.serviceId,
      timeConfig: props.timeConfig
    }).map(result => result.data)
  }),
  function ServiceBreadcrumb({ serviceId, service }) {
    return (
      <WithInfrastructureHealthIndicationBehaviour
        snapshotId={serviceId}
        render={healthInfo => (
          <Breadcrumb
            label={t('in-kubernetes:breadcrumbs.k8SService')}
            icon="lib_kubernetes_service"
            healthInfo={healthInfo}
          >
            {service && service.name}
          </Breadcrumb>
        )}
      />
    );
  }
);
