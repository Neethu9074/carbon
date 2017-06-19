import React from 'react';

import { percentageTwoDecimalPlaces } from 'in-services/formatters/number';

import './NetworkElement.less';

const block = 'in-trace-view-network-element';

export default function TreeNetworkElement({ parent, element, parentSpanForPercentageCalculation }) {
  let duration = null;
  // be really pesimistic here and assume that everyone go bad.
  if (
    parent != null &&
    element.children.length === 1 &&
    element.children[0].type === 'span' &&
    parent.type === 'span'
  ) {
    duration = parent.span.get('duration') - element.children[0].span.get('duration');
    duration = Math.max(duration, 0);
  }

  const totalTime = parentSpanForPercentageCalculation.get('duration') + 0.00000001;

  return (
    <div className={block}>
      Network and Serialization
      {duration != null ? ` (${duration} ms, ${percentageTwoDecimalPlaces(Math.min(1, duration / totalTime))})` : null}

      <div className={`${block}__dashed-filler`} />
    </div>
  );
}
