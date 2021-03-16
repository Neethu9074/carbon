/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { range } from 'lodash';
import React from 'react';

import { Tr, Td } from 'in-components/tables/sharedComponents/Table';
import Skeleton from 'in-new-components/Loading/Skeleton';

import locals from './LoadingSkeletonRows.mless';

const loadingRowSkeletonDimensions = [
  [0.9, 0.3, 0.5, 0.2, 0.3],
  [0.4, 0.3, 0.4, 0.3, 0.3],
  [0.7, 0.3, 0.4, 0.2, 0.3]
];

export default function LoadingSkeletonRows({ cols, rows = 3 }) {
  const rowsToRender = [];
  for (let i = 0; i < rows; i++) {
    rowsToRender.push(loadingRowSkeletonDimensions[i % loadingRowSkeletonDimensions.length]);
  }

  return (
    <>
      {rowsToRender.map((dimensions, i) => (
        <Tr key={i}>
          {range(cols).map(i => (
            <Td key={i} className={locals.cell}>
              <Skeleton className={locals.skeleton} style={{ width: `${dimensions[i % dimensions.length] * 100}%` }} />
            </Td>
          ))}
        </Tr>
      ))}
    </>
  );
}
