import React from 'react';

import ResourceTooltipContent from 'in-kubernetes/Dashboards/commonComponents/ResourceTooltipContent';
import Tooltip from 'in-components/Tooltip';

export default function KubernetesResources(props) {
  return (
    <Tooltip themeStyle="light" content={<ResourceTooltipContent {...props} />} align="topMiddle">
      <span>memory, cpu</span>
    </Tooltip>
  );
}
