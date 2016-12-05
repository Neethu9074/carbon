import React from 'react';

import {highlightedTimeframe$, clearHighlightedTimeframe} from 'in-stores/timeline/highlightedTimeframe';
import {setTimeframe, setFocusedMoment, focusedMoment$} from 'in-stores/timeline';
import {MAX_ZOOM_LEVEL} from 'in-components/timeline/timelineStore';
import {to$} from 'in-components/timeline/timelineStore';
import SvgIcon from 'in-components/SvgIcon';
import Button from 'in-components/Button';
import connectTo from 'in-hoc/connectTo';

import './ApplyButton.less';


const block = 'in-chart-apply-button';

export default connectTo({
  highlightedTimeframe: highlightedTimeframe$,
  focusedMoment: focusedMoment$,
  to: to$
},
function ApplyButton({to, focusedMoment, highlightedTimeframe}) {
  if (!highlightedTimeframe) {
    return null;
  }

  return (
    <Button className={block}
            kind='secondary'
            onClick={() => onButtonClicked(highlightedTimeframe, focusedMoment, to)}>
      <SvgIcon type='search'
               width={12}
               height={12}
               color='#172429' />
    </Button>
  );
});

function onButtonClicked(highlightedTimeframe, focusedMoment, timelineTo) {
  const from = highlightedTimeframe[0];
  let to = highlightedTimeframe[1];
  let windowSize = to - from;

  if (windowSize <= MAX_ZOOM_LEVEL) {
    windowSize = MAX_ZOOM_LEVEL;
    to = timelineTo;
  }

  setTimeframe(windowSize, to);
  clearHighlightedTimeframe();

  if (!focusedMoment) {
    // stop live mode
    setFocusedMoment(timelineTo);
  }
}
