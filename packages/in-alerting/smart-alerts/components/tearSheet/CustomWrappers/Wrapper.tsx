/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { ReactNode } from 'react';

import { Gap } from '@instana/components/types/components/Stack/types';
import { Stack, SvgIcon, Tooltip } from '@instana/components';

import AlertTypography from 'in-alerting/components/AlertTypography';

export function ScopeWrapper({
  title,
  description,
  children,
  gap
}: {
  title: string;
  description: string;
  children: ReactNode;
  gap: keyof typeof Gap;
}) {
  return (
    <Stack direction="vertical" gap={gap}>
      <Stack direction="vertical" gap={'disabled'}>
        <AlertTypography variant="heading-200" content={title} />
        <AlertTypography variant="body-regular" content={description} color="color600" />
      </Stack>
      {children}
    </Stack>
  );
}

export function SectionWrapper({ children, actions }: { children: ReactNode; actions?: ReactNode }): JSX.Element {
  return (
    <Stack direction="horizontal" gap="xxlarge" distribution="spaceBetween">
      {children}
      {actions && <div>{actions}</div>}
    </Stack>
  );
}

export function ForecastAlertingWrapper({
  children,
  title,
  description,
  tooltipContent,
  tooltipIcon
}: {
  children: ReactNode;
  title: string;
  description: string;
  tooltipContent: string;
  tooltipIcon: string;
}) {
  return (
    <Stack direction="vertical" gap="xsmall">
      <Stack direction="horizontal" gap="xsmall">
        <AlertTypography color="color900" content={title} variant="body-regular" />
        <Tooltip content={tooltipContent}>
          <SvgIcon type={tooltipIcon} size="s" />
        </Tooltip>
      </Stack>
      {children}
      <AlertTypography color="color600" content={description} variant="body-small" />
    </Stack>
  );
}
