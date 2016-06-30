import React from 'react';

import {isOpen$ as isSidebarOpen$} from 'in-components/sidebars/Map/sidebarStore';
import {isCollapsed$} from 'in-components/timeline/timelineStore';
import {clearSelectedSnapshotId} from 'in-stores/snapshot';
import {clearSelectedIncident} from 'in-stores/incident';
import {clearSelectedEvent} from 'in-stores/events';
import connectTo from 'in-hoc/connectTo';

import './FullscreenOverlayView.less';

const block = 'in-fullscreen-overlay-view';

export default connectTo(
  props => {
    return {
      isOpen: props.isOpen$,
      isSidebarOpen: isSidebarOpen$,
      isCollapsed: isCollapsed$
    };
  }, function FullscreenOverlayView({isOpen, isCollapsed, isSidebarOpen, children}) {
    if (!isOpen) {
      return null;
    }

    let classes = block;

    if (!isCollapsed) {
      classes += ' ' + block + '--timeline-expanded';
    }

    if (isSidebarOpen) {
      classes += ' ' + block + '--sidebar-open';
    }

    return (
      <div className={classes}
           onClick={() => {
             clearSelectedIncident();
             clearSelectedSnapshotId();
             clearSelectedEvent();
           }}>
        {children}
      </div>
    );
  }
);
