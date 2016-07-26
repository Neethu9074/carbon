import React from 'react';

import {getDirection} from 'in-components/traceView/util';

export default function TreeNetworkElement({parent, element}) {
  let duration = null;
  // be really pesimistic here and assume that everyone go bad.
  if (parent != null && element.children.length === 1 && element.children[0].type === 'span' &&
      getDirection(element.children[0].span) && parent.type === 'span') {
    duration = parent.span.get('duration') - element.children[0].span.get('duration');
    duration = Math.max(duration, 0);
  }
  return (
    <div>
      NETWORK
      {duration != null ? ` (${duration} ms)` : null}
    </div>
  );
}
