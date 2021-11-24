/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { ReactChild } from 'react';

import locals from './HelpParagraph.mless';

export interface Props {
  children: ReactChild;
}

export default function HelpParagraph({ children }: Props) {
  return <p className={locals.para}>{children}</p>;
}
