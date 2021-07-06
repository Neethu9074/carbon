/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';

import { TableHorizontalIndicatorRow, TableLoadingSkeletonRows } from '@instana/components';

export default function LoadingRows({ cols, progress, numSkeletonRows }) {
  return (
    <Fragment>
      <TableHorizontalIndicatorRow cols={cols} progress={progress} />
      <TableLoadingSkeletonRows cols={cols} rows={numSkeletonRows} />
    </Fragment>
  );
}
