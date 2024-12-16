/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import LoadingIndicator from 'in-components/LoadingIndicators/LoadingIndicator';

import './CellLoadingIndicator.less';

const block = 'in-cell-loading';

export default function CellLoadingIndicator() {
  return <LoadingIndicator className={block} />;
}

export const cellLoadingIndicatorInstance = <CellLoadingIndicator />;
