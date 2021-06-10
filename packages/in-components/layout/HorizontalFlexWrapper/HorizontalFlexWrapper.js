/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { forwardRef } from 'react';
import classNames from 'classnames';

import locals from './HorizontalFlexWrapper.mless';

export default forwardRef(function HorizontalFlexWrapper({ className, children, ...furtherProps }, ref) {
  return (
    <div ref={ref} className={classNames(locals.wrapper, className)} {...furtherProps}>
      {children}
    </div>
  );
});
