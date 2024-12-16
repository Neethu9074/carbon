/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import React from 'react';

import { DashboardTableRow as Row, DashboardTableCell as Cell } from '@instana/components';
import { LoadingSkeleton } from '@instana/components';

import { DEFAULT_NUMBER_ROWS } from 'in-plg/pages/WelcomePage/widgets/utils/WidgetUtil';

import locals from 'in-plg/pages/WelcomePage/widgets/table/CommonTableStyle.mless';

interface LoadingListProps {
  numSkeletonRows?: number;
  numSkeletonColumns: number;
  favPresent?: boolean;
}

export default function LoadingTableList({
  numSkeletonRows = DEFAULT_NUMBER_ROWS,
  numSkeletonColumns,
  favPresent = false
}: LoadingListProps) {
  const loadingRows = [];
  for (let i = 0; i < numSkeletonRows; i++) {
    const rowCells = [];
    for (let j = 0; j < numSkeletonColumns; j++) {
      rowCells.push(
        <Cell key={`cell-${j}-${i}`}>
          <LoadingSkeleton
            className={classNames({
              [locals.loadingSkeletonForFav]: j === numSkeletonColumns - 1 && favPresent
            })}
          />
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
