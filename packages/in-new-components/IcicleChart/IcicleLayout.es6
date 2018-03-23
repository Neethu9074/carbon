import { deepFreeze } from 'in-services/util/object';
import { isOverlappedWith } from 'in-new-components/IcicleChart/TimeRangeHelper';

export function applyLayout(rootSpan) {
  let spanFrames = [];

  const totalDuration = rootSpan.duration;
  positionSpan(spanFrames, rootSpan, null, 0, totalDuration, []);

  return deepFreeze(spanFrames);
}

function positionSpan(spanFrames, span, parent, depth, totalDuration, occupiedTimeRangesByDepth) {
  const { id, label, start, duration, children } = span;
  const end = start + duration;

  let depthWithoutOverlapping = findDepthWithoutAnyOverlapping(depth, [start, end], occupiedTimeRangesByDepth);

  const spanFrame = {
    id,
    label,
    start,
    duration,
    parent: parent ? parent.id : null,
    depth: depthWithoutOverlapping,
    x: start / totalDuration,
    dx: duration / totalDuration
  };

  spanFrames.push(spanFrame);

  if (children) {
    children.map(childSpan => {
      positionSpan(spanFrames, childSpan, span, depthWithoutOverlapping + 1, totalDuration, occupiedTimeRangesByDepth);
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
