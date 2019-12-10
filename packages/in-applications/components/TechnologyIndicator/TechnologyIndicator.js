import React from 'react';

import TechnologyLabelWithIcon from 'in-new-components/TechnologyLabelWithIcon';
import { getLabel } from 'in-applications/technologyRegistry';
import Tooltip from 'in-components/Tooltip';
import Link from 'in-components/Link';

import locals from './TechnologyIndicator.mless';

export default function TechnologyIndicator({ pluginOrGroupType, getHref$, showTechnologyLabel = true }) {
  const label = getLabel(pluginOrGroupType);
  if (!label) {
    return null;
  }

  let content = <TechnologyLabelWithIcon plugin={pluginOrGroupType} label={label} is10Icon />;

  if (getHref$) {
    content = (
      <Link className={locals.link} href$={getHref$ && getHref$(pluginOrGroupType)}>
        {content}
      </Link>
    );
  }

  if (showTechnologyLabel) {
    return content;
  }

  return <Tooltip content={label}>{content}</Tooltip>;
}
