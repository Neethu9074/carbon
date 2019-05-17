import React from 'react';

import getKubernetesService from 'in-subscription/kubernetes/getKubernetesService';
import Breadcrumb from 'in-sdk/components/dashboard/breadcrumb/Breadcrumb';

import connectTo from 'in-hoc/connectTo';

export default connectTo(
  props => ({
    service: getKubernetesService({
      id: props.serviceId,
      timeConfig: props.timeConfig
    }).map(result => result.data)
  }),
  function ServiceBreadcrumb({ service }) {
    return (
      <Breadcrumb label="K8s Service" icon="lib_kubernetes_service">
        {service && service.name}
      </Breadcrumb>
    );
  }
);
