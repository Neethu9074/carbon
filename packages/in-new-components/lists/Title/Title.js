/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import locals from './Title.mless';

export default function Title({ children }) {
  return <h1 className={locals.title}>{children}</h1>;
}
