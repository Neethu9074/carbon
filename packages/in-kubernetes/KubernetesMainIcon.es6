import React from 'react';
import { get } from 'lodash';

import { clusterListFullyQualified as kubernetesClusterList, kubernetes } from 'in-kubernetes/navigation/paths';
import getKubernetesMonitoringState$ from 'in-subscription/kubernetes/getKubernetesMonitoringState';
import View from 'in-new-components/MainNavigation/components/ViewSwitcher/View';
import { getView, isView } from 'in-stores/navigation/navigation';
import { timeConfig$ } from 'in-stores/time/config';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  {
    monitoringState: timeConfig$.flatMap(timeConfig =>
      getKubernetesMonitoringState$({ timeConfig }).map(result => (result.data ? result.data : null))
    )
  },
  function KubernetesMainIcon({ monitoringState, isExpanded, onViewSwitched }) {
    const solutionType = get(monitoringState, 'solutionType', 'Kubernetes');
    const iconPath = `lib_${solutionType.toLowerCase()}_inverted`;
    return (
      <View
        label={solutionType}
        icon={iconPath}
        href$={getView(kubernetesClusterList)}
        isActive$={isView(kubernetes)}
        sidebarIsExpanded={isExpanded}
        onClick={onViewSwitched}
      />
    );
  }
);
