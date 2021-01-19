/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import classNames from 'classnames';
import React from 'react';

import locals from './StanImage.mless';

export default function StanImage({ className }) {
  return (
    <div
      className={classNames({
        [locals.stan]: true,
        [className]: className
      })}
    />
  );
}
