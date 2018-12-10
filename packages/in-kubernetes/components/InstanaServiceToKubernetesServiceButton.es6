import React from 'react';

import getKubernetesServiceIdByInstanaServiceName from 'in-subscription/kubernetes/getKubernetesServiceIdByInstanaServiceName';
import { getServiceDashboard } from 'in-kubernetes/navigation/paths';
import Button from 'in-new-components/Button';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  ({ serviceId, timeConfig }) => ({
    kubernetesServiceId: getKubernetesServiceIdByInstanaServiceName({ serviceId, timeConfig }).map(
      result => result.data
    )
  }),
  function InstanaServiceToKubernetesServiceButton({ kubernetesServiceId, timeConfig }) {
    if (!kubernetesServiceId) {
      return null;
    }

    return (
      <Button
        kind="primary"
        icon="lib_kubernetes_service"
        href$={getServiceDashboard(kubernetesServiceId, {
          timeConfig
        })}
      >
        Explore Service
      </Button>
    );
  }
);
