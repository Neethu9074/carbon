import React from 'react';

import TechnologyLabelWithIcon from 'in-new-components/TechnologyLabelWithIcon';
import { getLabel } from 'in-applications/technologyRegistry';
import Tooltip from 'in-components/Tooltip';

export default function TechnologyIndicator({ pluginOrGroupType, showTechnologyLabel = true }) {
  const label = getLabel(pluginOrGroupType);
  if (!label) {
    return null;
  }

  let content = <TechnologyLabelWithIcon plugin={pluginOrGroupType} label={label} is10Icon />;
  if (showTechnologyLabel) {
    return content;
  }

  return <Tooltip content={label}>{content}</Tooltip>;
}
