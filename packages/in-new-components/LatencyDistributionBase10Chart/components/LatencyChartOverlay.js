import { isEqual, findIndex } from 'lodash';
import React, { useState } from 'react';

import ChartContextMenu from 'in-new-components/LatencyDistributionBase10Chart/components/ChartContextMenu';
import { millis, number, latency } from 'in-services/formatters/number';
import { latencySelectionChanged } from 'in-analyze/tracker';
import evaluateClassNames from 'in-services/util/classnames';
import cursors from 'in-components/cursors';
import theme from 'in-themes';

import locals from './LatencyChartOverlay.mless';

const SELECTION_HANDLE_WIDTH_IN_PX = 8;
const SELECTION_HANDLE_BOUND_IN_PX = SELECTION_HANDLE_WIDTH_IN_PX / 2 + 1;
const SELECTION_HANDLE_HEIGHT_IN_PX = 30;

/**
 * Transparent pane which captures mouse events and adds:
 * - adjustable or non-adjustable bucket selection
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
  onSelectionChanged,
  // can the selection be moved and resized?
  selectionAdjustable,
  dataSource
}) {
  // If the selection is adjustable the glass pane element which captures mouse events must be wider than
  // the chart on both sides (left and right) by GLASS_PANE_OFFSET, in order to:
  // - Cover completely the resizing handles which are partially outside the chart area.
  // - Keep the resizing active, when the first or the last bucket is reached and the mouse pointer
  //   exits the chart area by max GLASS_PANE_OFFSET.
  const GLASS_PANE_OFFSET = selectionAdjustable ? 30 : 0;

  const hoverPositions = {
    RESIZE_LEFT: 1,
    MOVE: 2,
    RESIZE_RIGHT: 3
  };

  const initSelectedBuckets = () => {
    if (
      !selection ||
      (selection.from == null && selection.to == null) ||
      // invalid selection
      (selection.from && selection.to && selection.from > selection.to)
    ) {
      return null;
    }
    const bucketFrom = findBucketIndexByLatency(buckets, selection.from) || 0;
    // the upper bound is specified as strict inequality (<), turn it into a not strict one (<=)
    const notStrictTo = selection.to && selection.to - 1;
    const bucketTo = findBucketIndexByLatency(buckets, notStrictTo) || buckets.length - 1;
    return {
      fromBucketIndex: bucketFrom,
      numberOfBuckets: bucketTo - bucketFrom + 1
    };
  };

  const findBucketIndexByLatency = (buckets, latency) => {
    if (latency == null) {
      return null;
    }
    const bucketIndex = findIndex(
      buckets,
      bucket => (bucket.from == null || bucket.from <= latency) && (bucket.to == null || latency < bucket.to)
    );
    return bucketIndex == -1 ? null : bucketIndex;
  };

  // Mouse current state e.g., {
  //   startX: 1000,            // horizontal coordinate when selection was started
  //   lastX: 120,              // last horizontal coordinate
  //   moved: true,             // was the horizontal coordinate changed since the last mouse down event, used for single bucket click selection
  //   cursor: cursors.pointer, // current mouse cursor
  //   selecting: true,         // selection is being made
  //   resizingLeft: false,     // selection is being resized from the left
  //   resizingRight: false,    // selection is being resized from the right
  //   moving: false            // selection is being moved
  // }
  const [mouseState, setMouseState] = useState(null);
  // Current bucket selection, e.g., {fromBucketIndex: 0, numberOfBuckets: 10}
  const [selectedBuckets, setSelectedBuckets] = useState(initSelectedBuckets());
  // Which bucket should be highlighted + tooltip
  const [highlightedBucketIndex, setHighlightedBucketIndex] = useState(null);
  // Should the context menu be shown?
  const [showContextMenu, setShowContextMenu] = useState(selection?.from != null || selection?.to != null);
  // Should the context menu be opened immediately instead of showing the quick buttons first?
  // Used only for single bucket click selection.
  const [immediatelyOpenContextMenu, setImmediatelyOpenContextMenu] = useState(false);

  const selectionStartX = selectedBuckets ? selectedBuckets.fromBucketIndex * bucketWidth : 0;
  const selectionWidth = selectedBuckets ? selectedBuckets.numberOfBuckets * bucketWidth : 0;

  const resetSelection = () => {
    setSelectedBuckets(null);
    setMouseState(null);
    setShowContextMenu(false);
    setImmediatelyOpenContextMenu(false);
  };

  const menuItems = selectionAdjustable
    ? [
        {
          name: 'clear_selection',
          icon: 'lib_openclose_cancel',
          label: 'Remove latency filter',
          onClick: () => resetSelection()
        },
        ...selectionMenuItems
      ]
    : selectionMenuItems;

  const getMouseX = e => {
    return e.nativeEvent.offsetX - GLASS_PANE_OFFSET;
  };

  const getBucketIndexAt = mousePosition => {
    let bucketIndex = Math.floor(mousePosition / bucketWidth);
    // clicking outside the buckets should snap to the first/last bucket
    bucketIndex = Math.max(0, bucketIndex);
    return Math.min(bucketIndex, buckets.length - 1);
  };

  const updateMouseState = stateUpdates => {
    setMouseState(prevState => {
      const newState = { ...prevState, ...stateUpdates };
      // don't update state unless it changed
      return isEqual(newState, prevState) ? prevState : newState;
    });
  };

  const onMouseDown = event => {
    event.preventDefault();
    if (selectedBuckets) {
      if (selectionAdjustable) {
        // Initiate moving or resizing
        const currentX = getMouseX(event);
        const hoverPosition = getHoverPosition(currentX);
        if (hoverPosition === hoverPositions.RESIZE_LEFT) {
          updateMouseState({ lastX: currentX, resizingLeft: true, cursor: cursors.ewResize });
        } else if (hoverPosition === hoverPositions.MOVE) {
          updateMouseState({ lastX: currentX, moving: true, cursor: cursors.grabbing });
        } else if (hoverPosition === hoverPositions.RESIZE_RIGHT) {
          updateMouseState({ lastX: currentX, resizingRight: true, cursor: cursors.ewResize });
        }
      } else {
        // If selection is not adjustable, clicking on the glass panel discards the selection.
        resetSelection();
      }
    } else {
      // Initiate selection - a new selection is only possible, if there is no current selection.
      const currentX = getMouseX(event);
      updateMouseState({ startX: currentX, lastX: currentX, selecting: true });
    }
    if (!selectionAdjustable) {
      // In order to be consistent with other charts, hide bucket highlighting (and tooltip) if selection
      // is active. However, never hide it when selection is adjustable.
      setHighlightedBucketIndex(null);
    }
  };

  const onMouseMove = event => {
    const currentMousePosition = getMouseX(event);
    const currentBucketIndex = getBucketIndexAt(currentMousePosition);
    const selectedBucketFirst = selectedBuckets && selectedBuckets.fromBucketIndex;
    const selectedBucketLast = selectedBuckets && selectedBucketFirst + selectedBuckets.numberOfBuckets - 1;
    if (mouseState?.selecting) {
      const startBucketIndex = getBucketIndexAt(mouseState.startX);
      selectBuckets(startBucketIndex, currentBucketIndex);
      updateMouseState({ lastX: currentMousePosition, moved: true });
    } else if (mouseState?.moving) {
      const lastBucketIndex = getBucketIndexAt(mouseState.lastX);
      let moveDistanceInBuckets = currentBucketIndex - lastBucketIndex;
      if (moveDistanceInBuckets > 0) {
        // limit rightwards movement at the last bucket
        moveDistanceInBuckets =
          Math.min(buckets.length - 1, selectedBucketLast + moveDistanceInBuckets) - selectedBucketLast;
      } else if (moveDistanceInBuckets < 0) {
        // limit leftwards movement at the first bucket
        moveDistanceInBuckets = Math.max(0, selectedBucketFirst + moveDistanceInBuckets) - selectedBucketFirst;
      }
      selectBuckets(selectedBucketFirst + moveDistanceInBuckets, selectedBucketLast + moveDistanceInBuckets);
      updateMouseState({ lastX: currentMousePosition });
    } else if (mouseState?.resizingRight) {
      // limit leftwards movement at the first selected bucket
      const hoveredOverBucketCurrent = Math.max(selectedBucketFirst, currentBucketIndex);
      let moveDistanceInBuckets = hoveredOverBucketCurrent - selectedBucketLast;
      if (moveDistanceInBuckets > 0) {
        // limit rightwards movement at the very last bucket
        moveDistanceInBuckets =
          Math.min(buckets.length - 1, selectedBucketLast + moveDistanceInBuckets) - selectedBucketLast;
      }
      selectBuckets(selectedBucketFirst, selectedBucketLast + moveDistanceInBuckets);
      updateMouseState({ lastX: currentMousePosition });
    } else if (mouseState?.resizingLeft) {
      // limit rightwards movement at the last selected bucket
      const hoveredOverBucketCurrent = Math.min(selectedBucketLast, currentBucketIndex);
      let moveDistanceInBuckets = hoveredOverBucketCurrent - selectedBucketFirst;
      if (moveDistanceInBuckets < 0) {
        // limit leftwards movement at the very first bucket
        moveDistanceInBuckets = Math.max(0, selectedBucketFirst + moveDistanceInBuckets) - selectedBucketFirst;
      }
      selectBuckets(selectedBucketFirst + moveDistanceInBuckets, selectedBucketLast);
      updateMouseState({ lastX: currentMousePosition });
    } else if (selectionAdjustable) {
      // adjust the mouse cursor to give a visual clue, whether resizing or moving of the selection can start
      updateMouseCursor(currentMousePosition);
    }

    if (selectionAdjustable || (!mouseState?.selecting && !selectedBuckets)) {
      // update highlighted bucket index
      let highlightedBucketIndex = currentBucketIndex;
      // When we reach the last/first bucket during resizing from the left/right, the selection will be
      // only one bucket wide and we don't allow to resize pass this (swapping selection's start and end).
      // We should do the same for the highlighted bucket as well. This way the tooltip stays on the selected
      // bucket, which feels more natural.
      if (mouseState?.resizingLeft) {
        highlightedBucketIndex = Math.min(highlightedBucketIndex, selectedBucketLast);
      } else if (mouseState?.resizingRight) {
        highlightedBucketIndex = Math.max(highlightedBucketIndex, selectedBucketFirst);
      }
      setHighlightedBucketIndex(highlightedBucketIndex);
    }
  };

  const onMouseUp = event => {
    if (mouseState?.selecting) {
      completeSelection(event);
    }
    setMouseState(null);
  };

  const onMouseLeave = event => {
    if (mouseState?.selecting) {
      completeSelection(event);
    }
    setMouseState(null);
    setHighlightedBucketIndex(null);
  };

  const onMouseEnter = event => {
    if (mouseState?.moving) {
      const currentMousePosition = getMouseX(event);
      updateMouseState({ lastX: currentMousePosition });
    }
  };

  const getHoverPosition = currentMousePosition => {
    const resizeFrom = selectionStartX - SELECTION_HANDLE_BOUND_IN_PX;
    const moveFrom = selectionStartX + SELECTION_HANDLE_BOUND_IN_PX;
    const moveTo = selectionStartX + selectionWidth - SELECTION_HANDLE_BOUND_IN_PX;
    const resizeTo = selectionStartX + selectionWidth + SELECTION_HANDLE_BOUND_IN_PX;
    if (resizeFrom <= currentMousePosition && currentMousePosition <= moveFrom) {
      return hoverPositions.RESIZE_LEFT;
    } else if (moveFrom < currentMousePosition && currentMousePosition < moveTo) {
      return hoverPositions.MOVE;
    } else if (moveTo <= currentMousePosition && currentMousePosition <= resizeTo) {
      return hoverPositions.RESIZE_RIGHT;
    }
    return null;
  };

  const completeSelection = event => {
    const currentMousePosition = getMouseX(event);
    const selectionBucketStart = getBucketIndexAt(mouseState.startX);
    const selectionBucketEnd = getBucketIndexAt(currentMousePosition);
    selectBuckets(selectionBucketStart, selectionBucketEnd);

    // Show context menu right away only for a single bucket selection (click without moving the cursor)
    // and never when the selection is adjustable.
    if (mouseState.moved !== true && !selectionAdjustable) {
      setImmediatelyOpenContextMenu(true);
      setShowContextMenu(true);
    }
  };

  const selectBuckets = (startBucketIndex, endBucketIndex) => {
    const fromBucketIndex = Math.min(startBucketIndex, endBucketIndex);
    const lastBucketIndex = Math.max(startBucketIndex, endBucketIndex);
    const numberOfBuckets = Math.abs(startBucketIndex - endBucketIndex) + 1;
    if (
      selectBuckets &&
      selectBuckets.fromBucketIndex === fromBucketIndex &&
      selectBuckets.numberOfBuckets === numberOfBuckets
    ) {
      // no change, no need to update the state
      return;
    }
    setSelectedBuckets({
      fromBucketIndex: fromBucketIndex,
      numberOfBuckets: numberOfBuckets
    });
    if (onSelectionChanged != null) {
      // after resizing the selection rightwards, keep the original "from" value, instead
      // of "snapping" to the start of the first bucket
      let from =
        selection?.from && mouseState?.resizingRight
          ? selection.from
          : fromBucketIndex && buckets[fromBucketIndex].from;
      // after resizing the selection leftwards, keep the original "to" value, instead
      // of "snapping" to the end of the last bucket
      let to =
        selection?.to && mouseState?.resizingLeft ? selection.to : lastBucketIndex && buckets[lastBucketIndex].to;
      onSelectionChanged({ from: from, to: to });
      latencySelectionChanged();
    }
  };

  const tooltipPositionStyle =
    highlightedBucketIndex != null &&
    (highlightedBucketIndex > buckets.length / 2
      ? { right: (buckets.length - highlightedBucketIndex + 0.5) * bucketWidth }
      : { left: (highlightedBucketIndex + 1.5) * bucketWidth });
  const strikeLinePosition = highlightedBucketIndex != null && highlightedBucketIndex * bucketWidth + bucketCenter;

  const selectionDone = !mouseState?.selecting && selectedBuckets;
  const contextMenuLeftAligned =
    selectedBuckets && selectedBuckets.fromBucketIndex + selectedBuckets.numberOfBuckets - 1 < buckets.length / 2;
  const cursor = mouseState?.cursor || cursors.pointer;

  return (
    <div className={locals.overlay} style={{ width: width }}>
      <div
        className={locals.glassPane}
        style={{
          height: height,
          cursor: cursor,
          width: width + 2 * GLASS_PANE_OFFSET + 'px',
          left: -GLASS_PANE_OFFSET + 'px'
        }}
        onMouseEnter={onMouseEnter}
        onMouseUp={onMouseUp}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
      />
      {selectedBuckets && (
        <Selection
          height={height}
          selectionStart={selectionStartX}
          selectionWidth={selectionWidth}
          selectionAdjustable={selectionAdjustable}
        />
      )}
      {selectionDone && (
        <ChartContextMenu
          style={{ bottom: height, left: selectionStartX + selectionWidth }}
          immediatelyOpenContextMenu={immediatelyOpenContextMenu}
          showContextMenu={showContextMenu}
          setShowContextMenu={value => setShowContextMenu(value)}
          bucketWidth={bucketWidth}
          leftAligned={contextMenuLeftAligned}
          onContextMenuClosed={() => selectionAdjustable || resetSelection()}
          menuItems={menuItems}
        />
      )}

      {highlightedBucketIndex != null && (
        <>
          {// Don't show the strike line while resizing the selection to minimize disruption. It's obvious enough
          // for which bucket the tooltip is shown.
          !(mouseState?.resizingLeft || mouseState?.resizingRight) && (
            <StrikeLine style={{ height: height, left: strikeLinePosition }} />
          )}
          <Tooltip
            bucket={buckets[highlightedBucketIndex]}
            percentiles={percentileBuckets[highlightedBucketIndex]}
            style={{ ...tooltipPositionStyle, bottom: height }}
            dataSource={dataSource}
          />
        </>
      )}
    </div>
  );

  function updateMouseCursor(currentMousePosition) {
    const hoverPosition = getHoverPosition(currentMousePosition);
    if (hoverPosition === hoverPositions.RESIZE_LEFT || hoverPosition === hoverPositions.RESIZE_RIGHT) {
      updateMouseState({ cursor: cursors.ewResize });
    } else if (hoverPosition === hoverPositions.MOVE) {
      updateMouseState({ cursor: cursors.grab });
    } else if (currentMousePosition >= 0 && currentMousePosition <= bucketWidth * buckets.length) {
      // inside the chart area
      updateMouseState({ cursor: cursors.pointer });
    } else {
      // outside the chart area (inside the GLASS_PANE_OFFSET area)
      updateMouseState({ cursor: cursors.default });
    }
  }
}

function Selection({ height, selectionStart, selectionWidth, selectionAdjustable }) {
  const selectionHandleBaseStyle = {
    width: SELECTION_HANDLE_WIDTH_IN_PX + 'px',
    bottom: (height - SELECTION_HANDLE_HEIGHT_IN_PX) / 2 + 'px',
    height: SELECTION_HANDLE_HEIGHT_IN_PX + 'px'
  };

  return (
    <>
      <div
        className={evaluateClassNames({
          [locals.selection]: true,
          [locals.selectionAdjustable]: selectionAdjustable
        })}
        style={{
          height: height,
          left: selectionStart,
          width: selectionWidth,
          backgroundColor: theme.lib.colors.chartSelection
        }}
      />
      {selectionAdjustable && (
        <>
          <div
            className={locals.selectionHandle}
            style={{
              left: selectionStart - SELECTION_HANDLE_WIDTH_IN_PX / 2 + 'px',
              ...selectionHandleBaseStyle
            }}
          />
          <div
            className={locals.selectionHandle}
            style={{
              left: selectionStart + selectionWidth - SELECTION_HANDLE_WIDTH_IN_PX / 2 + 1 + 'px',
              ...selectionHandleBaseStyle
            }}
          />
        </>
      )}
    </>
  );
}

function Tooltip({ bucket, percentiles, style, dataSource }) {
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
        <span>{dataSource === 'calls' ? 'Calls' : 'Traces'} (sum)</span>
        <span className={locals.value}>{number.forcedCompact.detailed(bucket.calls)}</span>
      </div>
      {percentiles.map(p => (
        <div key={p.percentile} className={locals.labelWrapper}>
          <span>p{p.percentile}</span>
          <span className={locals.value}>{latency.compact(p.latency)}</span>
        </div>
      ))}
    </div>
  );
}

function StrikeLine({ style }) {
  return <div style={style} className={locals.barStrike} />;
}
