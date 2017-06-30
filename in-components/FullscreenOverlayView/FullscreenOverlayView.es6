import React from 'react';

import { timelineHeight$ } from 'in-components/timeline/timelineStore';
import { alwaysTrue } from 'in-services/fixedStreams';
import toPx from 'in-services/formatters/toPx';
import connectTo from 'in-hoc/connectTo';

import './FullscreenOverlayView.less';

const block = 'in-fullscreen-overlay-view';

export default connectTo(
  props => {
    return {
      isOpen: props.isOpen$ || alwaysTrue,
      timelineHeight: timelineHeight$
    };
  },
  function FullscreenOverlayView({ isOpen, timelineHeight, children, className, overlayTimeline = false }) {
    if (!isOpen) {
      return null;
    }

    let classes = block;
    if (className) {
      classes = `${classes} ${className}`;
    }

    if (overlayTimeline) {
      timelineHeight = 0;
      classes += ` ${block}__overlay`;
    }

    return (
      <section
        className={classes}
        style={{
          bottom: toPx(timelineHeight),
          top: toPx(80)
        }}
      >
        {children}
      </section>
    );
  }
);
