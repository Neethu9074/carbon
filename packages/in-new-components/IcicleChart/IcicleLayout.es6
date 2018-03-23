import { deepFreeze } from 'in-services/util/object';

export function applyLayout(rootSpan) {
  let spanFrames = [];

  const totalDuration = rootSpan.duration;
  positionSpan(spanFrames, rootSpan, null, 0, totalDuration);

  return deepFreeze(spanFrames);
}

let maxDepth = 0;

function positionSpan(spanFrames, span, parent, depth, totalDuration) {
  maxDepth = Math.max(depth, maxDepth);

  const { id, label, start, duration, children } = span;

  if (children) {
    children.map(childSpan => {
      positionSpan(spanFrames, childSpan, span, depth + 1, totalDuration);
    });
  }

  const spanFrame = {
    id,
    label,
    start,
    duration,
    parent: parent ? parent.id : null,
    depth: depth,
    x: start / totalDuration,
    dx: duration / totalDuration,
    dy: 1 / (maxDepth + 1),
    y: depth * (1 / (maxDepth + 1))
  };

  spanFrames.push(spanFrame);
}
