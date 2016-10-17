import React from 'react';

import {timelineHeight$} from 'in-components/timeline/timelineStore';
import {clearSelectedSnapshotId} from 'in-stores/snapshot';
import {clearSelectedEvent} from 'in-stores/events';
import toPx from 'in-services/formatters/toPx';
import connectTo from 'in-hoc/connectTo';

import './FullscreenOverlayView.less';

const block = 'in-fullscreen-overlay-view';

export default connectTo(
  props => {
    return {
      isOpen: props.isOpen$,
      timelineHeight: timelineHeight$
    };
  }, function FullscreenOverlayView({isOpen, timelineHeight, children}) {
    if (!isOpen) {
      return null;
    }

    return (
      <div className={block}
           onClick={() => {
             clearSelectedSnapshotId();
             clearSelectedEvent();
           }}
           style={{
             bottom: toPx(timelineHeight)
           }}>
        {children}
      </div>
    );
  }
);
