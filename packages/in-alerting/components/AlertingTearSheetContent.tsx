/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { ReactNode } from 'react';

import { Typography } from '@instana/components';

import locals from './AlertingTearSheetContent.mless';

export default function AlertingTearSheetContent({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <div>
        <Typography variant="heading-600">{title}</Typography>
      </div>

      <div className={locals.contentArea}>{children}</div>
    </div>
  );
}
