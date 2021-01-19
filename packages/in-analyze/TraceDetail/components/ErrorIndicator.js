/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import classNames from 'classnames';
import React from 'react';

import locals from './ErrorIndicator.mless';

export default function ErrorIndicator({ erroneous, allowZero, small, inChart }) {
  if (!erroneous && !allowZero) {
    return null;
  }

  return (
    <div
      className={classNames({
        [locals.errorIcon]: true,
        [locals.inChart]: inChart,
        [locals.errorIconDefault]: !small && !inChart,
        [locals.errorIconSmall]: small
      })}
    >
      !
    </div>
  );
}
