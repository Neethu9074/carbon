/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { Pill, Stack, Typography, useTheme } from '@instana/components';

interface TimeWindowPillProps {
  children: string;
  color?: string;
  withDark?: boolean;
}
export default function TimeWindowPill({ color, children, withDark }: TimeWindowPillProps) {
  const theme = useTheme();
  return (
    <Pill color={color ?? theme.ids.color.option.neutral[400]}>
      <Stack gap="xxsmall" direction="horizontal">
        <Typography onDark={withDark} variant="body-small">
          {children}
        </Typography>
      </Stack>
    </Pill>
  );
}
