/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import React from 'react';

import SloTileSkeleton from 'in-custom-dashboards/widgets/Slo/Tiles/SloTileSkeleton';

import locals from './WidgetHeader.mless';

interface WidgetHeaderSkeletonProps {
  compact?: boolean;
}

export default function WidgetHeaderSkeleton({ compact }: WidgetHeaderSkeletonProps) {
  return (
    <div className={compact ? locals.listContainer : locals.tilesContainer} data-testid="widget-header-skeleton">
      <SloTileSkeleton compact={compact} />
      <SloTileSkeleton compact={compact} />
      <SloTileSkeleton compact={compact} />
    </div>
  );
}
