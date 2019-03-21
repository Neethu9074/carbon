import React from 'react';
import { get } from 'lodash';

import getKubernetesClusterMonitoringState$ from 'in-subscription/kubernetes/getKubernetesClusterMonitoringState';
import Capitalize from 'in-kubernetes/Dashboards/commonComponents/Capitalize';
import Breadcrumb from 'in-sdk/components/dashboard/breadcrumb/Breadcrumb';
import { clusterListFullyQualified } from 'in-kubernetes/navigation/paths';
import { timeConfig$ } from 'in-stores/time/config';
import { getView } from 'in-stores/navigation';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  props => ({
    monitoringState: timeConfig$.flatMap(timeConfig =>
      getKubernetesClusterMonitoringState$({
        id: props.clusterId,
        timeConfig: timeConfig
      }).map(result => (result.data ? result.data : null))
    )
  }),
  function HomeViewBreadcrumb({ monitoringState }) {
    const distributionType = get(monitoringState, 'distributionType', 'Kubernetes');
    return (
      <Breadcrumb href$={getView(clusterListFullyQualified)}>
        <Capitalize>{distributionType}</Capitalize>
      </Breadcrumb>
    );
  }
);
