/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import React from 'react';

import { CarbonButtonSet } from '@instana/components';

import { carbonButtonEnabled } from 'in-services/featureFlags';

import locals from './ButtonGroup.mless';

export default function ButtonGroup({ children, className, horizontal }) {
  const cssClass = classNames({
    [locals.group]: true,
    [locals.vertical]: !horizontal,
    [locals.horizontal]: horizontal,
    [className]: !!className
  });
  if (carbonButtonEnabled) {
    return (
      <CarbonButtonSet stacked={!horizontal}>
        <div className={locals.carbonButtonSet}>{children}</div>
      </CarbonButtonSet>
    );
  }
  return (
    <div className={cssClass} role="group">
      {children}
    </div>
  );
}
