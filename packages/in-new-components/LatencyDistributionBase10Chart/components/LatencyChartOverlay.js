import React, { useState, useEffect } from 'react';
import { isEqual } from 'lodash';

import ChartContextMenu from 'in-new-components/LatencyDistributionBase10Chart/components/ChartContextMenu';
import { setTimeConfig, fixateTimeConfig } from 'in-stores/time/config';
import { millis, number, latency } from 'in-services/formatters/number';
import { latencySelectionChanged } from 'in-analyze/tracker';
import evaluateClassNames from 'in-services/util/classnames';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { mutateUrl } from 'in-stores/navigation';
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

  const findBucketIndexByLatency = (buckets, latency) => {
    if (latency == null) {
      return null;
    }
    const bucketIndex = buckets.findIndex(
      bucket => (bucket.from == null || bucket.from <= latency) && (bucket.to == null || latency < bucket.to)
    );
    return bucketIndex === -1 ? null : bucketIndex;
  };

  const latencyToBucketSelection = latencySelection => {
    if (
      !latencySelection ||
      (latencySelection.from == null && latencySelection.to == null) ||
      // invalid selection
      (latencySelection.from && latencySelection.to && latencySelection.from > latencySelection.to)
    ) {
      return null;
    }
    const fromIndex = findBucketIndexByLatency(buckets, latencySelection.from) || 0;
    // the upper bound is specified as strict inequality (<), turn it into a not strict one (<=)
    const notStrictTo = latencySelection.to && latencySelection.to - 1;
    let toIndex = findBucketIndexByLatency(buckets, notStrictTo);
    if (toIndex == null) {
      toIndex = buckets.length - 1;
    }
    return {
      fromIndex: fromIndex,
      toIndex: toIndex
    };
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
  // Current bucket selection, e.g., {fromIndex: 0, toIndex: 10}
  const [selectedBuckets, setSelectedBuckets] = useState(latencyToBucketSelection(selection));
  // Which bucket should be highlighted + tooltip
  const [highlightedBucketIndex, setHighlightedBucketIndex] = useState(null);
  // Should the context menu be shown?
  const [showContextMenu, setShowContextMenu] = useState(selection?.from != null || selection?.to != null);
  // Should the context menu be opened immediately instead of showing the quick buttons first?
  // Used only for single bucket click selection.
  const [immediatelyOpenContextMenu, setImmediatelyOpenContextMenu] = useState(false);

  const timeConfig = useTimeConfig();

  // update selected buckets when the 'selection' property changes
  useEffect(() => {
    const newSelectedBuckets = latencyToBucketSelection(selection);
    if (!isEqual(selectedBuckets, newSelectedBuckets)) {
      setSelectedBuckets(newSelectedBuckets);
    }
  }, [selection]);

  // Fixate time config when latency selection is made. This is necessary because the latency chart won't
  // get refreshed when selection is adjusted, however, the result table does. If the time config would not
  // be fixated, the chart and the table would show data for different time frames.
  useEffect(() => {
    if ((selection?.from || selection?.to) && timeConfig.to == null) {
      mutateUrl(location => setTimeConfig(location, fixateTimeConfig(timeConfig)), true);
    }
  }, [selection]);

  const selectionStartX = selectedBuckets ? selectedBuckets.fromIndex * bucketWidth : 0;
  const selectionWidth = selectedBuckets ? (selectedBuckets.toIndex - selectedBuckets.fromIndex + 1) * bucketWidth : 0;

  const resetSelection = () => {
    setSelectedBuckets(null);
    setMouseState(null);
    setShowContextMenu(false);
    setImmediatelyOpenContextMenu(false);
  };

  // If the selection is adjustable, the selection won't be clear by clicking somewhere
  // as in case of normal charts. We need to provide a menu item to clear the selection instead.
  const menuItems = selectionAdjustable
    ? [
        {
          name: 'clear_selection',
          icon: 'lib_openclose_cancel',
          label: 'Remove latency filter',
          onClick: () => {
            resetSelection();
            notifyOnSelectionChangedHandler(null);
          }
        },
        ...selectionMenuItems
      ]
    : selectionMenuItems;

  const getMouseX = synthEvent => synthEvent.nativeEvent.offsetX - GLASS_PANE_OFFSET;

  const getBucketIndexAt = mousePosition => {
    let bucketIndex = Math.floor(mousePosition / bucketWidth);
    // clicking outside the buckets should snap to the first/last bucket
    bucketIndex = Math.max(0, bucketIndex);
    return Math.min(bucketIndex, buckets.length - 1);
  };

  /**
   * Returns 'from' and 'to' indices of buckets between two X coordinates. A bucket is selected only
   * if its center is included in the selection.
   */
  const getBucketsBetweenXCoordinates = (x1, x2) => {
    const leftX = Math.min(x1, x2);
    const rightX = Math.max(x1, x2);

    let fromIndex = Math.round(leftX / bucketWidth);
    let toIndex = Math.round(rightX / bucketWidth) - 1;

    if (toIndex < fromIndex) {
      return [null, null];
    }

    // clicking outside the buckets should snap to the first/last bucket
    fromIndex = Math.max(0, fromIndex);
    fromIndex = Math.min(fromIndex, buckets.length - 1);
    toIndex = Math.max(0, toIndex);
    toIndex = Math.min(toIndex, buckets.length - 1);

    return [fromIndex, toIndex];
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
    const selectedBucketFirst = selectedBuckets && selectedBuckets.fromIndex;
    const selectedBucketLast = selectedBuckets && selectedBuckets.toIndex;
    if (mouseState?.selecting) {
      const [fromIndex, toIndex] = getBucketsBetweenXCoordinates(mouseState.startX, currentMousePosition);
      updateSelectedBuckets(fromIndex, toIndex);
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
      updateSelectedBuckets(selectedBucketFirst + moveDistanceInBuckets, selectedBucketLast + moveDistanceInBuckets);
      updateMouseState({ lastX: currentMousePosition });
    } else if (mouseState?.resizingRight) {
      // limit leftwards movement at the right edge of the first selected bucket
      const rightX = Math.max((selectedBucketFirst + 1) * bucketWidth, currentMousePosition);
      const [fromIndex, toIndex] = getBucketsBetweenXCoordinates(selectedBucketFirst * bucketWidth, rightX);
      updateSelectedBuckets(fromIndex, toIndex);
      updateMouseState({ lastX: currentMousePosition });
    } else if (mouseState?.resizingLeft) {
      // limit rightwards movement at the left edge of the last selected bucket
      const leftX = Math.min(selectedBucketLast * bucketWidth, currentMousePosition);
      const [fromIndex, toIndex] = getBucketsBetweenXCoordinates(leftX, (selectedBucketLast + 1) * bucketWidth);
      updateSelectedBuckets(fromIndex, toIndex);
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
      const [fromIndex, toIndex] = getBucketsBetweenXCoordinates(mouseState.startX, getMouseX(event));
      let newBucketSelection = null;
      if (selectionAdjustable && fromIndex === 0 && toIndex === buckets.length - 1) {
        // If selection is adjustable, selecting all buckets clears the selection. This is necessary, because selection
        // is always kept in sync with latency filters and currently there is no way expressing selection of the whole
        // latency range. Theoretically, full selection could be expressed as 'call.latency >= 0', but currently
        // all latency based filters have to use positive latency values. The reason for this is that all latencies in
        // range from 0 to 1ms are stored in backed as 0ms. Latencies from this range are displayed across the product
        // as '< 1' and we want to avoid querying calls by 'call.latency = 0'.
        newBucketSelection = null;
        setSelectedBuckets(null);
      } else {
        newBucketSelection = updateSelectedBuckets(fromIndex, toIndex);
        // Show context menu right away only for a single bucket selection (click without moving the cursor)
        // and never when the selection is adjustable.
        if (mouseState.moved !== true && !selectionAdjustable) {
          setImmediatelyOpenContextMenu(true);
          setShowContextMenu(true);
        }
      }
      notifyOnSelectionChangedHandler(newBucketSelection);
    } else if (mouseState?.moving || mouseState?.resizingLeft || mouseState?.resizingRight) {
      notifyOnSelectionChangedHandler(selectedBuckets);
    }
    setMouseState(null);
  };

  const onMouseLeave = event => {
    onMouseUp(event);
    setHighlightedBucketIndex(null);
  };

  const onMouseEnter = event => {
    if (mouseState?.moving) {
      const currentMousePosition = getMouseX(event);
      updateMouseState({ lastX: currentMousePosition });
    }
  };

  const getHoverPosition = currentMousePosition => {
    if (!selectedBuckets) {
      return null;
    }
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

  const notifyOnSelectionChangedHandler = newBucketSelection => {
    if (onSelectionChanged == null) {
      // no handler registered
      return;
    }

    const newSelection = {};
    if (newBucketSelection) {
      const fromBucketIndex = newBucketSelection.fromIndex;
      const toBucketIndex = newBucketSelection.toIndex;

      let fromLatency = null;
      if (mouseState?.resizingRight && selection?.from != null) {
        // after resizing the selection rightwards, keep the original "from" value,
        // instead of "snapping" to the start of the first selected bucket
        fromLatency = selection.from;
      } else if (fromBucketIndex != null) {
        fromLatency = buckets[fromBucketIndex].from;
      }

      let toLatency = null;
      if (mouseState?.resizingLeft && selection?.to != null) {
        // after resizing the selection leftwards, keep the original "to" value,
        // instead of "snapping" to the end of the last selected bucket
        toLatency = selection.to;
      } else if (toBucketIndex != null) {
        toLatency = buckets[toBucketIndex].to;
      }

      if (fromLatency) {
        // discard from=0 latency filter
        newSelection.from = fromLatency;
      }
      if (toLatency) {
        newSelection.to = toLatency;
      }
    }

    if (!isEqual(selection, newSelection)) {
      // notify only if the selection really changed
      onSelectionChanged(newSelection);
      latencySelectionChanged({
        selecting: mouseState?.selecting,
        resizing: mouseState?.resizingLeft || mouseState?.resizingRight,
        moving: mouseState?.moving
      });
    }
  };

  const updateSelectedBuckets = (startBucketIndex, endBucketIndex) => {
    const newState =
      startBucketIndex != null && endBucketIndex != null
        ? {
            fromIndex: Math.min(startBucketIndex, endBucketIndex),
            toIndex: Math.max(startBucketIndex, endBucketIndex)
          }
        : null;
    // don't update state unless it changed
    setSelectedBuckets(prevState => (isEqual(newState, prevState) ? prevState : newState));
    return newState;
  };

  const tooltipPositionStyle =
    highlightedBucketIndex != null &&
    (highlightedBucketIndex > buckets.length / 2
      ? { right: (buckets.length - highlightedBucketIndex + 0.5) * bucketWidth }
      : { left: (highlightedBucketIndex + 1.5) * bucketWidth });
  const strikeLinePosition = highlightedBucketIndex != null && highlightedBucketIndex * bucketWidth + bucketCenter;

  const tooltipForSelection =
    selectionAdjustable &&
    (mouseState?.selecting || mouseState?.resizingLeft || mouseState?.resizingRight || mouseState?.moving);
  let tooltipFrom = null;
  let tooltipTo = null;
  if (tooltipForSelection) {
    tooltipFrom = selectedBuckets && selectedBuckets.fromIndex;
    tooltipTo = selectedBuckets && selectedBuckets.toIndex;
  } else if (highlightedBucketIndex != null) {
    tooltipFrom = highlightedBucketIndex;
    tooltipTo = highlightedBucketIndex;
  }

  const selectionDone = !mouseState?.selecting && selectedBuckets;
  const contextMenuLeftAligned = selectedBuckets && selectedBuckets.toIndex < buckets.length / 2;
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
        onContextMenu={e => {
          e.preventDefault();
          return false;
        }}
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

      {tooltipFrom != null && (
        <>
          {!tooltipForSelection && <StrikeLine style={{ height: height, left: strikeLinePosition }} />}
          <Tooltip
            buckets={buckets.slice(tooltipFrom, tooltipTo + 1)}
            percentileBuckets={percentileBuckets.slice(tooltipFrom, tooltipTo + 1)}
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

function Tooltip({ buckets, percentileBuckets, style, dataSource }) {
  const formatTime = millis.forcedCompactOnMs.detailed;
  const from = buckets[0].from && formatTime(buckets[0].from);
  const to = buckets[buckets.length - 1].to && formatTime(buckets[buckets.length - 1].to);
  const count = buckets.map(b => b.calls).reduce((a, v) => a + v, 0);
  const percentiles = percentileBuckets.reduce((a, v) => a.concat(v), []);

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
        <span className={locals.value}>{number.forcedCompact.detailed(count)}</span>
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
