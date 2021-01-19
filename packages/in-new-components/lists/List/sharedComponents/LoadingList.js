/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import classNames from 'classnames';
import React from 'react';

import Skeleton from 'in-new-components/Loading/Skeleton';
import { Ul, Li } from 'in-new-components/lists/List';

import locals from './LoadingList.mless';

export default function LoadingList({ className, skeletonClassName, size, numSkeletonRows = 3 }) {
  const loadingRows = [];
  for (let i = 0; i < numSkeletonRows; i++) {
    loadingRows[i] = (
      <Li key={i} size={size}>
        <Skeleton
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
