import React from 'react';

import SelectedWindowSizePresenter from 'in-components/timeline/components/SelectedWindowSizePresenter';
import TimelineCanvasReactWrapper from 'in-components/timeline/components/TimelineCanvasReactWrapper';
import TimelineTimeframeMarker from 'in-components/timeline/components/TimelineTimeframeMarker';
import TimelineNavigation from 'in-components/timeline/components/TimelineNavigation';
import TimelineMenu from 'in-components/timeline/components/TimelineMenu';
import EventTooltip from 'in-components/timeline/components/EventTooltip';
import {isCollapsed$} from 'in-components/timeline/timelineStore';
import {getIn} from 'in-services/settings';
import connectTo from 'in-hoc/connectTo';

import './Timeline.less';

const block = 'in-timeline';

export default connectTo({
    isCollapsed: isCollapsed$,
    autoCollapseTimeline: getIn(['autoCollapseTimeline'])
  }, function Timeline({isCollapsed, autoCollapseTimeline}) {
    let classes = block;

    if (!isCollapsed) {
      classes = `${classes} ${block}--expanded`;
    }

    if (!autoCollapseTimeline) {
      classes = `${classes} ${block}--no-auto-collapse`;
    }

    return (
      <div>
        <EventTooltip />

        <div className={classes}>
          <div className={`${block}__wrapper`}>
            <TimelineMenu />
            <TimelineCanvasReactWrapper />
          </div>
          <div className={block + '__bottom'}>
            <TimelineNavigation />
            <TimelineTimeframeMarker />
          </div>
        </div>

        <SelectedWindowSizePresenter />
      </div>
    );
  }
);
