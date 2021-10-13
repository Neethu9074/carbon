/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import React from 'react';

import locals from './Label.mless';

interface LabelProps {
  hasError?: boolean;
  className?: string;
}

export default function Label({
  hasError,
  className,
  ...labelProps
}: LabelProps & React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={classNames(locals.label, className, {
        [locals.hasError]: hasError
      })}
      {...labelProps}
    />
  );
}
