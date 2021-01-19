/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import classNames from 'classnames';
import React from 'react';

import locals from './MaxWidthFullscreenContainer.mless';

export default function MaxWidthFullscreenContainer({ children, className }) {
  return <div className={classNames(locals.wrapper, className)}>{children}</div>;
}
