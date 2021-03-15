/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import locals from './Header.mless';

export default function Header({ children }) {
  return <h1 className={locals.header}>{children}</h1>;
}
