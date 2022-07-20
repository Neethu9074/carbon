/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { SvgIconSizes } from '@instana/components';

import { getColorBySeverity } from 'in-stores/events';

import locals from './WithHealthIndication.mless';

export default function WithHealthIndication({ children, healthInfo, iconSize }) {
  if (!healthInfo || healthInfo.maxSeverity === 0) {
    return children;
  }

  const size = SvgIconSizes[iconSize ?? 'regular'];
  iconSize = 2 + ((size / 8) | 1) * 2;

  return (
    <div className={locals.wrapper}>
      {children}
      <div
        style={{
          width: `${iconSize}px`,
          height: `${iconSize}px`,
          right: `calc(100% - ${size}px)`,
          background: getColorBySeverity(healthInfo.maxSeverity)
        }}
        className={locals.dot}
      />
    </div>
  );
}
