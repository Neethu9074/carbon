/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { Pill, Stack, Typography } from '@instana/components';
import { themes } from '@instana/design-tokens';

interface TimeWindowPillProps {
  children: string;
  color?: string;
  withDark?: boolean;
}
export default function TimeWindowPill({ color, children, withDark }: TimeWindowPillProps) {
  return (
    <Pill color={color ?? themes.default.ids.color.option.neutral[400]}>
      <Stack gap="xxsmall" direction="horizontal">
        <Typography onDark={withDark} variant="body-small">
          {children}
        </Typography>
      </Stack>
    </Pill>
  );
}
