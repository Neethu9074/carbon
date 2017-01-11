import React from 'react';

import {formatDurationAccurately} from 'in-services/formatters/date';
import {timeframe$} from 'in-stores/timeline';
import connectTo from 'in-hoc/connectTo';

export default connectTo({
  duration: timeframe$
    .map(timeframe => formatDurationAccurately(timeframe.windowSize))
    .distinct()
}, function TimeWindowSizeLabel({prefix, duration}) {
  prefix = prefix || '';
  return (
    <span>{prefix + duration}</span>
  );
});
