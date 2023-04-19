/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import React from 'react';

import locals from './HorizontalControlsPresenter.mless';

interface Props {
  children: React.ReactNode;
  position: 'bottomLeft' | 'bottomMiddle' | 'bottomRight' | 'topLeft' | 'topMiddle' | 'topRight';
}

export default function HorizontalControlsPresenter({ children, position = 'bottomMiddle' }: Props) {
  return (
    <div
      className={classNames({
        [locals[position]]: position
      })}
    >
      {children}
    </div>
  );
}
