/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import React from 'react';

import { Stack } from '@instana/components';

import locals from './WidgetConfigInfo.mless';

export default function WidgetConfigInfoTooltip({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className={locals.widgetConfigGridContainer}>
      <Stack gap="xsmall">{children}</Stack>
    </div>
  );
}
