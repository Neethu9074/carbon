import React from 'react';

import getInstanaServiceIdByKubernetesServiceId from 'in-subscription/kubernetes/getInstanaServiceIdByKubernetesServiceId';
import { getServiceDashboard } from 'in-applications/navigation/paths';
import { alwaysNull } from 'in-services/fixedStreams';
import Button from 'in-new-components/Button';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  ({ timeConfig, result }) => ({
    instanaServiceId:
      result && result.data
        ? getInstanaServiceIdByKubernetesServiceId({ serviceName: result.data.name, timeConfig }).map(
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
