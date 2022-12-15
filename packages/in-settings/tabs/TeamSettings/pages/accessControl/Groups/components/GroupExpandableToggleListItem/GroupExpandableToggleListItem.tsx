/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import { Li, Stack, SvgIcon, Toggle, Typography } from '@instana/components';

import BetaBadge from 'in-components/BetaBadge/BetaBadge';

import locals from 'in-settings/tabs/TeamSettings/pages/accessControl/Groups/components/GroupExpandableToggleListItem/GroupExpandableToggleListItem.mless';

interface GroupExpandableToggleListItemProps {
  children: React.ReactNode;
  disabled?: boolean;
  id: string;
  headline: string;
  iconType: string;
  isBeta?: boolean;
  isExpanded?: boolean;
  onToggle?: VoidFunction;
}

export const GroupExpandableToggleListItem = ({
  children,
  disabled = false,
  id,
  headline,
  iconType,
  isBeta = false,
  isExpanded = false,
  onToggle
}: GroupExpandableToggleListItemProps) => {
  return (
    <Li noAlternatingBg className={locals.liOverride} aria-expanded={isExpanded} aria-controls={id}>
      <div className={locals.fullWidth}>
        <Stack align="center" direction="horizontal" gap="small" distribution="start">
          <SvgIcon className={locals.icon} type={iconType} />
          <label className={locals.textContainer}>
            <Typography variant="body-large" noMargin noWrap>
              {headline}
            </Typography>
            <Toggle checked={isExpanded} onChange={onToggle} disabled={disabled} />
          </label>
          {isBeta && <BetaBadge />}
        </Stack>
      </div>
      {isExpanded && (
        <div className={locals.fullWidth} id={id}>
          {children}
        </div>
      )}
    </Li>
  );
};
