import React from 'react';

import {isOpen$ as isSidebarOpen$} from 'in-components/sidebars/Map/sidebarStore';
import {timelineHeight$} from 'in-components/timeline/timelineStore';
import {clearSelectedSnapshotId} from 'in-stores/snapshot';
import {clearSelectedIncident} from 'in-stores/incident';
import {clearSelectedEvent} from 'in-stores/events';
import toPx from 'in-services/formatters/toPx';
import connectTo from 'in-hoc/connectTo';

import './FullscreenOverlayView.less';

const block = 'in-fullscreen-overlay-view';

export default connectTo(
  props => {
    return {
      isOpen: props.isOpen$,
      isSidebarOpen: isSidebarOpen$,
      timelineHeight: timelineHeight$
    };
  }, function FullscreenOverlayView({isOpen, timelineHeight, isSidebarOpen, children}) {
    if (!isOpen) {
      return null;
    }

    let classes = block;

    if (isSidebarOpen) {
      classes += ' ' + block + '--sidebar-open';
    }

    return (
      <div className={classes}
           onClick={() => {
             clearSelectedIncident();
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
