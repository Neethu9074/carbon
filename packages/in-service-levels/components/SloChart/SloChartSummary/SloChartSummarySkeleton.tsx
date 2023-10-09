/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import SloTileSkeleton from 'in-service-levels/components/SloChart/SloChartTiles/SloTileSkeleton';

import locals from './SloChartSummary.mless';

interface SloChartSummarySkeletonProps {
  compact?: boolean;
}

export default function SloChartSummarySkeleton({ compact }: SloChartSummarySkeletonProps) {
  return (
    <div className={compact ? locals.listContainer : locals.tilesContainer} data-testid="sli-summary-skeleton">
      <SloTileSkeleton compact={compact} />
      <SloTileSkeleton compact={compact} />
      <SloTileSkeleton compact={compact} />
    </div>
  );
}
