import React from 'react';

import { highlightedTimeframe$ } from 'in-stores/timeline/highlightedTimeframe';
import ApplyButton from 'in-charts/Chart/renderer/ApplyButton';
import connectTo from 'in-hoc/connectTo';

import locals from './ApplyTimeframeButtons.mless';

export default connectTo(
  {
    highlightedTimeframe: highlightedTimeframe$
  },
  function ApplyTimeframeButtons({ highlightedTimeframe, xScale }) {
    if (!highlightedTimeframe) {
      return null;
    }

    const to = Math.min(xScale.getRangeTo(), xScale.getRange(highlightedTimeframe[1]));

    return (
      <div
        style={{
          right: xScale.getRangeTo() - to
        }}
        className={locals.applyTimeframeButtons}
      >
        <ApplyButton />
      </div>
    );
  }
);
