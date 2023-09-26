/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { LoadingSkeleton } from '@instana/components';

import locals from './SloTile.mless';

interface SloTileSkeletonProps {
  compact?: boolean;
}

export default function SloTileSkeleton({ compact = false }: SloTileSkeletonProps) {
  if (compact) {
    return (
      <div className={locals.oneRow} data-testid="slo-tile-skeleton">
        <div className={locals.titleValueBorder}>
          <LoadingSkeleton className={locals.titleSkeleton} />
          <LoadingSkeleton className={locals.budgetSkeleton} />
        </div>
        <div className={locals.targetInfo}>
          <LoadingSkeleton className={locals.budgetTitleSkeleton} />
          <LoadingSkeleton className={locals.targetInfoSkeleton} />
        </div>
      </div>
    );
  }

  return (
    <div className={locals.tile} data-testid="slo-tile-skeleton">
      <LoadingSkeleton className={locals.titleSkeleton} />
      <div>
        <LoadingSkeleton className={locals.budgetSkeleton} />
      </div>
      <div className={locals.targetInfo}>
        <LoadingSkeleton className={locals.targetInfoSkeleton} />
      </div>
    </div>
  );
}
