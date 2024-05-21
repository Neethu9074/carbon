/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { ReactNode } from 'react';

import AlertTypography from 'in-alerting/components/AlertTypography';

import locals from './AlertingTearSheetContent.mless';

export default function AlertingTearSheetContent({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <AlertTypography variant={'heading-600'} content={title} noMargin />
      <div className={locals.contentArea}>{children}</div>
    </div>
  );
}
