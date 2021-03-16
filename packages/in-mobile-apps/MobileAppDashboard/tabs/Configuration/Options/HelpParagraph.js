/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import locals from './HelpParagraph.mless';

export default function HelpParagraph({ children }) {
  return <p className={locals.para}>{children}</p>;
}
