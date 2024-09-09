/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { DashboardTableRow as Row, DashboardTableCell as Cell } from '@instana/components';
import { LoadingSkeleton } from '@instana/components';

import { DEFAULT_NUMBER_SKELETON_ROWS } from 'in-plg/pages/WelcomePage/widgets/utils/WidgetUtil';

interface LoadingListProps {
  numSkeletonRows?: number;
  numSkeletonColumns: number;
}

export default function LoadingTableList({
  numSkeletonRows = DEFAULT_NUMBER_SKELETON_ROWS,
  numSkeletonColumns
}: LoadingListProps) {
  const loadingRows = [];
  for (let i = 0; i < numSkeletonRows; i++) {
    const rowCells = [];
    for (let j = 0; j < numSkeletonColumns; j++) {
      rowCells.push(
        <Cell key={`cell-${j}-${i}`}>
          <LoadingSkeleton />
        </Cell>
      );
    }

    loadingRows.push(
      <Row id={`${i}`} key={`cell-${i}`}>
        {rowCells}
      </Row>
    );
  }

  return <>{loadingRows}</>;
}
