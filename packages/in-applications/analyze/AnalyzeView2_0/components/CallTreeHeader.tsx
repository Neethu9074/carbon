/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import classNames from 'classnames';
import React from 'react';

import locals from './CallTreeHeader.mless';

interface CallTreeHeaderProps {
  size?: 'small' | 'regular';
  children: React.ReactNode;
  onClick?: () => void;
  errorState?: boolean;
}

export default function CallTreeHeader({
  size = 'regular',
  children,
  onClick,
  errorState = false
}: CallTreeHeaderProps) {
  return (
    <div
      className={classNames({
        [locals.small]: size === 'small',
        [locals.regular]: size === 'regular',
        [locals.errorState]: errorState,
        [locals.callTreeHeader]: true
      })}
      onClick={onClick}
    >
      <span
        className={classNames({
          [locals.errorState]: errorState,
          [locals.callTreeButton]: true
        })}
      >
        {children}
      </span>
    </div>
  );
}
