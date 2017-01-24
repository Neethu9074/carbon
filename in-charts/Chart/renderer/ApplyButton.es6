import {combineLatest} from 'reactive-observables';
import React from 'react';

import {highlightedTimeframe$, clearHighlightedTimeframe} from 'in-stores/timeline/highlightedTimeframe';
import {getFixedTimeframeUrl} from 'in-stores/navigation/navigation';
import {MAX_ZOOM_LEVEL} from 'in-components/timeline/timelineStore';
import {alwaysNull} from 'in-services/fixedStreams';
import {focusedMoment$} from 'in-stores/timeline';
import SvgIcon from 'in-components/SvgIcon';
import Button from 'in-components/Button';
import connectTo from 'in-hoc/connectTo';

import './ApplyButton.less';


const block = 'in-chart-apply-button';

export default connectTo({
  href: combineLatest([
    highlightedTimeframe$,
    focusedMoment$
  ]).flatMap(([highlightedTimeframe, focusedMoment]) => {
    if (!highlightedTimeframe) {
      return alwaysNull;
    }

    const from = highlightedTimeframe[0];
    let to = highlightedTimeframe[1];
    let windowSize = to - from;

    if (windowSize <= MAX_ZOOM_LEVEL) {
      windowSize = MAX_ZOOM_LEVEL;
    }

    return getFixedTimeframeUrl(windowSize, to, focusedMoment);
  })
},
function ApplyButton({href}) {
  if (!href) {
    return null;
  }

  return (
    <Button className={block}
            kind='secondary'
            href={href}
            onClick={onButtonClicked}>
      <SvgIcon type='search'
               width={12}
               height={12}
               color='#172429' />
    </Button>
  );
});

function onButtonClicked(e) {
  e.stopPropagation();

  clearHighlightedTimeframe();
}
