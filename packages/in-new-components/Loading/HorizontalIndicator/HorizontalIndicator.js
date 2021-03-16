/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import React from 'react';

import locals from './HorizontalIndicator.mless';

export default function HorizontalIndicator({ progress, rounded = false, className }) {
  if (!progress.loading) {
    return null;
  }
  const innerStyle = {};
  if (progress.percentage != null) {
    innerStyle.width = `${progress.percentage * 100}%`;
  } else {
    innerStyle.right = '0';
  }

  return (
    <div
      className={classNames({
        [locals.outer]: true,
        [locals.rounded]: rounded,
        [className]: className
      })}
    >
      <div
        className={classNames({
          [locals.inner]: true,
          [locals.indeterminate]: progress.percentage == null
        })}
        style={innerStyle}
      />
    </div>
  );
}
