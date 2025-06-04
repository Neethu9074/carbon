/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { Spacer } from '@instana/components';

import AlertTypography from 'in-alerting/components/AlertTypography';

import locals from './TearSheetStepTitleWrapper.mless';

export interface TearSheetStepTitleWrapperProps {
  headline: string;
  children?: React.ReactNode;
  description?: string;
  hideSpace?: boolean;
}

export default function TearSheetStepTitleWrapper({
  headline,
  children,
  description,
  hideSpace = false
}: TearSheetStepTitleWrapperProps) {
  return (
    <div className={locals.container}>
      <AlertTypography variant={'heading-200'} content={headline} noMargin />
      <AlertTypography variant={'body-regular'} color={'color600'} content={description} noMargin />
      {!hideSpace && <Spacer size="gutter" />}
      <>{children}</>
    </div>
  );
}
