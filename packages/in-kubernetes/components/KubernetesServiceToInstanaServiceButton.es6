import React from 'react';

import getInstanaServiceIdByKubernetesServiceId from 'in-subscription/kubernetes/getInstanaServiceIdByKubernetesServiceId';
import { getServiceDashboard } from 'in-applications/navigation/paths';
import Button from 'in-new-components/Button';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  ({ timeConfig, data: service }) => ({
    instanaServiceId: getInstanaServiceIdByKubernetesServiceId({ name: service.name, timeConfig }).map(
      result => result.data
    )
  }),
  function KubernetesServiceToInstanaServiceButton({ instanaServiceId, timeConfig }) {
    if (!instanaServiceId) {
      return null;
    }

    return (
      <Button
        kind="primary"
        icon="lib_application_service"
        href$={getServiceDashboard(instanaServiceId, {
          timeConfig
        })}
      >
        Explore Service
      </Button>
    );
  }
);
