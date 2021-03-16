/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import React from 'react';

import locals from './BarOverlay.mless';

export default function BarOverlay({ children, extraWide, extraExtraWide, allowOverflow }) {
  return (
    <div
      className={classNames({
        [locals.overlay]: true,
        [locals.extraWide]: extraWide && !extraExtraWide,
        [locals.extraExtraWide]: extraExtraWide,
        [locals.allowOverflow]: allowOverflow
      })}
    >
      {children}
    </div>
  );
}
