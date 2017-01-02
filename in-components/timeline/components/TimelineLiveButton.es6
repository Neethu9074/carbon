import React from 'react';

import {live$, setTo, setFocusedMoment} from 'in-stores/timeline';
import {to$} from 'in-components/timeline/timelineStore';
import connectTo from 'in-hoc/connectTo';

import './TimelineLiveButton.less';


const block = 'in-timeline-live-button';

export default connectTo({
    isLive: live$,
    to: to$
  },
  function TimelineLiveButton({isLive, to}) {
    return (
      <div className={block + (isLive ? ' ' + block + '__active' : '')}
           onClick={() => onClick(isLive, to)}>
        live
      </div>
    );
  }
);

function onClick(isLive, to) {
  if (isLive) {
    setFocusedMoment(to);
  } else {
    setFocusedMoment(null);
    setTo(null);
  }
}
