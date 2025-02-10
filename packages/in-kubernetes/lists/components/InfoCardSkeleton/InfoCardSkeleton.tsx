/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { LoadingSkeleton, Stack } from '@instana/components';

import locals from './InfoCardSkeleton.mless';

interface InfoCardSkeletonProps {
  numberOfCards?: number;
}

export default function InfoCardSkeleton({ numberOfCards = 6 }: Readonly<InfoCardSkeletonProps>) {
  const skeletonCards = [];

  for (let i = 0; i < numberOfCards; i++) {
    skeletonCards.push(<LoadingSkeleton className={locals.skeleton} />);
  }

  return (
    <div className={locals.wrapper}>
      <Stack direction="vertical">
        <LoadingSkeleton className={locals.title} />
        <Stack direction="horizontal">{skeletonCards}</Stack>
      </Stack>
    </div>
  );
}
