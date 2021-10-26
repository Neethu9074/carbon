/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import React from 'react';

import locals from './LeftRightPadding.mless';

interface Props {
  children: React.ReactNode;
  className?: string;
}

export default function LeftRightPadding({ children, className = '' }: Props) {
  return <div className={classNames(locals.wrapper, className)}>{children}</div>;
}
