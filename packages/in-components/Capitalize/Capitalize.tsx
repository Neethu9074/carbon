/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import React from 'react';

import { Nullish } from 'in-types';

import locals from './Capitalize.mless';

export interface CapitalizeProps {
  children: JSX.Element | string;
  className?: string;
}

export default function Capitalize({ children, className }: CapitalizeProps) {
  return <span className={classNames(locals.wrapper, className)}>{children}</span>;
}

export function capitalizeValue(value: string | Nullish): React.ReactNode {
  if (value === undefined || value === null) {
    return undefined;
  }
  return <Capitalize>{value}</Capitalize>;
}
