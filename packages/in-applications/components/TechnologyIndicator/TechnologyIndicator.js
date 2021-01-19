/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import EntityWithTypeAndIcon from 'in-new-components/EntityWithTypeAndIcon';
import { getLabel } from 'in-applications/technologyRegistry';
import Tooltip from 'in-components/Tooltip';
import Link from 'in-components/Link';

import locals from './TechnologyIndicator.mless';

export default function TechnologyIndicator({ pluginOrGroupType, getHref$, showTechnologyLabel = true }) {
  const label = getLabel(pluginOrGroupType);
  if (!label) {
    return null;
  }

  let content = (
    <EntityWithTypeAndIcon plugin={pluginOrGroupType} label={label} showTechnologyLabel={showTechnologyLabel} />
  );

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
