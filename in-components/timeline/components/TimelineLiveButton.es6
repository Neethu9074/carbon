import React from 'react';

import { getTimelineLiveUrl, getFixedTimeframeUrl } from 'in-stores/navigation/navigation';
import { to$ } from 'in-components/timeline/timelineStore';
import { live$ } from 'in-stores/timeline';
import connectTo from 'in-hoc/connectTo';
import Link from 'in-components/Link';

import './TimelineLiveButton.less';

const block = 'in-timeline-live-button';

export default connectTo(
  {
    isLive: live$
  },
  function TimelineLiveButton({ isLive }) {
    const className = block + (isLive ? ' ' + block + '__active' : '');

    const href$ = isLive
      ? to$.flatMap(to =>
          getFixedTimeframeUrl({
            to,
            focusedMoment: to
          })
        )
      : getTimelineLiveUrl();

    return (
      <Link className={`${block}__link`} href$={href$} onClick={e => e.stopPropagation()}>
        <div className={className}>
          Live
        </div>
      </Link>
    );
  }
);
