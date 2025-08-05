/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import classNames from 'classnames';
import React from 'react';

import { Stack, Typography } from '@instana/components';

import { newOnboardingPageEnabled } from 'in-services/featureFlags';
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
  children?: React.ReactNode;
}

export default function WelcomeToolbar({ title, children }: WelcomeToolbarProps) {
  return (
    <div
      className={classNames({
        [locals.toolbar]: true,
        [locals.toolbarbottom]: !newOnboardingPageEnabled
      })}
    >
      <Stack direction="horizontal" distribution="spaceBetween" align="center">
        <Stack align="start">
          <div className={locals.title}>
            <Typography variant="heading-03">{title}</Typography>
          </div>
        </Stack>
        <Stack>
          <DatePickerHeader />
        </Stack>
      </Stack>
      {children}
    </div>
  );
}
