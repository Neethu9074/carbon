/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { Typography } from '@instana/components';

import locals from './TearSheetStepContentWrapper.mless';

export interface TearSheetStepContentWrapperProps {
  headline: string;
  children: React.ReactNode;
  description?: string;
}

export default function TearSheetStepContentWrapper({
  headline,
  children,
  description
}: TearSheetStepContentWrapperProps) {
  return (
    <div className={locals.container}>
      <Typography variant="heading-300" noMargin>
        <span className={locals.color900}> {headline}</span>
        {description && (
          <Typography variant="body-small">
            <div className={locals.description}>{description} </div>
          </Typography>
        )}
      </Typography>
      <>{children}</>
    </div>
  );
}
