import { get } from 'lodash';
import React from 'react';

import { clusterListFullyQualified as kubernetesClusterList, kubernetes } from 'in-kubernetes/navigation/paths';
import getKubernetesMonitoringState$ from 'in-subscription/kubernetes/getKubernetesMonitoringState';
import View from 'in-new-components/MainNavigation/components/ViewSwitcher/View';
import { getView, isView } from 'in-stores/navigation/navigation';
import { timeConfig$ } from 'in-stores/time/config';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  {
    distributionType: timeConfig$.flatMap(timeConfig =>
      getKubernetesMonitoringState$({ timeConfig })
        .map(result => get(result, ['data', 'distributionType'], 'Kubernetes'))
        .distinct()
    )
  },
  function KubernetesMainIcon({ distributionType, isExpanded, onViewSwitched }) {
    const iconPath = `lib_${distributionType ? distributionType.toLowerCase() : 'Kubernetes'}_inverted`;
    return (
      <View
        label={distributionType}
        icon={iconPath}
        href$={getView(kubernetesClusterList)}
        isActive$={isView(kubernetes)}
        sidebarIsExpanded={isExpanded}
        onClick={onViewSwitched}
      />
    );
  }
);
