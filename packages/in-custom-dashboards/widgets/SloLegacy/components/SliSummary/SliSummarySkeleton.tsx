/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import React from 'react';

import SloTileSkeleton from 'in-custom-dashboards/widgets/SloLegacy/components/widget/tiles/SloTileSkeleton';

import locals from './SliSummary.mless';

interface SliSummarySkeletonProps {
  compact?: boolean;
}

export default function SliSummarySkeleton({ compact }: SliSummarySkeletonProps) {
  return (
    <div className={compact ? locals.listContainer : locals.tilesContainer} data-testid="sli-summary-skeleton">
      <SloTileSkeleton compact={compact} />
      <SloTileSkeleton compact={compact} />
      <SloTileSkeleton compact={compact} />
    </div>
  );
}
