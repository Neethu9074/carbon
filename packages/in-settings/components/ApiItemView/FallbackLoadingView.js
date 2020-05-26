import React from 'react';

import Skeleton from 'in-new-components/Loading/Skeleton';

import locals from './FallbackLoadingView.mless';

export default function renderFallbackLoadingView() {
  return (
    <>
      <Skeleton className={locals.skeleton1} />
      <Skeleton className={locals.skeleton2} />
      <Skeleton className={locals.skeleton3} />
    </>
  );
}
