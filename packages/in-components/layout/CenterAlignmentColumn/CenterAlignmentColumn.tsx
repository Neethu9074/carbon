/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import './CenterAlignmentColumn.less';

const block = 'in-center-alignment';

export interface Props {
  children: React.ReactChild;
}

export default function CenterAlignmentColumn({ children }: Props) {
  return <div className={block}>{children}</div>;
}
