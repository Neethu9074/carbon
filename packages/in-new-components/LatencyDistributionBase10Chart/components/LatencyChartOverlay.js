import { isEqual, findIndex } from 'lodash';
import React, { useState } from 'react';

import ChartContextMenu from 'in-new-components/LatencyDistributionBase10Chart/components/ChartContextMenu';
import { millis, number } from 'in-services/formatters/number';
import theme from 'in-themes';

import locals from './LatencyChartOverlay.mless';

/**
 * Transparent pane which captures mouse events and adds:
 * - bucket selection
 * - selection context menu
 * - highlighting of buckets with a tooltip
 */
export default function LatencyChartOverlay({
  buckets,
  percentileBuckets,
  // width of a bucket in pixels
  bucketWidth,
  // horizontal center of a bucket in pixels
  bucketCenter,
  height,
  width,
  // initial selection, e.g., {from: 1, to: 10}
  selection,
  // items for the selection context menu, if not set, selection will be disabled
  selectionMenuItems,
  // callback to call when selection changes, e.g., onSelectionChanged({from: 2, to: 3})
  onSelectionChanged
}) {
  const MIN_MOUSE_POSITION_DIFF = 3;

  const initSelectedBuckets = () => {
    if (selection?.from == null && selection?.to == null) {
      return null;
    }
    const bucketFrom = getBucketWithLatency(buckets, selection.from) || 0;
    const bucketTo = getBucketWithLatency(buckets, selection.to) || buckets.length - 1;
    return {
      firstBucket: bucketFrom,
      numberOfBuckets: bucketTo - bucketFrom + 1
    };
  };

  const getBucketWithLatency = (buckets, latency) => {
    if (latency == null) {
      return null;
    }
    const bucketIndex = findIndex(
      buckets,
      bucket => (bucket.from == null || bucket.from >= latency) && (bucket.to == null || latency < bucket.to)
    );
    return bucketIndex == -1 ? null : bucketIndex;
  };

  const isSelectionEnabled = () => {
    // Disable selection when there are no menu items.
    return selectionMenuItems && selectionMenuItems.length > 0;
  };

  // Tracking of past mouse positions while dragging e.g., { start: 1000, last: 120, moved: true }
  const [mousePositions, setMousePositions] = useState(null);
  // Current bucket selection, e.g., {firstBucket: 0, numberOfBuckets: 10}
  const [selectedBuckets, setSelectedBuckets] = useState(initSelectedBuckets());
  // Which bucket should be highlighted + tooltip
  const [highlightedBucket, setHighlightedBucket] = useState(null);
  // Should the context menu be shown?
  const [showContextMenu, setShowContextMenu] = useState(selection?.from != null || selection?.to != null);
  // Should the context menu be opened immediately instead of showing the quick buttons first?
  // Used only for single bucket click selection.
  const [immediatelyOpenContextMenu, setImmediatelyOpenContextMenu] = useState(false);

  const resetSelection = () => {
    setSelectedBuckets(null);
    setMousePositions(null);
    setShowContextMenu(false);
    setImmediatelyOpenContextMenu(false);
  };

  const isDragging = () => {
    return mousePositions && mousePositions.start != null;
  };

  const mousePosition = e => {
    return e.nativeEvent.offsetX;
  };

  const bucketAt = mousePosition => {
    let bucket = Math.floor(mousePosition / bucketWidth);
    // clicking outside the buckets should snap to the first/last bucket
    bucket = Math.max(0, bucket);
    return Math.min(bucket, buckets.length - 1);
  };

  const saveMousePositions = stateUpdates => {
    setMousePositions(prevState => {
      const newState = { ...prevState, ...stateUpdates };
      return isEqual(newState, prevState) ? prevState : newState;
    });
  };

  const onMouseDown = event => {
    event.preventDefault();
    // clicking on the glass panel when a highlighted selection was made, only discards the selection
    // a new selection should only possible if there is no current selection
    if (selectedBuckets) {
      resetSelection();
    } else {
      const currentMousePosition = mousePosition(event);
      saveMousePositions({ start: currentMousePosition, last: currentMousePosition });
    }
    if (isSelectionEnabled()) {
      // Hide bucket highlighting and tooltip if selection is active
      setHighlightedBucket(null);
    }
  };

  const onMouseMove = event => {
    if (isDragging()) {
      // bucket selection
      if (mousePositions?.last) {
        const currentMousePosition = mousePosition(event);
        const mousePositionDiff = Math.abs(currentMousePosition - mousePositions.last);

        if (mousePositionDiff > MIN_MOUSE_POSITION_DIFF) {
          const startBucket = bucketAt(mousePositions.start);
          const currentBucket = bucketAt(currentMousePosition);
          selectBuckets(startBucket, currentBucket);
          saveMousePositions({ last: currentMousePosition, moved: true });
        } else {
          saveMousePositions({ moved: true });
        }
      }
    }
    if (!isSelectionEnabled() || (!isDragging() && !selectedBuckets)) {
      // bucket highlighting + tooltip
      const currentMousePosition = mousePosition(event);
      setHighlightedBucket(bucketAt(currentMousePosition));
    }
  };

  const onMouseUp = event => {
    if (isDragging()) {
      const selectionBucketStart = bucketAt(mousePositions.start);
      const selectionBucketEnd = bucketAt(mousePosition(event));
      selectBuckets(selectionBucketStart, selectionBucketEnd);

      // show context menu right away only for a single bucket selection
      if (mousePositions.moved !== true) {
        setImmediatelyOpenContextMenu(true);
        setShowContextMenu(true);
      }
    }
    setMousePositions(null);
  };

  const onMouseLeave = event => {
    onMouseUp(event);
    setHighlightedBucket(null);
  };

  const selectBuckets = (startBucket, endBucket) => {
    const firstBucket = Math.min(startBucket, endBucket);
    const lastBucket = Math.max(startBucket, endBucket);
    const numberOfBuckets = Math.abs(startBucket - endBucket) + 1;
    if (
      selectBuckets &&
      selectBuckets.firstBucket === firstBucket &&
      selectBuckets.numberOfBuckets === numberOfBuckets
    ) {
      // no change, no need to update the state
      return;
    }
    setSelectedBuckets({
      firstBucket: firstBucket,
      numberOfBuckets: numberOfBuckets
    });
    if (isSelectionEnabled && onSelectionChanged != null) {
      onSelectionChanged({
        from: firstBucket && buckets[firstBucket].from,
        to: lastBucket && buckets[lastBucket].to
      });
    }
  };

  const selectionStart = selectedBuckets ? selectedBuckets.firstBucket * bucketWidth : 0;
  const selectionWidth = selectedBuckets ? selectedBuckets.numberOfBuckets * bucketWidth : 0;
  const tooltipPositionStyle =
    highlightedBucket != null &&
    (highlightedBucket > buckets.length / 2
      ? { right: (buckets.length - highlightedBucket + 0.5) * bucketWidth }
      : { left: (highlightedBucket + 1.5) * bucketWidth });
  const strikeLinePosition = highlightedBucket != null && highlightedBucket * bucketWidth + bucketCenter;

  const selectionDone = isSelectionEnabled() && !isDragging() && selectedBuckets;
  const contextMenuLeftAligned =
    selectedBuckets && selectedBuckets.firstBucket + selectedBuckets.numberOfBuckets - 1 < buckets.length / 2;

  return (
    <div className={locals.overlay} style={{ width: width }}>
      <div
        className={locals.glassPane}
        style={{ height: height }}
        onMouseUp={onMouseUp}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
      />
      {isSelectionEnabled() && (
        <div
          className={locals.selection}
          style={{
            height: height,
            left: selectionStart,
            width: selectionWidth,
            backgroundColor: theme.lib.colors.chartSelection
          }}
        />
      )}

      {selectionDone && (
        <ChartContextMenu
          style={{ bottom: height, left: selectionStart + selectionWidth }}
          immediatelyOpenContextMenu={immediatelyOpenContextMenu}
          showContextMenu={showContextMenu}
          setShowContextMenu={value => setShowContextMenu(value)}
          onContextMenuClosed={() => resetSelection()}
          bucketWidth={bucketWidth}
          leftAligned={contextMenuLeftAligned}
          menuItems={selectionMenuItems}
        />
      )}

      {highlightedBucket != null && (
        <>
          <StrikeLine style={{ height: height, left: strikeLinePosition }} />
          <Tooltip
            bucket={buckets[highlightedBucket]}
            percentiles={percentileBuckets[highlightedBucket]}
            style={{ ...tooltipPositionStyle, bottom: height }}
          />
        </>
      )}
    </div>
  );
}

function Tooltip({ bucket, percentiles, style }) {
  const formatTime = millis.forcedCompactOnMs.detailed;
  const from = bucket.from && formatTime(bucket.from);
  const to = bucket.to && formatTime(bucket.to);
  let latencyRangeLabel;
  if (to == null) {
    latencyRangeLabel = `> ${from}`;
  } else if (from == null || from === 0) {
    latencyRangeLabel = `< ${to}`;
  } else {
    latencyRangeLabel = `${from} to ${to}`;
  }
  return (
    <div className={locals.tooltipContent} style={style}>
      <div className={locals.labelWrapper}>{latencyRangeLabel}</div>
      <div className={locals.labelWrapper}>
        <div className={locals.dot} />
        <span>Calls (sum)</span>
        <span className={locals.value}>{number.forcedCompact.detailed(bucket.calls)}</span>
      </div>
      {percentiles.map(p => (
        <div key={p.percentile} className={locals.labelWrapper}>
          <span>p{p.percentile}</span>
          <span className={locals.value}>{p.latency}</span>
        </div>
      ))}
    </div>
  );
}

function StrikeLine({ style }) {
  return <div style={style} className={locals.barStrike} />;
}
