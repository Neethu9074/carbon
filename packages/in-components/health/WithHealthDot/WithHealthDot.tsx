/*
 * (c) Copyright IBM Corp. 2023
 * (c) Copyright Instana Inc.
 */

import React, { ReactNode } from 'react';

import { getColorBySeverity } from 'in-stores/events';

import locals from './WithHealthDot.mless';

interface WithHealthDootProps {
  severity?: number;
  iconSize: number;
  children: ReactNode;
}

export default function WithHealthDot({ severity = 0, iconSize, children }: WithHealthDootProps) {
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
