import {combineLatest} from 'reactive-observables';
import React from 'react';

import {highlightedTimeframe$, clearHighlightedTimeframe} from 'in-stores/timeline/highlightedTimeframe';
import {getFixedTimeframeUrl} from 'in-stores/navigation/navigation';
import {MAX_ZOOM_LEVEL} from 'in-components/timeline/timelineStore';
import {to$} from 'in-components/timeline/timelineStore';
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
    focusedMoment$,
    to$
  ]).flatMap(([highlightedTimeframe, focusedMoment, timelineTo]) => {
    if (!highlightedTimeframe) {
      return alwaysNull;
    }

    const from = highlightedTimeframe[0];
    let to = highlightedTimeframe[1];
    let windowSize = to - from;

    if (windowSize <= MAX_ZOOM_LEVEL) {
      windowSize = MAX_ZOOM_LEVEL;
      to = timelineTo;
    }

    return getFixedTimeframeUrl(windowSize, to, focusedMoment);
  })
},
function ApplyButton({href}) {
  if (!href) {
    return null;
  }

  return (
    <div className={block}>
      <Button className={`${block}__button`}
              kind='secondary'
              href={href}
              onClick={onButtonClicked}>
        <SvgIcon type='search'
                 width={12}
                 color='#172429' />
      </Button>
      <Button className={`${block}__button`}
              kind='secondary'
              onClick={onButtonClicked}>
        <SvgIcon type='x'
                 width={10}
                 color='#172429' />
      </Button>
    </div>
  );
});

function onButtonClicked(e) {
  e.stopPropagation();

  clearHighlightedTimeframe();
}
