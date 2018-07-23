import { isOverlappedWith } from 'in-analyze/TraceDetail/components/IcicleChart/TimeRangeHelper';
import { getStart, getEnd } from 'in-analyze/TraceDetail/components/callStartAndEndTime';
import { FAKE_ROOT_ID } from 'in-analyze/TraceDetail/shared/CallHelper';
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
  const { id, start, duration, children, ...props } = call;
  let depthWithoutOverlapping = depth;

  if (id == FAKE_ROOT_ID) {
    callFrames.push({
      ...props,
      id,
      traceStart,
      totalDuration,
      parent: null,
      depth: 0,
      x: 0,
      dx: 1
    });
  } else {
    const end = start + duration;
    depthWithoutOverlapping = findDepthWithoutAnyOverlapping(depth, [start, end], occupiedTimeRangesByDepth);

    const callFrame = {
      ...props,
      id,
      start,
      duration,
      parent: parentCall ? parentCall.id : null,
      depth: depthWithoutOverlapping,
      x: totalDuration ? (start - traceStart) / totalDuration : 0,
      dx: totalDuration ? duration / totalDuration : 1 // if totalDuration=0, the call should take the whole width (dx=1)
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
