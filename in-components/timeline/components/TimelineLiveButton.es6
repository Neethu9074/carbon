import React from 'react';

import {getTimelineLiveUrl, getFixedTimeframeUrl} from 'in-stores/navigation/navigation';
import {to$} from 'in-components/timeline/timelineStore';
import connectTo from 'in-hoc/connectTo';
import {live$} from 'in-stores/timeline';

import './TimelineLiveButton.less';


const block = 'in-timeline-live-button';

export default connectTo({
  isLive: live$,
  liveHref: getTimelineLiveUrl(),
  fixedHref: to$.flatMap(to => getFixedTimeframeUrl({
    to,
    focusedMoment: to
  }))
},
function TimelineLiveButton({isLive, liveHref, fixedHref}) {
  const className = block + (isLive ? ' ' + block + '__active' : '');

  return (
    <a className={`${block}__link`}
       href={isLive ? fixedHref : liveHref}
       onClick={e => e.stopPropagation()}>
      <div className={className}>
        Live
      </div>
    </a>
  );
});
