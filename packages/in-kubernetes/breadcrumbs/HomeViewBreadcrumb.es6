import { get } from 'lodash';
import React from 'react';

import getKubernetesClusterMonitoringState$ from 'in-subscription/kubernetes/getKubernetesClusterMonitoringState';
import Capitalize from 'in-kubernetes/Dashboards/commonComponents/Capitalize';
import Breadcrumb from 'in-sdk/components/dashboard/breadcrumb/Breadcrumb';
import { clusterListFullyQualified } from 'in-kubernetes/navigation/paths';
import { timeConfig$ } from 'in-stores/time/config';
import { getView } from 'in-stores/navigation';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  props => ({
    distributionType: timeConfig$.flatMap(timeConfig =>
      getKubernetesClusterMonitoringState$({
        id: props.clusterId,
        timeConfig: timeConfig
      })
        .map(result => get(result, ['data', 'distributionType'], 'Kubernetes'))
        .distinct()
    )
  }),
  function HomeViewBreadcrumb({ distributionType }) {
    return (
      <Breadcrumb href$={getView(clusterListFullyQualified)}>
        <Capitalize>{distributionType ? distributionType : 'Kubernetes'}</Capitalize>
      </Breadcrumb>
    );
  }
);
