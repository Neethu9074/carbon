/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import React from 'react';

import locals from './Actions.mless';

export default function Actions({ children, noVerticalMargin }) {
  return (
    <div
      className={classNames(locals.actions, {
        [locals.noVerticalMargin]: noVerticalMargin
      })}
    >
      {children}
    </div>
  );
}
