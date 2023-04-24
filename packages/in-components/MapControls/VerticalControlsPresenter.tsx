/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import React from 'react';

import locals from './VerticalControlsPresenter.mless';

interface Props {
  children: React.ReactNode;
  position: 'leftBottom' | 'leftMiddle' | 'leftTop' | 'rightBottom' | 'rightMiddle' | 'rightTop';
}
export default function VerticalControlsPresenter({ children, position = 'rightMiddle' }: Props) {
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
