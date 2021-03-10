/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import classNames from 'classnames';

import locals from './DBmarlinNotification.mless';

export default function DBmarlinNotification({ children, className, bold, small }) {
  return (
    <div
      className={classNames(
        classNames({
          [locals.message]: true,
          [locals.small]: small,
          [locals.bold]: bold
        }),
        className
      )}
    >
      <div className={locals.firstLine}>
        <span
          className={classNames({
            [locals.content]: true,
            [locals.smallSize]: small
          })}
        >
          {children}
        </span>
      </div>
    </div>
  );
}
