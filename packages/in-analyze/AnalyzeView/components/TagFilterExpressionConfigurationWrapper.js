/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import classNames from 'classnames';
import React from 'react';

import locals from './TagFilterExpressionConfigurationWrapper.mless';

export default function TagFilterExpressionConfigurationWrapper({ quickFilterBar, queryBuilder, disabled }) {
  return (
    <div
      className={classNames({
        [locals.wrapper]: true,
        [locals.disabled]: disabled
      })}
    >
      <div className={locals.bar}>{quickFilterBar}</div>
      <div className={locals.list}>{queryBuilder}</div>
    </div>
  );
}
