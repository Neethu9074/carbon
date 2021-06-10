/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import React from 'react';

import locals from './Skeleton.mless';

export default function SkeletonCellContent({ className, style, lightMode, darkMode }) {
  return (
    <span
      style={style}
      className={classNames({
        [locals.skeleton]: true,
        [locals.lightMode]: lightMode,
        [locals.darkMode]: darkMode,
        [className]: className
      })}
    />
  );
}
