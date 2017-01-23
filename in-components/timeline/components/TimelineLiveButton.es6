import React from 'react';

import {getTimelineLiveUrl} from 'in-stores/navigation/navigation';
import {live$, setFocusedMoment} from 'in-stores/timeline';
import {to$} from 'in-components/timeline/timelineStore';
import connectTo from 'in-hoc/connectTo';

import './TimelineLiveButton.less';


const block = 'in-timeline-live-button';

export default connectTo({
    isLive: live$,
    to: to$,
    href: getTimelineLiveUrl()
  },
function TimelineLiveButton({isLive, to, href}) {
  const className = block + (isLive ? ' ' + block + '__active' : '');
  if (isLive) {
    return (
      <div className={className}
           onClick={() => setFocusedMoment(to)}>
        live
      </div>
    );
  }

  return (
    <div className={className}>
      <a className={`${block}__link`}
         href={href}
         onClick={e => e.stopPropagation()}>
        live
      </a>
    </div>
  );
});
