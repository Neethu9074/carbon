/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { forwardRef } from 'react';
import classNames from 'classnames';

// @ts-expect-error
import locals from './HorizontalFlexWrapper.mless';

interface HorizontalFlexWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children: React.ReactNode;
}

export default forwardRef<HTMLDivElement, HorizontalFlexWrapperProps>(function HorizontalFlexWrapper(
  { className, children, ...furtherProps }: HorizontalFlexWrapperProps,
  ref
) {
  return (
    <div ref={ref} className={classNames(locals.wrapper, className)} {...furtherProps}>
      {children}
    </div>
  );
});
