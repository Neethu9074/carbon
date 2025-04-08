/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { ReactNode } from 'react';

import { Spacer, Tooltip, Pill, SvgIcon, Stack } from '@instana/components';

import AlertTypography from 'in-alerting/components/AlertTypography';

import locals from './LabelDescriptionWithIcon.mless';

interface LabelDescriptionWithIconProps {
  icon?: string;
  label: string;
  description: string;
  children?: ReactNode;
  disabled?: boolean;
  badgeTitle?: string;
  tooltipContent?: string;
}

export default function LabelDescriptionWithIcon({
  icon,
  label,
  description,
  children,
  disabled,
  badgeTitle,
  tooltipContent
}: LabelDescriptionWithIconProps) {
  return (
    <Stack align="start" gap="xxsmall">
      {/* display content */}

      <div className={locals.content}>
        {/* display icon */}
        {icon && <SvgIcon type={icon} className={locals.icon} />}

        <AlertTypography variant="body-bold" color="color900" content={label} />

        {/* If checkbox/ radiobtn is disabled */}
        {disabled && (
          <span className={locals.notSupported}>
            <Tooltip align={'rightMiddle'} delay={500} content={tooltipContent}>
              <Pill type="gray" className={locals.notSupported} size="md">
                <span title="" className={locals.pillContent}>
                  <SvgIcon type="lib_help_error_error_outline" size="xs" />
                  {badgeTitle}
                </span>
              </Pill>
            </Tooltip>
          </span>
        )}
      </div>
      <Spacer vertical="xxsmall" />
      <AlertTypography variant="body-small" color="color600" content={description} />
      {children}
    </Stack>
  );
}
