/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { ReactNode } from 'react';

import { getColorBySeverity } from 'in-stores/events';

import locals from './WithHealthDot.mless';

interface WithHealthDotProps {
  severity?: number;
  iconSize?: number;
  children?: ReactNode;
}

export default function WithHealthDot({ severity = 0, iconSize = 0, children }: WithHealthDotProps) {
  return (
    <div className={locals.wrapper}>
      {children}
      <div
        style={{
          width: iconSize,
          height: iconSize,
          left: `calc(100% - ${iconSize * 1.75}px)`,
          backgroundColor: getColorBySeverity(severity)
        }}
        className={locals.dot}
      />
    </div>
  );
}
