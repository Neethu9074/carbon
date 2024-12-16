/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { ReactNode } from 'react';
import classNames from 'classnames';

import { Variant } from '@instana/components/types/components/Typography/types';
import { Typography } from '@instana/components';

import locals from 'in-alerting/components/AlertTypography.mless';

export default function AlertTypography({
  variant,
  content,
  color,
  children = null,
  noMargin = true
}: {
  variant: Variant;
  content?: string | ReactNode;
  color?: string;
  children?: ReactNode;
  noMargin?: boolean;
}): JSX.Element | null {
  if (!content) {
    return null;
  }

  return (
    <Typography variant={variant} noMargin={noMargin}>
      <span
        className={classNames({
          [locals.color600]: color === 'color600',
          [locals.color900]: color === 'color900',
          [locals.colorNavy900]: color === 'color900-navy',
          [locals.color700]: color === 'color700',
          [locals.primaryOnLight]: color === 'primaryOnLight',
          [locals.teal500]: color === 'teal500'
        })}
      >
        {content}
      </span>
      {children}
    </Typography>
  );
}
