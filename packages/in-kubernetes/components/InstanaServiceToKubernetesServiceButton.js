import React from 'react';

import getKubernetesServiceForApplicationServiceId from 'in-subscription/kubernetes/getKubernetesServiceForApplicationServiceId';
import { getServiceDashboard } from 'in-kubernetes/navigation/paths';
import Button from 'in-new-components/Button';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  ({ serviceId, timeConfig }) => ({
    result: getKubernetesServiceForApplicationServiceId({ serviceId, timeConfig }).map(result => result.data)
  }),
  function InstanaServiceToKubernetesServiceButton({ result, timeConfig }) {
    if (!result) {
      return null;
    }

    return (
      <Button
        kind="primaryv2"
        icon="lib_kubernetes_service"
        href$={getServiceDashboard(result.kubernetesServiceId, {
          clusterId: result.clusterId,
          timeConfig
        })}
      >
        Explore K8s Service
      </Button>
    );
  }
);
