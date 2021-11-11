/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import './CenterAlignmentColumn.less';

const block = 'in-center-alignment';

export default function CenterAlignmentColumn({ children }) {
  return <div className={block}>{children}</div>;
}
