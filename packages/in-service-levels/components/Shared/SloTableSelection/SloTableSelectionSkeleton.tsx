/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Li, LoadingSkeleton, Ul } from '@instana/components';

import locals from './SloTableSelectionSkeleton.mless';

interface SloTableSelectionSkeletonProps {
  numRows: number;
  numColumns: number;
}

export default function SloTableSelectionSkeleton({ numRows, numColumns }: SloTableSelectionSkeletonProps) {
  return (
    <Ul>
      {Array(numRows)
        .fill(true)
        .map((_, rowIndex) => (
          <Li key={`skeleton-row-${rowIndex}`}>
            {Array(numColumns)
              .fill(true)
              .map((_, colIndex) => (
                <LoadingSkeleton className={locals.loadingSkeleton} key={`skeleton-column-${rowIndex}-${colIndex}`} />
              ))}
          </Li>
        ))}
    </Ul>
  );
}
