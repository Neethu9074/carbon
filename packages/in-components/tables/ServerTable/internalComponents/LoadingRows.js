/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';

import { HorizontalIndicatorRow, LoadingSkeletonRows } from 'in-components/tables/sharedComponents';

export default function LoadingRows({ cols, progress, numSkeletonRows }) {
  return (
    <Fragment>
      <HorizontalIndicatorRow cols={cols} progress={progress} />
      <LoadingSkeletonRows cols={cols} rows={numSkeletonRows} />
    </Fragment>
  );
}
