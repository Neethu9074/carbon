/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import TreeHeader from 'in-analyze/TraceDetail/components/CallTree/components/TreeHeader';
import HorizontalIndicator from 'in-new-components/Loading/HorizontalIndicator';
import Skeleton from 'in-new-components/Loading/Skeleton';

import locals from './CallTree.mless';

export default function LoadingCallTree({ progress }) {
  return (
    <div className={locals.callTree}>
      <TreeHeader rootCall={null} />
      <HorizontalIndicator progress={progress} />
      <Skeleton className={locals.skeleton} />
    </div>
  );
}
