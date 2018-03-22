import { fromJS } from 'immutable';

export function applyLayout(rootSpan) {
  let spanFrames = [];

  const totalDuration = rootSpan.get('duration');
  positionSpan(spanFrames, rootSpan, null, 0, totalDuration);

  return fromJS(spanFrames);
}

let maxDepth = 0;

function positionSpan(spanFrames, span, parent, depth, totalDuration) {
  maxDepth = Math.max(depth, maxDepth);

  const id = span.get('id');
  const label = span.get('label');
  const start = span.get('start');
  const duration = span.get('duration');
  const children = span.get('children');

  if (children) {
    children.toArray().map(childSpan => {
      positionSpan(spanFrames, childSpan, span, depth + 1, totalDuration);
    });
  }

  const spanFrame = {
    id,
    label,
    start,
    duration,
    parent: parent ? parent.get('id') : null,
    depth: depth,
    x: start / totalDuration,
    dx: duration / totalDuration,
    dy: 1 / (maxDepth + 1),
    y: depth * (1 / (maxDepth + 1))
  };

  spanFrames.push(spanFrame);
}
