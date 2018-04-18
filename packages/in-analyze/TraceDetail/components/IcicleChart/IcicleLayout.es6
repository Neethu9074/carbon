import { isOverlappedWith } from 'in-analyze/TraceDetail/components/IcicleChart/TimeRangeHelper';
import { deepFreeze } from 'in-services/util/object';

export function applyLayout(rootCall) {
  let callFrames = [];

  const totalDuration = rootCall.duration;
  positionCall(callFrames, rootCall, null, 0, rootCall.start, totalDuration, []);

  return deepFreeze(callFrames);
}

function positionCall(callFrames, call, parentCall, depth, traceStart, totalDuration, occupiedTimeRangesByDepth) {
  const { start, duration, children, ...props } = call;
  const end = start + duration;

  let depthWithoutOverlapping = findDepthWithoutAnyOverlapping(depth, [start, end], occupiedTimeRangesByDepth);

  const callFrame = {
    ...props,
    start,
    duration,
    parent: parentCall ? parentCall.id : null,
    depth: depthWithoutOverlapping,
    x: (start - traceStart) / totalDuration,
    dx: duration / totalDuration
  };

  callFrames.push(callFrame);

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
