/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { SvgIcon } from '@instana/components';

import Tooltip from 'in-components/Tooltip';
import { useTheme } from 'in-themes';

import locals from './SimpleModeStepContentWrapper.mless';

export interface SimpleModeStepContentWrapperProps {
  headline: string;
  children: React.ReactNode;
  titleToolTipText?: string;
}

export default function SimpleModeStepContentWrapper({
  headline,
  children,
  titleToolTipText
}: SimpleModeStepContentWrapperProps) {
  const theme = useTheme();
  return (
    <div className={locals.container}>
      <h1 className={locals.headline}>
        {headline}
        {titleToolTipText && (
          <Tooltip align="bottomMiddle" content={titleToolTipText}>
            <SvgIcon type="lib_help_error_info_outline" color={theme.ids.color.option.neutral['600']} />
          </Tooltip>
        )}
      </h1>
      <>{children}</>
    </div>
  );
}
