/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import classNames from 'classnames';
import React from 'react';

import { CarbonStack } from '@instana/components';

import locals from './SpaceBetweenStack.mless';

type CarbonStackProps = Parameters<typeof CarbonStack>[0];
interface SpaceBetweenStackProps extends Omit<CarbonStackProps, 'orientation' | 'className'> {}

export default function SpaceBetweenStack({ children, ...carbonStackProps }: SpaceBetweenStackProps) {
  return (
    <CarbonStack
      {...carbonStackProps}
      orientation="horizontal"
      className={classNames([locals.fullWidth, locals.spaceBetween])}
    >
      {children}
    </CarbonStack>
  );
}
