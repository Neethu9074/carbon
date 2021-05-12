/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { HorizontalIndicator } from '@instana/components';
import { LoadingSkeleton } from '@instana/components';

import TreeHeader from 'in-applications/analyze/components/TraceDetails/components/CallTree/components/TreeHeader';

import locals from './CallTree.mless';

export default function LoadingCallTree({ progress }) {
  return (
    <div className={locals.callTree}>
      <TreeHeader rootCall={null} />
      <HorizontalIndicator progress={progress} />
      <LoadingSkeleton className={locals.skeleton} />
    </div>
  );
}
