/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Stack } from '@instana/components';

import locals from './SideNavigationWrapper.mless';

export default function SideNavigationWrapper({ sidebar, children }) {
  return (
    <Stack direction="horizontal" gap="medium">
      <div className={locals.sidebar}>{sidebar}</div>
      <div className={locals.content}>{children}</div>
    </Stack>
  );
}
