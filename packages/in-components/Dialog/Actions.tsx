/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { ReactNode } from 'react';
import classNames from 'classnames';

import locals from './Actions.mless';

export interface Props {
  children: ReactNode;
  noVerticalMargin?: boolean;
}

export default function Actions({ children, noVerticalMargin }: Props) {
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
