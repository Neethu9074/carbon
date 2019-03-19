import React from 'react';

import { highlightedTimeframe$ } from 'in-stores/timeline/highlightedTimeframe';
import ApplyButton from 'in-charts/Chart/renderer/ApplyButton';
import connectTo from 'in-hoc/connectTo';

import locals from './ApplyTimeframeButtons.mless';

export default connectTo(
  {
    highlightedTimeframe: highlightedTimeframe$
  },
  function ApplyTimeframeButtons({ highlightedTimeframe, xScale, metrics }) {
    if (!highlightedTimeframe) {
      return null;
    }
    const to = Math.min(xScale.getRangeTo(), xScale.getRange(highlightedTimeframe[1]));
    metrics.y1._metricValuesForDownload = metrics['y1'].metrics;

    return (
      <div
        style={{
          right: xScale.getRangeTo() - to
        }}
        className={locals.applyTimeframeButtons}
      >
        <ApplyButton metrics={metrics} />
      </div>
    );
  }
);
