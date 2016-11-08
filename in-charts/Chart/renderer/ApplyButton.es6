import React from 'react';

import {highlightedTimeframe$, clearHighlightedTimeframe} from 'in-stores/timeline/highlightedTimeframe';
import {setTimeframe} from 'in-stores/timeline/timeline';
import Button from 'in-components/Button';
import connectTo from 'in-hoc/connectTo';

import './ApplyButton.less';


const block = 'in-chart-apply-button';


export default connectTo({
  highlightedTimeframe: highlightedTimeframe$
},
function ApplyButton({highlightedTimeframe}) {
  if (!highlightedTimeframe) {
    return null;
  }

  return (
    <Button className={block}
            onClick={() => onButtonClicked(highlightedTimeframe)}>
      Apply
    </Button>
  );
});

function onButtonClicked(highlightedTimeframe) {
  const from = highlightedTimeframe[0];
  const to = highlightedTimeframe[1];
  const windowSize = to - from;

  if (windowSize > 0) {
    setTimeframe(windowSize, to);
    clearHighlightedTimeframe();
  }
}
