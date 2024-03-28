/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';

import { TableHorizontalIndicatorRow, TableLoadingSkeletonRows } from '@instana/legacy';

import { Progress } from 'in-types';

interface LoadingRowsProps {
  cols: number;
  progress: Progress;
  numSkeletonRows: number;
}

export default function LoadingRows({ cols, progress, numSkeletonRows }: LoadingRowsProps) {
  return (
    <Fragment>
      <TableHorizontalIndicatorRow cols={cols} progress={progress} />
      <TableLoadingSkeletonRows cols={cols} rows={numSkeletonRows} />
    </Fragment>
  );
}
