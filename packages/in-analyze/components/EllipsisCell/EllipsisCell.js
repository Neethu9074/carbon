/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import locals from './EllipsisCell.mless';

export default function EllipsisCell({ children }) {
  return <div className={locals.shorten}>{children}</div>;
}
