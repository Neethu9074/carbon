/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { Stack, ThemeProvider } from '@instana/components';

import WelcomeHeader from 'in-plg/components/WelcomeHeader/WelcomeHeader';
import PageContent from 'in-plg/pages/WelcomePage/PageContent';

import locals from 'in-plg/pages/WelcomePage/WelcomePage.mless';

export default function WelcomePage() {
  return (
    <div className={locals.container}>
      <ThemeProvider theme={'g10'}>
        <WelcomeHeader />
        <Stack direction="vertical">
          <PageContent />
        </Stack>
      </ThemeProvider>
    </div>
  );
}
