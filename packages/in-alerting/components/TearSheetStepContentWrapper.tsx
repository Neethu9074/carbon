/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { SvgIcon, Typography } from '@instana/components';
import { themes } from '@instana/design-tokens';

import Tooltip from 'in-components/Tooltip';

import locals from './TearSheetStepContentWrapper.mless';

export interface TearSheetStepContentWrapperProps {
  headline: string;
  children: React.ReactNode;
  titleToolTipText?: string;
}

export default function TearSheetStepContentWrapper({
  headline,
  children,
  titleToolTipText
}: TearSheetStepContentWrapperProps) {
  return (
    <div className={locals.container}>
      <Typography variant="heading-300">
        {headline}
        {titleToolTipText && (
          <Tooltip align="bottomMiddle" content={titleToolTipText}>
            <SvgIcon type="lib_help_error_info_outline" color={themes.default.ids.color.option.neutral['600']} />
          </Tooltip>
        )}
      </Typography>
      <>{children}</>
    </div>
  );
}
