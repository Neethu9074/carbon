import React from 'react';

import {highlightedTimeframe$, clearHighlightedTimeframe} from 'in-stores/timeline/highlightedTimeframe';
import {to$} from 'in-components/timeline/timelineStore';
import {setTimeframe} from 'in-stores/timeline/timeline';
import {setFocusedMoment} from 'in-stores/timeline';
import SvgIcon from 'in-components/SvgIcon';
import Button from 'in-components/Button';
import connectTo from 'in-hoc/connectTo';

import './ApplyButton.less';


const block = 'in-chart-apply-button';

export default connectTo({
  highlightedTimeframe: highlightedTimeframe$,
  to: to$
},
function ApplyButton({to, highlightedTimeframe}) {
  if (!highlightedTimeframe) {
    return null;
  }

  return (
    <Button className={block}
            kind='secondary'
            onClick={() => onButtonClicked(highlightedTimeframe, to)}>
      <SvgIcon type='search'
               width={12}
               height={12}
               color='#172429' />
    </Button>
  );
});

function onButtonClicked(highlightedTimeframe, timelineTo) {
  const from = highlightedTimeframe[0];
  const to = highlightedTimeframe[1];
  const windowSize = to - from;

  if (windowSize > 0) {
    setTimeframe(windowSize, to);
    clearHighlightedTimeframe();

    // stop live mode
    setFocusedMoment(timelineTo);
  }
}
