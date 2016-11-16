import React from 'react';

import './NetworkElement.less';

const block = 'in-trace-view-network-element';

export default function TreeNetworkElement({parent, element}) {
  let duration = null;
  // be really pesimistic here and assume that everyone go bad.
  if (parent != null && element.children.length === 1 && element.children[0].type === 'span'
      && parent.type === 'span') {
    duration = parent.span.get('duration') - element.children[0].span.get('duration');
    duration = Math.max(duration, 0);
  }
  return (
    <div className={block}>
      Network and Serialization
      {duration != null ? ` (${duration} ms)` : null}

      <div className={`${block}__dashed-filler`} />
    </div>
  );
}
