/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import classNames from 'classnames';
import React from 'react';

import AlertTypography from 'in-alerting/components/AlertTypography';

import locals from './TearSheetStepContentWrapper.mless';

export interface TearSheetStepContentWrapperProps {
  headline: string;
  children?: React.ReactNode;
  description?: string;
  hidePadding?: boolean;
}

export default function TearSheetStepContentWrapper({
  headline,
  children,
  description,
  hidePadding = false
}: TearSheetStepContentWrapperProps) {
  return (
    <div className={classNames(locals.container, { [locals.showPadding]: !hidePadding })}>
      <AlertTypography variant={'heading-300'} color={'color900'} content={headline} noMargin>
        <span className={locals.block}>
          <AlertTypography variant={'body-regular'} color={'color600'} content={description} noMargin />
        </span>
      </AlertTypography>
      <>{children}</>
    </div>
  );
}
