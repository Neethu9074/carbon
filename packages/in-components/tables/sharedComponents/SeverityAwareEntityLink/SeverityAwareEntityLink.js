/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { SeverityIndicatorCellContentWrapper } from 'in-components/tables/ServerTable/internalComponents/LegacySeverityIndicatorCellContentWrapper';
import EntityLink from 'in-components/EntityLink/EntityLink';

export default function SeverityAwareEntityLink({
  severity,
  icon,
  label,
  tooltip,
  href,
  href$,
  specialIndicator,
  subscriptComponent
}) {
  return (
    <SeverityIndicatorCellContentWrapper severity={severity}>
      <EntityLink
        label={label}
        href={href}
        href$={href$}
        icon={icon}
        tooltip={tooltip}
        specialIndicator={specialIndicator}
        subscriptComponent={subscriptComponent}
      />
    </SeverityIndicatorCellContentWrapper>
  );
}
