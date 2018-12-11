import React from 'react';

import getInstanaServiceIdByKubernetesServiceName from 'in-subscription/kubernetes/getInstanaServiceIdByKubernetesServiceName';
import { getServiceDashboard } from 'in-applications/navigation/paths';
import { alwaysNull } from 'in-services/fixedStreams';
import Button from 'in-new-components/Button';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  ({ timeConfig, result }) => ({
    instanaServiceId:
      result && result.data
        ? getInstanaServiceIdByKubernetesServiceName({ kubernetesServiceName: result.data.name, timeConfig }).map(
            result => result.data
          )
        : alwaysNull
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
