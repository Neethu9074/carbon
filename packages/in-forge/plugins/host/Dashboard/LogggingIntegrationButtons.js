import React from 'react';

import LoggingIntegrationButtons from 'in-integrations/logging/LoggingIntegrationButtons';
import getKubernetesNodeByHost from 'in-subscription/kubernetes/getKubernetesNodeByHost';
import { timeConfig$ } from 'in-stores/time/config';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  props => {
    return {
      nodeSnapshot: timeConfig$.flatMap(timeConfig =>
        getKubernetesNodeByHost({
          filter: {
            hostId: props.snapshotId,
            timeConfig
          }
        }).map(result => result.data)
      )
    };
  },
  function NodeInformation({ hostFqdn, nodeSnapshot, timeConfig }) {
    return <LoggingIntegrationButtons hostFqdn={hostFqdn} isWithinKubernetes={nodeSnapshot} timeConfig={timeConfig} />;
  }
);
