/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { isOverlappedWith } from 'in-analyze/TraceDetail/components/IcicleChart/TimeRangeHelper';
import { getStart, getEnd } from 'in-analyze/TraceDetail/components/callStartAndEndTime';
import { isFakeRootCall } from 'in-analyze/TraceDetail/shared/CallHelper';
import { deepFreeze } from 'in-services/util/object';

export function applyLayout(rootCall) {
  let callFrames = [];

  const traceStart = getStart(rootCall);
  const traceEnd = getEnd(rootCall);
  const totalDuration = traceEnd - traceStart;

  positionCall(callFrames, rootCall, null, 0, traceStart, totalDuration, []);

  return deepFreeze(callFrames);
}

function positionCall(callFrames, call, parentCall, depth, traceStart, totalDuration, occupiedTimeRangesByDepth) {
  const { start, duration, children, ...props } = call;
  let depthWithoutOverlapping = depth;
  const isFakeRoot = isFakeRootCall(call);

  if (isFakeRoot) {
    callFrames.push({
      ...props,
      traceStart,
      duration: totalDuration,
      parent: null,
      depth: 0,
      x: 0,
      dx: 1,
      isFakeRoot
    });
  } else {
    // If duration === 0 and two spans has the same start, they will overlap in the chart. We avoid this by setting the duration to 1 if that is the case
    const end = start + (duration === 0 ? 1 : duration);
    depthWithoutOverlapping = findDepthWithoutAnyOverlapping(depth, [start, end], occupiedTimeRangesByDepth);

    const callFrame = {
      ...props,
      start,
      duration,
      parent: parentCall ? parentCall.id : null,
      depth: depthWithoutOverlapping,
      x: totalDuration ? (start - traceStart) / totalDuration : 0,
      dx: totalDuration ? duration / totalDuration : 1, // if totalDuration=0, the call should take the whole width (dx=1)
      totalDuration: totalDuration,
      traceStart: traceStart,
      children: children || []
    };

    callFrames.push(callFrame);
  }

  if (children) {
    children.map(subCalls => {
      positionCall(
        callFrames,
        subCalls,
        call,
        depthWithoutOverlapping + 1,
        traceStart,
        totalDuration,
        occupiedTimeRangesByDepth
      );
    });
  }
}

function findDepthWithoutAnyOverlapping(minDepth, timeRange, occupiedTimeRangesByDepth) {
  const start = timeRange[0];
  const end = timeRange[1];

  let depth = minDepth;

  for (let d = minDepth; ; d++) {
    if (!isOverlappedWith([start, end], occupiedTimeRangesByDepth[d])) {
      depth = d;
      break;
    }
  }

  if (!occupiedTimeRangesByDepth[depth]) {
    occupiedTimeRangesByDepth[depth] = [];
  }
  occupiedTimeRangesByDepth[depth].push([start, end]);

  return depth;
}
