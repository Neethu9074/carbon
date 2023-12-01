/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Stack } from '@instana/components';

import locals from './Layout.mless';

const Container = ({ children }: { children: JSX.Element | JSX.Element[] }): JSX.Element => {
  return (
    <Stack direction="horizontal" gap="disabled">
      {children}
    </Stack>
  );
};

const MainBody = ({ children }: { children: JSX.Element | JSX.Element[] }): JSX.Element => {
  return (
    <div className={locals.mainBody}>
      <Stack gap="large">{children}</Stack>
    </div>
  );
};

const SidePanel = ({ children }: { children: JSX.Element | JSX.Element[] }): JSX.Element => {
  return (
    <div className={locals.sidePanel}>
      <Stack>{children}</Stack>
    </div>
  );
};

export { Container, MainBody, SidePanel };
