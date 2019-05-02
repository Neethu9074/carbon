import React from 'react';

import ResourceTooltipContent from 'in-kubernetes/Dashboards/commonComponents/ResourceTooltipContent';
import { isBlank } from 'in-services/util/string';
import Tooltip from 'in-components/Tooltip';

export default function KubernetesResources(props) {
  return (
    <Tooltip themeStyle="light" content={<ResourceTooltipContent {...props} />} align="topMiddle">
      {!isBlank(props.quotasPresent) && <span>{props.quotasPresent}</span>}
    </Tooltip>
  );
}
