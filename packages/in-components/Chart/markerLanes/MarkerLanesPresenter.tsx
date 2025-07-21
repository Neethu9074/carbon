/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState, Children, cloneElement, useRef, isValidElement } from 'react';

import { SvgIconSizes } from '@instana/components';
import { TimeConfig } from '@instana/types';

import { getBlockSizeMillis } from 'in-services/util/dynamicAggregation';
import { ChartContentPostition } from 'in-components/Chart/types';

import locals from './MarkerLanesPresenter.mless';

const minBlockWidth = SvgIconSizes.xs;

type LabelAlignment = 'right' | 'left';

/**
 * These are the props added to the individual MarkerLanes by this component
 */
export interface PresentedLaneProps {
  labelAlignment: LabelAlignment;
  clusterSizeMillis: number;
  isClustered: boolean;
  chartWidth: number;
  chartBucketWidth: number;
  granularity: number;
  timeConfig: TimeConfig;
  laneLabelsVisible: boolean;
  onLaneHasMarkersToRender: () => void;
  chartHeight?: number;
  timeAxisHeight?: number;
  markerPaneHeight?: number;
}

type PartialMarkerLanesPresenterProps = Omit<MarkerLanesPresenterProps, 'children' | 'granularity'> & {
  children?: React.ReactNode;
  granularity?: number;
};

type MarkerLanesPresenterProps = {
  children: React.ReactNode;
  granularity: number;
  chartWidth: number;
  chartBucketWidth: number;
  timeConfig: TimeConfig;
  chartHeight?: number;
  timeAxisHeight?: number;
  markerPaneHeight?: number;
  chartContentPosition: ChartContentPostition;
};

type MarkerLanesWrapperProps = Omit<MarkerLanesPresenterProps, 'children'> & {
  lanes: React.ReactNode;
  setLaneLabelsVisibility: (isVisible: boolean) => void;
  labelAlignment: LabelAlignment;
  laneLabelsVisible: boolean;
  onLaneHasMarkersToRender: () => void;
  hasMarkersToRender: boolean;
};

export default function MarkerLanesPresenterPropsChecker(props: PartialMarkerLanesPresenterProps) {
  if (!props.children || !props.granularity) {
    return null;
  }

  return <MarkerLanesPresenter {...(props as MarkerLanesPresenterProps)} />;
}
function MarkerLanesPresenter({
  children,
  granularity,
  chartWidth,
  chartBucketWidth,
  chartContentPosition,
  ...remainingProps
}: MarkerLanesPresenterProps) {
  const [labelAlignment, setLabelAligment] = useState<LabelAlignment>('left');
  const [hasMarkersToRender, setHasMarkersToRender] = useState(false);
  const [laneLabelsVisible, setLaneLabelsVisibility] = useState(false);

  return (
    <div
      className={locals.markerLanesContainer}
      onMouseLeave={() => {
        if (hasMarkersToRender) setLaneLabelsVisibility(false);
      }}
    >
      <MarkerLanesWrapper
        {...remainingProps}
        lanes={children}
        setLaneLabelsVisibility={isVisible => setLaneLabelsVisibility(isVisible)}
        labelAlignment={labelAlignment}
        chartWidth={chartWidth}
        granularity={granularity}
        chartBucketWidth={chartBucketWidth}
        laneLabelsVisible={(hasMarkersToRender && laneLabelsVisible) || (!hasMarkersToRender && !laneLabelsVisible)}
        onLaneHasMarkersToRender={() => setHasMarkersToRender(true)}
        hasMarkersToRender={hasMarkersToRender}
        chartContentPosition={chartContentPosition}
      />
      <div
        className={locals[labelAlignment]}
        onMouseEnter={() => {
          if (hasMarkersToRender) setLabelAligment(labelAlignment === 'left' ? 'right' : 'left');
        }}
      />
    </div>
  );
}

function MarkerLanesWrapper({
  lanes,
  setLaneLabelsVisibility,
  labelAlignment,
  chartWidth,
  granularity,
  chartBucketWidth,
  laneLabelsVisible,
  hasMarkersToRender,
  timeConfig,
  ...remainingProps
}: MarkerLanesWrapperProps) {
  const isClustered = chartBucketWidth < minBlockWidth - 2;

  const markerLanesWrapperRef = useRef<HTMLDivElement>(null);

  const additionalChildProps: PresentedLaneProps = {
    ...remainingProps,
    labelAlignment,
    clusterSizeMillis: isClustered
      ? getClusterSizeMillis({
          width: chartWidth || (markerLanesWrapperRef.current?.getBoundingClientRect()?.width ?? 0),
          windowSize: timeConfig.windowSize,
          granularity
        })
      : granularity,
    isClustered,
    chartBucketWidth,
    chartWidth,
    granularity,
    timeConfig,
    laneLabelsVisible
  };

  return (
    <div
      ref={markerLanesWrapperRef}
      className={locals.markerLanesWrapper}
      onMouseEnter={() => {
        if (hasMarkersToRender) setLaneLabelsVisibility(true);
      }}
    >
      {Children.toArray(lanes)
        .filter(Boolean)
        .map(child => {
          return isValidElement(child) ? cloneElement(child, additionalChildProps) : child;
        })}
    </div>
  );
}

interface GetClusterSizeMillisProps {
  windowSize: number;
  width: number;
  granularity: number;
}

function getClusterSizeMillis({ windowSize, width, granularity }: GetClusterSizeMillisProps) {
  return getBlockSizeMillis({
    windowSize,
    minPixelsPerBlock: minBlockWidth,
    width,
    rollup: granularity
  });
}
