import React from 'react';

import { getColorForEventAtFocusedMomentAsStream } from 'in-stores/events';
import EventIcon from 'in-components/EventIcon';
import connectTo from 'in-hoc/connectTo';

import './Header.less';

const block = 'in-event-view-header';

export default connectTo(
  props => {
    return {
      background: getColorForEventAtFocusedMomentAsStream(props.event)
    };
  },
  function EventHeader({ event, heading, background, children }) {
    return (
      <div className={block}>
        <div className={`${block}__icon-wrapper`} style={{ background }}>
          <EventIcon event={event} />
        </div>
        <div className={`${block}__right`}>
          <h1 className={`${block}__heading`}>
            {heading}
          </h1>
          {children}
        </div>
      </div>
    );
  }
);
