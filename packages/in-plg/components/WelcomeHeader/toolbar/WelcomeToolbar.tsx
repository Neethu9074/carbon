/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { Stack, Typography } from '@instana/components';

import DatePicker from 'in-plg/components/DatePicker/DatePicker';

import locals from 'in-plg/components/WelcomeHeader/toolbar/WelcomeToolbar.mless';

function DatePickerHeader() {
  return (
    <div className="header" data-testid="date-picker">
      <Stack direction="horizontal">
        <DatePicker darkTheme={false} />
      </Stack>
    </div>
  );
}

interface WelcomeToolbarProps {
  title: string;
}

export default function WelcomeToolbar({ title }: WelcomeToolbarProps) {
  return (
    <div className={locals.toolbar}>
      <Stack direction="horizontal" distribution="spaceBetween" align="center">
        <Stack align="start">
          <Typography variant="heading-03">{title}</Typography>
        </Stack>
        <Stack>
          <DatePickerHeader />
        </Stack>
      </Stack>
    </div>
  );
}
