/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { ReactChildren } from 'react';

import locals from './Header.mless';

interface HeaderProps {
  children: ReactChildren;
}

export default function Header({ children }: HeaderProps) {
  return <h2 className={locals.header}>{children}</h2>;
}
