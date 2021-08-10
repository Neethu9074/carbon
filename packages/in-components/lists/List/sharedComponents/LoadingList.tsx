/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import React from 'react';

import { ListSizes, LoadingSkeleton } from '@instana/components';
import { Ul, Li } from '@instana/components';

// @ts-ignore
import locals from './LoadingList.mless';

interface LoadingListProps {
  className?: string;
  skeletonClassName?: string;
  size?: keyof typeof ListSizes;
  numSkeletonRows?: number;
}

export default function LoadingList({
  className,
  skeletonClassName = '',
  size,
  numSkeletonRows = 3
}: LoadingListProps) {
  const loadingRows = [];
  for (let i = 0; i < numSkeletonRows; i++) {
    loadingRows[i] = (
      <Li key={i} size={size}>
        <LoadingSkeleton
          className={classNames({
            [locals.skeleton]: true,
            [skeletonClassName]: skeletonClassName
          })}
        />
      </Li>
    );
  }

  return <Ul className={className}>{loadingRows}</Ul>;
}
