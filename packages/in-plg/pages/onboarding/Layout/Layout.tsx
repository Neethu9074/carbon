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
      <Wrapper>{children}</Wrapper>
    </div>
  );
};

/**
 * Side panel component for the onboarding layout.
 * @param children - React elements to render inside the panel
 * @param topMargin - Top margin in REM units
 * @returns Side panel component
 */
const SidePanel = ({
  children,
  topMargin = null
}: {
  children: JSX.Element | JSX.Element[];
  topMargin?: number | null;
}): JSX.Element => {
  const style = topMargin !== null ? { marginTop: `${topMargin}rem` } : undefined;

  return (
    <div className={locals.sidePanel} style={style}>
      <Stack>{children}</Stack>
    </div>
  );
};

const Wrapper = ({ children }: { children: JSX.Element | JSX.Element[] }): JSX.Element => {
  return <Stack gap="large">{children}</Stack>;
};

export { Container, MainBody, SidePanel, Wrapper };
