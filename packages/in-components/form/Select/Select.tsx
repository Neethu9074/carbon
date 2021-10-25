/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { forwardRef, ReactNode } from 'react';
import classNames from 'classnames';

import locals from './Select.mless';

export interface Props extends React.InputHTMLAttributes<HTMLSelectElement> {
  hasError?: boolean;
  useFullWidth?: boolean;
  wrapperClassName?: string;
  className?: string;
  children: ReactNode;
}

export default forwardRef<HTMLSelectElement, Props>(function FormSelect(
  { hasError, useFullWidth, wrapperClassName, ...selectProps }: Props,
  ref
) {
  return (
    <div
      className={classNames(locals.selectWrapper, wrapperClassName, {
        [locals.selectWrapperDisabled]: selectProps.disabled,
        [locals.useFullWidth]: useFullWidth
      })}
    >
      <select
        {...selectProps}
        className={classNames(selectProps.className, locals.select, {
          [`${locals.select}--has-error`]: hasError
        })}
        ref={ref}
      />
    </div>
  );
});
