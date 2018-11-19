import React from 'react';

import getKubernetesPod from 'in-subscription/kubernetes/getKubernetesPod';
import Breadcrumb from 'in-sdk/components/dashboard/breadcrumb/Breadcrumb';

import connectTo from 'in-hoc/connectTo';

export default connectTo(
  props => ({
    pod: getKubernetesPod({
      id: props.podId,
      timeConfig: props.timeConfig
    }).map(result => result.data)
  }),
  function NodeBreadPodBreadcrumbcrumb({ pod, href$ }) {
    return (
      <Breadcrumb label="Pod" icon="lib_kubernetes_pod" href$={href$}>
        {pod && pod.label}
      </Breadcrumb>
    );
  }
);
