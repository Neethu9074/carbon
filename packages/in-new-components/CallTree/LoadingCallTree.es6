import React from 'react';

import HorizontalIndicator from 'in-components/Progress/HorizontalIndicator';
import TreeHeader from 'in-new-components/CallTree/components/TreeHeader';
import Skeleton from 'in-components/Progress/Skeleton';

import locals from './CallTree.mless';

export default function LoadingCallTree({ progress }) {
  return (
    <div className={locals.callTree}>
      <TreeHeader rootSpan={{}} />
      <HorizontalIndicator progress={progress} />
      <Skeleton className={locals.skeleton} />
    </div>
  );
}
