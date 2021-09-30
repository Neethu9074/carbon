/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import React from 'react';

import locals from './Label.mless';

type LabelProps = {
  hasError?: boolean | undefined;
  className?: string | undefined;
} & React.LabelHTMLAttributes<HTMLLabelElement>;

export default function Label({ hasError, className, ...labelProps }: LabelProps) {
  return (
    <label
      className={classNames(locals.label, className, {
        [locals.hasError]: hasError
      })}
      {...labelProps}
    />
  );
}
