/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { ReactNode } from 'react';
import classNames from 'classnames';

import locals from './SaveError.mless';

export interface Props {
  children: ReactNode;
  className?: string;
}

export default function SaveError({ children, className }: Props) {
  return <p className={classNames(locals.error, className)}>{children}</p>;
}
