import React from 'react';

import Skeleton from 'in-new-components/Loading/Skeleton';
import { Ul, Li } from 'in-new-components/lists/List';

import locals from './LoadingList.mless';

export default function LoadingList({ className, numSkeletonRows = 3 }) {
  const loadingRows = [];
  for (let i = 0; i < numSkeletonRows; i++) {
    loadingRows[i] = (
      <Li key={i}>
        <Skeleton className={locals.skeleton} />
      </Li>
    );
  }

  return <Ul className={className}>{loadingRows}</Ul>;
}
