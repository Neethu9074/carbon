import React from 'react';

import {highlightedTimeframe$, clearHighlightedTimeframe} from 'in-stores/timeline/highlightedTimeframe';
import {setTimeframe} from 'in-stores/timeline/timeline';
import SvgIcon from 'in-components/SvgIcon';
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
      <SvgIcon type='check'
               width={12}
               height={12}
               color='#000' />
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
