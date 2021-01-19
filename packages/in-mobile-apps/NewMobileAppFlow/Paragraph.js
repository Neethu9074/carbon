/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import locals from './Paragraph.mless';

export default function Paragraph({ children }) {
  return <p className={locals.para}>{children}</p>;
}
