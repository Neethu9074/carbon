/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { SeverityIndicatorCellContentWrapper } from 'in-components/tables/sharedComponents';
import EntityLink from 'in-components/EntityLink/EntityLink';

export default function SeverityAwareEntityLink({
  severity,
  icon,
  label,
  tooltip,
  href$,
  specialIndicator,
  subscriptComponent
}) {
  return (
    <SeverityIndicatorCellContentWrapper severity={severity}>
      <EntityLink
        label={label}
        href$={href$}
        icon={icon}
        tooltip={tooltip}
        specialIndicator={specialIndicator}
        subscriptComponent={subscriptComponent}
      />
    </SeverityIndicatorCellContentWrapper>
  );
}
